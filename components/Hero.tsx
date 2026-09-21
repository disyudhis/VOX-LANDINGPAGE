"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-title", { y: 80, opacity: 0, duration: 1 })
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white"
    >
      <h1 className="hero-title text-6xl font-bold tracking-tight md:text-8xl">
        VOX
      </h1>
      <p className="hero-sub max-w-xl text-lg text-neutral-400">
        Tagline VOX kamu di sini.
      </p>
      <a
        href="#features"
        className="hero-cta rounded-full bg-white px-8 py-3 font-medium text-black"
      >
        Mulai
      </a>
    </section>
  );
}