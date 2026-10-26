"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
    { value: 50, suffix: "+", label: "Brand partner" },
    { value: 120, suffix: "+", label: "Konten review" },
    { value: 3, suffix: "", label: "Tahun berkarya" },
    { value: 300, suffix: "M+", label: "Insight bulanan" },
];

export default function Stats() {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
                    const end = Number(el.dataset.value);
                    const counter = { v: 0 };
                    el.textContent = "0";

                    gsap.to(counter, {
                        v: end,
                        duration: 1.6,
                        ease: "power2.out",
                        snap: { v: 1 },
                        onUpdate: () => {
                            el.textContent = String(counter.v);
                        },
                        scrollTrigger: { trigger: el, start: "top 90%", once: true },
                    });
                });
            });
        },
        { scope: root }
    );

    return (
        <div
            ref={root}
            className="grid grid-cols-2 border-y border-white/25 md:grid-cols-4"
        >
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="border-b border-white/25 p-6 odd:border-r md:border-b-0 md:border-r md:p-8 md:last:border-r-0"
                >
                    <p className="text-5xl font-bold italic tracking-tighter md:text-7xl">
                        <span className="stat-num" data-value={s.value}>
                            {s.value}
                        </span>
                        {s.suffix}
                    </p>
                    <p className="mt-2 text-sm text-neutral-400">{s.label}</p>
                </div>
            ))}
        </div>
    );
}