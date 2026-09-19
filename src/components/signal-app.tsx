"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Camera, MapPin, SendHorizontal } from "lucide-react";
import { AreaMap } from "@/components/area-map";
import { useSound } from "@/components/sound-provider";
import { VoiceRead } from "@/components/voice-read";
import { stopSpeaking } from "@/lib/voice";
import { areaForReport, briefForSpecies } from "@/lib/areas";
import { demoEncounters } from "@/lib/encounters";
import { speciesLabel } from "@/lib/guidance";
import { sourcesFor } from "@/lib/sources";
import type {
  AgentReply,
  ConversationPhase,
  DemoEncounter,
  IncidentReport,
  NextMove,
  PhotonNative,
  SceneAnalysis,
  SceneTap,
} from "@/lib/types";
import type { RoomMessage } from "@/lib/live-room";
import { photonFeatureList } from "@/lib/photon";
import { RiskBadge } from "@/components/risk-badge";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "resident" | "wildsignal" | "system";
  text?: string;
  imageSrc?: string;
  imageAlt?: string;
  tapback?: PhotonNative["tapback"];
}

interface SignalResponse extends AgentReply {
  runtime?: { gemini: boolean; photon: boolean; falkor?: boolean; model: string };
  error?: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function friendlyError(raw?: string) {
  if (raw && /404|NOT_FOUND|no longer available|gemini/i.test(raw)) {
    return "Gemini missed that pass. Use the Sunset, Presidio, or Telegraph cards — those run on the City rule file.";
  }
  return raw || "WildSignal could not read that.";
}

const INTRO: ChatMessage = {
  id: "intro",
  role: "system",
  text: "This is not a pamphlet and not a species quiz. Send a photo. You get one next move. Tap what you actually see — the move changes.",
};

export function SignalApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO]);
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<ConversationPhase>("idle");
  const [analysis, setAnalysis] = useState<SceneAnalysis | null>(null);
  const [reply, setReply] = useState<SignalResponse | null>(null);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upload, setUpload] = useState<{ src: string; base64: string; mime: string } | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const reportAnchor = useRef<HTMLDivElement>(null);
  const demoAbort = useRef(false);
  const { play } = useSound();
  const [playing, setPlaying] = useState(false);
  const [dropActive, setDropActive] = useState(false);

  const chips = reply?.followUp.chips ?? [];
  const locationChips = phase === "details" ? chips.filter((chip) => /ulloa|presidio|kearny|park trail|44th|pacific|fell|baker|heights/i.test(chip)) : [];
  const lastReply = [...messages]
    .reverse()
    .find((message) => message.role === "wildsignal" && message.text)?.text;

  async function send(opts: {
    text: string;
    encounter?: DemoEncounter;
    image?: { src: string; base64: string; mime: string };
    phase?: ConversationPhase;
    analysis?: SceneAnalysis | null;
    resetThread?: boolean;
  }) {
    const text = opts.text.trim();
    if (!text && !opts.encounter && !opts.image) return;

    const requestPhase = opts.phase ?? phase;
    const requestAnalysis = opts.analysis !== undefined ? opts.analysis : analysis;

    setError(null);
    setBusy(true);

    const resident: ChatMessage = {
      id: uid(),
      role: "resident",
      text: text || undefined,
      imageSrc: opts.image?.src ?? opts.encounter?.imageSrc,
      imageAlt: opts.encounter?.imageAlt ?? "Resident wildlife photo",
    };
    setMessages((current) =>
      opts.resetThread ? [INTRO, resident] : [...current, resident],
    );
    setDraft("");
    setUpload(null);
    setTyping(true);
    play("send");

    try {
      const payload: Record<string, unknown> = {
        text: text || opts.encounter?.residentMessage || "",
        phase: requestPhase,
        analysis: requestAnalysis,
        encounterId: opts.encounter?.id,
        neighborhood: text,
      };
      if (opts.image) {
        payload.imageBase64 = opts.image.base64;
        payload.mimeType = opts.image.mime;
      }

      const response = await fetch("/api/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as SignalResponse;
      if (!response.ok || data.error) {
        throw new Error(friendlyError(data.error));
      }

      setReply(data);
      setAnalysis(data.analysis);
      setPhase(data.followUp.phase);
      setReport(data.report ?? null);
      play(data.report ? "report" : data.photon.effect === "slam" ? "report" : "receive");

      const incoming: ChatMessage[] = data.messages.map((message) => ({
        id: uid(),
        role: "wildsignal",
        text: message,
      }));
      setMessages((current) => {
        const next = [...current, ...incoming];
        if (data.photon.tapback) {
          const lastPhoto = [...next]
            .reverse()
            .find((item) => item.role === "resident" && item.imageSrc);
          if (lastPhoto) lastPhoto.tapback = data.photon.tapback;
        }
        return next;
      });
      requestAnimationFrame(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
      });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something failed.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "system",
          text: message,
        },
      ]);
      return null;
    } finally {
      setTyping(false);
      setBusy(false);
    }
  }

  function onPickEncounter(encounter: DemoEncounter) {
    demoAbort.current = true;
    setPlaying(false);
    stopSpeaking();
    setPhase("idle");
    setAnalysis(null);
    setReport(null);
    setReply(null);
    void send({
      text: encounter.residentMessage,
      encounter,
      phase: "idle",
      analysis: null,
      resetThread: true,
    });
  }

  async function playLionDemo() {
    demoAbort.current = false;
    setPlaying(true);
    const lion = demoEncounters[0];
    setPhase("idle");
    setAnalysis(null);
    setReport(null);
    setReply(null);
    const first = await send({
      text: lion.residentMessage,
      encounter: lion,
      phase: "idle",
      analysis: null,
      resetThread: true,
    });
    if (!first || demoAbort.current) {
      setPlaying(false);
      return;
    }
    await wait(1400);
    if (demoAbort.current) {
      setPlaying(false);
      return;
    }
    const tap = first.sceneTaps?.[0];
    const afterTap = tap
      ? await send({
          text: `I see: ${tap.label}`,
          phase: first.followUp.phase,
          analysis: first.analysis,
        })
      : first;
    if (!afterTap || demoAbort.current) {
      setPlaying(false);
      return;
    }
    await wait(1400);
    if (demoAbort.current) {
      setPlaying(false);
      return;
    }
    const second = await send({
      text: "YES — I am safe",
      phase: afterTap.followUp.phase,
      analysis: afterTap.analysis,
    });
    if (!second || demoAbort.current) {
      setPlaying(false);
      return;
    }
    await wait(1600);
    if (demoAbort.current) {
      setPlaying(false);
      return;
    }
    await send({
      text: "44th & Ulloa",
      phase: second.followUp.phase,
      analysis: second.analysis,
    });
    setPlaying(false);
  }

  function stopDemo() {
    demoAbort.current = true;
    setPlaying(false);
  }

  useEffect(() => {
    const seen = new Set<string>();
    let cancelled = false;

    async function pull() {
      try {
        const response = await fetch("/api/room");
        const data = (await response.json()) as { messages?: RoomMessage[] };
        if (cancelled || !data.messages?.length) return;
        const fresh = data.messages.filter((item) => !seen.has(item.id));
        if (!fresh.length) return;
        for (const item of fresh) seen.add(item.id);
        setMessages((current) => [
          ...current,
          ...fresh.map((item) => ({
            id: item.id,
            role:
              item.from === "wildsignal"
                ? ("wildsignal" as const)
                : item.from === "resident"
                  ? ("resident" as const)
                  : ("system" as const),
            text: item.from === "resident" ? `${item.handle}: ${item.text}` : item.text,
          })),
        ]);
      } catch {
        /* projector poll is best-effort */
      }
    }

    void pull();
    const timer = window.setInterval(() => void pull(), 1500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (event.key === "1") onPickEncounter(demoEncounters[0]);
      if (event.key === "2") onPickEncounter(demoEncounters[1]);
      if (event.key === "3") onPickEncounter(demoEncounters[2]);
      if (event.key === " " && !playing && !busy) {
        event.preventDefault();
        void playLionDemo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, playing]);

  async function onFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Send a still photo — video stays on the phone for the Photon line.");
      return;
    }
    const dataUrl = await readFile(file);
    const [meta, base64] = dataUrl.split(",");
    const mime = /data:(.*);base64/.exec(meta)?.[1] ?? file.type;
    setUpload({ src: dataUrl, base64, mime });
  }

  const runtime = reply?.runtime;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy && !playing}
            onClick={() => (playing ? stopDemo() : void playLionDemo())}
            className="rounded-full bg-[color:var(--amber)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] disabled:opacity-50"
          >
            {playing ? "Stop walkthrough" : "Play 90-second walkthrough"}
          </button>
          {lastReply ? <VoiceRead text={lastReply} label="Read last reply" /> : null}
          <p className="text-[11px] text-[color:var(--fog)]/45">
            Or press 1 / 2 / 3 for lion, coyote, parrot. Drop a photo on the
            phone.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {demoEncounters.map((encounter) => (
            <button
              key={encounter.id}
              type="button"
              onClick={() => onPickEncounter(encounter)}
              disabled={busy}
              className="min-w-[148px] rounded-2xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-2 text-left transition hover:border-[color:var(--amber)]/50 hover:bg-[color:var(--wash)] disabled:opacity-50"
            >
              <div className="relative mb-2 h-16 overflow-hidden rounded-xl">
                <Image
                  src={encounter.imageSrc}
                  alt={encounter.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-[11px] font-medium text-[color:var(--fog)]">
                {encounter.title}
              </p>
              <p className="text-[10px] text-[color:var(--fog)]/50">{encounter.caption}</p>
            </button>
          ))}
        </div>

        <IMessagePhone
          messages={messages}
          typing={typing}
          chips={chips}
          locationChips={locationChips}
          busy={busy || playing}
          draft={draft}
          upload={upload}
          photon={reply?.photon}
          nextMove={reply?.nextMove}
          sceneTaps={phase === "scene" ? reply?.sceneTaps ?? [] : []}
          dropActive={dropActive}
          onDraft={setDraft}
          onSend={() =>
            void send({
              text: draft,
              image: upload ?? undefined,
            })
          }
          onChip={(chip) => void send({ text: chip })}
          onSceneTap={(tap, seen) =>
            void send({
              text: seen ? `I see: ${tap.label}` : `Not that: ${tap.label}`,
            })
          }
          onAttach={() => fileRef.current?.click()}
          onOpenReport={() =>
            reportAnchor.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          onDropFile={(file) => void onFile(file)}
          onDrag={setDropActive}
          onTapback={(id) => {
            play("tap");
            setMessages((current) =>
              current.map((message) =>
                message.id === id
                  ? {
                      ...message,
                      tapback: message.tapback === "emphasized" ? "liked" : "emphasized",
                    }
                  : message,
              ),
            );
          }}
          scrollerRef={scroller}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onFile(file);
            event.target.value = "";
          }}
        />
        {error ? <p className="text-sm text-orange-200">{error}</p> : null}
      </div>

      <aside className="space-y-4">
        <RuntimeStrip
          gemini={runtime?.gemini}
          photon={runtime?.photon}
          falkor={runtime?.falkor}
          model={runtime?.model}
        />
        <div ref={reportAnchor}>
          {report ? <ReportPanel report={report} /> : <PrivacyNote />}
        </div>
        {reply?.nextMove ? (
          <section className="rounded-3xl border border-[color:var(--amber)]/30 bg-[color:var(--amber)]/8 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
              Dispatcher · one move
            </p>
            <h3 className="mt-2 font-serif text-2xl text-[color:var(--fog)]">
              {reply.nextMove.text}
            </h3>
            <p className="mt-2 text-sm text-[color:var(--fog)]/60">{reply.nextMove.why}</p>
          </section>
        ) : (
          <EmptyAnalysis />
        )}
        {analysis ? (
          <details className="rounded-3xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-5 text-sm text-[color:var(--fog)]/70">
            <summary className="cursor-pointer font-medium text-[color:var(--fog)]">
              Gemini notes (held back from the thread)
            </summary>
            <div className="mt-4">
              <AnalysisPanel analysis={analysis} />
            </div>
          </details>
        ) : null}
        {reply?.graph ? <GraphPanel insight={reply.graph} /> : null}
      </aside>
    </div>
  );
}

