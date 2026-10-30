"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, Observer);

/**
 * Deck homepage: slide presentasi seperti halaman About, tapi dengan "langkah" di dalam slide
 * (dipakai etalase "Yang kami bikin" untuk menggeser kartu sebelum pindah ke slide berikutnya).
 *
 *  - Desktop/tablet (≥768px) tanpa reduced-motion: halaman dikunci, wheel / swipe / panah / titik navigasi
 *    memindahkan slide dengan animasi.
 *  - HP dan reduced-motion: scroll biasa. Tiap bab tampil sebagai section normal.
 *
 * Layout deck diatur lewat CSS (md:motion-safe:...), jadi HTML dari server sudah benar sebelum JS jalan.
 */
export const DECK_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const isDeckNow = () => typeof window !== "undefined" && window.matchMedia(DECK_QUERY).matches;

export type DeckApi = {
  /** Slide melaporkan berapa langkah internal yang dimilikinya (1 = tidak ada). */
  setSteps: (n: number) => void;
  /** Loncat ke langkah tertentu di slide ini. */
  goStep: (n: number) => void;
};

export type SlideState = {
  active: boolean;
  step: number;
  deck: boolean;
  api: DeckApi;
};

export type HomeSlide = {
  /** Sama dengan id anchor (#segments, #career, #contact) supaya link anchor memindahkan slide. */
  id: string;
  title: string;
  render: (s: SlideState) => ReactNode;
};

