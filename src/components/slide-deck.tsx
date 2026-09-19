"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LogoPlate } from "@/components/brand-mark";
import { useSound } from "@/components/sound-provider";

type SlideImage = {
  src: string;
  alt: string;
  label: string;
  credit: string;
};

type Slide = {
  kicker: string;
  title: string;
  body?: string;
  note?: string;
  logo?: boolean;
  images?: SlideImage[];
  rows?: { name: string; fact: string; desk: string; image?: string; imageAlt?: string }[];
};

const slides: Slide[] = [
  {
    kicker: "Hack for Humanity · San Francisco · 19 Sept 2026",
    title: "See it. Understand it. Keep it wild.",
    body: "An iMessage wildlife-coexistence agent. Gemini sees. Photon talks. The rule file speaks.",
    logo: true,
  },
  {
    kicker: "The gap",
    title: "You can name the animal. You still do not know who to call.",
    body: "A lion is a state wildlife report. A coyote is the park or city animal control. A parrot that will not fly is city dispatch. People freeze. They run. They post a pin. The wrong desk gets the call — or a crowd finds the animal first.",
    note: "That is the problem. WildSignal’s job is that minute: one next move, and the right desk.",
  },
  {
    kicker: "2026 in the papers",
    title: "Three mountain lions. One year. Same confused sidewalk.",
    body: "The papers named the blocks. Residents still did not know whether to run, film, or call.",
    note: "Neighborhood plates for the stories — not the news photos. SFGate, the Standard, ABC7, KTVU hold those.",
    images: [
      {
        src: "/slides/pac-heights.png",
        alt: "Foggy night street in Pacific Heights, used as a neighborhood plate",
        label: "January · Pacific Heights",
        credit: "SFGate — 77 lb male, Octavia & California",
      },
      {
        src: "/slides/panhandle.png",
        alt: "Tree canopy in the San Francisco Panhandle, used as a neighborhood plate",
        label: "Sept 5 · the Panhandle",
        credit: "The Standard — Fell & Baker, it left overnight",
      },
      {
        src: "/slides/outer-sunset.png",
        alt: "Foggy Outer Sunset intersection, used as a neighborhood plate",
        label: "Sept 18 · Outer Sunset",
        credit: "ABC7 / KTVU — 44th & Ulloa",
      },
    ],
  },
  {
    kicker: "Three neighbors · three desks",
    title: "Not the same animal. Not the same call.",
    note: "Orange is who you call — the desk that actually takes the report.",
    rows: [
      {
        name: "Mountain lion",
        fact: "Rare visitor. Three times in 2026. Not a city resident.",
        desk: "Who you call: California Fish & Wildlife. Do not run.",
        image: "/encounters/mountain-lion.jpg",
        imageAlt: "Night photograph of a mountain lion, a public reconstruction",
      },
      {
        name: "Coyote",
        fact: "Resident since 2002. Parks, pups, often escorting a dog.",
        desk: "Who you call: Presidio park staff, or city animal control.",
        image: "/encounters/coyote.jpg",
        imageAlt: "Photograph of a coyote, a public reconstruction",
      },
      {
        name: "Wild parrot",
        fact: "Official animal, 2023. A bird that will not fly is injured.",
        desk: "Who you call: San Francisco Animal Care & Control.",
        image: "/encounters/parrot.jpg",
        imageAlt: "Photograph of a cherry-headed conure, a public reconstruction",
      },
    ],
  },
  {
    kicker: "Best Use of Gemini",
    title: "Gemini interprets the scene. You confirm the pixels.",
    body: "One next move. Tap what you actually see. The instruction changes.",
    note: "Not a pamphlet. Not iNaturalist. The advice is a function of the scene you walk, beat by beat.",
  },
  {
    kicker: "Best Use of Photon",
    title: "The resident is already in Messages.",
    body: "Tapback. Gentle or slam. “Are you safe?” poll. Rich link. Contact card. Live App card. The live demo is the same loop in this browser — a shared Photon line only hears phones already on the project.",
    note: "You do not download an app while a coyote is escorting your dog. You also do not bet the pitch on a bounce.",
  },
  {
    kicker: "If they share a block",
    title: "We map a neighborhood. Never the animal.",
    body: "A delayed circle on OpenStreetMap. No live pin. No roost tree. No den.",
    note: "Exact coordinates stay with responders. The public line is blurred on purpose.",
  },
  {
    kicker: "The two questions",
    title: "911 is for a person. Google is for later.",
    note: "WildSignal is the router for the minute that is neither.",
    rows: [
      {
        name: "Why not just 911?",
        fact: "If a person is being attacked, hang up and call 911. A coyote on the Park Trail is not that. Neither is a parrot on Kearny, or a lion that already walked on. There is no one civic number for the rest — state wildlife, city animal control, park staff. 911 for every sighting jams the line that saves people.",
        desk: "911 stays for a person in danger. We route everything else.",
      },
      {
        name: "Why not ChatGPT or Google?",
        fact: "Google is six tabs while you are holding a leash. ChatGPT will invent the steps and happily help you post a pin. Gemini here only reads the scene — species, dog, child, block. The rule file, copied from the agencies, says what to do. Photon is already in Messages.",
        desk: "The model does not write the safety copy. That is the product.",
      },
    ],
  },
  {
    kicker: "90 seconds",
    title: "Outer Sunset photo → YES → 44th & Ulloa.",
    body: "Then the Presidio coyote (escorting). Then the Telegraph Hill parrot (city animal control).",
    note: "Open /signal. One loop. Live Gemini. Do not wait on a text from the seats.",
  },
  {
    kicker: "Keep it wild",
    title: "Fewer crowds. Fewer false emergencies. The right desk.",
    body: "WildSignal is not an emergency service. If a person is in danger, call 911.",
    note: "Questions. Then the live thread.",
  },
];

