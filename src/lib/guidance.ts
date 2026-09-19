import type {
  AgencyRoute,
  GuidanceCard,
  RiskLevel,
  SceneAnalysis,
  SpeciesId,
} from "@/lib/types";

const SFACC_EMERGENCY: AgencyRoute = {
  name: "SF Animal Care & Control — Emergency Dispatch",
  why: "City officers handle injured, trapped, or distressed wildlife inside San Francisco.",
  phone: "(415) 554-9400",
  hours: "6:00 a.m. – midnight",
  url: "https://www.sfanimalcare.org/living-with-urban-wildlife/report-found-or-injured/",
};

const SFACC_COYOTE: AgencyRoute = {
  name: "SF Animal Care & Control — Coyote observation",
  why: "Ordinary sightings become useful ecological data; dispatch is reserved for injury, distress, or true aggression.",
  email: "ACC@sfgov.org",
  phone: "(415) 554-9400",
  url: "https://www.sfanimalcare.org/living-with-urban-wildlife/coyote-sightings/",
};

const PRESIDIO_ECOLOGY: AgencyRoute = {
  name: "Presidio Trust wildlife ecologists",
  why: "Encounters inside the Presidio — especially during pupping season — should go to park ecologists.",
  phone: "(415) 561-4270",
  email: "coyote@presidiotrust.gov",
  url: "https://presidio.gov/about/sustainability/coyotes-in-the-presidio",
};

const CDFW_WIR: AgencyRoute = {
  name: "California Department of Fish and Wildlife — Wildlife Incident Reporting",
  why: "Mountain lion observations are routed to a CDFW investigator by location. Call 911 if anyone is in imminent danger.",
  url: "https://apps.wildlife.ca.gov/wir/",
};

const NINE_ONE_ONE: AgencyRoute = {
  name: "911",
  why: "Imminent danger to a person, or an animal attack, is an emergency — not a wildlife observation.",
};

function card(partial: GuidanceCard): GuidanceCard {
  return partial;
}

