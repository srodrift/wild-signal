import { SignalApp } from "@/components/signal-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SignalPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
          The thread
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[color:var(--fog)] sm:text-5xl">
          See it. Understand it. Keep it wild.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--fog)]/65">
          Play the walkthrough, or drop a photo. One next move. Tap what you
          actually see. This is the demo — it runs here, even if Messages
          bounces a new phone.
        </p>
        <div className="mt-8">
          <SignalApp />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
