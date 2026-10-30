"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Observer);

export type SlideDef = {
  id: string;
  title: string;
  tag: string; // mis. "HERO PITCH", tampil di header slide ini
  render: (active: boolean) => ReactNode;
};

export default function SlideDeck({ slides }: { slides: SlideDef[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const animating = useRef(false);
  const [index, setIndex] = useState(0);

  const goTo = (next: number) => {
    const clamped = gsap.utils.clamp(0, slides.length - 1, next);
    if (clamped === indexRef.current || animating.current) return;
    animating.current = true;
    indexRef.current = clamped;
    setIndex(clamped);
    gsap.to(track.current, {
      yPercent: -100 * clamped,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        animating.current = false;
      },
    });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Mode "slide presentasi" dengan scroll ditangkap: desktop saja.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        document.documentElement.style.overflow = "hidden";

        const observer = Observer.create({
          target: window,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 10,
          preventDefault: true,
          onDown: () => goTo(indexRef.current - 1),
          onUp: () => goTo(indexRef.current + 1),
        });

        const onKey = (e: KeyboardEvent) => {
          if (["ArrowDown", "PageDown", " "].includes(e.key)) {
            e.preventDefault();
            goTo(indexRef.current + 1);
          }
          if (["ArrowUp", "PageUp"].includes(e.key)) {
            e.preventDefault();
            goTo(indexRef.current - 1);
          }
        };
        window.addEventListener("keydown", onKey);

        return () => {
          observer.kill();
          window.removeEventListener("keydown", onKey);
          document.documentElement.style.overflow = "";
        };
      });
    },
    { scope: root }
  );

  // MOBILE: slide tersusun vertikal dan halaman di-scroll natural, jadi tidak ada Observer yang
  // mengubah `index`. Tanpa ini hanya slide 1 yang pernah "aktif" dan slide lain (mis. Team) kosong.
  // Slide yang paling terlihat di layar dijadikan slide aktif.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    let io: IntersectionObserver | null = null;

    const start = () => {
      io?.disconnect();
      io = null;
      if (!mq.matches || !root.current) return;

      const els = Array.from(root.current.querySelectorAll<HTMLElement>("[data-slide]"));
      const ratios = els.map(() => 0);

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const i = Number((e.target as HTMLElement).dataset.slide);
            ratios[i] = e.isIntersecting ? e.intersectionRatio : 0;
          });
          let best = 0;
          ratios.forEach((r, i) => {
            if (r > ratios[best]) best = i;
          });
          if (ratios[best] > 0 && best !== indexRef.current) {
            indexRef.current = best;
            setIndex(best);
          }
        },
        { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] }
      );
      els.forEach((el) => io!.observe(el));
    };

    start();
    mq.addEventListener("change", start);
    return () => {
      mq.removeEventListener("change", start);
      io?.disconnect();
    };
  }, [slides.length]);

  return (
    <div
      ref={root}
      className="relative bg-[#0B0B0B] text-white md:fixed md:inset-0 md:h-svh md:overflow-hidden"
    >

      {/* Dot navigasi, desktop saja */}
      <div className="pointer-events-auto fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 md:right-10 md:flex">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={s.title}
            aria-pressed={index === i}
            className={`h-2 w-2 rounded-full border border-white/40 transition-all ${index === i ? "scale-125 bg-white" : "bg-transparent hover:bg-white/40"
              }`}
          />
        ))}
      </div>

      <div
        ref={track}
        className="flex flex-col md:h-full md:will-change-transform"
      >
        {slides.map((s, i) => (
          <div key={s.id} data-slide={i} className="min-h-svh w-full pt-20 md:h-svh md:shrink-0 md:pt-0">
            {s.render(index === i)}
          </div>
        ))}
      </div>
    </div>
  );
}