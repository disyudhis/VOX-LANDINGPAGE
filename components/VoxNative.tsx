"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

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
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-white/15 bg-black">
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
        <span className="rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
          {activeIndex + 1}/{seg.posts.length}
        </span>
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
      className="segment-panel w-[76vw] max-w-[20rem] shrink-0 snap-start md:w-[22rem]"
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

export default function VoxNative() {
  const container = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);

  const [activeSeg, setActiveSeg] = useState(0);
  const [activePost, setActivePost] = useState<number[]>(() => segments.map(() => 0));

  const pickPost = (segIndex: number, postIndex: number) => {
    setActivePost((prev) => {
      const next = [...prev];
      next[segIndex] = postIndex;
      return next;
    });
  };

  const jumpTo = (index: number) => {
    const panelEl = panelRefs.current[index];
    if (!panelEl) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (!isDesktop) {
      panelEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      return;
    }

    const st = stRef.current;
    const el = track.current;
    if (!st || !el) return;
    const total = el.scrollWidth - el.parentElement!.clientWidth;
    const fraction = gsap.utils.clamp(0, 1, panelEl.offsetLeft / total);
    const targetY = st.start + fraction * (st.end - st.start);
    gsap.to(window, { duration: 1, ease: "power2.inOut", scrollTo: { y: targetY, autoKill: true } });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const getDistance = () => el.scrollWidth - el.parentElement!.clientWidth;

        // trigger = stage.current (BLOK UTUH h-svh), bukan lagi anak di dalamnya.
        // Ini kunci perbaikannya: ruang scroll tambahan sekarang terhitung benar
        // di alur dokumen, jadi section sesudahnya tidak lagi menabrak.
        const tween = gsap.to(el, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const dist = self.progress * getDistance();
              let idx = 0;
              panelRefs.current.forEach((p, i) => {
                if (p && p.offsetLeft <= dist + 40) idx = i;
              });
              setActiveSeg(idx);
            },
          },
        });
        stRef.current = tween.scrollTrigger ?? null;

        const progressTween = gsap.to(progress.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          progressTween.scrollTrigger?.kill();
          stRef.current = null;
        };
      });

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.from(".segment-panel", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: stage.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: container }
  );

  return (
    <section
      id="segments"
      ref={container}
      className="relative overflow-hidden border-t border-white/15 bg-black"
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
        className="relative flex flex-col justify-center px-6 py-24 md:h-svh md:py-0"
      >
        <div className="mb-8 md:mx-6 md:mb-10">
          <p className="text-sm uppercase tracking-widest text-neutral-500">Now showing</p>
          <h2 className="mt-2 text-5xl font-bold italic leading-none md:text-7xl">
            Yang kami bikin.
          </h2>
        </div>

        <div className="mb-6 flex flex-wrap items-start gap-x-8 gap-y-4 md:mx-6">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Feeds · Core business
            </p>
            <div className="flex flex-wrap gap-1.5">
              {segments.map((s, i) =>
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
              {segments.map((s, i) =>
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

        <div className="mb-6 h-px bg-white/15 md:mx-6">
          <div ref={progress} className="h-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
        </div>

        <div className="overflow-x-auto pb-2 md:overflow-visible md:pb-0">
          <div ref={track} className="flex w-max snap-x snap-mandatory items-start gap-5 px-6 md:gap-7">
            {segments.map((seg, i) => (
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
      </div>

      <div className="relative border-t border-white/15 px-6 py-16 text-center md:py-20">
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border-2 border-white px-8 py-3 font-bold italic"
        >
          Lihat semua di Instagram ↗
        </a>
      </div>
    </section>
  );
}