import type { SpeciesBrief } from "@/lib/areas";

export function SpeciesCard({
  brief,
  highlight = false,
}: {
  brief: SpeciesBrief;
  highlight?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border p-5 ${
        highlight
          ? "border-[color:var(--amber)]/40 bg-[color:var(--amber)]/8"
          : "border-[color:var(--rule)] bg-[color:var(--wash)]"
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--amber)]">
        {brief.status}
      </p>
      <h2 className="mt-2 font-serif text-2xl text-[color:var(--fog)]">{brief.name}</h2>
      <p className="mt-3 text-sm leading-6 text-[color:var(--fog)]/70">{brief.about}</p>
      <p className="mt-4 text-xs font-medium text-[color:var(--fog)]">If you see it</p>
      <ul className="mt-2 space-y-1.5 text-sm text-[color:var(--fog)]/70">
        {brief.ifYouSeeIt.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs font-medium text-[color:var(--fog)]">Do not</p>
      <ul className="mt-2 space-y-1.5 text-sm text-[color:var(--fog)]/55">
        {brief.doNot.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-[color:var(--fog)]/45">{brief.reportTo}</p>
    </article>
  );
}
