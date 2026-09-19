export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startPhotonListener } = await import("@/lib/spectrum-listener");
  void startPhotonListener();
}
