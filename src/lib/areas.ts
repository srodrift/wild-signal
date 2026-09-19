import type { SpeciesId } from "@/lib/types";

export type NeighborId = "harbor_porpoise" | "bobcat" | "pinniped" | "raccoon";

export interface MapArea {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  species: SpeciesId | NeighborId;
  hint: string;
}

export interface SpeciesBrief {
  id: SpeciesId | NeighborId;
  name: string;
  status: string;
  about: string;
  ifYouSeeIt: string[];
  doNot: string[];
  reportTo: string;
}

export const mapAreas: MapArea[] = [
  {
    id: "outer-sunset",
    name: "Outer Sunset",
    lat: 37.7596,
    lng: -122.503,
    radiusMeters: 700,
    species: "mountain_lion",
    hint: "44th & Ulloa",
  },
  {
    id: "pacific-heights",
    name: "Pacific Heights",
    lat: 37.7908,
    lng: -122.4274,
    radiusMeters: 700,
    species: "mountain_lion",
    hint: "Octavia & California · Jan 2026",
  },
  {
    id: "panhandle",
    name: "Panhandle",
    lat: 37.7735,
    lng: -122.4416,
    radiusMeters: 650,
    species: "mountain_lion",
    hint: "Fell & Baker · Sept 5, 2026",
  },
  {
    id: "east-cut",
    name: "East Cut / Rincon Hill",
    lat: 37.7858,
    lng: -122.3922,
    radiusMeters: 800,
    species: "mountain_lion",
    hint: "Rincon Hill · 2020 background",
  },
  {
    id: "presidio",
    name: "Presidio",
    lat: 37.7989,
    lng: -122.4662,
    radiusMeters: 900,
    species: "coyote",
    hint: "Park Trail",
  },
  {
    id: "telegraph-hill",
    name: "Telegraph Hill",
    lat: 37.8025,
    lng: -122.4058,
    radiusMeters: 450,
    species: "parrot",
    hint: "Kearny Street steps",
  },
  {
    id: "fort-point",
    name: "Fort Point / Crissy shore",
    lat: 37.8106,
    lng: -122.4773,
    radiusMeters: 800,
    species: "harbor_porpoise",
    hint: "Golden Gate breakwater",
  },
];

