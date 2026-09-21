"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".about-line", {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: "top 75%" },
        });
      });
    },
    { scope: container }
  );

  return (
    <section id="about" ref={container} className="px-6 py-28 md:py-40">
      <div className="mx-auto max-w-4xl">
        <p className="about-line mb-6 text-sm uppercase tracking-widest text-neutral-500">
          Tentang VOX
        </p>
        <h2 className="about-line text-4xl font-bold italic leading-tight md:text-7xl">
          Suara dari Bandung, untuk siapa saja yang mau didengar.
        </h2>
        <p className="about-line mt-8 max-w-xl text-lg text-neutral-400">
          Ganti paragraf ini dengan cerita singkat VOX: siapa kalian, kenapa
          disebut pioneer, dan apa yang bikin beda.
        </p>
      </div>
    </section>
  );
}