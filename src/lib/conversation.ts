import type { ConversationPhase, SceneAnalysis } from "@/lib/types";

export interface ThreadState {
  phase: ConversationPhase;
  analysis?: SceneAnalysis;
  neighborhood?: string;
}

const threads = new Map<string, ThreadState>();

export function getThread(id: string): ThreadState {
  return threads.get(id) ?? { phase: "idle" };
}

export function setThread(id: string, state: ThreadState) {
  threads.set(id, state);
}

export function threadCount() {
  return threads.size;
}
