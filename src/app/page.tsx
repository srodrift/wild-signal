import Image from "next/image";
import Link from "next/link";
import { LogoPlate } from "@/components/brand-mark";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { demoEncounters } from "@/lib/encounters";
import { sources } from "@/lib/sources";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 pb-20 pt-14 lg:grid-cols-[1fr_auto] lg:pt-20">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
                San Francisco · 19 September 2026
              </p>
              <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[1.05] text-[color:var(--fog)] sm:text-6xl">
                Three mountain lions walked the City this year.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-[color:var(--fog)]/70">
                The sidewalk still does not know who to call. That is the
                product — one next move, and the right desk.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signal"
                  className="rounded-full bg-[color:var(--amber)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)]"
                >
                  Open the thread
                </Link>
                <Link
                  href="/slides"
                  className="rounded-full border border-[color:var(--rule)] px-5 py-2.5 text-sm text-[color:var(--fog)]"
                >
                  Slides
                </Link>
              </div>
            </div>
            <LogoPlate size={420} className="mx-auto h-auto w-64 sm:w-80" />
          </div>
        </section>

        <section>
          <div className="relative mx-auto max-w-5xl overflow-hidden px-4">
            <Image
              src="/encounters/mountain-lion.jpg"
              alt="Night photograph of a mountain lion used as a demo reconstruction"
              width={1400}
              height={700}
              className="h-64 w-full rounded-[2rem] object-cover sm:h-80"
              priority
            />
          </div>
          <p className="mx-auto mt-3 max-w-5xl px-4 text-xs text-[color:var(--fog)]/40">
            Reconstruction — not the Sunset animal. The useful test is a bad
            photo on the N-Judah side of town.
          </p>
        </section>

        <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-16 md:grid-cols-3">
          {demoEncounters.map((encounter) => (
            <Link
              key={encounter.id}
              href="/signal"
              className="group overflow-hidden rounded-3xl border border-[color:var(--rule)]"
            >
              <div className="relative h-40">
                <Image
                  src={encounter.imageSrc}
                  alt={encounter.imageAlt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--amber)]">
                  {encounter.neighborhood}
                </p>
                <h2 className="mt-2 font-serif text-2xl text-[color:var(--fog)]">
                  {encounter.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--fog)]/60">
                  {encounter.caption}
                </p>
              </div>
            </Link>
          ))}
        </section>

        <section className="border-t border-[color:var(--rule)]">
          <div className="mx-auto w-full max-w-5xl px-4 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
              2026 in the papers
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl text-[color:var(--fog)]">
              The City already wrote the next move.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {sources.slice(0, 4).map((source) => (
                <article
                  key={source.id}
                  className="rounded-3xl border border-[color:var(--rule)] p-5"
                >
                  <h3 className="text-base font-medium text-[color:var(--fog)]">
                    {source.claim}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--fog)]/65">
                    {source.detail}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-[color:var(--amber)]">
                    {source.source}
                  </p>
                </article>
              ))}
            </div>
            <Link
              href="/evidence"
              className="mt-8 inline-flex text-sm underline underline-offset-4"
            >
              Full source table
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
