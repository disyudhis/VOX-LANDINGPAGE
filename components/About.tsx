"use client";

import { Fragment, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Kind =
  | "headline"
  | "reels"
  | "news"
  | "review"
  | "meme"
  | "hype"
  | "carousel"
  | "voxtizen"
  | "poll";

type TileData = {
  kind: Kind;
  label: string;
  className: string; // posisi grid: HP 2 kolom x 6 baris, desktop 5 kolom x 4 baris
  src?: string; // opsional: screenshot feed asli, mis. "/feeds/reels-1.jpg"
};

const SHOW_LABELS = true; // false = sembunyikan semua label kecil di kotak
const headline = ["Ini", "suara", "kami.."];

const tiles: TileData[] = [
  {
    kind: "headline",
    label: "",
    className:
      "col-span-2 row-span-2 md:col-span-3 md:col-start-2 md:row-span-2 md:row-start-1",
  },
  { kind: "reels", label: "Reels", className: "row-span-2 md:col-start-1 md:row-start-1" },
  { kind: "news", label: "Berita", className: "md:col-span-2 md:col-start-1 md:row-start-3" },
  { kind: "review", label: "Review", className: "md:col-start-5 md:row-span-3 md:row-start-1" },
  { kind: "carousel", label: "Carousel", className: "col-span-2 md:col-span-2 md:col-start-1 md:row-start-4" },
  { kind: "hype", label: "Hype", className: "md:col-start-4 md:row-start-3" },
  { kind: "voxtizen", label: "VOXTIZEN", className: "md:col-start-3 md:row-start-4" },
  { kind: "meme", label: "Receh", className: "hidden md:col-start-3 md:row-start-3 md:block" },
  { kind: "poll", label: "Poll", className: "hidden md:col-span-2 md:col-start-4 md:row-start-4 md:block" },
];

const DARK: Kind[] = ["reels", "review", "hype", "voxtizen"];

const stripes: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 14px)",
};
const outlineWhite: CSSProperties = {
  color: "transparent",
  WebkitTextStroke: "2px #fff",
};

/* ---------- Isi tiap kotak (mock dari CSS) ---------- */

function Mock({ kind }: { kind: Kind }) {
  switch (kind) {
    case "reels":
      return (
        <div className="absolute inset-0" style={stripes}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 text-xl">
              ▶
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3 space-y-1.5">
            <div className="h-1.5 w-2/3 rounded-full bg-white" />
            <div className="h-1.5 w-full rounded-full bg-white/40" />
            <p className="pt-1 text-[10px] text-neutral-400">@vox.bandung</p>
          </div>
        </div>
      );

    case "news":
      return (
        <div className="absolute inset-x-4 bottom-4 top-10 flex flex-col justify-end gap-1.5 md:top-12 md:gap-2">
          <span className="mb-1 hidden w-fit -rotate-2 rounded bg-black px-2 py-0.5 text-[10px] font-bold italic tracking-widest text-white md:block">
            BREAKING
          </span>
          <div className="h-2.5 w-full rounded bg-black md:h-4" />
          <div className="h-2.5 w-4/5 rounded bg-black md:h-4" />
          <div className="h-2.5 w-1/2 rounded bg-black md:h-4" />
        </div>
      );

    case "review":
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <p
            className="text-5xl font-bold italic leading-none md:text-8xl"
            style={outlineWhite}
          >
            4.8
          </p>
          <p className="text-sm tracking-[0.3em] md:text-lg">★★★★★</p>
        </div>
      );

    case "meme":
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="-rotate-6 text-5xl font-bold italic leading-none tracking-tighter md:text-7xl">
            WKWK
          </p>
        </div>
      );

    case "hype":
      return (
        <div className="absolute inset-0">
          <span className="absolute right-4 top-3 text-xl">↗</span>
          <p className="absolute bottom-3 left-4 text-5xl font-bold italic leading-none tracking-tighter md:text-7xl">
            #1
          </p>
          <div className="absolute bottom-4 right-4 flex h-10 items-end gap-1 md:h-16">
            {[30, 45, 40, 65, 100].map((h, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-white md:w-2"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      );

    case "carousel":
      return (
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 top-9 flex items-center justify-center md:top-10">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-12 w-10 rounded-lg border-2 border-black md:h-24 md:w-20 ${i === 1 ? "bg-black" : "bg-white"
                  } ${i ? "-ml-4 md:-ml-6" : ""}`}
                style={{ transform: `rotate(${(i - 1) * 8}deg)`, zIndex: i }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="h-1.5 w-1.5 rounded-full border border-black" />
            <span className="h-1.5 w-1.5 rounded-full border border-black" />
          </div>
        </div>
      );

    case "voxtizen":
      return (
        <div className="absolute inset-0">
          <div
            aria-hidden
            className="absolute -bottom-3 -right-3 h-3/4 w-3/4 bg-contain bg-right-bottom bg-no-repeat opacity-20"
            style={{ backgroundImage: "url(/vox-mark-sm.png)" }}
          />
          <p className="absolute bottom-3 left-3 text-lg font-bold italic leading-none tracking-tight md:left-4 md:text-3xl">
            VOXTIZEN
          </p>
        </div>
      );

    case "poll":
      return (
        <div className="absolute inset-x-4 bottom-4 top-12 flex flex-col justify-end gap-2.5">
          <div className="h-7 rounded-full border-2 border-black">
            <div className="flex h-full w-[62%] items-center rounded-full bg-black px-2.5 text-[10px] font-bold italic text-white">
              62%
            </div>
          </div>
          <div className="h-7 rounded-full border-2 border-black">
            <div className="flex h-full w-[38%] items-center rounded-full border-r-2 border-black px-2.5 text-[10px] font-bold italic">
              38%
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function Tile({ tile }: { tile: TileData }) {
  // Kotak judul
  if (tile.kind === "headline") {
    return (
      <li
        className={`vn-tile relative overflow-hidden rounded-2xl border-2 border-white bg-white text-black will-change-transform md:rounded-3xl ${tile.className}`}
      >
        <div className="absolute inset-0 flex items-end p-4 md:p-8">
          <h2 className="text-6xl font-bold italic leading-[0.9] tracking-tighter md:text-[clamp(3.5rem,8.5vw,9rem)]">
            {headline.map((w) => (
              <Fragment key={w}>
                <span className="inline-block overflow-hidden py-[0.06em] pr-[0.1em] align-bottom">
                  <span className="vn-word inline-block">{w}</span>
                </span>{" "}
              </Fragment>
            ))}
          </h2>
        </div>
      </li>
    );
  }

  const dark = DARK.includes(tile.kind);

  return (
    <li
      className={`vn-tile relative overflow-hidden rounded-2xl border-2 border-white will-change-transform md:rounded-3xl ${dark ? "bg-black text-white" : "bg-white text-black"
        } ${tile.className}`}
    >
      {tile.src ? (
        <>
          <Image
            src={tile.src}
            alt={tile.label}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </>
      ) : (
        <Mock kind={tile.kind} />
      )}

      {SHOW_LABELS && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tile.src ? "bg-white text-black" : "border border-current"
            }`}
        >
          {tile.label}
        </span>
      )}
    </li>
  );
}

