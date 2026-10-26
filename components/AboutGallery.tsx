"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Category = { label: string; src?: string };

const categories: Category[] = [
    { label: "Global News Digest" },
    { label: "Culture & Pop Trends" },
    { label: "Reels & Video Production" },
    { label: "Community & Skena Moments" },
];

const stats = [
    { value: "100K+", label: "Monthly Readers" },
    { value: "50+", label: "Cultural & Brand Collaborations" },
    { value: "100%", label: "Independent Content" },
];

const stripes: CSSProperties = {
    backgroundImage:
        "repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 14px)",
};

// Drag-to-scroll khusus mouse di desktop. Sentuhan tetap pakai swipe native.
function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let dragging = false;
        let startX = 0;
        let startScroll = 0;

        const onDown = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            dragging = true;
            startX = e.clientX;
            startScroll = el.scrollLeft;
            el.style.cursor = "grabbing";
        };
        const onMove = (e: PointerEvent) => {
            if (!dragging) return;
            el.scrollLeft = startScroll - (e.clientX - startX);
        };
        const onUp = () => {
            dragging = false;
            el.style.cursor = "";
        };

        el.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        return () => {
            el.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
    }, [ref]);
}

export default function AboutGallery() {
    const container = useRef<HTMLElement>(null);
    const track = useRef<HTMLDivElement>(null);
    useDragScroll(track);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                gsap.from(".ag-fade", {
                    y: 20,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".ag-head", start: "top 85%", once: true },
                });

                gsap.from(".ag-card", {
                    y: 24,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power3.out",
                    scrollTrigger: { trigger: track.current, start: "top 85%", once: true },
                });

                gsap.from(".ag-stat", {
                    y: 16,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".ag-stats", start: "top 88%", once: true },
                });
            });
        },
        { scope: container }
    );

    return (
        <section ref={container} className="border-t border-black/10 bg-white px-6 py-24 text-black md:py-36">
            <div className="ag-head mx-auto mb-10 max-w-6xl md:mb-14">
                <p className="ag-fade mb-4 text-sm uppercase tracking-widest text-neutral-500">
                    Editorial proof
                </p>
                <h2 className="ag-fade text-5xl font-bold italic leading-none tracking-tight md:text-7xl">
                    Bukan cuma ngomong.
                </h2>
            </div>

            <div
                ref={track}
                className="-mx-6 flex cursor-grab gap-5 overflow-x-auto px-6 pb-2 select-none md:mx-0 md:px-0"
            >
                <div className="hidden shrink-0 md:block md:w-[calc((100vw-72rem)/2-1.5rem)]" aria-hidden />
                {categories.map((c) => (
                    <div key={c.label} className="ag-card w-[72vw] max-w-[20rem] shrink-0 md:w-80">
                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                            {c.src ? (
                                <Image
                                    src={c.src}
                                    alt={c.label}
                                    fill
                                    sizes="(min-width: 768px) 320px, 72vw"
                                    className="object-cover grayscale"
                                />
                            ) : (
                                <div className="absolute inset-0" style={stripes} />
                            )}
                        </div>
                        <p className="mt-3 text-sm font-bold italic">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="ag-stats mx-auto mt-16 grid max-w-6xl grid-cols-1 divide-y divide-black/10 border-y border-black/10 md:mt-24 md:grid-cols-3 md:divide-x md:divide-y-0">
                {stats.map((s) => (
                    <div key={s.label} className="ag-stat flex flex-col items-start gap-1 py-8 md:items-center md:py-10">
                        <p className="text-5xl font-bold italic leading-none tracking-tight md:text-6xl">{s.value}</p>
                        <p className="text-sm text-neutral-500 md:text-center">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}