"use client";

import { useSound } from "@/components/sound-provider";

export function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      className="shrink-0 rounded-full px-3 py-1.5 text-[color:var(--fog)]/70 transition hover:bg-[color:var(--wash)] hover:text-[color:var(--fog)]"
      aria-pressed={enabled}
      aria-label={enabled ? "Mute WildSignal sound" : "Play fog and message sounds"}
    >
      {enabled ? "Sound on" : "Sound"}
    </button>
  );
}
