import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HowPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
          Architecture
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[color:var(--fog)] sm:text-5xl">
          Gemini sees. Photon talks. FalkorDB remembers.
        </h1>
        <p className="mt-5 text-base leading-7 text-[color:var(--fog)]/70">
          Hack for Humanity asked for Gemini and Photon. FalkorDB is the extra sponsored
          graph. WildSignal uses all three: one photo, one iMessage thread, one blurred
          pattern graph. A shared intersection becomes a neighborhood circle — never a
          live wildlife pin.
        </p>

        <section className="mt-10 space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--fog)]">Gemini</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--fog)]/70">
              Gemini is the interpreter, not the narrator. It looks at the photo and the
              resident’s sentence and returns structured fields: probable species,
              confidence, visible behavior, human context (dog, child, traffic, food),
              condition, and what remains uncertain. It is forbidden from writing the
              safety steps. That keeps a blurry cat from becoming invented folklore.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--fog)]">Photon</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--fog)]/70">
              Photon Spectrum is the interaction layer. The same agent loop that powers
              this page is the loop a managed iMessage line would run: inbound photo,
              typing indicator, first-message instructions, one follow-up, then a
              responder packet. Residents should not have to download an app while a
              coyote is escorting their dog.
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--fog)]/70">
              The public line is <code className="text-[color:var(--amber)]">(628) 789-5362</code>.
              Photon assigned it from the shared iMessage pool. Text it from the
              project phone, or enter your number on /text to get a line. The
              Spectrum listener replies with the same agent as this browser.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--fog)]">FalkorDB</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--fog)]/70">
              Photon forgets when the thread ends. FalkorDB keeps the relationships:
              species → blurred area → agency, plus context like “dog present.” A common
              coyote on the Park Trail becomes “third escorting report this season,” not a
              new 911 event. Set <code className="text-[color:var(--amber)]">FALKORDB_HOST</code> to
              write the same Cypher into a live FalkorDB. Without it, the demo graph runs
              in memory with the same shape.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--fog)]">The rule file</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--fog)]/70">
              Guidance is a curated map, not a prompt. Mountain lion nearby → CDFW
              encounter card. Coyote + dog + following → Presidio / SFACC escorting card.
              Injured bird → SFACC dispatch. Immediate human danger → 911. Low confidence
              → the more conservative card, labeled unconfirmed.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--fog)]">What we left out</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--fog)]/70">
              OpenAI, Anthropic, iNaturalist, Google Maps, Supabase, Firebase, and any
              live public sighting pin. OpenStreetMap tiles only draw a delayed
              neighborhood circle after someone shares a block. A pin map would make a
              smoother demo and a worse neighbor.
            </p>
          </div>
        </section>

        <Link
          href="/signal"
          className="mt-10 inline-flex rounded-full bg-[color:var(--amber)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)]"
        >
          Open the Signal
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
