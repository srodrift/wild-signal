"use client";

import { useEffect, useState } from "react";
import { defaultDraft, formatUsNumber, publicTextNumber, smsHref } from "@/lib/spectrum-line";

interface LineInfo {
  e164: string;
  display: string;
  smsHref: string;
  redirectUrl: string;
  listening?: boolean;
  error?: string;
  yourPhone?: string;
}

export function TextLine() {
  const fallback = publicTextNumber();
  const [line, setLine] = useState<LineInfo>({
    e164: fallback,
    display: formatUsNumber(fallback),
    smsHref: smsHref(fallback, defaultDraft()),
    redirectUrl: "/api/photon/open",
  });
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/photon/line")
      .then((response) => response.json())
      .then((data: LineInfo & { listenError?: string }) => {
        if (data.e164) setLine(data);
        if (data.listenError) setError(data.listenError);
      })
      .catch(() => {
        setError("Could not reach the Photon line status.");
      });
  }, []);

  async function assign(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/photon/line", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await response.json()) as LineInfo;
      if (!response.ok) {
        setError(data.error || "Photon could not assign a line.");
        return;
      }
      setLine(data);
    } catch {
      setError("Photon could not assign a line.");
    } finally {
      setBusy(false);
    }
  }

  async function copyNumber() {
    await navigator.clipboard.writeText(line.e164);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-10 space-y-6">
      <section className="rounded-[2rem] border border-[color:var(--rule)] bg-[color:var(--wash)] px-6 py-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
          {line.listening ? "Line is listening" : "Open Messages"}
        </p>
        <p className="mt-3 font-serif text-5xl tracking-tight text-[color:var(--fog)] sm:text-6xl">
          {line.display}
        </p>
        <p className="mt-3 text-sm text-[color:var(--fog)]/55">
          iMessage · Photon Spectrum · San Francisco 628
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={line.smsHref}
            className="rounded-full bg-[color:var(--amber)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)]"
          >
            Open Messages
          </a>
          <a
            href={line.redirectUrl}
            className="rounded-full border border-[color:var(--rule)] px-5 py-2.5 text-sm text-[color:var(--fog)]"
          >
            Photon deep link
          </a>
          <button
            type="button"
            onClick={() => void copyNumber()}
            className="rounded-full border border-[color:var(--rule)] px-5 py-2.5 text-sm text-[color:var(--fog)]"
          >
            {copied ? "Copied" : "Copy number"}
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--rule)] p-6">
        <h2 className="font-serif text-2xl text-[color:var(--fog)]">
          Already added? Text again
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--fog)]/65">
          If you already used This is my number above, skip this. If Photon
          assigned you a different pool line, it appears here after you add
          yourself.
        </p>
        <form onSubmit={(event) => void assign(event)} className="mt-4 flex flex-wrap gap-3">
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(415) 555-0134"
            className="h-11 min-w-[220px] flex-1 rounded-full border border-[color:var(--rule)] bg-[color:var(--ink)] px-4 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[color:var(--fog)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)] disabled:opacity-50"
          >
            {busy ? "Assigning…" : "Get my line"}
          </button>
        </form>
        {line.yourPhone ? (
          <p className="mt-3 font-mono text-xs text-[color:var(--eucalyptus)]">
            Assigned for {line.yourPhone}. Text {line.display}.
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-[color:var(--amber)]">{error}</p> : null}
      </section>
    </div>
  );
}
