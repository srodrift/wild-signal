import type {
  GraphEdge,
  GraphInsight,
  GraphNode,
  IncidentReport,
  SceneAnalysis,
  SpeciesId,
} from "@/lib/types";
import { speciesLabel } from "@/lib/guidance";

interface StoredEncounter {
  id: string;
  species: SpeciesId;
  area: string;
  agency: string;
  risk: string;
  context: string[];
  createdAt: string;
}

const store: StoredEncounter[] = [];

function blurArea(raw: string) {
  const text = raw.trim();
  if (/presidio|park trail|ridge trail/i.test(text)) return "Presidio";
  if (/ulloa|44th|sunset/i.test(text)) return "Outer Sunset";
  if (/kearny|telegraph/i.test(text)) return "Telegraph Hill";
  if (/panhandle|golden gate park/i.test(text)) return "Golden Gate Park";
  const first = text.split(",")[0]?.trim();
  return first && first.length < 40 ? first : "San Francisco";
}

function seed() {
  if (store.length > 0) return;
  store.push(
    {
      id: "seed-coyote-1",
      species: "coyote",
      area: "Presidio",
      agency: "Presidio Trust wildlife ecologists",
      risk: "yellow",
      context: ["small dog present", "pupping season"],
      createdAt: "2026-09-12T16:10:00.000Z",
    },
    {
      id: "seed-coyote-2",
      species: "coyote",
      area: "Presidio",
      agency: "Presidio Trust wildlife ecologists",
      risk: "yellow",
      context: ["small dog present", "escorting"],
      createdAt: "2026-09-18T07:40:00.000Z",
    },
    {
      id: "seed-lion-1",
      species: "mountain_lion",
      area: "Outer Sunset",
      agency: "California Department of Fish and Wildlife — Wildlife Incident Reporting",
      risk: "orange",
      context: ["night", "residential street"],
      createdAt: "2026-09-18T15:20:00.000Z",
    },
    {
      id: "seed-parrot-1",
      species: "parrot",
      area: "Telegraph Hill",
      agency: "SF Animal Care & Control — Emergency Dispatch",
      risk: "orange",
      context: ["on the ground", "flock still present"],
      createdAt: "2026-09-10T18:05:00.000Z",
    },
  );
}

function patternLine(input: {
  species: SpeciesId;
  area: string;
  count: number;
  context: string[];
}) {
  const dog = input.context.some((item) => /dog|leash/i.test(item));
  if (input.species === "coyote" && dog) {
    return `${input.count} coyote-with-dog encounters already on the ${input.area} graph this season — same escorting pattern, not a new emergency.`;
  }
  if (input.species === "coyote") {
    return `${input.count} ordinary coyote observations in ${input.area}. The graph says this is a resident, not an invasion.`;
  }
  if (input.species === "mountain_lion") {
    return `${input.count} mountain-lion observation${input.count === 1 ? "" : "s"} in ${input.area} on the graph. Rare, routed to CDFW — never to a public pin.`;
  }
  if (input.species === "parrot") {
    return `${input.count} injured-conure reports in ${input.area}. Pattern: bird down, flock still above → SFACC, not a roost map.`;
  }
  return `${input.count} similar ${speciesLabel(input.species).toLowerCase()} records in ${input.area}.`;
}

function snapshot(species: SpeciesId, area: string): GraphInsight {
  seed();
  const matches = store.filter((row) => row.species === species && row.area === area);
  const latest = matches[matches.length - 1];
  const context = latest?.context ?? [];
  const nodes: GraphNode[] = [
    { id: `species:${species}`, type: "species", label: speciesLabel(species) },
    { id: `area:${area}`, type: "area", label: area },
  ];
  const edges: GraphEdge[] = [];
  if (latest) {
    nodes.push({ id: `agency:${latest.agency}`, type: "agency", label: latest.agency });
    edges.push({ from: `species:${species}`, to: `area:${area}`, type: "SEEN_IN" });
    edges.push({ from: `area:${area}`, to: `agency:${latest.agency}`, type: "ROUTES_TO" });
  }
  for (const row of matches.slice(-3)) {
    nodes.push({ id: row.id, type: "encounter", label: row.risk });
    edges.push({ from: row.id, to: `species:${species}`, type: "OF_SPECIES" });
    edges.push({ from: row.id, to: `area:${area}`, type: "IN_AREA" });
  }
  return {
    backend: falkorConfigured() ? "falkordb" : "memory",
    area,
    species,
    similarCount: matches.length,
    pattern: patternLine({
      species,
      area,
      count: matches.length,
      context,
    }),
    routedTo: latest?.agency ?? null,
    nodes,
    edges,
  };
}

export function falkorConfigured() {
  return Boolean(process.env.FALKORDB_HOST || process.env.FALKORDB_URL);
}

async function writeFalkor(row: StoredEncounter) {
  const { FalkorDB } = await import("falkordb");
  const host = process.env.FALKORDB_HOST ?? "127.0.0.1";
  const port = Number(process.env.FALKORDB_PORT ?? 6379);
  const client = await FalkorDB.connect({
    username: process.env.FALKORDB_USERNAME,
    password: process.env.FALKORDB_PASSWORD,
    socket: { host, port },
  });
  try {
    const graph = client.selectGraph("wildsignal");
    await graph.query(
      `
      MERGE (s:Species {id: $species})
      MERGE (a:Area {name: $area})
      MERGE (g:Agency {name: $agency})
      CREATE (e:Encounter {id: $id, risk: $risk, createdAt: $createdAt})
      CREATE (e)-[:OF_SPECIES]->(s)
      CREATE (e)-[:IN_AREA]->(a)
      CREATE (e)-[:ROUTED_TO]->(g)
      MERGE (s)-[:SEEN_IN]->(a)
      MERGE (a)-[:ROUTES_TO]->(g)
      `,
      {
        params: {
          species: row.species,
          area: row.area,
          agency: row.agency,
          id: row.id,
          risk: row.risk,
          createdAt: row.createdAt,
        },
      },
    );
  } finally {
    await client.close();
  }
}

export function insightForAnalysis(analysis: SceneAnalysis): GraphInsight {
  seed();
  const area = blurArea(analysis.locationClues);
  return snapshot(analysis.probableSpecies, area);
}

export async function recordReport(report: IncidentReport): Promise<GraphInsight> {
  seed();
  const area = blurArea(report.neighborhoodHint);
  const row: StoredEncounter = {
    id: report.id,
    species: report.probableSpecies,
    area,
    agency: report.agency.name,
    risk: report.riskLevel,
    context: [...report.humanContext, ...report.observedBehavior],
    createdAt: report.createdAt,
  };
  if (!store.some((item) => item.id === row.id)) {
    store.push(row);
  }
  if (falkorConfigured()) {
    try {
      await writeFalkor(row);
    } catch (error) {
      console.warn("FalkorDB write failed; memory graph still holds the encounter", error);
    }
  }
  return snapshot(row.species, area);
}

export function graphOverview() {
  seed();
  return {
    backend: falkorConfigured() ? "falkordb" : "memory",
    areas: [...new Set(store.map((row) => row.area))],
    encounters: store.length,
    insight: store.map((row) => ({
      species: row.species,
      area: row.area,
      agency: row.agency,
    })),
  };
}
