"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { DeckApi } from "@/components/home/HomeDeck";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const IG_URL = "https://www.instagram.com/voxnative/";

type Variant = "photo" | "text" | "reel";
type Post = { text: string; src?: string; url?: string };

type Segment = {
  id: string;
  label: string;
  tag: "Core business" | "Segmen baru";
  color: string;
  variant: Variant;
  posts: Post[];
};

const segments: Segment[] = [
  {
    id: "news",
    label: "News",
    tag: "Core business",
    color: "#38BDF8",
    variant: "photo",
    posts: [
      {
        text: "Guru ini rela gendong muridnya yang disabilitas saat study tour biar ia juga bisa bahagia kayak teman-temannya yang lain.",
        src: "/feeds/news.jpg",
      },
      { text: "Kota ini baru saja buka taman baru di tengah pusat kota." },
    ],
  },
  {
    id: "studi",
    label: "Studi Ilmiah",
    tag: "Core business",
    color: "#A78BFA",
    variant: "photo",
    posts: [
      {
        text: "Survei: Gen Z jadi generasi paling gak bahagia di dunia.",
        src: "/feeds/studi.jpg",
      },
      { text: "Riset: orang yang tidur cukup ternyata lebih jarang baper." },
    ],
  },
  {
    id: "meme",
    label: "Meme",
    tag: "Core business",
    color: "#D7FF3F",
    variant: "photo",
    posts: [
      {
        text: "Kurang profesional apalagi coba, muak-muak gini tetap gue jalanin.",
        src: "/feeds/meme.jpg",
      },
      { text: "Pas gajian vs pas tanggal tua, orangnya beda." },
    ],
  },
  {
    id: "quote",
    label: "Quote",
    tag: "Core business",
    color: "#FF6B9A",
    variant: "text",
    posts: [
      {
        text: "Kalau ditanya kurang apa, GUE KURANG TIDUR, kalo kurang sabar GA MUNGKIN.",
        src: "/feeds/quote.jpg",
      },
      { text: "Gak semua harus dijelasin, ada yang cukup dijalanin." },
    ],
  },
  {
    id: "review",
    label: "Review",
    tag: "Segmen baru",
    color: "#FF3B30",
    variant: "reel",
    posts: [
      {
        text: "Staycation di rooftop pool, worth it?",
        url: IG_URL,
        src: "/reels/review.jpg",
      },
      { text: "Kafe hidden gem di utara Bandung", url: IG_URL },
    ],
  },
  {
    id: "cinematic",
    label: "Cinematic",
    tag: "Segmen baru",
    color: "#FF3B30",
    variant: "reel",
    posts: [
      {
        text: "POV: golden hour di Braga.",
        url: IG_URL,
        src: "/reels/cinematic.jpg",
      },
      { text: "Satu menit, seribu rasa.", url: IG_URL },
    ],
  },
  {
    id: "challenge",
    label: "Challenge",
    tag: "Segmen baru",
    color: "#FF3B30",
    variant: "reel",
    posts: [
      {
        text: "Habisin seblak level 50 dalam 3 menit.",
        url: IG_URL,
        src: "/reels/challenge.jpg",
      },
      { text: "VOXTIZEN vs 10 pedagang, siapa paling jujur?", url: IG_URL },
    ],
  },
];

// Post teks tanpa gambar masih berupa placeholder, jadi tidak ditampilkan. Datanya tetap ada di
// atas; begitu post kedua diberi `src` (gambar asli) ia otomatis muncul lagi sebagai thumbnail.
const SEGMENTS: Segment[] = segments.map((s) => {
  const withImage = s.posts.filter((p) => p.src);
  return { ...s, posts: withImage.length ? withImage : s.posts.slice(0, 1) };
});

const stripes: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 14px)",
};

const grainStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  backgroundRepeat: "repeat",
};