export const guidanceLibrary = {
  mountainLionPresent: card({
    id: "mountain-lion-present",
    title: "Possible mountain lion — stay calm, give it room",
    riskLevel: "orange",
    immediateActions: [
      "Do not approach and do not run.",
      "Face the animal. Do not turn your back or crouch.",
      "Bring children onto your shoulders and keep pets next to you, leashed.",
      "Give the animal a clear escape route — step aside if you are blocking it.",
      "Appear larger: open a jacket, raise your arms, speak firmly.",
      "Back away slowly once there is space between you.",
    ],
    doNot: [
      "Do not run, jog away, or turn your back.",
      "Do not bend down, pick up a stick while crouched, or look like four-legged prey.",
      "Do not follow the animal, post a live location, or gather a crowd to watch.",
    ],
    explanation:
      "CDFW says mountain lions generally avoid people and that few reported sightings are an imminent public-safety threat. The correct first move is space and calm — not a chase, a photo expedition, or a neighborhood alert with a pin. Once you are inside: do not jog at dawn, dusk, or night; bring pets into a covered shelter; deer feeders attract lions.",
    sourceIds: [
      "cdfw-hwc-lions",
      "cdfw-hwc-prevent",
      "cdfw-lion-id",
      "cdfw-wir",
      "ktvu-sunset-2026",
      "abc7-sunset-2026",
      "sfgate-pacheights-2026",
      "sfstandard-panhandle-2026",
      "sfpd-eastcut-2020",
    ],
    reportRecommended: true,
    emergency: false,
    agency: CDFW_WIR,
  }),
  mountainLionEmergency: card({
    id: "mountain-lion-emergency",
    title: "Immediate danger — protect people first",
    riskLevel: "red",
    immediateActions: [
      "Call 911 if a person is being attacked or cannot get to safety.",
      "Do not run. Face the animal, appear larger, and make loud noise.",
      "If attacked, fight back. Protect your head and neck. Stay on your feet if you can.",
      "Get children and pets behind you only after you are facing the animal.",
    ],
    doNot: [
      "Do not play dead.",
      "Do not turn away to film or to call someone other than 911.",
    ],
    explanation:
      "Attacks are rare, but CDFW is explicit: if a mountain lion attacks a person, call 911 immediately and fight back.",
    sourceIds: ["cdfw-hwc-lions"],
    reportRecommended: true,
    emergency: true,
    agency: NINE_ONE_ONE,
  }),
  coyoteWithDog: card({
    id: "coyote-with-dog",
    title: "Likely coyote — this may be escorting, not hunting",
    riskLevel: "yellow",
    immediateActions: [
      "Shorten the leash and pick up a small dog if you can do it without crouching toward the coyote.",
      "Do not run. Keep facing the animal and move away calmly.",
      "If it comes within about 50 feet and does not yield, stand tall, wave your arms, and speak loudly.",
      "Leave the area. Do not continue the walk through a posted pupping-season closure.",
    ],
    doNot: [
      "Do not unleash the dog, let it chase, or stand your ground next to a den.",
      "Do not feed the coyote or throw food to ‘distract’ it.",
      "Do not assume lunging at a dog means the coyote is hunting you.",
    ],
    explanation:
      "SFACC calls this escorting: coyotes often follow people with dogs to move them away from pups. The Presidio currently closes two trail segments to dogs through early October for exactly this reason. The animal is usually asking for distance, not a fight.",
    sourceIds: [
      "sfacc-escort",
      "presidio-pupping-2026",
      "axios-coyote-2026",
      "presidio-coyotes",
      "nps-goga-coyote-safety",
    ],
    reportRecommended: true,
    emergency: false,
    agency: PRESIDIO_ECOLOGY,
  }),
  coyoteObserve: card({
    id: "coyote-observe",
    title: "Coyote nearby — ordinary urban wildlife",
    riskLevel: "green",
    immediateActions: [
      "Watch from a distance. Enjoy it. Keep walking.",
      "Keep dogs leashed and children next to you.",
      "Secure any food or trash you are carrying.",
    ],
    doNot: [
      "Do not feed, follow, or try to photograph from closer range.",
      "Do not call emergency dispatch for a coyote that is simply passing through.",
    ],
    explanation:
      "Coyotes have lived in the Presidio since 2002 and now use parks across the city. A calm animal crossing a field is doing its job — including rodent control. Habituation from feeding is what turns a neighbor into a conflict.",
    sourceIds: ["presidio-coyotes", "sfacc-escort", "nps-roadkill", "nps-goga-coyote-safety"],
    reportRecommended: false,
    emergency: false,
    agency: SFACC_COYOTE,
  }),
  coyoteTraffic: card({
    id: "coyote-traffic",
    title: "Wildlife near traffic — the street is the hazard",
    riskLevel: "orange",
    immediateActions: [
      "Do not chase the animal out of the roadway yourself.",
      "If it is safe for you, warn approaching cars without entering the lane.",
      "Call SFACC dispatch if the animal is injured or unable to leave the street.",
    ],
    doNot: [
      "Do not herd it with a car or a crowd.",
      "Do not stand in traffic to take a photo.",
    ],
    explanation:
      "The National Park Service identifies road collisions as a primary cause of coyote death in the Bay Area. A useful report here is about the roadway, not about ‘aggression.’",
    sourceIds: ["nps-roadkill", "sfacc-injured"],
    reportRecommended: true,
    emergency: false,
    agency: SFACC_EMERGENCY,
  }),
  parrotInjured: card({
    id: "parrot-injured",
    title: "Possible injured wild parrot — give it quiet, then call",
    riskLevel: "orange",
    immediateActions: [
      "Keep people, dogs, and cars away from the bird.",
      "Do not try to feed it bread, chips, or water from a bottle.",
      "Note the exact block, whether it can stand or fly, and any visible injury.",
      "Call SFACC dispatch so an officer or a licensed rehabilitator can take it.",
    ],
    doNot: [
      "Do not chase the flock to find a roost.",
      "Do not post a precise roost or nest location.",
      "Do not assume a bird on the ground is ‘just resting’ if it cannot fly.",
    ],
    explanation:
      "San Francisco designated these cherry-headed conures as the city’s official animal in 2023. In August 2026, SFFD and SFACC freed one whose head was stuck in balcony glass and released it after a check. A bird that will not fly still needs that desk — not a crowd or a backyard rescue.",
    sourceIds: ["sf-ordinance-124-23", "sfacc-injured", "nbc-parrot-glass-2026"],
    reportRecommended: true,
    emergency: false,
    agency: SFACC_EMERGENCY,
  }),
  parrotObserve: card({
    id: "parrot-observe",
    title: "Wild parrots — a civic animal, not a pet",
    riskLevel: "green",
    immediateActions: [
      "Watch the flock from the sidewalk. Count roughly. Note anything unusual.",
      "Keep food away. Feeding trains birds onto balconies and into traffic.",
    ],
    doNot: [
      "Do not share a roost tree address.",
      "Do not try to handle a bird that can still fly.",
    ],
    explanation:
      "The official-animal ordinance recognizes the flock as part of the city’s public life. The useful civic act is a careful observation, not a capture.",
    sourceIds: ["sf-ordinance-124-23"],
    reportRecommended: false,
    emergency: false,
    agency: SFACC_COYOTE,
  }),
  injuredGeneral: card({
    id: "injured-general",
    title: "Injured or trapped wildlife — create space, then report",
    riskLevel: "orange",
    immediateActions: [
      "Keep pets and children back.",
      "Do not touch the animal.",
      "Call SFACC Emergency Dispatch with the block, species guess, and what you can see.",
    ],
    doNot: [
      "Do not attempt a backyard rescue or offer food.",
      "Do not post a live location that will draw spectators.",
    ],
    explanation:
      "SFACC officers take distressed wildlife from 6 a.m. to midnight and transfer animals to licensed rehabilitators. Touching wildlife can injure you and the animal.",
    sourceIds: ["sfacc-injured"],
    reportRecommended: true,
    emergency: false,
    agency: SFACC_EMERGENCY,
  }),
  unknownLowConfidence: card({
    id: "unknown-low-confidence",
    title: "Unconfirmed species — take the safest applicable actions",
    riskLevel: "yellow",
    immediateActions: [
      "Create distance. Do not approach to ‘get a better look.’",
      "Keep dogs leashed and children next to you.",
      "Do not run if the animal is a large cat or canid.",
      "If it looks like a mountain lion, treat it as one until you are sure it is not.",
    ],
    doNot: [
      "Do not trust a single blurry frame as a positive ID.",
      "Do not crowd the animal for more photos.",
    ],
    explanation:
      "WildSignal will not invent a species. Low confidence means we use the more conservative guidance — mountain-lion rules if a large cat is possible — and we say so.",
    sourceIds: ["cdfw-hwc-lions", "sfacc-escort"],
    reportRecommended: true,
    emergency: false,
    agency: SFACC_EMERGENCY,
  }),
} satisfies Record<string, GuidanceCard>;

