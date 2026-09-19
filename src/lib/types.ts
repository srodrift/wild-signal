export type SpeciesId =
  | "mountain_lion"
  | "coyote"
  | "parrot"
  | "dog"
  | "cat"
  | "raccoon"
  | "other"
  | "unknown";

export type RiskLevel = "green" | "yellow" | "orange" | "red";

export type AnimalCondition = "healthy" | "injured" | "trapped" | "unknown";

export type ConversationPhase =
  | "idle"
  | "talk"
  | "scene"
  | "triage"
  | "details"
  | "report_ready";

export interface SceneTap {
  id: string;
  label: string;
  prompt: string;
}

export interface NextMove {
  text: string;
  why: string;
}

export interface VisualEvidence {
  cue: string;
  supports: string;
  rulesOut: string;
}

export interface SceneAnalysis {
  probableSpecies: SpeciesId;
  commonName: string;
  identificationConfidence: number;
  identificationNotes: string;
  observedBehavior: string[];
  humanContext: string[];
  animalCondition: AnimalCondition;
  appearsHabituated: boolean;
  locationClues: string;
  uncertainty: string;
  visualEvidence: VisualEvidence[];
  ruledOut: string[];
  usedGemini: boolean;
}

export interface PhotonNative {
  tapback?: "emphasized" | "loved" | "liked" | "questioned";
  effect?: "gentle" | "slam" | "loud";
  poll?: { title: string; options: string[] };
  contact?: { name: string; phone?: string; email?: string; subtitle: string };
  richLink?: { url: string; title: string; subtitle: string };
  appCard?: { title: string; subtitle: string; url: string; live: boolean };
  group?: { name: string; members: string[] };
}

export interface GuidanceCard {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  immediateActions: string[];
  doNot: string[];
  explanation: string;
  sourceIds: string[];
  reportRecommended: boolean;
  emergency: boolean;
  agency: AgencyRoute;
}

export interface AgencyRoute {
  name: string;
  why: string;
  phone?: string;
  hours?: string;
  url?: string;
  email?: string;
}

export interface IncidentReport {
  id: string;
  createdAt: string;
  probableSpecies: SpeciesId;
  commonName: string;
  identificationConfidence: number;
  riskLevel: RiskLevel;
  neighborhoodHint: string;
  observedBehavior: string[];
  humanContext: string[];
  animalCondition: AnimalCondition;
  witnessSafe: boolean | null;
  notes: string;
  agency: AgencyRoute;
  publicDisplay: string;
  sourceIds: string[];
  usedGemini: boolean;
}

export interface AgentReply {
  analysis: SceneAnalysis;
  guidance: GuidanceCard;
  messages: string[];
  followUp: {
    phase: ConversationPhase;
    prompt: string;
    chips: string[];
  };
  report: IncidentReport | null;
  photon: PhotonNative;
  nextMove?: NextMove;
  sceneTaps?: SceneTap[];
  graph?: GraphInsight;
}

export interface GraphNode {
  id: string;
  type: "encounter" | "species" | "area" | "agency" | "context";
  label: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: string;
}

export interface GraphInsight {
  backend: "falkordb" | "memory";
  area: string;
  species: SpeciesId;
  similarCount: number;
  pattern: string;
  routedTo: string | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SourceRecord {
  id: string;
  claim: string;
  source: string;
  detail: string;
  url: string;
  designConsequence: string;
}

export interface DemoEncounter {
  id: "mountain-lion" | "coyote" | "parrot";
  species: SpeciesId;
  title: string;
  neighborhood: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  imageCredit: string;
  residentMessage: string;
  analysis: SceneAnalysis;
}
