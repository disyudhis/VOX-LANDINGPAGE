"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HASHTAG = "#OurVoicesAreTheMove";
const MAX_TILT = 14; // derajat tilt logo
const POOL = 18; // jumlah stempel yang didaur ulang
const STEP = 48; // jarak (px) antar stempel saat cursor bergerak

type Badge = {
  label: string;
  emoji: string;
  color: string;
  pos: string;
  rotate: number;
  big?: boolean;
};

// Warna sama seperti aksen di section "Yang kami bikin"
const badges: Badge[] = [
  { label: "News", emoji: "📰", color: "#38BDF8", pos: "left-[3%] top-[14%]", rotate: -8 },
  { label: "Studi", emoji: "🔬", color: "#A78BFA", pos: "right-[3%] top-[9%]", rotate: 7, big: true },
  { label: "Meme", emoji: "😂", color: "#D7FF3F", pos: "left-[-1%] top-[48%]", rotate: 11, big: true },
  { label: "Quote", emoji: "✍️", color: "#FF6B9A", pos: "right-[-1%] top-[50%]", rotate: -7 },
  { label: "Review", emoji: "⭐", color: "#FF3B30", pos: "left-[6%] bottom-[12%]", rotate: 6 },
  { label: "Cinematic", emoji: "🎬", color: "#FF3B30", pos: "right-[6%] bottom-[14%]", rotate: -10 },
  { label: "Challenge", emoji: "🔥", color: "#FF3B30", pos: "left-1/2 top-[3%] -translate-x-1/2", rotate: 4, big: true },
];

