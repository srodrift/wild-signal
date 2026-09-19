import { guidanceLibrary } from "@/lib/guidance";
import type { AgentReply, SceneAnalysis } from "@/lib/types";

export function isGreeting(text: string) {
  return /^(hi+|hey+|hello|yo|sup|hiya|howdy|good (morning|afternoon|evening)|test|testing|hola)\b[!?. ]*$/i.test(
    text.trim(),
  );
}

export function looksLikeEncounter(text: string, hasImage = false) {
  if (hasImage) return true;
  const t = text.trim();
  if (!t) return false;
  if (isGreeting(t)) return false;
  if (
    /^(who are you|what(?:'s| is) (this|wild ?signal)|how does (this|it) work|why (not )?(911|chatgpt|google)|who do i call|what do i (do|text)|help|thanks|thank you)\b/i.test(
      t,
    )
  ) {
    return false;
  }
  return /(lion|cougar|puma|coyote|parrot|conure|animal|i see|i saw|spotted|following me|in the (street|road|park)|on the sidewalk|will not fly|won't fly|grounded|injured|trapped)/i.test(
    t,
  );
}

export function talkAnalysis(): SceneAnalysis {
  return {
    probableSpecies: "unknown",
    commonName: "Conversation",
    identificationConfidence: 0,
    identificationNotes: "Not a scene yet — talking first.",
    observedBehavior: [],
    humanContext: [],
    animalCondition: "unknown",
    appearsHabituated: false,
    locationClues: "Not stated",
    uncertainty: "No photo or sighting yet.",
    visualEvidence: [],
    ruledOut: [],
    usedGemini: false,
  };
}

export function composeTalk(text: string): AgentReply {
  const t = text.trim();
  const body = talkReply(t);
  return {
    analysis: talkAnalysis(),
    guidance: guidanceLibrary.unknownLowConfidence,
    messages: [body],
    followUp: {
      phase: "talk",
      prompt: "Ask a question, or send what you see.",
      chips: [
        "I see a mountain lion",
        "A coyote is following my dog",
        "A parrot will not fly",
        "Who do I call?",
      ],
    },
    report: null,
    photon: {
      effect: "gentle",
      tapback: isGreeting(t) ? "liked" : "questioned",
    },
  };
}

function talkReply(text: string) {
  if (isGreeting(text)) {
    return [
      "Hey. I’m wild signal — the City’s wildlife desk in Messages.",
      "Three mountain lions walked San Francisco this year: Pacific Heights in January, a tree in the Panhandle on September 5, then 44th and Ulloa on September 18. Coyotes already live here. The parrots are the official animal.",
      "Send a photo or say what you actually see. I’ll give you one next move and the desk that takes that call — CDFW, SFACC, or the Presidio. Not a pamphlet.",
    ].join("\n\n");
  }

  if (/911|emergency/i.test(text) && !/not 911|why not 911/i.test(text)) {
    return [
      "If a person is being hurt, hang up and call 911. That is the only one-number rule.",
      "A coyote on the Park Trail is not that. Neither is a parrot on Kearny, or a lion that already walked on. Those go to state wildlife, city animal control, or park staff — I route that minute so 911 stays clear.",
    ].join("\n\n");
  }

  if (/who do i call|which (desk|number|agency)|who (to|should i) (call|text)/i.test(text)) {
    return [
      "Depends on the animal.",
      "Mountain lion → California Fish & Wildlife. Do not run. Face it. Give it a way out.",
      "Coyote, especially with a dog → Presidio ecologists if you are in the park, otherwise SFACC at (415) 554-9400.",
      "A parrot that will not fly → the same SFACC dispatch. Official animal, city desk.",
      "911 only if a person is in danger. Tell me which one you are looking at.",
    ].join("\n\n");
  }

  if (/lion|cougar|puma/i.test(text)) {
    return [
      "This year’s lions: a 77-pound male in Pacific Heights in January (SFGate), Fell and Baker in the Panhandle on September 5 (The Standard — it left overnight), then a juvenile at 44th and Ulloa on September 18 (KTVU / ABC7).",
      "CDFW: do not run, do not crouch, face the animal, give it an escape route. The report desk is Fish & Wildlife, not a live pin.",
      "If you are looking at one right now, send the photo or the block.",
    ].join("\n\n");
  }

  if (/coyote/i.test(text)) {
    return [
      "Coyotes have lived in the Presidio since 2002. Axios this April: nearly every serious confrontation in the City still involves a dog. Escorting — following, stiff, noisy — is usually the animal walking you out of a den, not a hunt.",
      "Pick the dog up if you can, or shorten the leash and leave the way you came. Park Trail / Ridge Trail: Presidio staff. Elsewhere: SFACC (415) 554-9400.",
      "Is a dog with you?",
    ].join("\n\n");
  }

  if (/parrot|conure|bird/i.test(text)) {
    return [
      "The cherry-headed conures are the official animal (Ordinance 124-23). A bird that will not fly, or one stuck in glass, is city dispatch — SFACC (415) 554-9400. Firefighters and ACC already did that balcony rescue on August 31.",
      "Do not handle it. Keep dogs back. I will not publish a roost tree.",
      "Is it on the ground, or still in the flock?",
    ].join("\n\n");
  }

  if (/chatgpt|google|how (is this|are you) different/i.test(text)) {
    return [
      "Google is six tabs while you are holding a leash. ChatGPT will invent the steps and help you post a pin.",
      "I only read the scene — species, dog, child, block. The words come from CDFW, the Presidio Trust, NPS, and SFACC. Photon is already in Messages.",
      "Send what you see.",
    ].join("\n\n");
  }

  if (/who are you|what(?:'s| is) (this|wild ?signal)|how does/i.test(text)) {
    return [
      "wild signal. You send what you see. Gemini names the animal and the scene. A rule file — not the model — says the next move and which desk to call.",
      "Photon’s shared line only hears phones we have added as users. If you already did that, just text. If a bounce said it didn’t recognize you, add your number first, then say hi again.",
    ].join("\n\n");
  }

  return [
    "I’m here. Tell me what you see — or ask who to call.",
    "Lion, coyote, parrot, a dog being followed, a bird that will not fly. I will stay in the conversation and still use the City’s copy, not a guess.",
  ].join("\n\n");
}
