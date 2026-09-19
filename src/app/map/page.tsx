"use client";

import { useMemo, useState } from "react";
import { AreaMap } from "@/components/area-map";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SpeciesCard } from "@/components/species-card";
import { mapAreas, neighborBriefs, speciesBriefs } from "@/lib/areas";

export default function MapPage() {
  const [focusId, setFocusId] = useState(mapAreas[0].id);
  const focus = useMemo(
    () => mapAreas.find((area) => area.id === focusId) ?? mapAreas[0],
    [focusId],
  );
  const brief =
    speciesBriefs.find((item) => item.id === focus.species) ??
    neighborBriefs.find((item) => item.id === focus.species);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
          Generalized area — not a live pin
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-[color:var(--fog)] sm:text-5xl">
          If they share a block, we map a neighborhood — never the animal.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--fog)]/65">
          A resident sends an intersection through Photon. WildSignal draws a wide,
          delayed circle so responders know the part of town. Exact coordinates, dens,
          and roost trees stay off the public map. The same page holds the animals
          people actually argue about — coyotes, conures, a fin off Crissy — so a
          raccoon thread does not become a lion report.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {mapAreas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => setFocusId(area.id)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                area.id === focusId
                  ? "bg-[color:var(--amber)] text-[color:var(--ink)]"
                  : "border border-[color:var(--rule)] text-[color:var(--fog)]"
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <AreaMap areas={mapAreas} focusId={focusId} />
          <p className="mt-2 text-xs text-[color:var(--fog)]/40">
            Orange circle: possible area around {focus.hint}. No marker is placed on the
            animal.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {speciesBriefs.map((item) => (
            <SpeciesCard
              key={item.id}
              brief={item}
              highlight={item.id === focus.species}
            />
          ))}
        </div>
        <h2 className="mt-12 font-serif text-3xl text-[color:var(--fog)]">
          Also in the frame
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--fog)]/60">
          NPS counts 387 vertebrates in Golden Gate. Bay Nature tracks the porpoises
          that came back. r/sanfrancisco votes for raccoons and then freezes when a
          coyote crosses the trail. These cards are for that minute — not a field guide.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {neighborBriefs.map((item) => (
            <SpeciesCard
              key={item.id}
              brief={item}
              highlight={item.id === focus.species}
            />
          ))}
        </div>
        {brief ? (
          <p className="mt-6 text-sm text-[color:var(--fog)]/50">
            Showing {brief.name} for the {focus.name} circle.
          </p>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
