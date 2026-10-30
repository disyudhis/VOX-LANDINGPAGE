"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HASHTAG = "#OurVoicesAreTheMove";
// Dipecah per kata supaya bisa masuk bergantian. Disambung tanpa spasi = tetap terbaca satu hashtag.
const HASHTAG_PARTS = ["#Our", "Voices", "Are", "The", "Move"];
const MAX_TILT = 14; // derajat tilt logo
const POOL = 18; // jumlah stempel yang didaur ulang
const STEP = 48; // jarak (px) antar stempel saat cursor bergerak

const WALL_SRC = "/hero/collage-wallpaper.png";
// Frame strip hanya tampil kecil (~150px × zoom), jadi pakai versi yang sudah dioptimasi & diperkecil
// oleh Next, bukan PNG mentah. (w=1200, q=75 termasuk nilai bawaan Next.)
const WALL_FRAME_SRC = "/_next/image?url=%2Fhero%2Fcollage-wallpaper.png&w=1200&q=75";

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

/* ------------------------------------------------------------------ */
/* Strip film: tiap frame = "jendela" ke satu area wallpaper kolase.   */
/* Titik tengah tile (fx, fy) = posisi 0–1 di dalam wallpaper.         */
/* Kalau crop terasa meleset, ubah WALL_ASPECT / ZOOM / TILES.         */
/* ------------------------------------------------------------------ */
const WALL_ASPECT = 1.81; // lebar ÷ tinggi wallpaper
const ZOOM = 4.5; // seberapa besar wallpaper diperbesar dalam satu frame (≈ 1 tile per frame)

const TILES: Record<string, [number, number]> = {
  a: [0.075, 0.45],
  b: [0.27, 0.45],
  c: [0.5, 0.45],
  d: [0.73, 0.45],
  e: [0.925, 0.45],
  f: [0.27, 0.8],
  g: [0.5, 0.8],
  h: [0.73, 0.8],
};

function frameStyle(key: string): CSSProperties {
  const [fx, fy] = TILES[key];
  const sx = ZOOM; // lebar gambar ÷ lebar frame
  const sy = (ZOOM * 0.75) / WALL_ASPECT; // frame 3:4 → tinggi gambar ÷ tinggi frame
  const clamp = (v: number) => Math.min(100, Math.max(0, v));
  const px = clamp(((fx * sx - 0.5) / (sx - 1)) * 100);
  const py = clamp(((fy * sy - 0.5) / (sy - 1)) * 100);
  return {
    backgroundImage: `url(${WALL_FRAME_SRC})`,
    backgroundSize: `${ZOOM * 100}% auto`,
    backgroundPosition: `${px}% ${py}%`,
  };
}

type Strip = { id: string; rot: number; speed: number; frames: string[] };

const strips: Strip[] = [
  { id: "s1", rot: -7, speed: 70, frames: ["b", "a", "f"] },
  { id: "s2", rot: 5, speed: 130, frames: ["c", "g", "b"] },
  { id: "s3", rot: 6, speed: 90, frames: ["d", "h", "e"] },
  { id: "s4", rot: -5, speed: 150, frames: ["e", "c", "f"] },
];

const css = `
.hx-strip{position:absolute; z-index:2; will-change:transform}
.hx-s1{left:1%; top:-8%; width:clamp(120px,11vw,190px)}
.hx-s2{left:13.5%; top:30%; width:clamp(110px,10vw,175px)}
.hx-s3{right:12.5%; top:-4%; width:clamp(110px,10vw,175px)}
.hx-s4{right:1%; top:32%; width:clamp(120px,11vw,190px)}
.hx-strip-in{position:relative; background:#080808; border:1px solid #262626; padding:10px 14px; display:flex; flex-direction:column; gap:8px;
  box-shadow:0 18px 40px rgba(0,0,0,.55)}
/* lubang perforasi film di kiri & kanan */
.hx-strip-in::before,.hx-strip-in::after{content:""; position:absolute; top:0; bottom:0; width:5px;
  background:repeating-linear-gradient(to bottom,transparent 0 6px,rgba(255,255,255,.5) 6px 12px)}
.hx-strip-in::before{left:4px}
.hx-strip-in::after{right:4px}
.hx-frame{aspect-ratio:3/4; width:100%; background-color:#111; filter:grayscale(1) contrast(1.12); border:1px solid #1d1d1d}
@media (max-width:1023px){
  .hx-s2,.hx-s4{display:none}
}
@media (max-width:767px){
  .hx-s1{left:-7%; top:6%; width:26vw}
  .hx-s3{right:-7%; top:38%; width:26vw}
  .hx-strip-in{padding:7px 10px; gap:6px}
}
`;

type HeroProps = { active?: boolean; deck?: boolean };

