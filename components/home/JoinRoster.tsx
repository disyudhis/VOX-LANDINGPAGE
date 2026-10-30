"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { vacancies } from "@/lib/vacancies";
import type { Vacancy } from "@/lib/vacancies";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Join the Movement (homepage): satu bab, kompak, TANPA pin.
 * Data lowongan dari lib/vacancies.ts. Kosong → tampil "coming soon" (tidak ada lowongan fiktif).
 * Career.tsx (route /career) tidak diubah.
 */
const IG_URL = "https://www.instagram.com/voxnative/";
const ACCENTS = ["#D7FF3F", "#38BDF8", "#FF6B9A", "#A78BFA", "#FF3B30"];

const pad = (n: number) => String(n).padStart(2, "0");

const grainStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  backgroundRepeat: "repeat",
};

const css = `
.jr-move{color:transparent;-webkit-text-stroke:2px #fff;transition:color .5s ease,-webkit-text-stroke-color .5s ease}
.jr-move.is-on{color:#D7FF3F;-webkit-text-stroke-color:#D7FF3F}
@media (prefers-reduced-motion:reduce){.jr-move{color:#D7FF3F;-webkit-text-stroke-color:#D7FF3F}}
`;

function VacancyRow({ role, index }: { role: Vacancy; index: number }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const external = /^https?:/i.test(role.applyUrl);

  return (
    <li className="jr-row border-t border-white/15 last:border-b">
      <a
        href={role.applyUrl}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={`Lamar sebagai ${role.title} (${role.type})`}
        className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 py-5 transition-transform duration-300 hover:translate-x-2 focus-visible:translate-x-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="pt-1.5 text-xs font-bold tracking-widest" style={{ color: accent }}>
          {pad(index + 1)}
        </span>

        <span className="min-w-0">
          <span className="block text-2xl font-bold italic leading-tight md:text-3xl">{role.title}</span>
          <span className="mt-1 line-clamp-2 block text-sm text-neutral-400">{role.blurb}</span>
        </span>

        <span className="flex flex-col items-end gap-2">
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ borderColor: accent, color: accent }}
          >
            {role.type}
          </span>
          <span
            aria-hidden
            className="text-xl leading-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1"
          >
            ↗
          </span>
        </span>
      </a>
    </li>
  );
}

type Props = { deck?: boolean; active?: boolean };

export default function JoinRoster({ deck = false, active = true }: Props) {
  const container = useRef<HTMLElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Satu rangkaian pendek (≈ 1,2 dtk), sekali jalan, tidak menahan scroll maupun tombol lamar.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Mode deck: timeline ditahan dan diputar saat slide aktif (tidak ada scroll untuk memicunya).
        // Mode scroll biasa (HP): dipicu ScrollTrigger seperti sebelumnya.
        const tl = gsap.timeline({
          paused: deck,
          defaults: { ease: "power4.out" },
          ...(deck ? {} : { scrollTrigger: { trigger: container.current, start: "top 70%", once: true } }),
        });

        tl.from(".jr-eyebrow", { opacity: 0, y: 12, duration: 0.6 }, 0)
          .from(".jr-line > span", { yPercent: 118, rotate: 5, skewY: 6, duration: 0.95, stagger: 0.14 }, 0.05)
          .call(() => container.current?.querySelector(".jr-move")?.classList.add("is-on"), undefined, 0.9)
          .from(".jr-copy", { opacity: 0, y: 16, duration: 0.7 }, 0.55);

        if (deck) {
          tl.from(".jr-row", { opacity: 0, x: 28, duration: 0.7, stagger: 0.08 }, 0.5);
          tl.progress(0);
          introRef.current = tl;
          return () => {
            introRef.current = null;
          };
        }

        // Daftar punya pemicu sendiri: di HP letaknya di bawah headline, di luar layar saat bab mulai
        gsap.from(".jr-row", {
          opacity: 0,
          x: 28,
          duration: 0.7,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: ".jr-list", start: "top 88%", once: true },
        });
      });
    },
    { scope: container, dependencies: [deck], revertOnUpdate: true }
  );

  useEffect(() => {
    if (!deck) return;
    const tl = introRef.current;
    if (!tl) return;
    container.current?.querySelector(".jr-move")?.classList.remove("is-on");
    if (active) tl.restart();
    else tl.pause(0);
  }, [active, deck]);

  return (
    <section
      id="career"
      ref={container}
      className="relative overflow-hidden border-t border-white/15 bg-black md:motion-safe:flex md:motion-safe:h-full md:motion-safe:items-center md:motion-safe:pt-16"
    >
      <style>{css}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]" style={grainStyle} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:px-10 md:py-24 lg:min-h-[78svh] lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-center">
        {/* Kiri: pernyataan */}
        <div className="min-w-0">
          <p className="jr-eyebrow text-sm uppercase tracking-widest text-neutral-500">Join the movement</p>

          <h2
            className="mt-3 font-bold italic leading-[0.86] tracking-tight text-[clamp(2.6rem,12vw,3.3rem)] md:text-[clamp(3.5rem,10vw,6.5rem)] lg:text-[clamp(3.5rem,7vw,7rem)]"
            aria-label="Your voice. Your move."
          >
            <span className="jr-line block overflow-hidden pb-[0.1em] pr-[0.06em]" aria-hidden>
              <span className="inline-block">YOUR VOICE.</span>
            </span>
            <span className="jr-line block overflow-hidden pb-[0.1em] pr-[0.06em]" aria-hidden>
              <span className="jr-move inline-block">YOUR MOVE.</span>
            </span>
          </h2>

          <p className="jr-copy mt-6 max-w-md text-lg text-neutral-400">
            We&rsquo;re looking for people who make things move.
          </p>
        </div>

        {/* Kanan: daftar lowongan (baris bernomor, tanpa carousel layar penuh) */}
        <div className="min-w-0">
          {vacancies.length > 0 ? (
            <ul aria-label="Lowongan yang tersedia" className="jr-list">
              {vacancies.map((role, i) => (
                <VacancyRow key={role.id} role={role} index={i} />
              ))}
            </ul>
          ) : (
            <ul aria-label="Lowongan" className="jr-list">
              <li className="jr-row border-t border-white/15 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-2xl font-bold italic leading-tight md:text-3xl">Coming soon.</p>
                    <p className="mt-1 text-sm text-neutral-400">Lowongan lagi kami siapkan.</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-dashed border-white/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                    Segera
                  </span>
                </div>
              </li>
              <li className="jr-row border-y border-white/15">
                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-5 transition-transform duration-300 hover:translate-x-2 focus-visible:translate-x-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <span className="text-lg font-bold italic">Kabar terbaru di Instagram</span>
                  <span
                    aria-hidden
                    className="text-xl leading-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}