function PhotoRow({ images }: { images: SlideImage[] }) {
  return (
    <ul className="mt-6 grid max-w-5xl gap-3 sm:grid-cols-3">
      {images.map((image) => (
        <li key={image.src} className="overflow-hidden rounded-2xl border border-[color:var(--rule)]">
          <div className="relative h-36 sm:h-44">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 30vw, 90vw"
            />
          </div>
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-[color:var(--fog)]">{image.label}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-[color:var(--fog)]/50">
              {image.credit}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SlideDeck() {
  const [index, setIndex] = useState(0);
  const { play, enabled, toggle } = useSound();
  const slide = slides[index];

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      if (clamped === index) return;
      setIndex(clamped);
      play("tap");
    },
    [index, play],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        go(index + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(slides.length - 1);
      if (event.key === "f" || event.key === "F") {
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen();
        } else {
          void document.exitFullscreen();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="deck flex min-h-full flex-col bg-[color:var(--ink)]">
      <div className="hidden print:block">
        {slides.map((item) => (
          <section key={item.title} className="break-after-page px-10 py-16">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--amber)]">
              {item.kicker}
            </p>
            <h1 className="mt-4 font-serif text-4xl text-[color:var(--fog)]">{item.title}</h1>
            {item.body ? (
              <p className="mt-4 text-xl text-[color:var(--fog)]/75">{item.body}</p>
            ) : null}
            {item.images ? <PhotoRow images={item.images} /> : null}
            {item.rows ? (
              <ul className="mt-6 space-y-4">
                {item.rows.map((row) => (
                  <li key={row.name}>
                    <p className="font-serif text-2xl">{row.name}</p>
                    <p className="mt-1 text-lg text-[color:var(--fog)]/75">{row.fact}</p>
                    <p className="mt-1 text-sm text-[color:var(--amber)]">{row.desk}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            {item.note ? (
              <p className="mt-4 text-base text-[color:var(--fog)]/50">{item.note}</p>
            ) : null}
          </section>
        ))}
      </div>
      <div className="flex min-h-full flex-1 flex-col print:hidden">
        <div className="flex items-center justify-between px-5 py-3 text-xs text-[color:var(--fog)]/45">
          <Link href="/" className="hover:text-[color:var(--fog)]">
            wild signal
          </Link>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void toggle()} className="hover:text-[color:var(--fog)]">
              {enabled ? "Sound on" : "Sound"}
            </button>
            <span>
              {index + 1} / {slides.length}
            </span>
            <span className="hidden sm:inline">← → · F fullscreen</span>
          </div>
        </div>

        <div
          role="presentation"
          onClick={() => go(index + 1 < slides.length ? index + 1 : index)}
          className="flex flex-1 cursor-pointer flex-col justify-center px-6 py-6 text-left sm:px-16"
        >
          {slide.logo ? (
            <div className="mb-6 w-fit rounded-[2rem] bg-[#f3eee4] px-4 py-3">
              <LogoPlate size={220} className="h-auto w-44 sm:w-52" />
            </div>
          ) : null}
          <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--amber)]">
            {slide.kicker}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.08] text-[color:var(--fog)] sm:text-5xl">
            {slide.title}
          </h1>
          {slide.body ? (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[color:var(--fog)]/75 sm:text-xl">
              {slide.body}
            </p>
          ) : null}
          {slide.images ? <PhotoRow images={slide.images} /> : null}
          {slide.rows ? (
            <ul
              className={`mt-6 grid max-w-5xl gap-4 ${
                slide.rows.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {slide.rows.map((row) => (
                <li key={row.name}>
                  {row.image ? (
                    <div className="relative mb-3 h-32 overflow-hidden rounded-xl">
                      <Image
                        src={row.image}
                        alt={row.imageAlt ?? row.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 28vw, 90vw"
                      />
                    </div>
                  ) : null}
                  <p className="font-serif text-2xl text-[color:var(--fog)]">{row.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--fog)]/75">{row.fact}</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--amber)]">{row.desk}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {slide.note ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--fog)]/50">
              {slide.note}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between px-5 pb-5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="rounded-full border border-[color:var(--rule)] px-3 py-1.5 text-xs text-[color:var(--fog)] disabled:opacity-30"
          >
            Back
          </button>
          <div className="flex gap-1.5">
            {slides.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className={`size-2 rounded-full ${
                  i === index ? "bg-[color:var(--amber)]" : "bg-[color:var(--fog)]/20"
                }`}
              />
            ))}
          </div>
          {index === slides.length - 1 ? (
            <Link
              href="/signal"
              className="rounded-full bg-[color:var(--amber)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)]"
            >
              Open Signal
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="rounded-full border border-[color:var(--rule)] px-3 py-1.5 text-xs text-[color:var(--fog)]"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