export default function Hero() {
  const container = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const logoWrap = useRef<HTMLDivElement>(null);
  const quickRotX = useRef<((v: number) => void) | null>(null);
  const quickRotY = useRef<((v: number) => void) | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const poolIdx = useRef(0);
  const [copied, setCopied] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-fade", {
          y: 26,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        });

        gsap.to(logoWrap.current, {
          y: -12,
          duration: 2.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Overlay menipis seiring scroll, collage jadi lebih "terlihat"
        gsap.fromTo(
          overlay.current,
          { opacity: 0.88 },
          {
            opacity: 0.62,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Zoom-out + parallax wallpaper, jalan di desktop & HP
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          bg.current,
          { scale: 1.15, yPercent: -5 },
          {
            scale: 1,
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Badge "sticker": meledak masuk dengan pantulan, lalu goyang + melayang terus. Desktop saja.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".badge-orbit");

        gsap.from(items, {
          scale: 0,
          opacity: 0,
          duration: 0.7,
          stagger: { each: 0.08, from: "random" },
          delay: 0.4,
          ease: "back.out(2.4)",
        });

        items.forEach((el, i) => {
          const base = Number(el.dataset.rotate) || 0;
          gsap.to(el, {
            y: gsap.utils.random(-16, -10),
            rotation: base + gsap.utils.random(-7, 7),
            duration: gsap.utils.random(2.2, 3.6),
            delay: 1 + i * 0.1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      });

      // Chip meledak masuk bergantian, acak. HP saja, tanpa gerak idle (hemat baterai).
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(".badge-chip", {
          scale: 0,
          opacity: 0,
          duration: 0.55,
          stagger: { each: 0.07, from: "random" },
          delay: 0.5,
          ease: "back.out(2.4)",
        });
      });

      quickRotX.current = gsap.quickTo(logoWrap.current, "rotationX", {
        duration: 0.5,
        ease: "power3.out",
      });
      quickRotY.current = gsap.quickTo(logoWrap.current, "rotationY", {
        duration: 0.5,
        ease: "power3.out",
      });

      // Semua stempel disiapkan tak terlihat, titik pusatnya di tengah elemen
      gsap.set(".trail-stamp", { xPercent: -50, yPercent: -50, opacity: 0 });
    },
    { scope: container }
  );

  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tilt logo ---------- */

  const handleStageMove = contextSafe(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion() || !stage.current) return;
      const rect = stage.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      quickRotY.current?.(px * MAX_TILT * 2);
      quickRotX.current?.(-py * MAX_TILT * 2);
    }
  );

  const resetTilt = contextSafe(() => {
    quickRotX.current?.(0);
    quickRotY.current?.(0);
  });

  const setPressed = contextSafe((down: boolean) => {
    gsap.to(logoWrap.current, {
      scale: down ? 0.96 : 1,
      duration: 0.25,
      ease: "power3.out",
    });
  });

  const handleStageUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    setPressed(false);
    if (e.pointerType !== "mouse") resetTilt();
  };

  /* ---------- Cursor trail ---------- */

  const stamp = contextSafe(
    (x: number, y: number, fly?: { dx: number; dy: number }) => {
      const stamps = gsap.utils.toArray<HTMLElement>(
        ".trail-stamp",
        container.current
      );
      if (!stamps.length) return;

      const el = stamps[poolIdx.current % stamps.length];
      poolIdx.current += 1;

      const angle = gsap.utils.random(-30, 30);
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { x, y, scale: 0.5, rotation: angle, opacity: 0.9 },
        {
          x: x + (fly?.dx ?? 0),
          y: y + (fly?.dy ?? 0),
          scale: fly ? 0.8 : 1.15,
          rotation: angle + gsap.utils.random(-40, 40),
          opacity: 0,
          duration: fly ? 0.8 : 1,
          ease: "power2.out",
        }
      );
    }
  );

  const handleTrailMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion() || !container.current) return;
    const r = container.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const last = lastPos.current;
    if (last && Math.hypot(x - last.x, y - last.y) < STEP) return;

    lastPos.current = { x, y };
    stamp(x, y);
  };

  const handleTrailDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion() || !container.current) return;
    if ((e.target as HTMLElement).closest("a, button")) return;

    const r = container.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const count = 6;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + gsap.utils.random(0, 0.5);
      const d = gsap.utils.random(70, 120);
      stamp(x, y, { dx: Math.cos(a) * d, dy: Math.sin(a) * d });
    }
  };

  /* ---------- Salin hashtag ---------- */

  const copyHashtag = async () => {
    try {
      await navigator.clipboard.writeText(HASHTAG);
    } catch {
      // Abaikan kalau Clipboard API tidak tersedia
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      ref={container}
      onPointerMove={handleTrailMove}
      onPointerDown={handleTrailDown}
      onPointerLeave={() => {
        lastPos.current = null;
      }}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Wallpaper collage */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={bg} className="absolute inset-0 will-change-transform">
          <Image
            src="/hero/collage-wallpaper.png"
            alt="Kumpulan momen di balik layar VOXNATIVE"
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale contrast-110"
          />
        </div>
      </div>

      {/* Gradasi gelap supaya logo, hashtag & badge tetap kontras */}
      <div
        ref={overlay}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.88)_60%,#000_100%)]"
        style={{ opacity: 0.88 }}
      />

      {/* Lapisan stempel trail, di atas wallpaper, di bawah konten */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      >
        {Array.from({ length: POOL }).map((_, i) => (
          <span
            key={i}
            className="trail-stamp absolute left-0 top-0 h-11 w-10 bg-contain bg-center bg-no-repeat opacity-0 will-change-transform"
            style={{ backgroundImage: "url(/vox-mark-sm.png)" }}
          />
        ))}
      </div>

      {/* Badge sticker, hanya desktop */}
      <div className="hero-fade pointer-events-none absolute inset-0 z-[3] hidden md:block">
        {badges.map((b) => (
          <a
            key={b.label}
            href="#segments"
            data-rotate={b.rotate}
            style={{
              background: b.color,
              boxShadow: "3px 3px 0 #000",
              transform: `rotate(${b.rotate}deg)`,
            }}
            className={`badge-orbit pointer-events-auto absolute inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-black font-bold italic uppercase tracking-tight text-black transition-transform duration-200 hover:scale-110 ${b.big ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs"
              } ${b.pos}`}
          >
            <span aria-hidden>{b.emoji}</span>
            {b.label}
          </a>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div
          ref={stage}
          onPointerMove={handleStageMove}
          onPointerLeave={resetTilt}
          onPointerDown={() => setPressed(true)}
          onPointerUp={handleStageUp}
          onPointerCancel={handleStageUp}
          className="hero-fade touch-none select-none py-6 [perspective:900px]"
        >
          <div
            ref={logoWrap}
            className="w-[78vw] max-w-md will-change-transform drop-shadow-[0_25px_50px_rgba(255,255,255,0.08)] md:max-w-xl"
          >
            <Image
              src="/vox-native-logo.png"
              alt="VOX Native"
              width={3147}
              height={436}
              draggable={false}
              sizes="(min-width: 768px) 576px, 78vw"
              className="h-auto w-full select-none"
              loading="eager"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={copyHashtag}
          className="hero-fade group relative text-2xl font-bold italic tracking-tight text-neutral-300 transition-colors hover:text-white md:text-4xl"
        >
          {HASHTAG}
        </button>

        {/* Baris chip sticker, hanya HP */}
        <div className="hero-fade -mx-6 flex gap-3 overflow-x-auto px-6 pb-2 md:hidden">
          {badges.map((b) => (
            <a
              key={b.label}
              href="#segments"
              style={{
                background: b.color,
                boxShadow: "3px 3px 0 #000",
                transform: `rotate(${b.rotate}deg)`,
              }}
              className="badge-chip inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-black px-3.5 py-2 text-xs font-bold italic uppercase tracking-tight text-black"
            >
              <span aria-hidden>{b.emoji}</span>
              {b.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hero-fade rounded-full bg-white px-8 py-3 font-bold italic text-black"
        >
          Kolaborasi dengan VOX
        </a>
      </div>
    </section>
  );
}