export const speciesBriefs: SpeciesBrief[] = [
  {
    id: "mountain_lion",
    name: "Mountain lion (also puma, cougar, panther)",
    status: "Rare visitor — specially protected, not a city resident",
    about:
      "Three times in 2026. January 27: a 77-pound young male on Lafayette Park steps, then a courtyard at Octavia and California — a neighbor thought it was a dog until she saw the tail. September 5: a dog walker watched one climb a Panhandle tree at Fell and Baker; it left overnight once the park stayed quiet. September 18: another young male at 44th and Ulloa, collared and released. They are dispersing visitors, not city residents. City alert copy this year is the same next move: do not run, face it, back away, look big. The useful ID is a long black-tipped tail.",
    ifYouSeeIt: [
      "Do not run or crouch. Face the animal and give it an escape route.",
      "Get children up and pets in. Look larger. Back away slowly.",
      "Share a block — not a live pin. 2026 city alert: SFACC (415) 554-9400; if someone is in danger, 911. State desk: CDFW WIR.",
      "Once you are inside: bring pets in at night, skip dawn and dusk jogs, and do not feed deer.",
    ],
    doNot: [
      "Do not follow it, post a precise pin, or gather a crowd.",
      "Do not assume every large cat at night is a house cat.",
      "Do not treat a dead pet or goat as a sidewalk sighting — that is a CDFW depredation report.",
    ],
    reportTo: "CDFW Wildlife Incident Reporting — apps.wildlife.ca.gov/wir",
  },
  {
    id: "coyote",
    name: "Coyote",
    status: "Established neighbor since 2002",
    about:
      "Coyotes came back to the Presidio on their own and now use parks across the city. In April 2026 Axios quoted SFACC: nearly every serious confrontation still involves a dog. Off-leash and small dogs are the risk; escorting looks scary and is usually protective. Presidio Park Trail and Ridge Trail stay closed to dogs through early October for pupping.",
    ifYouSeeIt: [
      "If it is just passing through: watch, walk on, keep the dog leashed and within arm’s reach.",
      "If it follows you and a dog: shorten the leash, don’t run, leave the area.",
      "If it is in the street or clearly hurt: call SFACC dispatch. In GGNRA, negative encounters go to park dispatch (415) 561-5505.",
    ],
    doNot: [
      "Do not feed it. Feeding is illegal and can get the animal killed later.",
      "Do not call 911 for an ordinary sighting.",
    ],
    reportTo: "Presidio ecologists if you are in the park; otherwise SFACC observation",
  },
  {
    id: "parrot",
    name: "Cherry-headed / red-masked conure",
    status: "San Francisco’s official animal (Ordinance 124-23, 2023)",
    about:
      "These green-and-red conures are not native, but they are the city’s official animal. A bird on a wire is ordinary. A bird on the sidewalk that will not fly, or one stuck in a balcony, is not — SFFD and SFACC freed a trapped green parrot from third-floor glass on August 31, 2026, checked it, and released it.",
    ifYouSeeIt: [
      "Healthy flock: watch from the sidewalk. Do not publish a roost tree.",
      "Bird down, not flushing, or trapped: keep dogs and people back, then call SFACC. Do not climb after it.",
      "Do not feed bread or try a backyard rescue.",
    ],
    doNot: [
      "Do not chase the flock to find where they sleep.",
      "Do not assume a grounded bird is ‘just resting.’",
    ],
    reportTo: "SFACC Emergency Dispatch (415) 554-9400, 6 a.m.–midnight",
  },
];

