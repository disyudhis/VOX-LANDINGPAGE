"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const headlineWords = "Global News, Pop Culture, and Everything In-Between.".split(" ");

const stripes: CSSProperties = {
    backgroundImage:
        "repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 14px)",
};

type Img = { caption: string; src?: string };

// Isi src begitu foto editorial asli ada.
const images: Img[] = [
    { caption: "Redaksi VOXNATIVE, Bandung." },
    { caption: "Di balik layar produksi konten." },
];

export default function AboutHero() {
    const container = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                gsap
                    .timeline({ defaults: { ease: "power3.out" } })
                    .from(".ah-word", { yPercent: 110, duration: 0.8, stagger: 0.035, ease: "power4.out" })
                    .from(".ah-fade", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.5");

                gsap.from(".ah-img", {
                    y: 36,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".ah-gallery", start: "top 85%", once: true },
                });
            });
        },
        { scope: container }
    );

    return (
        <section ref={container} className="relative overflow-hidden bg-white text-black">
            <Image
                src="/vox-mark.png"
                alt=""
                width={1911}
                height={2040}
                loading="eager"
                className="pointer-events-none absolute -right-16 -top-16 h-[34rem] w-auto invert opacity-[0.03] md:-right-10 md:-top-24 md:h-[46rem]"
            />

            <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 md:pb-20 md:pt-40">
                <span className="ah-fade mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-black/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-neutral-600 md:mb-10">
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    VOXNATIVE • Media &amp; Culture
                </span>

                <h1 className="text-5xl font-bold italic leading-[1.03] tracking-tight md:text-8xl lg:text-[6.25rem]">
                    {headlineWords.map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden pb-[0.1em] pr-[0.22em] align-bottom">
                            <span className="ah-word inline-block">{word}</span>
                        </span>
                    ))}
                </h1>

                <p className="ah-fade mt-8 max-w-2xl text-lg text-neutral-600 md:mt-10 md:text-xl">
                    Tempat paling pas buat mantengin update berita dunia, nemenin waktu
                    luang lewat racikan meme, quote, dan konten harian redaksi. Nggak
                    kaku, tanpa basa-basi, dan pas buat scrolling harianmu.
                </p>
            </div>

            <div className="ah-gallery mx-auto max-w-6xl px-6 pb-24 md:pb-32">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
                    <figure className="ah-img md:col-span-7">
                        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                            {images[0].src ? (
                                <Image
                                    src={images[0].src}
                                    alt={images[0].caption}
                                    fill
                                    sizes="(min-width: 768px) 58vw, 92vw"
                                    className="object-cover grayscale"
                                />
                            ) : (
                                <div className="absolute inset-0" style={stripes} />
                            )}
                        </div>
                        <figcaption className="mt-3 text-xs italic text-neutral-500">
                            {images[0].caption}
                        </figcaption>
                    </figure>

                    <figure className="ah-img md:col-span-5 md:pt-10">
                        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                            {images[1].src ? (
                                <Image
                                    src={images[1].src}
                                    alt={images[1].caption}
                                    fill
                                    sizes="(min-width: 768px) 40vw, 92vw"
                                    className="object-cover grayscale"
                                />
                            ) : (
                                <div className="absolute inset-0" style={stripes} />
                            )}
                        </div>
                        <figcaption className="mt-3 text-xs italic text-neutral-500">
                            {images[1].caption}
                        </figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
}