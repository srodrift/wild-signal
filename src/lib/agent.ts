import { applySceneTap, nextMoveFor, openingLine, sceneTapsFor } from "@/lib/coach";
import { encounterById } from "@/lib/encounters";
import { analyzeWithGemini, geminiConfigured } from "@/lib/gemini";
import { selectGuidance, speciesLabel } from "@/lib/guidance";
import type {
  AgentReply,
  ConversationPhase,
  IncidentReport,
  PhotonNative,
  SceneAnalysis,
} from "@/lib/types";

function buildMessages(analysis: SceneAnalysis) {
  const guidance = selectGuidance(analysis);
  const move = nextMoveFor(analysis);
  const messages = [openingLine(analysis)];
  if (guidance.emergency) {
    messages.push("If anyone is hurt, call 911. Reply YES only after you are safe.");
  }
  return { guidance, messages, move };
}

function followUpFor(
  analysis: SceneAnalysis,
  phase: ConversationPhase,
): AgentReply["followUp"] {
  const guidance = selectGuidance(analysis);

  if (phase === "scene") {
    return {
      phase: "scene",
      prompt: "Tap what you actually see. The next move will change.",
      chips: ["YES — I am safe", "NO — I need help now"],
    };
  }

  if (phase === "triage") {
    return {
      phase: "triage",
      prompt: "Are you currently safe? Reply YES or NO.",
      chips: ["YES — I am safe", "NO — I need help now"],
    };
  }

  if (phase === "details") {
    const chips =
      analysis.probableSpecies === "mountain_lion"
        ? ["44th & Ulloa", "Pacific Heights", "Fell & Baker"]
        : analysis.probableSpecies === "coyote"
          ? ["Park Trail, Presidio", "It followed us", "Small dog on leash"]
          : ["Kearny Street steps", "Bird still on the sidewalk", "Flock is above"];

    return {
      phase: "details",
      prompt: guidance.reportRecommended
        ? "Share a block — not a pin."
        : "Send a block if you want a private note.",
      chips,
    };
  }

  return {
    phase: "report_ready",
    prompt: "Report is ready. Exact location stays with responders. The public line is blurred on purpose.",
    chips: ["Show me why you chose this"],
  };
}

function photonOpening(analysis: SceneAnalysis): PhotonNative {
  const guidance = selectGuidance(analysis);
  return {
    tapback: "emphasized",
    effect: guidance.emergency ? "slam" : "gentle",
    poll: {
      title: "Are you currently safe?",
      options: ["YES — I am safe", "NO — I need help now"],
    },
    richLink: guidance.agency.url
      ? {
          url: guidance.agency.url,
          title: guidance.agency.name,
          subtitle: "Official source — not a live map",
        }
      : undefined,
  };
}

function photonReport(report: IncidentReport): PhotonNative {
  return {
    effect: "gentle",
    contact: {
      name: report.agency.name,
      phone: report.agency.phone,
      email: report.agency.email,
      subtitle: report.agency.why,
    },
    richLink: {
      url: "/map",
      title: "Generalized area map",
      subtitle: "Neighborhood circle — not a live pin",
    },
    appCard: {
      title: `Responder packet ${report.id}`,
      subtitle: report.publicDisplay,
      url: report.agency.url ?? "https://wildlife.ca.gov/HWC/Mountain-Lions",
      live: true,
    },
    group: {
      name: "WildSignal · private response",
      members: ["You", report.agency.name, "WildSignal"],
    },
  };
}

export { composeTalk } from "@/lib/talk";

export function composeOpening(analysis: SceneAnalysis): AgentReply {
  const { guidance, messages, move } = buildMessages(analysis);
  return {
    analysis,
    guidance,
    messages,
    followUp: followUpFor(analysis, "scene"),
    report: null,
    nextMove: move,
    sceneTaps: sceneTapsFor(analysis),
    photon: photonOpening(analysis),
  };
}

export function composeSceneReply(analysis: SceneAnalysis, tap: string): AgentReply {
  const updated = applySceneTap(analysis, tap);
  const guidance = selectGuidance(updated);
  const move = nextMoveFor(updated);
  return {
    analysis: updated,
    guidance,
    messages: [`Next move: ${move.text}`],
    followUp: followUpFor(updated, "scene"),
    report: null,
    nextMove: move,
    sceneTaps: sceneTapsFor(updated).filter((item) => !tap.toLowerCase().includes(item.label.toLowerCase())),
    photon: {
      effect: guidance.emergency ? "slam" : "gentle",
    },
  };
}