export const neighborBriefs: SpeciesBrief[] = [
  {
    id: "harbor_porpoise",
    name: "Harbor porpoise & bottlenose dolphin",
    status: "Returned neighbors — Bay, not a sidewalk animal",
    about:
      "Harbor porpoises lived in the Bay for millennia (Ohlone shellmounds hold their bones), vanished for sixty-plus years after a WWII submarine net and dirty water, and came back in 2008 as fish returned. Bottlenose dolphins followed warm water north after the 1983 El Niño and were permanent Bay residents by 2016. A short triangular fin that barely breaks is usually a porpoise. A taller curved fin, spyhopping, or a show off Fort Point is usually a dolphin — not a shark.",
    ifYouSeeIt: [
      "Watch from the seawall or bridge. Do not launch a boat to chase the pod.",
      "Triangular fin, brief roll: harbor porpoise. Curved fin, longer animal: bottlenose dolphin.",
      "Photograph the dorsal fin if you can do it from shore and send it to The Marine Mammal Center cetacean catalog.",
    ],
    doNot: [
      "Do not assume every Ocean Beach or Crissy fin is a shark.",
      "Do not crowd a hauled-out seal on the same shoreline to ‘get closer to the dolphins.’",
    ],
    reportTo: "The Marine Mammal Center cetacean field research — marinemammalcenter.org",
  },
  {
    id: "bobcat",
    name: "Bobcat",
    status: "Headlands resident — short tail, not a lion",
    about:
      "NPS says gray fox, bobcat, and coyote are the common mesocarnivores in Golden Gate coastal scrub. Bobcats hunt rodents and rabbits in Gerbode and Tennessee valleys. People regularly mistake bobcat tracks and a large tawny cat for a mountain lion. The tell is the tail: a lion’s is long and black-tipped; a bobcat’s is short and ‘bobbed.’",
    ifYouSeeIt: [
      "Give it the trail. Do not crouch for a photo.",
      "If the tail is short, it is almost certainly not a lion.",
      "If you are unsure and the animal is large, use mountain-lion rules until you are sure.",
    ],
    doNot: [
      "Do not post a pin to a den or a daytime rest spot.",
      "Do not treat a Headlands bobcat as an Inner Sunset emergency.",
    ],
    reportTo: "Ordinary sighting: enjoy it. A cat that will not leave a trail or a person: GGNRA dispatch (415) 561-5505",
  },
  {
    id: "pinniped",
    name: "Harbor seal & California sea lion",
    status: "Coastal haul-outs — Pier 39 is the civic one",
    about:
      "NPS: isolated rocks and beaches are haul-outs. Hundreds of harbor seals use Point Bonita Cove; pupping is concentrated in Bolinas Lagoon and Tomales Bay. Sea lions made Pier 39 famous after 1989. Young whales sometimes wander into the Bay. Southern sea otters are still rare this far north.",
    ifYouSeeIt: [
      "Stay well back from a seal or sea lion on sand. Mothers will abandon a pup that is crowded.",
      "A lone pup that looks ‘abandoned’ is often waiting for the tide. Call The Marine Mammal Center before touching it.",
    ],
    doNot: [
      "Do not let a dog rush a haul-out.",
      "Do not pour water on a ‘sleeping’ seal or try to push it back in.",
    ],
    reportTo: "The Marine Mammal Center 24-hour rescue: (415) 289-SEAL",
  },
  {
    id: "raccoon",
    name: "Raccoon",
    status: "Night neighbor — not a 911 animal",
    about:
      "r/sanfrancisco argues about coyotes versus raccoons the way other cities argue about sports. A 2024 thread asking ‘which of SF’s wildlife is your favorite’ filled with coyotes, hawks, owls, herons, raccoons — and ‘where are the parrots?’ One runner wrote that a coyote leaped off a trail, killed something, and they froze: run, make noise, or back away? That is the encounter-interpretation problem. A raccoon in a trash can is not it.",
    ifYouSeeIt: [
      "Secure trash and pet food. Watch from the porch.",
      "If it is clearly injured or trapped, call SFACC. If it is eating compost, close the lid tomorrow.",
    ],
    doNot: [
      "Do not feed it. Do not treat a backyard raccoon as a mountain-lion event.",
      "Do not start a neighborhood removal campaign over a healthy animal.",
    ],
    reportTo: "SFACC only if injured, trapped, or truly aggressive — (415) 554-9400",
  },
];

export function areaForLocation(text: string) {
  const hay = text.toLowerCase();
  if (
    /fort point|baker beach|ocean beach|porpoise|dolphin|dorsal|fin off|shark/.test(
      hay,
    )
  ) {
    return mapAreas.find((area) => area.id === "fort-point");
  }
  if (/presidio|park trail|ridge trail|crissy/.test(hay)) {
    return mapAreas.find((area) => area.id === "presidio");
  }
  if (/pacific heights|pac heights|lafayette|octavia/.test(hay)) {
    return mapAreas.find((area) => area.id === "pacific-heights");
  }
  if (/panhandle|fell and baker|fell & baker|fell street/.test(hay)) {
    return mapAreas.find((area) => area.id === "panhandle");
  }
  if (/rincon|east cut|oracle|channel street|salesforce/.test(hay)) {
    return mapAreas.find((area) => area.id === "east-cut");
  }
  if (/ulloa|44th|sunset/.test(hay)) {
    return mapAreas.find((area) => area.id === "outer-sunset");
  }
  if (/kearny|telegraph|parrot/.test(hay)) {
    return mapAreas.find((area) => area.id === "telegraph-hill");
  }
  return undefined;
}

export function areaForReport(text: string, species: SpeciesId) {
  return areaForLocation(text) ?? mapAreas.find((area) => area.species === species);
}

export function briefForSpecies(id: SpeciesId | NeighborId) {
  return (
    speciesBriefs.find((brief) => brief.id === id) ??
    neighborBriefs.find((brief) => brief.id === id)
  );
}