export default function Hero({ active = true, deck = false }: HeroProps) {
  const container = useRef<HTMLElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const logoWrap = useRef<HTMLDivElement>(null);
  const quickRotX = useRef<((v: number) => void) | null>(null);
  const quickRotY = useRef<((v: number) => void) | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const poolIdx = useRef(0);
  const [copied, setCopied] = useState(false);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const wasActive = useRef(active);

  // Mode deck: kembali ke slide ini = pembukaan diputar lagi (sama seperti slide About)
  useEffect(() => {
    if (deck && active && !wasActive.current) introRef.current?.restart();
    wasActive.current = active;
  }, [active, deck]);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* ================= PEMBUKAAN (≈ 1,6 dtk, CTA tidak ditahan) ================= */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        introRef.current = tl;

        // 1. Dinding kolase terbuka seperti celah letterbox, lalu menyusut ke ukuran normal
        tl.fromTo(
          wall.current,
          { clipPath: "inset(46% 0% 46% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut", clearProps: "clipPath" },
          0
        )
          .fromTo(bg.current, { scale: 1.18, yPercent: -4 }, { scale: 1.15, yPercent: -4, duration: 1.6, ease: "expo.out" }, 0)

          // 2. Strip film meluncur masuk berlapis
          .fromTo(
            ".hx-strip",
            { yPercent: 28, opacity: 0, rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot) + 7 },
            {
              yPercent: 0,
              opacity: 1,
              rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot),
              duration: 0.95,
              stagger: 0.09,
            },
            0.15
          )

          // 3. Logo: disapu dari kiri ke kanan, jadi titik fokus pertama
          .fromTo(".hero-stage", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
          .fromTo(
            ".hero-logo-img",
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "expo.out", clearProps: "clipPath" },
            0.35
          )

          // 4. Hashtag masuk kata per kata
          .from(".hx-tok", { yPercent: 115, duration: 0.7, stagger: 0.06 }, 0.6)

          // 5. CTA muncul cepat, tidak menunggu urutan lain
          .from(".hero-cta", { opacity: 0, y: 16, duration: 0.5 }, 0.45)

          // 6. Label kategori menyusul terakhir, pelan, tidak berebut dengan logo
          .from(
            ".badge-orbit, .badge-chip",
            { scale: 0, opacity: 0, duration: 0.55, stagger: { each: 0.07, from: "random" }, ease: "back.out(2.2)" },
            0.95
          )
          .from(".hero-chips", { opacity: 0, duration: 0.4 }, 0.9);

        // Logo melayang sangat pelan (satu-satunya gerak idle)
        if (window.matchMedia("(min-width: 768px)").matches) {
          gsap.to(logoWrap.current, {
            y: -6,
            duration: 4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 1.5,
          });
        }

        /* ================= TRANSISI KELUAR ke "Yang kami bikin" ================= */
        const scrub = {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        } as const;

        // Dinding makin gelap sampai hitam pekat, menyatu dengan section berikutnya
        gsap.fromTo(overlay.current, { opacity: 0.86 }, { opacity: 1, ease: "power1.in", scrollTrigger: scrub });

        // Wallpaper zoom-out pelan
        gsap.fromTo(
          bg.current,
          { scale: 1.15, yPercent: -4 },
          { scale: 1, yPercent: 4, ease: "none", scrollTrigger: scrub, immediateRender: false }
        );

        // Strip film naik dengan kecepatan berbeda-beda (kedalaman halus)
        gsap.utils.toArray<HTMLElement>(".hx-strip").forEach((el) => {
          gsap.to(el, { y: -Number(el.dataset.speed), ease: "none", scrollTrigger: scrub });
        });

        // Konten naik pelan lalu memudar di paruh akhir
        // Badge ikut memudar bersama konten (sebelumnya tertinggal terang setelah logo hilang)
        gsap.to(".hero-badges", { opacity: 0, ease: "power1.in", scrollTrigger: scrub });
        gsap.to(content.current, { yPercent: -14, opacity: 0, ease: "power1.in", scrollTrigger: scrub });
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
      <style>{css}</style>

      {/* Dinding kolase (wallpaper utuh, digelapkan supaya logo tetap jadi fokus) */}
      <div ref={wall} className="absolute inset-0 z-0 overflow-hidden">
        <div ref={bg} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.15)" }}>
          <Image
            src={WALL_SRC}
            alt="Kumpulan momen di balik layar VOXNATIVE"
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale contrast-110"
          />
        </div>
      </div>

      {/* Gradasi gelap: tepi hitam pekat, tengah sedikit terang di balik logo */}
      <div
        ref={overlay}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.88)_60%,#000_100%)] will-change-[opacity]"
        style={{ opacity: 0.86 }}
      />

      {/* Strip film: potongan kolase yang sama, dimiringkan dan ditumpuk di sisi kiri-kanan */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {strips.map((s) => (
          <div
            key={s.id}
            data-rot={s.rot}
            data-speed={s.speed}
            className={`hx-strip hx-${s.id}`}
            style={{ transform: `rotate(${s.rot}deg)` }}
          >
            <div className="hx-strip-in">
              {s.frames.map((k, i) => (
                <div key={i} className="hx-frame" style={frameStyle(k)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lapisan stempel trail */}
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
      <div className="hero-badges pointer-events-none absolute inset-0 z-[3] hidden md:block">
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

      {/* Lebur ke hitam di tepi bawah, menyambung ke section berikutnya */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-28 bg-gradient-to-b from-transparent to-black"
      />

      <div ref={content} className="relative z-10 flex flex-col items-center gap-8">
        <div
          ref={stage}
          onPointerMove={handleStageMove}
          onPointerLeave={resetTilt}
          onPointerDown={() => setPressed(true)}
          onPointerUp={handleStageUp}
          onPointerCancel={handleStageUp}
          className="hero-stage touch-pan-y select-none py-6 [perspective:900px]"
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
              className="hero-logo-img h-auto w-full select-none"
              loading="eager"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={copyHashtag}
          aria-label={HASHTAG}
          className="group relative text-2xl font-bold italic tracking-tight text-neutral-300 transition-colors hover:text-white md:text-4xl"
        >
          {HASHTAG_PARTS.map((p) => (
            <span key={p} aria-hidden className="-mr-[0.06em] inline-block overflow-hidden pb-[0.12em] pr-[0.06em] align-bottom">
              <span className="hx-tok inline-block">{p}</span>
            </span>
          ))}
        </button>

        {/* Baris chip sticker, hanya HP */}
        <div className="hero-chips -mx-6 flex gap-3 overflow-x-auto px-6 pb-2 md:hidden">
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
          className="hero-cta rounded-full bg-white px-8 py-3 font-bold italic text-black"
        >
          Kolaborasi dengan VOX
        </a>
      </div>
    </section>
  );
}