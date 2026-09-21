"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const BARS = 32;

export default function CareerHero() {
  const root = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ch-item", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        });
      });
    },
    { scope: root }
  );

  // Bangunkan waveform sebentar, lalu kembali datar
  const wake = contextSafe(() => {
    gsap.killTweensOf(".flat-bar");
    gsap.fromTo(
      ".flat-bar",
      { scaleY: 0.04 },
      {
        scaleY: "random(0.25, 1)",
        duration: 0.35,
        ease: "sine.out",
        yoyo: true,
        repeat: 1,
        stagger: { each: 0.02, from: "center" },
      }
    );
  });

  return (
    <section ref={root} className="px-6 pb-16 pt-32 md:pb-24 md:pt-44">
      <div className="mx-auto max-w-6xl">
        <p className="ch-item mb-6 flex items-center gap-3 text-sm uppercase tracking-widest text-neutral-500">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-white" />
          Career · Ditutup sementara
        </p>

        <h1 className="ch-item text-6xl font-bold italic leading-[0.9] tracking-tighter md:text-9xl">
          Belum ada
          <br />
          lowongan.
        </h1>

        <div className="ch-item mt-10 flex items-end gap-4">
          <span className="text-[28vw] font-bold italic leading-[0.8] tracking-tighter md:text-[16rem]">
            00
          </span>
          <span className="pb-2 text-neutral-400 md:pb-6 md:text-xl">
            posisi
            <br />
            dibuka
          </span>
        </div>

        <button
          type="button"
          onClick={wake}
          aria-label="Bangunkan waveform"
          className="ch-item mt-10 block w-full cursor-pointer"
        >
          <div
            aria-hidden
            className="flex h-20 items-center justify-between gap-1 md:h-28"
          >
            {Array.from({ length: BARS }).map((_, i) => (
              <div
                key={i}
                className="flat-bar h-full w-full max-w-2 rounded-full bg-white will-change-transform md:max-w-3"
                style={{ transform: "scaleY(0.04)" }}
              />
            ))}
          </div>
          <span className="mt-4 block text-left text-sm text-neutral-500">
            Sepi? Tap garis di atas. Tapi kami tetap mendengarkan.
          </span>
        </button>

        <p className="ch-item mt-10 max-w-xl text-lg text-neutral-400">
          Saat ini semua posisi di VOX sudah terisi. Tapi tim kami terus
          bertumbuh, dan kami lebih suka mengenal orangnya dulu sebelum
          lowongannya ada.
        </p>
      </div>
    </section>
  );
}