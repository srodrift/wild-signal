"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { wildSound, type SoundCue } from "@/lib/sound";

interface SoundApi {
  enabled: boolean;
  toggle: () => Promise<void>;
  play: (cue: SoundCue) => void;
}

const SoundContext = createContext<SoundApi>({
  enabled: false,
  toggle: async () => undefined,
  play: () => undefined,
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  const value = useMemo<SoundApi>(
    () => ({
      enabled,
      async toggle() {
        if (enabled) {
          wildSound.stop();
          setEnabled(false);
          return;
        }
        await wildSound.unlock();
        wildSound.startAmbient();
        wildSound.play("enable");
        setEnabled(true);
      },
      play(cue) {
        wildSound.play(cue);
      },
    }),
    [enabled],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
