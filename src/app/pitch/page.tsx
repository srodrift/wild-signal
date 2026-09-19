import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PitchPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
          MLH submission · 90-second demo
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[color:var(--fog)] sm:text-5xl">
          What to tell the judges.
        </h1>
        <p className="mt-5 text-base leading-7 text-[color:var(--fog)]/70">
          Paste the block below into the MLH submission. Then run the live demo on
          /signal — Outer Sunset first. No extra app. No second model.
        </p>

        <section className="mt-10 rounded-3xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-6">
          <h2 className="font-serif text-2xl text-[color:var(--fog)]">Submission copy</h2>
          <pre className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[color:var(--fog)]/80">
            {`Project: WildSignal
Track: Best Use of Gemini API + Best Use of Photon
Graph: FalkorDB stores blurred encounter patterns (species → area → agency), not live pins.

Problem
Three mountain lions walked San Francisco in 2026 — Pacific Heights, the Panhandle, the Outer Sunset. Coyotes already live in the Presidio (trails closed to dogs through early October). Wild parrots are the city’s official animal. Residents have seconds to decide what they are seeing, whether to run, and who to tell — and the guidance is split across CDFW, SFACC, and Presidio ecologists.

Solution
WildSignal is an iMessage wildlife-coexistence agent. You send a photo. Gemini interprets species, behavior, and scene context under uncertainty. A curated rule file — not the model — returns reviewed safety copy and prepares a report for the correct desk. If they share a block, a delayed neighborhood circle is drawn — never a live pin on the animal.

Gemini
Multimodal reasoning on a bad night photograph. Structured JSON only: confidence, visual evidence (what the pixels support and rule out), human context (dog, child, traffic). Gemini is forbidden from writing the safety steps.

Photon
Text (628) 789-5362. Photon delivers the agent in iMessage: typing, tapbacks, gentle/slam effects, a “Are you safe?” poll, official rich links, contact cards, a live App card, and a private response group. Chat fits because you do not download an app while a coyote is escorting your dog.

Why not 911
911 is for a person in danger. There is no second civic number for a coyote, a grounded parrot, or a lion that already moved on. WildSignal routes that minute so 911 stays clear.

Why not ChatGPT
The model does not write the safety copy. Gemini reads the scene. A curated rule file speaks. Photon is already in Messages.

Impact
Fewer panicked crowds around a stressed lion. Fewer false emergencies. Better observations for the people who can actually act.`}
          </pre>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[color:var(--fog)]">90-second demo</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--fog)]/75">
            <li>
              <strong className="text-[color:var(--fog)]">0:00 Problem.</strong> Yesterday,
              44th and Ulloa. People had a blurry animal and three agencies.
              Open /signal. Do not wait on a text from the seats — Photon’s
              shared line bounces phones it does not already know.
            </li>
            <li>
              <strong className="text-[color:var(--fog)]">0:15 Gemini.</strong> Send the night
              photo. Show the visual evidence: long tail, heavy shoulders, not a coyote.
              Confidence 72%. The model does not invent “what to do.”
            </li>
            <li>
              <strong className="text-[color:var(--fog)]">0:40 Photon.</strong> iMessage poll:
              are you safe? Gentle effect. Tapback on the photo. Point at the native
              feature chips.
            </li>
            <li>
              <strong className="text-[color:var(--fog)]">1:00 Report.</strong> YES, then 44th
              &amp; Ulloa. Contact card + live App card to CDFW WIR. A neighborhood
              circle appears — no pin on the lion.
            </li>
            <li>
              <strong className="text-[color:var(--fog)]">1:20 Expand.</strong> Coyote + dog =
              escorting, Presidio ecologists. Injured parrot = SFACC (415) 554-9400.
            </li>
          </ol>
        </section>

        <section className="mt-8 rounded-3xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-6">
          <h2 className="font-serif text-2xl text-[color:var(--fog)]">
            If a judge asks
          </h2>
          <div className="mt-5 space-y-5 text-sm leading-6 text-[color:var(--fog)]/80">
            <div>
              <p className="font-medium text-[color:var(--fog)]">
                “Why not just call 911?”
              </p>
              <p className="mt-2">
                If a person is being attacked, I would tell them to hang up and
                call 911. That is the only one-number rule, and it is already on
                the last slide. A coyote walking the Park Trail is not an
                emergency. Neither is a parrot on Kearny, or a lion that already
                moved on. There is no second civic number for those calls — it
                is state wildlife, city animal control, or park staff, depending
                on the animal and the block. If everyone dials 911, the line that
                saves people gets a mountain-lion TikTok. WildSignal is the
                router for the minute that is not 911: one next move, and the
                desk that can actually act.
              </p>
            </div>
            <div>
              <p className="font-medium text-[color:var(--fog)]">
                “How is this not ChatGPT or Google?”
              </p>
              <p className="mt-2">
                Google is six official pages while you are holding a leash.
                ChatGPT will invent the steps and help you drop a pin. We do not
                let the model write “what to do.” Gemini only reads this photo —
                species, tail, dog, child, block — and says how sure it is. A
                rule file copied from California Fish &amp; Wildlife, the
                Presidio, and city animal control chooses the words and the
                desk. Photon puts that in Messages, which is already open. That
                is the product: interpret this scene, then route. Not a search.
                Not a chatbot that makes up wildlife law.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[color:var(--rule)] p-6">
          <h2 className="font-serif text-2xl text-[color:var(--fog)]">Judging rubric</h2>
          <dl className="mt-4 space-y-4 text-sm leading-6 text-[color:var(--fog)]/75">
            <div>
              <dt className="font-medium text-[color:var(--fog)]">Technical</dt>
              <dd>
                One agent loop, Gemini JSON, Photon native payload. Demo encounters run
                without a key; a Gemini key turns the same loop live.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[color:var(--fog)]">Creativity</dt>
              <dd>
                Not a chatbot and not a live wildlife map. Behavioral triage over
                classification. Uncertainty is the feature.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[color:var(--fog)]">Demo clarity</dt>
              <dd>
                One photo, one poll, one packet. Before: panic and a group chat. After:
                reviewed steps and the right phone number.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[color:var(--fog)]">Partner eligibility</dt>
              <dd>
                Gemini does the seeing. Photon does the talking. No other model, no
                wildlife API, no live pin map.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[color:var(--fog)]">Impact</dt>
              <dd>
                A real, dated local event plus standing coyote and parrot ecology. Protects
                people without turning animals into content.
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/slides"
            className="inline-flex rounded-full bg-[color:var(--amber)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)]"
          >
            Open judge slides
          </Link>
          <Link
            href="/signal"
            className="inline-flex rounded-full border border-[color:var(--rule)] px-5 py-2.5 text-sm text-[color:var(--fog)]"
          >
            Run the 90-second demo
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
