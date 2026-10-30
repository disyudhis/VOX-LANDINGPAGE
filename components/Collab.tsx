"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Closing chapter. Menggantikan isi Collab.tsx lama; id="contact" tetap, jadi link
 * "#contact" di Hero dan "/#contact" di Navbar tetap berfungsi.
 *
 * TUJUAN CTA
 *  - Isi WHATSAPP_NUMBER dengan nomor asli (angka saja, mis. "628123456789") → CTA "Hubungi Kami" ke WhatsApp.
 *  - Selama masih kosong, CTA memakai profil Instagram yang sudah dipakai di situs ini
 *    (tidak ada link palsu). Ubah CTA_FALLBACK kalau kamu ingin tujuan lain.
 */
const WHATSAPP_NUMBER = ""; // contoh: "628123456789"
const IG_URL = "https://www.instagram.com/voxnative/";

const waNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
const CTA_FALLBACK = { href: IG_URL, label: "Hubungi lewat Instagram" };
const CTA = waNumber
  ? { href: `https://wa.me/${waNumber}`, label: "Hubungi Kami" }
  : CTA_FALLBACK;

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Platform", href: "/platform" },
  { label: "Career", href: "/career" },
];

// Warna sama dengan label kategori di Hero & "Yang kami bikin"
const pills = [
  { t: "News", bg: "#38BDF8", rot: -8, pos: "right-[9%] top-[12%]" },
  { t: "Meme", bg: "#D7FF3F", rot: 7, pos: "right-[22%] top-[30%]" },
  { t: "Challenge", bg: "#FF3B30", rot: -5, pos: "right-[6%] top-[40%]", light: true },
];

const grainStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  backgroundRepeat: "repeat",
};

/** Memecah teks per huruf supaya bisa jatuh bergantian (dan "MOVE." bisa bergetar). */
function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="cl-c inline-block will-change-transform">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </>
  );
}

type Props = { deck?: boolean; active?: boolean };