function ReelIcon({ label, className }: { label: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (label === "Review")
    return (
      <svg {...common} className={className} aria-hidden>
        <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
      </svg>
    );
  if (label === "Cinematic")
    return (
      <svg {...common} className={className} aria-hidden>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M7 6l2 4M13 6l2 4" />
      </svg>
    );
  return (
    <svg {...common} className={className} aria-hidden>
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}

function FrameContent({ seg, post }: { seg: Segment; post: Post }) {
  if (post.src) {
    return (
      <Image
        src={post.src}
        alt={post.text}
        fill
        sizes="(min-width: 768px) 420px, 80vw"
        className="object-contain"
      />
    );
  }

  if (seg.variant === "text") {
    const dark = seg.id === "quote";
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center p-8 text-center ${
          dark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {dark && (
          <Image
            src="/vox-mark-sm.png"
            alt=""
            width={1911}
            height={2040}
            className="pointer-events-none absolute -right-10 -top-6 h-48 w-auto rotate-12 opacity-[0.08]"
          />
        )}
        <p className="relative text-xl font-bold italic leading-snug md:text-2xl">
          {post.text}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" style={stripes}>
      {seg.variant === "reel" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/70 text-xl text-white">
            ▶
          </span>
        </div>
      )}
      <p className="absolute inset-x-5 bottom-5 text-base font-bold italic leading-snug text-white">
        {post.text}
      </p>
    </div>
  );
}

function Panel({
  seg,
  activeIndex,
  onPick,
  panelRef,
}: {
  seg: Segment;
  activeIndex: number;
  onPick: (i: number) => void;
  panelRef: (el: HTMLDivElement | null) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const post = seg.posts[activeIndex];
  const isReel = seg.variant === "reel";

  useGSAP(
    () => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          frameRef.current,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }
        );
      });
    },
    { scope: frameRef, dependencies: [activeIndex], revertOnUpdate: true }
  );

  const frame = (
    <div className="seg-frame relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-white/15 bg-black">
      <div ref={frameRef} className="absolute inset-0">
        <FrameContent seg={seg} post={post} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black"
          style={{ background: seg.color }}
        >
          {isReel && <ReelIcon label={seg.label} className="mr-1 inline h-3 w-3" />}
          {seg.label}
        </span>
        {seg.posts.length > 1 && (
          <span className="rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
            {activeIndex + 1}/{seg.posts.length}
          </span>
        )}
      </div>

      {isReel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 text-xl text-white">
            ▶
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={panelRef}
      className="segment-panel w-[76vw] max-w-[20rem] shrink-0 snap-start md:w-[min(20rem,34svh)] md:motion-safe:w-[min(20rem,28svh)]"
    >
      {isReel && post.url ? (
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="group block">
          {frame}
        </a>
      ) : (
        frame
      )}

      {seg.posts.length > 1 && (
        <div className="mt-3 flex gap-1.5">
          {seg.posts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onPick(i)}
              aria-pressed={i === activeIndex}
              className={`h-10 w-8 shrink-0 overflow-hidden rounded-sm border transition-opacity ${
                i === activeIndex
                  ? "border-white opacity-100"
                  : "border-white/20 opacity-45 hover:opacity-75"
              }`}
            >
              {p.src ? (
                <Image
                  src={p.src}
                  alt=""
                  width={32}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-neutral-900 text-[10px] text-neutral-500">
                  {i + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type SlideProps = {
  deck?: boolean;
  active?: boolean;
  step?: number;
  api?: DeckApi;
};

/**
 * Dua mode:
 *  - deck (desktop/tablet, motion boleh): tanpa pin dan tanpa scroll. Kartu digeser per "langkah" oleh deck
 *    (wheel/swipe/panah). Setelah langkah terakhir, gestur berikutnya pindah ke slide berikutnya.
 *  - biasa (HP / reduced-motion): daftar kartu bisa digeser dengan jari, animasi masuk lewat ScrollTrigger.
 */
export default function VoxNative({ deck = false, active = true, step = 0, api }: SlideProps) {
  const container = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetsRef = useRef<number[]>([0]);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const apiRef = useRef(api);
  apiRef.current = api;

  const [activeSeg, setActiveSeg] = useState(0);
  const [activePost, setActivePost] = useState<number[]>(() => SEGMENTS.map(() => 0));

  const pickPost = (segIndex: number, postIndex: number) => {
    setActivePost((prev) => {
      const next = [...prev];
      next[segIndex] = postIndex;
      return next;
    });
  };

  /* ---------- Mode deck: ukur langkah & geser kartu ---------- */

  // Offset geser per langkah = jarak antar kartu; langkah terakhir dijepit ke ujung daftar.
  const measure = () => {
    const el = track.current;
    if (!el || !el.parentElement) return;
    const max = Math.max(0, el.scrollWidth - el.parentElement.clientWidth);
    const p0 = panelRefs.current[0];
    const p1 = panelRefs.current[1];
    const pitch = p0 && p1 ? p1.offsetLeft - p0.offsetLeft : 340;
    const n = max > 0 ? Math.ceil(max / pitch) : 0;
    offsetsRef.current = Array.from({ length: n + 1 }, (_, k) => Math.min(k * pitch, max));
    apiRef.current?.setSteps(n + 1);
  };

  const applyStep = (instant = false) => {
    const offs = offsetsRef.current;
    const k = Math.min(step, offs.length - 1);
    const off = offs[k];
    const dur = instant ? 0 : 0.85;
    gsap.to(track.current, { x: -off, duration: dur, ease: "power3.inOut", overwrite: true });
    gsap.to(progress.current, {
      scaleX: offs.length > 1 ? k / (offs.length - 1) : 1,
      duration: dur,
      ease: "power3.inOut",
      overwrite: true,
    });
    const base = panelRefs.current[0]?.offsetLeft ?? 0;
    let idx = 0;
    panelRefs.current.forEach((p, i) => {
      if (p && p.offsetLeft - base <= off + 40) idx = i;
    });
    if (offs.length > 1 && k === offs.length - 1) idx = SEGMENTS.length - 1;
    setActiveSeg(idx);
  };
  const applyRef = useRef(applyStep);
  applyRef.current = applyStep;

  const jumpTo = (index: number) => {
    const panelEl = panelRefs.current[index];
    if (!panelEl) return;

    if (deck && apiRef.current) {
      const base = panelRefs.current[0]?.offsetLeft ?? 0;
      const target = panelEl.offsetLeft - base;
      const offs = offsetsRef.current;
      let best = 0;
      offs.forEach((o, k) => {
        if (Math.abs(o - target) < Math.abs(offs[best] - target)) best = k;
      });
      apiRef.current.goStep(best);
      return;
    }
    panelEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* ================= MODE DECK ================= */
      if (deck) {
        mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          let raf = 0;
          const remeasure = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
              measure();
              applyRef.current(true);
            });
          };
          measure();
          applyRef.current(true);
          window.addEventListener("resize", remeasure);

          // Animasi masuk satu rangkaian; ditahan di awal dan diputar saat slide aktif
          const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
          tl.from(".vn-eyebrow, .seg-meta-wrap", { opacity: 0, y: 12, duration: 0.6 }, 0)
            .from(".seg-rule", { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "expo.out" }, 0)
            .from(".vn-line > span", { yPercent: 118, rotate: 5, skewY: 6, duration: 0.95 }, 0.1)
            .from(
              ".segment-panel .seg-frame",
              {
                clipPath: "inset(100% 0% 0% 0%)",
                y: 40,
                duration: 0.85,
                stagger: 0.07,
                ease: "power3.out",
                clearProps: "clipPath,transform",
              },
              0.35
            )
            .from(".seg-corner", { opacity: 0, duration: 0.5, stagger: 0.05 }, 0.5)
            .from(".seg-deckbar > *", { opacity: 0, y: 12, duration: 0.6, stagger: 0.1 }, 0.9);
          tl.progress(0);
          introRef.current = tl;

          return () => {
            window.removeEventListener("resize", remeasure);
            cancelAnimationFrame(raf);
            tl.kill();
            introRef.current = null;
            gsap.set(track.current, { clearProps: "transform" });
          };
        });
        return;
      }

      /* ================= MODE BIASA (HP / reduced-motion) ================= */

      // Judul masuk per baris, sama seperti bahasa gerak halaman About.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".vn-line > span", {
          yPercent: 118,
          rotate: 5,
          skewY: 6,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: stage.current, start: "top 75%", once: true },
        });
        gsap.from(".vn-eyebrow", {
          opacity: 0,
          y: 12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: stage.current, start: "top 75%", once: true },
        });
        gsap.from(".seg-rule", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: stage.current, start: "top 75%", once: true },
        });
        // Penutup bab: baris besar naik, tombol "Lanjut" menyusul
        gsap.from(".seg-outro-line > span", {
          yPercent: 118,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: ".seg-outro-line", start: "top 90%", once: true },
        });
        gsap.from(".seg-outro-next", {
          opacity: 0,
          y: 14,
          duration: 0.7,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: { trigger: ".seg-outro-line", start: "top 90%", once: true },
        });
      });

      // HP: kartu masuk saat daftar kartu terlihat (bukan saat bagian atas bab terlihat)
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(".segment-panel", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: track.current, start: "top 92%", once: true },
        });
      });

      // HP: segmen yang sedang terlihat di daftar geser menjadi segmen aktif (filter ikut menyala)
      mm.add("(max-width: 767px)", () => {
        const root = track.current?.parentElement;
        if (!root) return;
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              const i = panelRefs.current.indexOf(e.target as HTMLDivElement);
              if (i >= 0) setActiveSeg(i);
            });
          },
          { root, threshold: 0.6 }
        );
        panelRefs.current.forEach((p) => p && io.observe(p));
        return () => io.disconnect();
      });
    },
    { scope: container, dependencies: [deck], revertOnUpdate: true }
  );

  // Deck: geser kartu mengikuti langkah dari deck
  useEffect(() => {
    if (!deck) return;
    applyStep(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, deck]);

  // Deck: putar animasi masuk saat slide aktif, tahan di awal saat tidak
  useEffect(() => {
    if (!deck) return;
    const tl = introRef.current;
    if (!tl) return;
    if (active) tl.restart();
    else tl.pause(0);
  }, [active, deck]);

  // Label segmen aktif di header berganti dengan gerak singkat
  const labelMounted = useRef(false);
  useGSAP(
    () => {
      if (!labelMounted.current) {
        labelMounted.current = true;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".seg-active",
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
        );
      });
    },
    { scope: container, dependencies: [activeSeg] }
  );

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="segments"
      ref={container}
      className="relative overflow-hidden border-t border-white/15 bg-black md:motion-safe:h-full"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={grainStyle}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]"
      />

      <div
        ref={stage}
        className="relative flex flex-col justify-center px-6 py-24 md:motion-reduce:h-svh md:motion-reduce:py-0 md:motion-safe:h-full md:motion-safe:pb-3 md:motion-safe:pt-20"
      >
        {/* Sudut penanda ala lembar kontak (dekoratif, desktop) */}
        <span aria-hidden className="seg-corner absolute left-6 top-24 hidden h-1 w-1 bg-white/60 md:block" />
        <span aria-hidden className="seg-corner absolute right-6 top-24 hidden h-1 w-1 bg-white/60 md:block" />
        <span aria-hidden className="seg-corner absolute bottom-8 left-6 hidden h-1 w-1 bg-white/60 md:block" />
        <span aria-hidden className="seg-corner absolute bottom-8 right-6 hidden h-1 w-1 bg-white/60 md:block" />

        <div className="mb-8 md:mx-6 md:mb-6 md:motion-safe:mr-12">
          <div className="seg-rule h-px bg-white/25" aria-hidden />
          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <p className="vn-eyebrow text-sm uppercase tracking-widest text-neutral-500">Now showing</p>
              <h2 className="mt-2 text-5xl font-bold italic leading-none md:text-[clamp(2.4rem,9svh,4.5rem)]">
                <span className="vn-line block overflow-hidden pb-[0.1em] pr-[0.06em]">
                  <span className="inline-block">Yang kami bikin.</span>
                </span>
              </h2>
            </div>

            {/* Penanda segmen aktif (desktop): angka + nama, mengikuti geser kartu */}
            <div className="seg-meta-wrap hidden shrink-0 text-right md:block" aria-hidden>
              <p className="text-xs font-bold tracking-widest text-neutral-500">
                {pad(activeSeg + 1)} / {pad(SEGMENTS.length)}
              </p>
              <p
                className="seg-active mt-1 overflow-hidden text-3xl font-bold italic uppercase leading-none"
                style={{ color: SEGMENTS[activeSeg].color }}
              >
                {SEGMENTS[activeSeg].label}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-start gap-x-8 gap-y-4 md:mx-6">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Feeds · Core business
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SEGMENTS.map((s, i) =>
                s.tag === "Core business" ? (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-pressed={activeSeg === i}
                    className="rounded-full border px-3.5 py-1.5 text-xs font-bold italic transition-colors"
                    style={{
                      borderColor: activeSeg === i ? s.color : "rgba(255,255,255,0.2)",
                      background: activeSeg === i ? s.color : "transparent",
                      color: activeSeg === i ? "#000" : "#fff",
                    }}
                  >
                    {s.label}
                  </button>
                ) : null
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#FF3B30]">
              Reels · Segmen baru
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SEGMENTS.map((s, i) =>
                s.tag === "Segmen baru" ? (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-pressed={activeSeg === i}
                    className={`flex items-center gap-1.5 rounded-full border border-[#FF3B30] px-3.5 py-1.5 text-xs font-bold italic transition-colors ${
                      activeSeg === i ? "bg-[#FF3B30] text-black" : "text-white hover:bg-[#FF3B30]/10"
                    }`}
                  >
                    <ReelIcon label={s.label} className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 h-px bg-white/15 md:mx-6">
          <div ref={progress} className="h-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
        </div>

        <div className="overflow-x-auto pb-2 md:overflow-visible md:pb-0 md:motion-reduce:overflow-x-auto">
          <div ref={track} className="flex w-max snap-x snap-mandatory items-start gap-5 px-6 md:gap-7">
            {SEGMENTS.map((seg, i) => (
              <Panel
                key={seg.id}
                seg={seg}
                activeIndex={activePost[i]}
                onPick={(p) => pickPost(i, p)}
                panelRef={(el) => {
                  panelRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-neutral-500 md:hidden">
          Geser untuk lihat semua segmen →
        </p>

        {/* Bar bawah (hanya mode deck): pengganti blok penutup besar */}
        <div className="seg-deckbar mt-5 hidden items-center justify-between gap-4 md:mx-6 md:motion-safe:mr-12 md:motion-safe:flex">
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-xl font-bold italic transition-transform duration-300 hover:translate-x-2 focus-visible:translate-x-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Lihat semua di Instagram <span aria-hidden>↗</span>
          </a>
          <a
            href="#career"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-xs font-bold uppercase italic tracking-widest transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
          >
            Lanjut: Join our team <span aria-hidden>↓</span>
          </a>
        </div>
      </div>

      {/* Penutup bab untuk scroll biasa (HP / reduced-motion) */}
      <div className="relative border-t border-white/15 px-6 py-16 md:px-16 md:py-24 md:motion-safe:hidden">
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-fit font-bold italic leading-none"
        >
          <span className="seg-outro-line block overflow-hidden pb-[0.1em] pr-[0.06em] text-4xl md:text-7xl">
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-3">
              Lihat semua di Instagram ↗
            </span>
          </span>
        </a>

        <a
          href="#career"
          className="seg-outro-next mt-10 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-xs font-bold uppercase italic tracking-widest transition-colors hover:bg-white hover:text-black"
        >
          Lanjut: Join our team <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}