export default function HomeDeck({ slides }: { slides: HomeSlide[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const wrappers = useRef<(HTMLDivElement | null)[]>([]);

  const indexRef = useRef(0);
  const stepRef = useRef(0);
  const stepsRef = useRef<number[]>(slides.map(() => 1));
  const lock = useRef(false);

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  // Nilai awal dari matchMedia supaya anak-anaknya langsung membangun animasi mode yang benar
  // (deck hanya dipakai di efek, bukan di JSX, jadi tidak ada beda hidrasi).
  const [deck, setDeck] = useState<boolean>(isDeckNow);

  const unlockAfter = (ms: number) => {
    lock.current = true;
    window.setTimeout(() => {
      lock.current = false;
    }, ms);
  };

  const setStepBoth = (n: number) => {
    stepRef.current = n;
    setStep(n);
  };

  const goStepTo = (n: number) => {
    const max = (stepsRef.current[indexRef.current] ?? 1) - 1;
    const c = Math.min(max, Math.max(0, n));
    if (c === stepRef.current || lock.current) return;
    unlockAfter(650);
    setStepBoth(c);
  };

  const goSlide = (next: number, fromBack = false, instant = false) => {
    const c = gsap.utils.clamp(0, slides.length - 1, next);
    if (!instant && (c === indexRef.current || lock.current)) return;
    indexRef.current = c;
    setIndex(c);
    // Mundur ke slide yang punya langkah internal = tampilkan langkah terakhirnya
    setStepBoth(fromBack ? Math.max(0, (stepsRef.current[c] ?? 1) - 1) : 0);
    if (instant) {
      gsap.set(track.current, { yPercent: -100 * c });
      return;
    }
    lock.current = true;
    gsap.to(track.current, {
      yPercent: -100 * c,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        lock.current = false;
      },
    });
  };

  const forward = () => {
    const i = indexRef.current;
    if (stepRef.current < (stepsRef.current[i] ?? 1) - 1) goStepTo(stepRef.current + 1);
    else goSlide(i + 1);
  };

  const back = () => {
    if (stepRef.current > 0) goStepTo(stepRef.current - 1);
    else goSlide(indexRef.current - 1, true);
  };

  // API stabil per slide
  const apis = useMemo<DeckApi[]>(
    () =>
      slides.map((_, i) => ({
        setSteps: (n: number) => {
          stepsRef.current[i] = Math.max(1, n);
        },
        goStep: (n: number) => goStepTo(n),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(DECK_QUERY, () => {
        const html = document.documentElement;
        setDeck(true);
        html.style.overflow = "hidden";
        html.setAttribute("data-deck", "");
        window.scrollTo(0, 0);

        // Datang dengan hash (mis. dari Navbar di /about ke /#contact): langsung ke slide itu
        const hashId = window.location.hash.slice(1);
        const hi = slides.findIndex((s) => s.id === hashId);
        if (hi > 0) goSlide(hi, false, true);

        const observer = Observer.create({
          target: window,
          type: "wheel,touch",
          wheelSpeed: -1,
          tolerance: 10,
          preventDefault: true,
          onDown: () => back(),
          onUp: () => forward(),
        });

        const onKey = (e: KeyboardEvent) => {
          const t = e.target as HTMLElement | null;
          const inControl = !!t?.closest("button, a, input, textarea, select, [contenteditable]");
          if (e.key === " " && inControl) return; // spasi di tombol/link = klik, bukan pindah slide
          if (["ArrowDown", "PageDown", " "].includes(e.key)) {
            e.preventDefault();
            forward();
          } else if (["ArrowUp", "PageUp"].includes(e.key)) {
            e.preventDefault();
            back();
          }
        };
        window.addEventListener("keydown", onKey);

        // Link anchor (#segments, #career, #contact, /#contact, logo "/") memindahkan slide, bukan scroll.
        // Fase capture + stopPropagation: Next Link & Lenis tidak ikut memproses klik yang sama.
        const onClick = (e: MouseEvent) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
          if (!a || a.target === "_blank") return;
          const href = a.getAttribute("href") ?? "";
          const onHome = window.location.pathname === "/";
          let id: string | null = null;
          if (href.startsWith("#")) id = href.slice(1);
          else if (onHome && href.startsWith("/#")) id = href.slice(2);
          else if (onHome && href === "/") id = slides[0].id;
          if (!id) return;
          const i = slides.findIndex((s) => s.id === id);
          if (i < 0) return;
          e.preventDefault();
          e.stopPropagation();
          goSlide(i);
        };
        document.addEventListener("click", onClick, true);

        return () => {
          observer.kill();
          window.removeEventListener("keydown", onKey);
          document.removeEventListener("click", onClick, true);
          html.style.overflow = "";
          html.removeAttribute("data-deck");
          gsap.set(track.current, { clearProps: "transform" });
          indexRef.current = 0;
          stepRef.current = 0;
          lock.current = false;
          setIndex(0);
          setStep(0);
          setDeck(false);
        };
      });
    },
    { scope: root }
  );

  // Slide yang tidak sedang tampil tidak boleh bisa difokus keyboard (kalau tidak, browser menggeser
  // kontainer overflow-hidden dan transform deck jadi tidak sejajar).
  useEffect(() => {
    wrappers.current.forEach((el, i) => {
      if (!el) return;
      (el as HTMLElement & { inert: boolean }).inert = deck && i !== index;
    });
  }, [deck, index]);

  return (
    <div
      ref={root}
      className="relative bg-black text-white md:motion-safe:fixed md:motion-safe:inset-0 md:motion-safe:h-svh md:motion-safe:overflow-hidden"
    >
      {/* Titik navigasi, hanya mode deck */}
      <nav
        aria-label="Bab halaman"
        className="pointer-events-auto fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 md:right-10 md:motion-safe:flex"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goSlide(i)}
            aria-label={s.title}
            aria-current={index === i ? "true" : undefined}
            className={`h-2 w-2 rounded-full border border-white/40 transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              index === i ? "scale-125 bg-white" : "bg-transparent hover:bg-white/40"
            }`}
          />
        ))}
      </nav>

      <div ref={track} className="flex flex-col md:motion-safe:h-full md:motion-safe:will-change-transform">
        {slides.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              wrappers.current[i] = el;
            }}
            data-slide={i}
            className="w-full md:motion-safe:h-svh md:motion-safe:shrink-0"
          >
            {s.render({
              active: deck ? i === index : true,
              step: deck ? (i === index ? step : i < index ? Math.max(0, (stepsRef.current[i] ?? 1) - 1) : 0) : 0,
              deck,
              api: apis[i],
            })}
          </div>
        ))}
      </div>
    </div>
  );
}