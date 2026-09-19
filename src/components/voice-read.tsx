"use client";

import { useEffect, useState } from "react";
import { canSpeak, speak, stopSpeaking } from "@/lib/voice";
import { cn } from "@/lib/utils";

export function VoiceRead({
  text,
  label = "Read aloud",
  compact = false,
}: {
  text: string;
  label?: string;
  compact?: boolean;
}) {
  const [speaking, setSpeaking] = useState(false);
  const ready = canSpeak() && Boolean(text.trim());

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (speaking) {
          stopSpeaking();
          setSpeaking(false);
          return;
        }
        setSpeaking(true);
        speak(text, () => setSpeaking(false));
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full transition",
        compact
          ? "px-2 py-0.5 text-[10px] text-white/70 hover:bg-white/10"
          : "border border-[color:var(--rule)] px-3 py-1.5 text-xs text-[color:var(--fog)] hover:bg-[color:var(--wash)]",
      )}
      aria-pressed={speaking}
    >
      <span aria-hidden>{speaking ? "◼" : "▶"}</span>
      {speaking ? "Stop voice" : label}
    </button>
  );
}