/* ---------- Section ---------- */

export default function About() {
  const container = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const rotations = useRef<number[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Siapkan rotasi acak SEKALI per kotak, dipakai bareng oleh fase "mengumpul" dan "meledak"
      // supaya sudutnya konsisten, tidak loncat saat pin mengambil alih.
      rotations.current = tiles.map(() => gsap.utils.random(-25, 25));
      const rotFor = (i: number) => rotations.current[i] ?? 0;

      const scatterFrom = (g: HTMLElement) => ({
        x: (i: number, el: HTMLElement) =>
          g.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
        y: (i: number, el: HTMLElement) =>
          g.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2),
        scale: 0.2,
        rotation: (i: number) => rotFor(i),
        opacity: 0,
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const g = grid.current;
        if (!g) return;

        // Fase 1 (SEBELUM pin): selagi section ini mendekat lewat scroll normal,
        // kotak-kotak pelan-pelan mengumpul & menghilang ke tengah papan.
        // Ini yang menjembatani transisi dari Hero, supaya tidak "nabrak" pin.
        gsap.fromTo(
          ".vn-tile",
          { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
          {
            ...scatterFrom(g),
            ease: "power1.in",
            stagger: { each: 0.02, from: "edges", grid: "auto" },
            scrollTrigger: {
              trigger: stage.current,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Satu timeline dipakai di desktop dan HP, bedanya hanya panjang scroll
      const build = (scrollFactor: number) => {
        const g = grid.current;
        if (!g) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * scrollFactor)}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Fase 2 (SAAT pin aktif): lanjut persis dari titik "mengumpul" tadi,
        // lalu meledak menyebar ke posisi bento-nya.
        tl.fromTo(".vn-tile", scatterFrom(g), {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: { each: 0.07, from: "center", grid: "auto" },
        }, 0);

        // Judul naik kata demi kata dari balik topeng
        tl.fromTo(
          ".vn-word",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.5, ease: "power3.out", stagger: 0.12 },
          1
        );

        tl.to({}, { duration: 0.4 }); // jeda sebentar saat papan sudah lengkap
      };

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () =>
        build(1.3)
      );
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () =>
        build(1.1)
      );
    },
    { scope: container }
  );

  return (
    <section id="about" ref={container} className="bg-black">
      <div ref={stage} className="h-svh p-2.5 md:p-3">
        <ul
          ref={grid}
          className="relative grid h-full grid-cols-2 grid-rows-6 gap-2.5 md:grid-cols-5 md:grid-rows-4 md:gap-3"
        >
          {tiles.map((t) => (
            <Tile key={t.kind} tile={t} />
          ))}
        </ul>
      </div>
    </section>
  );
}