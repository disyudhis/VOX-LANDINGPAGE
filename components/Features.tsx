"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  { title: "Fitur Satu", desc: "Deskripsi singkat." },
  { title: "Fitur Dua", desc: "Deskripsi singkat." },
  { title: "Fitur Tiga", desc: "Deskripsi singkat." },
];

export default function Features() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".feature-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        },
      });
    },
    { scope: container }
  );

  return (
    <section
      id="features"
      ref={container}
      className="min-h-screen bg-neutral-950 px-6 py-32 text-white"
    >
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="feature-card rounded-2xl border border-neutral-800 p-8"
          >
            <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
            <p className="text-neutral-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}