export function composeAfterSafety(
  analysis: SceneAnalysis,
  safe: boolean,
): AgentReply {
  const { guidance } = buildMessages(analysis);

  if (!safe) {
    return {
      analysis,
      guidance: { ...guidance, emergency: true, riskLevel: "red" },
      messages: [
        "Stay on the line with 911 if you can. Face the animal if it is still there. Do not run. Get children and pets close without turning your back.",
        "When you are behind a door or in a car, reply YES and I will finish the wildlife report.",
      ],
      followUp: {
        phase: "triage",
        prompt: "Reply YES when you are safe.",
        chips: ["YES — I am safe now"],
      },
      report: null,
      photon: {
        effect: "slam",
        tapback: "emphasized",
        contact: {
          name: "911",
          phone: "911",
          subtitle: "Imminent danger — people first, then the wildlife report.",
        },
      },
    };
  }

  return {
    analysis,
    guidance,
    messages: ["Share a block when you can. One intersection. No live pin."],
    followUp: followUpFor(analysis, "details"),
    report: null,
    photon: {
      effect: "gentle",
      richLink: photonOpening(analysis).richLink,
    },
  };
}

export function composeReport(
  analysis: SceneAnalysis,
  details: { neighborhood?: string; notes?: string; witnessSafe?: boolean },
): AgentReply {
  const guidance = selectGuidance(analysis);
  const report = buildReport(analysis, details);

  const body = [
    `Packet for ${report.agency.name}.`,
    report.agency.phone ? `Call ${report.agency.phone}.` : "",
    "Neighborhood circle is on the map. No pin on the animal.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    analysis,
    guidance,
    messages: [body],
    followUp: followUpFor(analysis, "report_ready"),
    report,
    photon: photonReport(report),
  };
}

export function buildReport(
  analysis: SceneAnalysis,
  details: { neighborhood?: string; notes?: string; witnessSafe?: boolean },
): IncidentReport {
  const guidance = selectGuidance(analysis);
  const neighborhood =
    details.neighborhood?.trim() ||
    analysis.locationClues ||
    "San Francisco — block withheld from public view";

  return {
    id: `WS-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    probableSpecies: analysis.probableSpecies,
    commonName: analysis.commonName,
    identificationConfidence: analysis.identificationConfidence,
    riskLevel: guidance.riskLevel,
    neighborhoodHint: neighborhood,
    observedBehavior: analysis.observedBehavior,
    humanContext: analysis.humanContext,
    animalCondition: analysis.animalCondition,
    witnessSafe: details.witnessSafe ?? null,
    notes: details.notes?.trim() || analysis.identificationNotes,
    agency: guidance.agency,
    publicDisplay: publicDisplay(analysis, neighborhood),
    sourceIds: guidance.sourceIds,
    usedGemini: analysis.usedGemini,
  };
}

function publicDisplay(analysis: SceneAnalysis, neighborhood: string) {
  const withheld = "San Francisco — block withheld from public view";
  const general =
    neighborhood && neighborhood !== withheld
      ? neighborhood.split(",")[0].trim()
      : "a San Francisco neighborhood";
  return `Wildlife response active near ${general}. Species ${speciesLabel(analysis.probableSpecies).toLowerCase()} — unconfirmed to the public. Do not search for the animal.`;
}

export async function interpretEncounter(input: {
  text: string;
  encounterId?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<SceneAnalysis> {
  const demo = input.encounterId ? encounterById(input.encounterId) : undefined;

  if (demo) {
    return { ...demo.analysis, usedGemini: false };
  }

  if (geminiConfigured() && (input.imageBase64 || input.text)) {
    try {
      return await analyzeWithGemini({
        text: input.text,
        imageBase64: input.imageBase64,
        mimeType: input.mimeType,
      });
    } catch {
      return {
        probableSpecies: "unknown",
        commonName: "Unconfirmed animal",
        identificationConfidence: 0.2,
        identificationNotes:
          "Gemini could not read this pass. Treat it as unconfirmed and use the conservative next move.",
        observedBehavior: [],
        humanContext: input.text ? [input.text] : [],
        animalCondition: "unknown",
        appearsHabituated: false,
        locationClues: "Not stated",
        uncertainty: "Model pass failed. Do not invent a species.",
        visualEvidence: [],
        ruledOut: [],
        usedGemini: false,
      };
    }
  }

  return {
    probableSpecies: "unknown",
    commonName: "Unconfirmed animal",
    identificationConfidence: 0.22,
    identificationNotes:
      "Live Gemini analysis is off in this environment (no GEMINI_API_KEY). Without a model pass, WildSignal will not invent a species from a custom photo.",
    observedBehavior: [],
    humanContext: input.text ? [input.text] : [],
    animalCondition: "unknown",
    appearsHabituated: false,
    locationClues: "Not stated",
    uncertainty:
      "Add a Gemini API key to enable visual reasoning. Until then, use a demo encounter or treat this as unconfirmed.",
    visualEvidence: [],
    ruledOut: [],
    usedGemini: false,
  };
}

export function parseSafetyReply(text: string): boolean | null {
  const t = text.trim().toLowerCase();
  if (/^(yes|y|safe|i am safe|yes — i am safe|yes — i am safe now)\b/.test(t)) {
    return true;
  }
  if (/^(no|n|help|not safe|no — i need help now)\b/.test(t)) {
    return false;
  }
  return null;
}
