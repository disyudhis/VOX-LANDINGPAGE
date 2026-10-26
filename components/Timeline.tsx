"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Placeholder. Ganti dengan histori VOX yang sebenarnya.
const milestones = [
  { year: "2019", title: "Titik mula", desc: "Satu kamera, satu rasa penasaran terhadap cerita-cerita kecil di Bandung." },
  { year: "2020", title: "Konten pertama tembus ribuan", desc: "Video pertama yang menunjukkan ada audiens yang menunggu cerita berikutnya." },
  { year: "2021", title: "Kolaborasi brand pertama", desc: "Brand lokal pertama mempercayakan ceritanya pada VOX." },
  { year: "2022", title: "Lahirnya VOX Native", desc: "Format review hotel, kafe, dan kuliner resmi jadi identitas baru." },
  { year: "2023", title: "VOXTIZEN terbentuk", desc: "Dari penonton jadi komunitas yang ikut turun langsung ke acara VOX." },
  { year: "2024", title: "Ekspansi platform", desc: "Hadir penuh di Instagram, TikTok, dan Threads dengan gaya bertutur khas VOX." },
];

export default function Timeline() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: track digeser horizontal, section dikunci selama itu
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const getDistance = () => el.scrollWidth - el.parentElement!.clientWidth;

        const tween = gsap.to(el, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        const progressTween = gsap.to(progress.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          progressTween.scrollTrigger?.kill();
        };
      });

      // Mobile & reduce-motion: kartu muncul biasa, tanpa pin
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.from(".timeline-card", {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: section }
  );

  return (
    <section ref={section} className="relative overflow-hidden border-t border-white/15 bg-black">
      <div className="flex flex-col justify-center px-6 py-24 md:h-screen md:py-0">
        <div className="mb-10 md:mb-14 md:px-6">
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Perjalanan
          </p>
          <h2 className="mt-2 text-5xl font-bold italic leading-none md:text-7xl">
            Dari mana kami mulai.
          </h2>
        </div>

        <div className="mb-8 hidden h-px bg-white/15 md:mx-6 md:block">
          <div ref={progress}
            className="h-full bg-white"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }} />
        </div>

        <div className="overflow-x-auto pb-4 md:overflow-visible md:pb-0">
          <div ref={track} className="flex w-max snap-x snap-mandatory gap-4 px-6 md:gap-6">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className="timeline-card w-[78vw] shrink-0 snap-start rounded-2xl border border-white/15 p-6 md:w-[26rem] md:p-10"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  0{i + 1} / 0{milestones.length}
                </p>
                <p className="mt-6 text-6xl font-bold italic leading-none tracking-tighter md:text-8xl">
                  {m.year}
                </p>
                <h3 className="mt-6 text-2xl font-bold italic md:text-3xl">
                  {m.title}
                </h3>
                <p className="mt-3 text-neutral-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-neutral-500 md:hidden">
          Geser untuk lihat perjalanan selengkapnya →
        </p>
      </div>
    </section>
  );
}