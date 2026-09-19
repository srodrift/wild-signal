import { selectGuidance } from "@/lib/guidance";
import type { SceneAnalysis, SceneTap } from "@/lib/types";

export function sceneTapsFor(analysis: SceneAnalysis): SceneTap[] {
  const fromPhoto = analysis.visualEvidence.slice(0, 2).map((row, index) => ({
    id: `cue-${index}`,
    label: row.cue,
    prompt: `Seeing this: ${row.cue}?`,
  }));

  const extras: SceneTap[] =
    analysis.probableSpecies === "coyote"
      ? [{ id: "dog", label: "A dog is with me", prompt: "A dog is with me?" }]
      : analysis.probableSpecies === "mountain_lion"
        ? [{ id: "still-there", label: "It is still in the street", prompt: "Still in the street?" }]
        : [{ id: "grounded", label: "The bird will not fly", prompt: "Bird still down?" }];

  const seen = new Set(fromPhoto.map((tap) => tap.id));
  return [...fromPhoto, ...extras.filter((tap) => !seen.has(tap.id))].slice(0, 3);
}

export function applySceneTap(analysis: SceneAnalysis, raw: string): SceneAnalysis {
  const text = raw.trim();
  const denied = /^(not that|not:|no —|no:|i don't see)/i.test(text);
  const cue = text
    .replace(/^(i see:|seeing this:|seen:|not that:|not:|yes:|no:)\s*/i, "")
    .replace(/\?$/, "")
    .trim();

  const next: SceneAnalysis = {
    ...analysis,
    visualEvidence: analysis.visualEvidence,
    ruledOut: [...analysis.ruledOut],
    humanContext: [...analysis.humanContext],
    observedBehavior: [...analysis.observedBehavior],
  };

  if (denied) {
    next.ruledOut = [...next.ruledOut, cue];
    next.identificationConfidence = Math.max(0.28, next.identificationConfidence - 0.08);
    if (/dog|leash/i.test(cue)) {
      next.humanContext = next.humanContext.filter((row) => !/dog|leash/i.test(row));
    }
    if (/street|road|traffic/i.test(cue)) {
      next.observedBehavior = next.observedBehavior.filter((row) => !/street|road|traffic/i.test(row));
    }
    if (/fly|ground|sidewalk/i.test(cue)) {
      next.animalCondition = "unknown";
    }
    return next;
  }

  next.humanContext = next.humanContext.includes(cue)
    ? next.humanContext
    : [...next.humanContext, cue];
  next.identificationConfidence = Math.min(0.94, next.identificationConfidence + 0.03);
  if (/dog|leash/i.test(cue) && !next.humanContext.some((row) => /dog/i.test(row))) {
    next.humanContext.push("dog on leash");
  }
  return next;
}

export function nextMoveFor(analysis: SceneAnalysis) {
  const guidance = selectGuidance(analysis);
  return {
    text: guidance.immediateActions[0] ?? "Create distance. Do not approach.",
    why: guidance.title,
  };
}

export function openingLine(analysis: SceneAnalysis) {
  const move = nextMoveFor(analysis);
  const name = analysis.commonName.split("(")[0]?.trim() ?? analysis.commonName;
  const confidence = `${Math.round(analysis.identificationConfidence * 100)}%`;
  return `${name} — ${confidence}.\n\nNext move: ${move.text}`;
}

export function looksLikePlace(text: string) {
  return /ulloa|44th|sunset|presidio|park trail|kearny|telegraph|fort point|baker|rincon|east cut|oracle/i.test(
    text,
  );
}

export function isSceneTap(text: string, taps: SceneTap[] = []) {
  const t = text.trim();
  if (/^(i see:|seeing this:|seen:|not that:|not:)/i.test(t)) return true;
  return taps.some((tap) => t === tap.label || t === tap.prompt);
}
