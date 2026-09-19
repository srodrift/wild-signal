import { JoinLine } from "@/components/join-line";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TextLine } from "@/components/text-line";
import { formatUsNumber, publicTextNumber } from "@/lib/spectrum-line";

export default function TextPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
          Optional · not the demo
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[color:var(--fog)] sm:text-5xl">
          The 628 line is backstage.
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--fog)]/65">
          {formatUsNumber(publicTextNumber())} only hears phones Photon already
          lists as users. A stranger gets the bounce you saw. The pitch is the
          thread at /signal. Use this page only if you want to add your own
          iMessage number later.
        </p>
        <div className="mt-8">
          <JoinLine />
        </div>
        <TextLine />
      </main>
      <SiteFooter />
    </div>
  );
}
