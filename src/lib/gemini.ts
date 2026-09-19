import { GoogleGenAI } from "@google/genai";
import type { SceneAnalysis, SpeciesId } from "@/lib/types";

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-3.6-flash",
  "gemini-2.5-flash",
].filter((name, index, all): name is string => Boolean(name) && all.indexOf(name) === index);

const SPECIES: SpeciesId[] = [
  "mountain_lion",
  "coyote",
  "parrot",
  "dog",
  "cat",
  "raccoon",
  "other",
  "unknown",
];

function isSpecies(value: unknown): value is SpeciesId {
  return typeof value === "string" && SPECIES.includes(value as SpeciesId);
}

export function geminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
}

const SYSTEM = `You are WildSignal's visual interpreter for San Francisco wildlife encounters.

You analyze a resident's photo and/or description. You do NOT give safety advice, legal advice, or veterinary advice. Another system maps your structured assessment onto reviewed agency instructions.

Be conservative. A blurry large cat at night may be a mountain lion, a dog, or a house cat — say so. Never inflate confidence to sound useful.

San Francisco context you may use:
- Mountain lions are rare visitors, usually dispersing young animals, not a resident city population.
- Coyotes are established, especially in the Presidio and large parks. Following a person with a dog near a den is often escorting.
- Cherry-headed / red-masked conures are the city's official animal.

Return JSON only with this shape:
{
  "probableSpecies": "mountain_lion" | "coyote" | "parrot" | "dog" | "cat" | "raccoon" | "other" | "unknown",
  "commonName": string,
  "identificationConfidence": number between 0 and 1,
  "identificationNotes": string,
  "observedBehavior": string[],
  "humanContext": string[],
  "animalCondition": "healthy" | "injured" | "trapped" | "unknown",
  "appearsHabituated": boolean,
  "locationClues": string,
  "uncertainty": string,
  "visualEvidence": [{ "cue": string, "supports": string, "rulesOut": string }],
  "ruledOut": string[]
}

humanContext should mention dogs, children, strollers, food, traffic, night, leashes, or parks when the image or text supports it.
visualEvidence is the WHOA: name the pixels that support the ID and what they rule out. On a blurry night photo this matters more than a species label.`;

function parseAnalysis(raw: string): SceneAnalysis | null {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    const probableSpecies = isSpecies(parsed.probableSpecies)
      ? parsed.probableSpecies
      : "unknown";
    const condition = parsed.animalCondition;
    return {
      probableSpecies,
      commonName:
        typeof parsed.commonName === "string" ? parsed.commonName : "Unconfirmed animal",
      identificationConfidence: clamp01(parsed.identificationConfidence),
      identificationNotes:
        typeof parsed.identificationNotes === "string"
          ? parsed.identificationNotes
          : "Gemini did not return identification notes.",
      observedBehavior: stringArray(parsed.observedBehavior),
      humanContext: stringArray(parsed.humanContext),
      animalCondition:
        condition === "healthy" ||
        condition === "injured" ||
        condition === "trapped" ||
        condition === "unknown"
          ? condition
          : "unknown",
      appearsHabituated: Boolean(parsed.appearsHabituated),
      locationClues:
        typeof parsed.locationClues === "string" ? parsed.locationClues : "Not stated",
      uncertainty:
        typeof parsed.uncertainty === "string"
          ? parsed.uncertainty
          : "Identification is uncertain.",
      visualEvidence: evidenceArray(parsed.visualEvidence),
      ruledOut: stringArray(parsed.ruledOut),
      usedGemini: true,
    };
  } catch {
    return null;
  }
}

function clamp01(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return 0.3;
  return Math.min(1, Math.max(0, n));
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").slice(0, 8);
}

function evidenceArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      if (
        typeof row.cue !== "string" ||
        typeof row.supports !== "string" ||
        typeof row.rulesOut !== "string"
      ) {
        return null;
      }
      return { cue: row.cue, supports: row.supports, rulesOut: row.rulesOut };
    })
    .filter((row): row is { cue: string; supports: string; rulesOut: string } => row !== null)
    .slice(0, 6);
}

export async function analyzeWithGemini(input: {
  text: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<SceneAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [
    {
      text: `Resident message:\n${input.text || "(no text, image only)"}`,
    },
  ];

  if (input.imageBase64 && input.mimeType) {
    parts.unshift({
      inlineData: {
        mimeType: input.mimeType,
        data: input.imageBase64,
      },
    });
  }

  let lastError: Error | null = null;
  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: SYSTEM,
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned an empty response");
      }

      const parsed = parseAnalysis(text);
      if (!parsed) {
        throw new Error("Gemini returned JSON we could not parse");
      }
      return parsed;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Gemini failed");
      if (!/404|NOT_FOUND|no longer available/i.test(lastError.message)) {
        break;
      }
    }
  }
  throw lastError ?? new Error("Gemini failed");
}