function IMessagePhone({
  messages,
  typing,
  chips,
  locationChips,
  busy,
  draft,
  upload,
  photon,
  nextMove,
  sceneTaps,
  dropActive,
  onDraft,
  onSend,
  onChip,
  onSceneTap,
  onAttach,
  onOpenReport,
  onDropFile,
  onDrag,
  onTapback,
  scrollerRef,
}: {
  messages: ChatMessage[];
  typing: boolean;
  chips: string[];
  locationChips: string[];
  busy: boolean;
  draft: string;
  upload: { src: string } | null;
  photon?: PhotonNative;
  nextMove?: NextMove;
  sceneTaps: SceneTap[];
  dropActive: boolean;
  onDraft: (value: string) => void;
  onSend: () => void;
  onChip: (chip: string) => void;
  onSceneTap: (tap: SceneTap, seen: boolean) => void;
  onAttach: () => void;
  onOpenReport: () => void;
  onDropFile: (file: File) => void;
  onDrag: (active: boolean) => void;
  onTapback: (id: string) => void;
  scrollerRef: RefObject<HTMLDivElement | null>;
}) {
  const effect = photon?.effect;
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div
        className={cn(
          "phone-shell overflow-hidden rounded-[2.3rem] border border-white/12 bg-[#0b0b0c] shadow-[0_30px_80px_rgba(0,0,0,0.45)]",
          effect === "slam" && "phone-slam",
          effect === "gentle" && "phone-gentle",
          dropActive && "ring-2 ring-[#0a84ff]",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          onDrag(true);
        }}
        onDragLeave={() => onDrag(false)}
        onDrop={(event) => {
          event.preventDefault();
          onDrag(false);
          const file = event.dataTransfer.files[0];
          if (file) onDropFile(file);
        }}
      >
        <div className="relative bg-[#1c1c1e]">
          <div className="mx-auto mt-2 h-6 w-28 rounded-full bg-black" />
          <div className="flex items-center justify-between px-5 pb-3 pt-2">
            <span className="text-xs text-[#0a84ff]">Messages</span>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-white">WildSignal</p>
              <p className="text-[10px] text-white/40">iMessage · Photon</p>
            </div>
            <span className="text-xs text-white/30">SF</span>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="imessage-wallpaper flex h-[520px] flex-col gap-2 overflow-y-auto px-3 py-4"
        >
          {messages.map((message) => (
            <Bubble key={message.id} message={message} onTapback={onTapback} />
          ))}
          {nextMove && !typing ? (
            <div className="rounded-[1.15rem] bg-[#1d4ed8] px-3 py-3 text-white">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">
                Next move
              </p>
              <p className="mt-1 text-[14px] font-medium leading-5">{nextMove.text}</p>
              <p className="mt-1 text-[11px] text-white/55">{nextMove.why}</p>
            </div>
          ) : null}
          {sceneTaps.length > 0 && !typing ? (
            <SceneBoard taps={sceneTaps} busy={busy} onTap={onSceneTap} />
          ) : null}
          {locationChips.length > 0 && !typing ? (
            <LocationShare places={locationChips} busy={busy} onShare={onChip} />
          ) : null}
          {photon && !typing ? (
            <NativeWidgets
              photon={photon}
              onChip={onChip}
              busy={busy}
              onOpenReport={onOpenReport}
            />
          ) : null}
          {typing ? (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-[#2c2c2e] px-3 py-2 text-white">
                <span className="typing-dots">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {chips.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto border-t border-white/5 bg-[#1c1c1e] px-3 py-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={busy}
                onClick={() => onChip(chip)}
                className="shrink-0 rounded-full bg-[#0a84ff] px-3 py-1 text-[11px] font-medium text-white disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        ) : null}

        <form
          className="flex items-end gap-2 bg-[#1c1c1e] px-3 pb-5 pt-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSend();
          }}
        >
          <button
            type="button"
            onClick={onAttach}
            className="grid size-9 place-items-center rounded-full bg-white/8 text-white"
            aria-label="Attach a photo"
          >
            <Camera className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            {upload ? (
              <div className="mb-2 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={upload.src} alt="Selected" className="h-16 w-full object-cover" />
              </div>
            ) : null}
            <input
              value={draft}
              onChange={(event) => onDraft(event.target.value)}
              placeholder="iMessage"
              className="h-9 w-full rounded-full border border-white/10 bg-[#2c2c2e] px-3 text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="grid size-9 place-items-center rounded-full bg-[#0a84ff] text-white disabled:opacity-40"
            aria-label="Send"
          >
            <SendHorizontal className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function Bubble({
  message,
  onTapback,
}: {
  message: ChatMessage;
  onTapback?: (id: string) => void;
}) {
  if (message.role === "system") {
    return (
      <p className="mx-auto max-w-[280px] text-center text-[11px] leading-5 text-white/45">
        {message.text}
      </p>
    );
  }

  const mine = message.role === "resident";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[80%] rounded-[1.15rem] text-[13px] leading-5",
          message.imageSrc ? "overflow-visible" : "overflow-hidden",
          mine ? "bg-[#0a84ff] text-white" : "bg-[#2c2c2e] text-white",
        )}
      >
        {message.imageSrc ? (
          <div
            className="relative h-40 w-full overflow-hidden rounded-t-[1.15rem]"
            onDoubleClick={() => message.role === "resident" && onTapback?.(message.id)}
          >
            <Image
              src={message.imageSrc}
              alt={message.imageAlt || ""}
              fill
              className="object-cover"
            />
            {message.tapback ? (
              <span className="absolute -bottom-2 -left-2 rounded-full bg-[#2c2c2e] px-1.5 py-0.5 text-[11px] shadow-md ring-1 ring-white/10">
                {message.tapback === "emphasized" ? "‼️" : "👍"}
              </span>
            ) : null}
          </div>
        ) : null}
        {message.text ? (
          <p className="whitespace-pre-wrap px-3 py-2">{message.text}</p>
        ) : null}
        {!mine && message.text ? (
          <div className="px-2 pb-2">
            <VoiceRead text={message.text} label="Read this" compact />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RuntimeStrip({
  gemini,
  photon,
  falkor,
  model,
}: {
  gemini?: boolean;
  photon?: boolean;
  falkor?: boolean;
  model?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-[11px]">
      <span className="rounded-full bg-[color:var(--wash)] px-2.5 py-1 text-[color:var(--fog)]/70">
        Gemini {gemini ? `live · ${model}` : "demo analysis · add GEMINI_API_KEY"}
      </span>
      <span className="rounded-full bg-[color:var(--wash)] px-2.5 py-1 text-[color:var(--fog)]/70">
        Photon {photon ? "line live · (628) 789-5362" : "iMessage surface in this browser"}
      </span>
      <span className="rounded-full bg-[color:var(--wash)] px-2.5 py-1 text-[color:var(--fog)]/70">
        FalkorDB {falkor ? "graph connected" : "in-memory graph · same Cypher shape"}
      </span>
    </div>
  );
}

function GraphPanel({ insight }: { insight: NonNullable<AgentReply["graph"]> }) {
  return (
    <section className="rounded-3xl border border-emerald-400/25 bg-emerald-400/8 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">
        FalkorDB pattern graph · {insight.backend}
      </p>
      <h3 className="mt-2 font-serif text-xl text-[color:var(--fog)]">
        {insight.similarCount} similar {insight.species.replace("_", " ")} records in{" "}
        {insight.area}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--fog)]/75">{insight.pattern}</p>
      {insight.routedTo ? (
        <p className="mt-3 text-xs text-[color:var(--fog)]/50">Routes to {insight.routedTo}</p>
      ) : null}
      <p className="mt-3 text-[11px] leading-5 text-[color:var(--fog)]/40">
        Areas are blurred on purpose. The graph stores relationships — species, season,
        desk — not a live pin.
      </p>
    </section>
  );
}

function EmptyAnalysis() {
  return (
    <div className="rounded-3xl border border-dashed border-[color:var(--rule)] p-6 text-sm text-[color:var(--fog)]/60">
      <p className="font-medium text-[color:var(--fog)]">No encounter yet.</p>
      <p className="mt-2 leading-6">
        Press Play 90-second walkthrough, or tap the Outer Sunset card. Answer the
        safety poll, then share a block. Gemini reasons under uncertainty; the rule
        file speaks.
      </p>
    </div>
  );
}

function AnalysisPanel({ analysis }: { analysis: SceneAnalysis }) {
  return (
    <section className="rounded-3xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
        Gemini visual evidence
      </p>
      <h2 className="mt-2 font-serif text-2xl text-[color:var(--fog)]">
        {analysis.commonName}
      </h2>
      <p className="mt-1 text-sm text-[color:var(--fog)]/60">
        {speciesLabel(analysis.probableSpecies)} · {Math.round(analysis.identificationConfidence * 100)}%
        confidence · {analysis.usedGemini ? "live model" : "curated demo analysis"}
      </p>
      <p className="mt-4 text-sm leading-6 text-[color:var(--fog)]/80">
        {analysis.identificationNotes}
      </p>
      {analysis.visualEvidence.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {analysis.visualEvidence.map((row) => (
            <li
              key={row.cue}
              className="rounded-2xl bg-black/20 px-3 py-2 text-sm text-[color:var(--fog)]/80"
            >
              <span className="font-medium text-[color:var(--fog)]">{row.cue}</span>
              <span className="block text-xs text-[color:var(--fog)]/50">
                Supports {row.supports}. Rules out {row.rulesOut}.
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {analysis.ruledOut.length > 0 ? (
        <p className="mt-3 text-xs text-[color:var(--fog)]/45">
          Ruled out: {analysis.ruledOut.join(" · ")}
        </p>
      ) : null}
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Fact label="Behavior" value={analysis.observedBehavior.join(", ") || "—"} />
        <Fact label="Human context" value={analysis.humanContext.join(", ") || "—"} />
        <Fact label="Condition" value={analysis.animalCondition} />
        <Fact label="Uncertainty" value={analysis.uncertainty} />
      </dl>
    </section>
  );
}

function PhotonNativePanel({ reply }: { reply: AgentReply }) {
  return (
    <section className="rounded-3xl border border-[#0a84ff]/30 bg-[#0a84ff]/8 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#8ec5ff]">
        Photon native iMessage
      </p>
      <h3 className="mt-2 font-serif text-xl text-[color:var(--fog)]">
        Chat is the product
      </h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--fog)]/70">
        The resident is already in Messages. Photon uses the features that live there —
        not a downloaded app.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {photonFeatureList(reply).map((feature) => (
          <span
            key={feature}
            className="rounded-full bg-[#0a84ff]/20 px-2.5 py-1 text-[11px] text-[#d6ebff]"
          >
            {feature}
          </span>
        ))}
      </div>
    </section>
  );
}

function SceneBoard({
  taps,
  busy,
  onTap,
}: {
  taps: SceneTap[];
  busy: boolean;
  onTap: (tap: SceneTap, seen: boolean) => void;
}) {
  return (
    <div className="rounded-[1.15rem] bg-[#2c2c2e] p-3 text-white">
      <p className="text-[11px] font-medium text-white/50">What do you actually see?</p>
      <p className="mt-1 text-[11px] text-white/45">
        Tap yes or no. The next move changes. This is not a species quiz.
      </p>
      <div className="mt-2 space-y-2">
        {taps.map((tap) => (
          <div key={tap.id} className="rounded-xl bg-black/25 px-2.5 py-2">
            <p className="text-[12px]">{tap.prompt}</p>
            <div className="mt-1.5 flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => onTap(tap, true)}
                className="rounded-full bg-[#0a84ff] px-3 py-1 text-[11px] disabled:opacity-50"
              >
                I see it
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onTap(tap, false)}
                className="rounded-full bg-white/10 px-3 py-1 text-[11px] disabled:opacity-50"
              >
                Not that
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationShare({
  places,
  busy,
  onShare,
}: {
  places: string[];
  busy: boolean;
  onShare: (place: string) => void;
}) {
  return (
    <div className="rounded-[1.15rem] bg-[#2c2c2e] p-3 text-white">
      <p className="text-[11px] font-medium text-white/50">Share location</p>
      <p className="mt-1 text-[12px] text-white/70">
        A block or intersection — not a live pin.
      </p>
      <div className="mt-2 space-y-1.5">
        {places.map((place) => (
          <button
            key={place}
            type="button"
            disabled={busy}
            onClick={() => onShare(place)}
            className="flex w-full items-center gap-2 rounded-xl bg-[#0a84ff] px-3 py-2 text-left text-[12px] disabled:opacity-50"
          >
            <MapPin className="size-3.5 shrink-0" />
            {place}
          </button>
        ))}
      </div>
    </div>
  );
}

function NativeWidgets({
  photon,
  onChip,
  busy,
  onOpenReport,
}: {
  photon: PhotonNative;
  onChip: (chip: string) => void;
  busy: boolean;
  onOpenReport: () => void;
}) {
  return (
    <div className="space-y-2">
      {photon.effect ? (
        <p className="text-center text-[10px] uppercase tracking-[0.16em] text-white/35">
          iMessage effect · {photon.effect}
        </p>
      ) : null}
      {photon.poll ? (
        <div className="rounded-[1.15rem] bg-[#2c2c2e] p-3 text-white">
          <p className="text-[11px] font-medium text-white/50">Poll</p>
          <p className="mt-1 text-sm font-medium">{photon.poll.title}</p>
          <div className="mt-2 space-y-1.5">
            {photon.poll.options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={busy}
                onClick={() => onChip(option)}
                className="block w-full rounded-xl bg-[#0a84ff] px-3 py-1.5 text-left text-[12px] disabled:opacity-50"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {photon.richLink ? (
        <a
          href={photon.richLink.url}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-[1.15rem] bg-[#2c2c2e] text-white"
        >
          <div className="bg-[#0a84ff]/20 px-3 py-2 text-[11px] text-[#8ec5ff]">Rich link</div>
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{photon.richLink.title}</p>
            <p className="text-[11px] text-white/50">{photon.richLink.subtitle}</p>
          </div>
        </a>
      ) : null}
      {photon.contact ? (
        <div className="rounded-[1.15rem] bg-[#2c2c2e] px-3 py-3 text-white">
          <p className="text-[11px] text-white/45">Contact card</p>
          <p className="mt-1 text-sm font-medium">{photon.contact.name}</p>
          {photon.contact.phone ? (
            <p className="text-[12px] text-[#8ec5ff]">{photon.contact.phone}</p>
          ) : null}
          <p className="mt-1 text-[11px] leading-4 text-white/50">{photon.contact.subtitle}</p>
        </div>
      ) : null}
      {photon.appCard ? (
        <button
          type="button"
          onClick={onOpenReport}
          className="block w-full rounded-[1.15rem] bg-gradient-to-br from-[#1d4ed8] to-[#0a84ff] px-3 py-3 text-left text-white"
        >
          <p className="text-[11px] text-white/70">
            iMessage App {photon.appCard.live ? "· live" : ""} · tap for the map
          </p>
          <p className="mt-1 text-sm font-medium">{photon.appCard.title}</p>
          <p className="mt-1 text-[11px] leading-4 text-white/80">{photon.appCard.subtitle}</p>
        </button>
      ) : null}
      {photon.group ? (
        <p className="text-center text-[11px] text-white/40">
          Group renamed “{photon.group.name}” · {photon.group.members.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

function GuidancePanel({ reply }: { reply: AgentReply }) {
  const sources = useMemo(
    () => sourcesFor(reply.guidance.sourceIds),
    [reply.guidance.sourceIds],
  );

  return (
    <section className="rounded-3xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <RiskBadge level={reply.guidance.riskLevel} />
        <span className="text-[11px] text-[color:var(--fog)]/50">
          Advice is mapped, not generated
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-xl text-[color:var(--fog)]">
          {reply.guidance.title}
        </h3>
        <VoiceRead
          text={[
            reply.guidance.title,
            ...reply.guidance.immediateActions,
            reply.guidance.explanation,
          ].join(". ")}
          label="Read guidance"
        />
      </div>
      <ul className="mt-3 space-y-2 text-sm text-[color:var(--fog)]/80">
        {reply.guidance.immediateActions.map((step) => (
          <li key={step} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--amber)]" />
            <span>{step}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 text-xs text-[color:var(--fog)]/50">
        {sources.map((source) => (
          <p key={source.id}>
            <Link href="/evidence" className="underline underline-offset-2">
              {source.source}
            </Link>
          </p>
        ))}
      </div>
    </section>
  );
}

function ReportPanel({ report }: { report: IncidentReport }) {
  const area = areaForReport(report.neighborhoodHint, report.probableSpecies);
  const areas = useMemo(() => (area ? [area] : []), [area]);

  return (
    <section className="rounded-3xl border border-[color:var(--amber)]/30 bg-[color:var(--amber)]/8 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--amber)]">
        Responder packet {report.id}
      </p>
      <h3 className="mt-2 font-serif text-xl text-[color:var(--fog)]">
        {report.agency.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--fog)]/75">{report.agency.why}</p>
      <div className="mt-4 grid gap-2 text-sm text-[color:var(--fog)]">
        {report.agency.phone ? <p>Call {report.agency.phone}</p> : null}
        {report.agency.email ? <p>{report.agency.email}</p> : null}
        {report.agency.url ? (
          <a
            href={report.agency.url}
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Open the official form
          </a>
        ) : null}
      </div>
      {area ? (
        <div className="mt-4">
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[color:var(--amber)]">
            Possible area · {area.name}
          </p>
          <AreaMap areas={areas} focusId={area.id} />
          <p className="mt-2 text-xs leading-5 text-[color:var(--fog)]/50">
            Circle around {area.hint}. No marker is placed on the animal. Exact
            coordinates stay with responders.
          </p>
        </div>
      ) : null}
      <p className="mt-4 rounded-2xl bg-black/25 px-3 py-2 text-xs leading-5 text-[color:var(--fog)]/70">
        Public line: {report.publicDisplay}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/map"
          className="inline-flex rounded-full border border-[color:var(--rule)] px-3 py-1.5 text-xs text-[color:var(--fog)]"
        >
          Species map
        </Link>
        <Link
          href="/evidence"
          className="inline-flex rounded-full border border-[color:var(--rule)] px-3 py-1.5 text-xs text-[color:var(--fog)]"
        >
          Why this routing
        </Link>
      </div>
    </section>
  );
}

function SpeciesNote({ species }: { species: IncidentReport["probableSpecies"] }) {
  const brief = briefForSpecies(species);
  if (!brief) return null;
  return (
    <section className="rounded-3xl border border-[color:var(--rule)] bg-[color:var(--wash)] p-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--amber)]">
        {brief.status}
      </p>
      <h3 className="mt-2 font-serif text-xl text-[color:var(--fog)]">{brief.name}</h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--fog)]/70">{brief.about}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-[color:var(--fog)]/70">
        {brief.ifYouSeeIt.slice(0, 2).map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
      <Link
        href="/map"
        className="mt-4 inline-flex text-xs underline underline-offset-2 text-[color:var(--fog)]"
      >
        Full notes for lion, coyote, and conure
      </Link>
    </section>
  );
}

function PrivacyNote() {
  return (
    <section className="rounded-3xl border border-[color:var(--rule)] p-5 text-sm leading-6 text-[color:var(--fog)]/65">
      <p className="font-medium text-[color:var(--fog)]">
        Generalized area — never a live pin.
      </p>
      <p className="mt-2">
        If you share a block, WildSignal draws a wide neighborhood circle so responders
        know the part of town. Exact coordinates, dens, nests, and roost trees stay off
        the public map. The agent never asks you to follow an animal.
      </p>
      <Link
        href="/map"
        className="mt-3 inline-flex text-xs underline underline-offset-2 text-[color:var(--fog)]"
      >
        Mountain lion, coyote, and conure notes
      </Link>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-[color:var(--fog)]/40">
        {label}
      </dt>
      <dd className="mt-1 text-[color:var(--fog)]/85">{value}</dd>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