export default function Collab({ deck = false, active = true }: Props) {
  const container = useRef<HTMLElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const ready = useRef(false); // hover-shake baru aktif setelah animasi masuk selesai

  // Getar singkat pada "MOVE." (dipakai saat masuk dan saat di-hover). Berakhir tepat di posisi semula.
  const shake = makeShake(container);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string | Element | null, start: string) => ({ trigger, start, once: true });

        // Mode deck: SATU timeline yang diputar saat slide aktif. CTA tetap masuk lebih awal (0,25 dtk).
        if (deck) {
          const d = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
          d.from(".cl-eyebrow", { opacity: 0, y: 12, duration: 0.6 }, 0)
            .from(".cl-cta", { opacity: 0, y: 18, duration: 0.6 }, 0.25)
            .from(".cl-c", { yPercent: 115, rotate: 7, duration: 0.85, ease: "back.out(1.6)", stagger: 0.03 }, 0.1)
            .call(
              () => {
                ready.current = true;
                shake();
              },
              undefined,
              1.7
            )
            .from(".cl-copy", { opacity: 0, y: 14, duration: 0.7 }, 0.5)
            .fromTo(
              ".cl-logo",
              { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.out", clearProps: "clipPath" },
              0.6
            )
            .from(".cl-foot", { opacity: 0, y: 10, duration: 0.6 }, 0.9)
            .fromTo(
              ".cl-pill",
              { scale: 0, rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot) - 26 },
              {
                scale: 1,
                rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot),
                duration: 0.6,
                ease: "back.out(2.4)",
                stagger: 0.1,
              },
              1.0
            );
          d.progress(0);
          introRef.current = d;
          return () => {
            introRef.current = null;
          };
        }

        // 1) Headline + label kategori: begitu bab ini masuk layar
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: once(container.current, "top 65%"),
        });
        tl.from(".cl-eyebrow", { opacity: 0, y: 12, duration: 0.6 }, 0)
          .from(
            ".cl-c",
            { yPercent: 115, rotate: 7, duration: 0.85, ease: "back.out(1.6)", stagger: 0.03 },
            0.1
          )
          // Jadwalkan SESUDAH huruf terakhir selesai jatuh (≈ 1,65 dtk) supaya tidak bentrok
          .call(
            () => {
              ready.current = true;
              shake();
            },
            undefined,
            1.7
          )
          .fromTo(
            ".cl-pill",
            { scale: 0, rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot) - 26 },
            {
              scale: 1,
              rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot),
              duration: 0.6,
              ease: "back.out(2.4)",
              stagger: 0.1,
            },
            1.0
          );

        // 2) Paragraf, CTA, wordmark, footer: masing-masing dipicu posisinya sendiri.
        gsap.from(".cl-copy", { opacity: 0, y: 14, duration: 0.7, ease: "power3.out", scrollTrigger: once(".cl-copy", "top 92%") });
        gsap.from(".cl-cta", { opacity: 0, y: 18, duration: 0.6, ease: "power3.out", scrollTrigger: once(".cl-cta", "top 96%") });
        gsap.fromTo(
          ".cl-logo",
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "expo.out",
            clearProps: "clipPath",
            scrollTrigger: once(".cl-logo", "top 96%"),
          }
        );
        gsap.from(".cl-foot", { opacity: 0, y: 10, duration: 0.6, ease: "power3.out", scrollTrigger: once(".cl-foot", "top 98%") });
      });
    },
    { scope: container, dependencies: [deck], revertOnUpdate: true }
  );

  // Mode deck: putar saat slide aktif, tahan di awal saat tidak
  useEffect(() => {
    if (!deck) return;
    const tl = introRef.current;
    if (!tl) return;
    ready.current = false;
    if (active) tl.restart();
    else tl.pause(0);
  }, [active, deck]);

  return (
    <section
      id="contact"
      ref={container}
      className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden border-t border-white/15 bg-black px-6 pb-8 pt-20 md:px-10 md:pb-10 md:pt-24 md:motion-safe:h-full md:motion-safe:min-h-0"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]" style={grainStyle} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]"
      />

      {/* Label kategori kecil (gema dari Hero), desktop saja */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] hidden md:block">
        {pills.map((p) => (
          <span
            key={p.t}
            data-rot={p.rot}
            style={{
              background: p.bg,
              color: p.light ? "#fff" : "#000",
              transform: `rotate(${p.rot}deg)`,
              boxShadow: "3px 3px 0 #000",
            }}
            className={`cl-pill absolute rounded-full border-2 border-black px-3.5 py-1.5 text-xs font-bold uppercase italic tracking-tight ${p.pos}`}
          >
            {p.t}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="cl-eyebrow text-sm uppercase tracking-widest text-neutral-500">Punya brand? Ayo kolaborasi.</p>

        <h2
          aria-label="Let's make something move."
          onPointerEnter={() => ready.current && shake()}
          className="mt-4 font-bold italic leading-[0.86] tracking-tight text-[clamp(2.8rem,13.5vw,4.4rem)] md:text-[clamp(3.5rem,min(11vw,15.5svh),10.5rem)]"
        >
          <span className="cl-line block overflow-hidden pb-[0.1em] pr-[0.06em]" aria-hidden>
            <Chars text="LET'S MAKE" />
          </span>
          <span className="cl-line block overflow-hidden pb-[0.1em] pr-[0.06em] md:pl-[6vw]" aria-hidden>
            <Chars text="SOMETHING" />
          </span>
          <span
            className="cl-line cl-move block overflow-hidden pb-[0.1em] pr-[0.06em] text-vox-lime md:pl-[2vw]"
            aria-hidden
          >
            <Chars text="MOVE." />
          </span>
        </h2>

        <div className="mt-10 flex flex-col gap-6 md:mt-12 md:flex-row md:items-center md:justify-between">
          <p className="cl-copy max-w-md text-lg text-neutral-400">
            Kami terbuka untuk kolaborasi review brand, hotel, cafe, dan lainnya.
          </p>

          <a
            href={CTA.href}
            target="_blank"
            rel="noopener noreferrer"
            className="cl-cta group inline-flex w-fit items-center gap-3 rounded-full bg-white px-9 py-4 text-lg font-bold italic text-black transition-colors duration-200 hover:bg-vox-lime focus-visible:bg-vox-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {CTA.label}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
            >
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* Penutup: wordmark (gema Hero) + footer yang sama seperti sebelumnya */}
      <div className="relative z-10 mx-auto mt-16 flex w-full max-w-6xl flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
        <Image
          src="/vox-native-logo.png"
          alt="VOX Native"
          width={3147}
          height={436}
          sizes="(min-width: 768px) 360px, 70vw"
          className="cl-logo h-auto w-[min(70vw,360px)]"
        />

        <footer className="cl-foot flex flex-col gap-3 text-sm text-neutral-500 md:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white focus-visible:text-white">
                {l.label}
              </Link>
            ))}
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white focus-visible:text-white"
            >
              Instagram
            </a>
          </nav>
          <p className="text-neutral-600">© {new Date().getFullYear()} VOXNATIVE.</p>
        </footer>
      </div>
    </section>
  );
}

/**
 * Getaran singkat huruf "MOVE.". Dipakai dari timeline maupun event hover;
 * selalu berakhir di rotasi 0 (yoyo dengan jumlah ulang genap, dimulai dari 0).
 */
function makeShake(container: React.RefObject<HTMLElement | null>) {
  return () => {
    if (typeof window === "undefined" || !container.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = container.current.querySelectorAll<HTMLElement>(".cl-move .cl-c");
    if (!chars.length) return;
    gsap.killTweensOf(chars, "rotation");
    gsap.to(chars, {
      rotation: () => gsap.utils.random(-9, 9),
      duration: 0.07,
      repeat: 3,
      yoyo: true,
      ease: "none",
      stagger: 0.015,
      overwrite: "auto",
    });
  };
}