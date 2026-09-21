"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const BARS = 20;

export default function Hero() {
    const container = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                gsap.from(".hero-word", {
                    yPercent: 110,
                    duration: 1.1,
                    ease: "power4.out",
                });

                gsap.from(".hero-fade", {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    delay: 0.5,
                    ease: "power3.out",
                });

                gsap.to(".wave-bar", {
                    scaleY: "random(0.15, 1)",
                    duration: 0.6,
                    ease: "sine.inOut",
                    repeat: -1,
                    repeatRefresh: true,
                    stagger: { each: 0.05, from: "center" },
                });
            });
        },
        { scope: container }
    );

    return (
        <section ref={container} className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
            <h1 className="overflow-hidden text-[34vw] font-bold italic leading-[0.85] tracking-tighter md:text-[22vw]">
                <span className="hero-word inline-block">VOX</span>
            </h1>

            <div aria-hidden className="hero-fade flex h-24 items-center gap-1.5 md:h-32 md:gap-2.5">
                {Array.from({ length: BARS }).map((_, i) => (
                    <div key={i} className="wave-bar h-full w-1.5 rounded-full bg-white will-change-transform md:w-2.5" />
                ))}
            </div>

            <p className="hero-fade max-w-md text-lg text-neutral-400">
                Media partner pioneer di Bandung.
            </p>

            <a href="#contact" className="hero-fade rounded-full bg-white px-8 py-3 font-bold italic text-black">
                Kolaborasi dengan VOX
            </a>
        </section>
    );
}
