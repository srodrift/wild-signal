import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sources } from "@/lib/sources";

export default function EvidencePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
          Why we built this
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-[color:var(--fog)] sm:text-5xl">
          Every product choice is a claim. Here is the evidence.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--fog)]/65">
          WildSignal is not “AI for animals.” It exists because the City met three
          mountain lions in 2026 — Pacific Heights, the Panhandle, the Outer Sunset —
          already lives with coyotes, and named the wild parrots its official animal,
          while the guidance is still split across state, city, and park desks.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--fog)]/65">
          The conclusion we are willing to defend: this is an encounter-interpretation
          problem. People need to tell ordinary behavior from preventable conflict, an
          injured animal, and a genuine emergency — in the same minute they are holding
          a phone.
        </p>

        <div className="mt-10 overflow-hidden rounded-3xl border border-[color:var(--rule)]">
          <div className="hidden grid-cols-[1.1fr_0.8fr_1fr] bg-[color:var(--wash)] px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--fog)]/50 md:grid">
            <span>Claim</span>
            <span>Source</span>
            <span>What we built because of it</span>
          </div>
          {sources.map((source) => (
            <article
              key={source.id}
              className="grid gap-3 border-t border-[color:var(--rule)] px-5 py-5 md:grid-cols-[1.1fr_0.8fr_1fr]"
            >
              <div>
                <h2 className="text-base font-medium text-[color:var(--fog)]">
                  {source.claim}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--fog)]/60">
                  {source.detail}
                </p>
              </div>
              <div className="text-sm">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--amber)] underline underline-offset-2"
                >
                  {source.source}
                </a>
              </div>
              <p className="text-sm leading-6 text-[color:var(--fog)]/70">
                {source.designConsequence}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-6">
          <h2 className="font-serif text-2xl text-[color:var(--fog)]">
            What we refused to build
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[color:var(--fog)]/70">
            <li>
              A live public sighting pin that would send photographers to a stressed lion.
              A delayed neighborhood circle after someone shares a block is different.
            </li>
            <li>
              A general “ask me anything about SF wildlife” chatbot. Bay Nature’s
              waterways index is a magazine: leopard sharks, swimming worms, tide pools.
              We took one article — fins off Crissy and Ocean Beach are usually returned
              porpoises or dolphins — because that is the same interpretation problem.
              We did not add a tide-pool quiz.
            </li>
            <li>Model-authored safety advice. Gemini interprets. The rule file speaks.</li>
            <li>A third-party wildlife classifier, a maps API, or a second language model.</li>
          </ul>
          <Link
            href="/signal"
            className="mt-6 inline-flex rounded-full bg-[color:var(--amber)] px-4 py-2 text-sm font-medium text-[color:var(--ink)]"
          >
            Run the three encounters
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
