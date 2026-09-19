import type { DemoEncounter } from "@/lib/types";

export const demoEncounters: DemoEncounter[] = [
  {
    id: "mountain-lion",
    species: "mountain_lion",
    title: "Outer Sunset · night shape",
    neighborhood: "44th Avenue & Ulloa Street",
    caption: "Blurry, after dark, a large cat in the street.",
    imageSrc: "/encounters/mountain-lion.jpg",
    imageAlt: "Night camera photograph of a mountain lion walking in low light",
    imageCredit:
      "Demo reconstruction using a public night photograph by Santa Monica Mountains National Recreation Area / Wikimedia Commons. Not a photo of the September 18 Outer Sunset animal.",
    residentMessage:
      "Saw this near 44th and Ulloa just now. I have my kid in the stroller. Is this a mountain lion??",
    analysis: {
      probableSpecies: "mountain_lion",
      commonName: "Mountain lion (Puma concolor)",
      identificationConfidence: 0.72,
      identificationNotes:
        "Long tail, heavy forequarters, and a uniform tan coat are more consistent with a mountain lion than a coyote or a large house cat. The frame is dark and grainy — this is not a certain identification.",
      observedBehavior: ["crossing or lingering in a residential street", "not charging"],
      humanContext: ["child in stroller", "night", "Outer Sunset residential block"],
      animalCondition: "unknown",
      appearsHabituated: false,
      locationClues: "44th Avenue and Ulloa Street, Outer Sunset, San Francisco",
      uncertainty:
        "Could still be a large dog or a misread house cat in sodium-vapor light. Treat as a mountain lion until you have distance.",
      visualEvidence: [
        {
          cue: "Tail longer than the hind legs",
          supports: "mountain lion",
          rulesOut: "bobcat, most house cats",
        },
        {
          cue: "Heavy shoulders, relatively small head",
          supports: "puma",
          rulesOut: "coyote, shepherd mix",
        },
        {
          cue: "Uniform tan coat, no grizzle",
          supports: "mountain lion",
          rulesOut: "coyote",
        },
      ],
      ruledOut: ["coyote", "domestic dog", "house cat"],
      usedGemini: false,
    },
  },
  {
    id: "coyote",
    species: "coyote",
    title: "Presidio · dog walk",
    neighborhood: "Park Trail, Presidio",
    caption: "A coyote holding the trail, watching a leashed dog.",
    imageSrc: "/encounters/coyote.jpg",
    imageAlt: "Coyote sitting and watching, photographed in daylight",
    imageCredit:
      "Demo reconstruction using a public coyote portrait / Wikimedia Commons. Not a live Presidio pin.",
    residentMessage:
      "This thing keeps watching us on the Park Trail. I have my small dog. It will not leave.",
    analysis: {
      probableSpecies: "coyote",
      commonName: "Coyote (Canis latrans)",
      identificationConfidence: 0.86,
      identificationNotes:
        "Pointed muzzle, tall ears, and a grizzled coat read as coyote, not a loose German shepherd. Body language in the description is watchful, not a chase.",
      observedBehavior: ["watching", "remaining nearby", "possible escorting"],
      humanContext: ["small dog present", "Presidio Park Trail", "pupping season"],
      animalCondition: "healthy",
      appearsHabituated: false,
      locationClues: "Park Trail, Presidio of San Francisco — currently closed to dogs through early October",
      uncertainty:
        "Escorting versus curiosity cannot be proven from one still. The closed trail plus a small dog is enough to change course.",
      visualEvidence: [
        {
          cue: "Pointed muzzle and tall ears",
          supports: "coyote",
          rulesOut: "mountain lion",
        },
        {
          cue: "Grizzled coat, lean body",
          supports: "coyote",
          rulesOut: "German shepherd",
        },
        {
          cue: "Watching, not chasing",
          supports: "escorting / territorial",
          rulesOut: "predatory pursuit of a person",
        },
      ],
      ruledOut: ["mountain lion", "loose dog"],
      usedGemini: false,
    },
  },
  {
    id: "parrot",
    species: "parrot",
    title: "Telegraph Hill · bird down",
    neighborhood: "Kearny Street steps",
    caption: "Cherry-headed conure on the ground, flock still above.",
    imageSrc: "/encounters/parrot.jpg",
    imageAlt: "Red-masked parakeet photographed in the Presidio of San Francisco",
    imageCredit:
      "Public photograph of a red-masked parakeet in the Presidio / Wikimedia Commons. Used as a stand-in, not a live roost map.",
    residentMessage:
      "Flock on the wires above Kearny. One bird is on the sidewalk and not flying off when people walk by.",
    analysis: {
      probableSpecies: "parrot",
      commonName: "Cherry-headed / red-masked conure (Psittacara erythrogenys)",
      identificationConfidence: 0.9,
      identificationNotes:
        "Red face, green body, and long tail match San Francisco’s wild conures — the city’s official animal. A bird that stays on the sidewalk while the flock remains above is not typical loafing.",
      observedBehavior: ["on the ground", "not flushing", "flock still present"],
      humanContext: ["sidewalk", "pedestrians", "Telegraph Hill"],
      animalCondition: "injured",
      appearsHabituated: true,
      locationClues: "Kearny Street steps, Telegraph Hill — flock on overhead wires",
      uncertainty:
        "Injury versus exhaustion is hard to see from a phone photo. Failure to flush is enough to call SFACC rather than wait.",
      visualEvidence: [
        {
          cue: "Red face, green body, long tail",
          supports: "cherry-headed conure",
          rulesOut: "pigeon, parrotlet",
        },
        {
          cue: "On the sidewalk while the flock stays above",
          supports: "injury or exhaustion",
          rulesOut: "ordinary loafing",
        },
      ],
      ruledOut: ["healthy loafing bird"],
      usedGemini: false,
    },
  },
];

export function encounterById(id: string) {
  return demoEncounters.find((encounter) => encounter.id === id);
}