function has(context: string[], ...needles: string[]) {
  const hay = context.join(" ").toLowerCase();
  return needles.some((needle) => hay.includes(needle));
}

export function selectGuidance(analysis: SceneAnalysis): GuidanceCard {
  const ctx = [
    ...analysis.humanContext,
    ...analysis.observedBehavior,
    analysis.locationClues,
    analysis.identificationNotes,
  ];

  const attack = has(ctx, "attack", "maul", "on top of a person", "biting a person");
  const dogPresent = has(
    [...analysis.humanContext, ...analysis.observedBehavior],
    "dog",
    "leash",
    "puppy on leash",
  );
  const traffic = has(ctx, "traffic", "road", "street", "car", "intersection");
  const presidio = has(ctx, "presidio", "park trail", "ridge trail", "crissy");

  if (analysis.probableSpecies === "mountain_lion" && attack) {
    return guidanceLibrary.mountainLionEmergency;
  }

  if (
    analysis.probableSpecies === "mountain_lion" ||
    (analysis.identificationConfidence < 0.5 &&
      has(ctx, "lion", "puma", "cougar", "large cat", "big cat"))
  ) {
    return guidanceLibrary.mountainLionPresent;
  }

  if (analysis.animalCondition === "injured" || analysis.animalCondition === "trapped") {
    if (analysis.probableSpecies === "parrot") return guidanceLibrary.parrotInjured;
    if (analysis.probableSpecies === "coyote" && traffic) {
      return guidanceLibrary.coyoteTraffic;
    }
    return guidanceLibrary.injuredGeneral;
  }

  if (analysis.probableSpecies === "coyote") {
    if (traffic) return guidanceLibrary.coyoteTraffic;
    if (dogPresent) {
      const card = {
        ...guidanceLibrary.coyoteWithDog,
        agency: presidio ? PRESIDIO_ECOLOGY : SFACC_COYOTE,
      };
      return card;
    }
    return guidanceLibrary.coyoteObserve;
  }

  if (analysis.probableSpecies === "parrot") {
    return guidanceLibrary.parrotObserve;
  }

  if (analysis.identificationConfidence < 0.5) {
    return guidanceLibrary.unknownLowConfidence;
  }

  return guidanceLibrary.unknownLowConfidence;
}

export function riskLabel(level: RiskLevel) {
  switch (level) {
    case "green":
      return "Green — ordinary wildlife";
    case "yellow":
      return "Yellow — change your behavior";
    case "orange":
      return "Orange — report, do not crowd";
    case "red":
      return "Red — people first";
  }
}

export function speciesLabel(id: SpeciesId) {
  switch (id) {
    case "mountain_lion":
      return "Mountain lion";
    case "coyote":
      return "Coyote";
    case "parrot":
      return "Wild parrot";
    case "dog":
      return "Domestic dog";
    case "cat":
      return "Domestic cat";
    case "raccoon":
      return "Raccoon";
    case "other":
      return "Other animal";
    case "unknown":
      return "Unconfirmed";
  }
}
