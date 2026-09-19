"use client";

import { useState } from "react";
import {
  defaultDraft,
  formatUsNumber,
  publicTextNumber,
  smsHref,
} from "@/lib/spectrum-line";

interface LineInfo {
  e164: string;
  display: string;
  smsHref: string;
  redirectUrl: string;
  yourPhone?: string;
  error?: string;
}

export function JoinLine() {
  const fallback = publicTextNumber();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [line, setLine] = useState<LineInfo | null>(null);

  async function addMe(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/photon/line", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email, name: "Resident" }),
      });
      const data = (await response.json()) as LineInfo;
      if (!response.ok) {
        setError(data.error || "Photon would not add that number.");
        return;
      }
      setLine(data);
    } catch {
      setError("Could not reach Photon. Try the dashboard steps on this page.");
    } finally {
      setBusy(false);
    }
  }

  if (line) {
    const number = line.display || formatUsNumber(line.e164);
    return (
      <section className="rounded-[2rem] border border-[color:var(--eucalyptus)]/30 bg-[color:var(--eucalyptus)]/8 px-6 py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--eucalyptus)]">
          You are on the project
        </p>
        <h2 className="mt-3 font-serif text-3xl text-[color:var(--fog)] sm:text-4xl">
          Now text {number}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--fog)]/65">
          Photon knows {line.yourPhone ?? "this phone"}. Open Messages and send{" "}
          <span className="font-medium text-[color:var(--fog)]">hi</span>. The
          bounce is gone. The thread on this screen will show the reply.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={line.smsHref || smsHref(line.e164, defaultDraft())}
            className="rounded-full bg-[color:var(--amber)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)]"
          >
            Open Messages
          </a>
          <a
            href={line.redirectUrl || "/api/photon/open"}
            className="rounded-full border border-[color:var(--rule)] px-5 py-2.5 text-sm text-[color:var(--fog)]"
          >
            Photon deep link
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[color:var(--amber)]/30 bg-[color:var(--amber)]/8 px-6 py-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
        Do this first — 20 seconds
      </p>
      <h2 className="mt-3 font-serif text-3xl text-[color:var(--fog)] sm:text-4xl">
        This is my number.
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--fog)]/70">
        Photon&apos;s free/pro line is a shared pool. It only delivers phones
        listed as users on the project. That is why you got{" "}
        <span className="text-[color:var(--fog)]">
          “this number didn&apos;t recognize yours.”
        </span>{" "}
        Add the number your iMessage actually sends from. Then text{" "}
        {formatUsNumber(fallback)}.
      </p>
      <form onSubmit={(event) => void addMe(event)} className="mt-6 space-y-3">
        <input
          type="tel"
          inputMode="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="(415) 555-0134"
          className="h-12 w-full rounded-full border border-[color:var(--rule)] bg-[color:var(--ink)] px-5 text-base outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Apple ID email — only if Messages sends from email"
          className="h-12 w-full rounded-full border border-[color:var(--rule)] bg-[color:var(--ink)] px-5 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-full bg-[color:var(--fog)] text-sm font-medium text-[color:var(--ink)] disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {busy ? "Adding you…" : "Add me as a user"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-[color:var(--amber)]">{error}</p> : null}
      <p className="mt-4 text-xs leading-5 text-[color:var(--fog)]/45">
        Same thing in the Photon dashboard: project → Users → Add, paste your
        mobile in +1… form, save, then text {formatUsNumber(fallback)} again.
        If it still bounces, open debug.photon.codes — that bot replies with
        the exact handle Apple is using. Add that.
      </p>
    </section>
  );
}
