"use client";

import { SoundProvider } from "@/components/sound-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SoundProvider>{children}</SoundProvider>;
}
