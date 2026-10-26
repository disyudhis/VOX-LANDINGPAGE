"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const points = [
    "Kami adalah media independen yang ngobrolin berita, budaya pop, dan segala hal di antaranya.",
    "Bukan cuma nulis, kami bikin kamu paham — dan kadang ketawa.",
    "Dari Reels santai sampai riset yang bikin mikir.",
    "Satu suara. Banyak cerita.",
];

const stripes: CSSProperties = {
    backgroundImage:
        "repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 14px)",
};

export default function AboutWhoWeAre() {
    const container = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                gsap.from(".www-word", {
                    yPercent: 110,
                    duration: 0.7,
                    stagger: 0.04,
                    ease: "power4.out",
                    scrollTrigger: { trigger: ".www-title", start: "top 85%", once: true },
                });

                gsap.from(".www-point", {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".www-list", start: "top 82%", once: true },
                });

                gsap.from(".www-img", {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".www-img", start: "top 85%", once: true },
                });
            });
        },
        { scope: container }
    );

    return (
        <section ref={container} className="border-t border-black/10 bg-white px-6 py-24 text-black md:py-36">
            <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-7">
                    <p className="mb-4 text-sm uppercase tracking-widest text-neutral-500">Who we are</p>
                    <h2 className="www-title mb-12 text-5xl font-bold italic leading-none tracking-tight md:mb-16 md:text-7xl">
                        {"Nggak Cuma Nulis Berita.".split(" ").map((w, i) => (
                            <span key={i} className="inline-block overflow-hidden pb-[0.08em] pr-[0.18em] align-bottom">
                                <span className="www-word inline-block">{w}</span>
                            </span>
                        ))}
                    </h2>

                    <ul className="www-list space-y-8">
                        {points.map((p, i) => (
                            <li key={i} className="www-point flex gap-6 border-b border-black/10 pb-8">
                                <span className="shrink-0 text-sm text-neutral-400">0{i + 1}</span>
                                <p className="text-xl font-bold italic leading-snug md:text-2xl">{p}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gambar diam di tempat selagi kamu baca daftar di samping — murni CSS, selalu mulus */}
                <div className="md:col-span-5">
                    <div className="www-img relative aspect-[3/4] overflow-hidden bg-neutral-100 md:sticky md:top-24">
                        <div className="absolute inset-0" style={stripes} />
                    </div>
                </div>
            </div>
        </section>
    );
}