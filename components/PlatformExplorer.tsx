"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { platforms, type PlatformId } from "@/lib/platforms";
import PlatformIcon from "./PlatformIcon";

gsap.registerPlugin(useGSAP);

/* ---------- Mockup HP (hanya div + CSS) ---------- */

function PhoneMock({ id }: { id: PlatformId }) {
  const heart = useRef<HTMLSpanElement>(null);

  const pop = () => {
    if (!heart.current) return;
    gsap.killTweensOf(heart.current);
    gsap
      .timeline()
      .fromTo(
        heart.current,
        { scale: 0, opacity: 1 },
        { scale: 1.4, duration: 0.35, ease: "back.out(2)" }
      )
      .to(heart.current, { opacity: 0, duration: 0.3 }, "+=0.15");
  };

  return (
    <div className="mx-auto w-56 rounded-[2.2rem] border-2 border-white p-2 md:w-72">
      <div
        aria-hidden
        onClick={pop}
        className="phone-inner relative aspect-[9/16] w-full cursor-pointer select-none overflow-hidden rounded-[1.7rem] border border-white/25 bg-black"
      >
        {id === "instagram" && (
          <div className="flex flex-col gap-2 p-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full border-2 border-white" />
              <div className="h-2 w-20 rounded-full bg-white/60" />
            </div>
            <div className="flex aspect-[4/5] items-center justify-center bg-white text-black">
              <span className="text-4xl font-bold italic tracking-tighter">VOX</span>
            </div>
            <div className="flex gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white" />
              <div className="h-4 w-4 rounded-full border-2 border-white" />
              <div className="h-4 w-4 rounded-full border-2 border-white" />
            </div>
            <div className="h-2 w-full rounded-full bg-white/50" />
            <div className="h-2 w-2/3 rounded-full bg-white/50" />
          </div>
        )}

        {id === "tiktok" && (
          <div className="relative h-full">
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              ▶
            </div>
            <div className="absolute bottom-4 left-3 right-16 space-y-2">
              <div className="h-2 w-24 rounded-full bg-white" />
              <div className="h-2 w-full rounded-full bg-white/50" />
              <div className="h-2 w-2/3 rounded-full bg-white/50" />
            </div>
            <div className="absolute bottom-4 right-3 flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-white" />
              <div className="h-8 w-8 rounded-full border-2 border-white" />
              <div className="h-8 w-8 rounded-full border-2 border-white" />
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white [animation-duration:4s] motion-reduce:animate-none" />
            </div>
          </div>
        )}

        {id === "threads" && (
          <div className="p-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 shrink-0 rounded-full border-2 border-white" />
                  {i < 2 && <div className="mt-1 w-px flex-1 bg-white/30" />}
                </div>
                <div className="flex-1 space-y-2 pb-5">
                  <div className="h-2 w-16 rounded-full bg-white" />
                  <div className="h-2 w-full rounded-full bg-white/50" />
                  <div className="h-2 w-4/5 rounded-full bg-white/50" />
                </div>
              </div>
            ))}
          </div>
        )}

        <span
          ref={heart}
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl opacity-0"
        >
          ♥
        </span>
      </div>
      <p className="mt-3 pb-1 text-center text-xs text-neutral-500">
        Tap layar untuk like
      </p>
    </div>
  );
}

/* ---------- Explorer ---------- */

export default function PlatformExplorer() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<PlatformId>("instagram");
  const current = platforms.find((p) => p.id === active)!;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".panel-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power3.out",
        });
        gsap.from(".phone-inner", {
          opacity: 0,
          scale: 0.96,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true }
  );

  return (
    <section ref={root} className="px-6 py-16 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
        {/* 1. Daftar platform */}
        <div
          role="tablist"
          aria-label="Pilih platform"
          className="border-t-2 border-white md:col-start-1 md:row-start-1"
        >
          {platforms.map((p, i) => {
            const on = p.id === active;
            return (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="platform-panel"
                onClick={() => setActive(p.id)}
                className={`flex w-full items-center justify-between border-b-2 border-white px-3 py-5 text-left transition-colors duration-300 md:py-6 ${
                  on ? "bg-white text-black" : "hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className="text-sm font-normal not-italic opacity-60">
                    0{i + 1}
                  </span>
                  <span className="text-4xl font-bold italic leading-none md:text-6xl">
                    {p.name}
                  </span>
                </span>
                <PlatformIcon id={p.id} className="h-7 w-7 md:h-9 md:w-9" />
              </button>
            );
          })}
        </div>

        {/* 2. Mockup HP */}
        <div className="md:col-start-2 md:row-span-2 md:row-start-1">
          <PhoneMock id={active} />
        </div>

        {/* 3. Detail platform */}
        <div
          id="platform-panel"
          role="tabpanel"
          className="md:col-start-1 md:row-start-2"
        >
          <p className="panel-item text-sm uppercase tracking-widest text-neutral-500">
            {current.handle}
          </p>
          <p className="panel-item mt-3 text-2xl font-bold italic leading-snug md:text-3xl">
            {current.tagline}
          </p>

          <div className="panel-item mt-8 flex items-end gap-3">
            <span className="text-7xl font-bold italic leading-none tracking-tighter md:text-8xl">
              {current.stat}
            </span>
            <span className="pb-2 text-neutral-400">{current.statLabel}</span>
          </div>

          <ul className="panel-item mt-8 flex flex-wrap gap-2">
            {current.formats.map((f) => (
              <li
                key={f}
                className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-bold italic"
              >
                {f}
              </li>
            ))}
          </ul>
            <a
          
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="panel-item mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold italic text-black"
          >
            Buka {current.name} ↗
          </a>
        </div>
      </div>
    </section>
  );
}