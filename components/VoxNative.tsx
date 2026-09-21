"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categories = ["Hotel", "Cafe", "Kuliner", "Wisata", "Brand"];

export default function VoxNative() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".native-row", {
          x: -60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: "top 70%" },
        });
      });
    },
    { scope: container }
  );

  return (
    <section
     id="platform"
      ref={container}
      className="bg-white px-6 py-28 text-black md:py-40"
    >
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-neutral-500">
          Segera hadir
        </p>
        <h2 className="mb-12 text-5xl font-bold italic md:text-8xl">
          VOX Native
        </h2>

        <ul className="border-t-2 border-black">
          {categories.map((c, i) => (
            <li
              key={c}
              className="native-row flex items-center justify-between border-b-2 border-black py-5 text-3xl font-bold italic md:py-7 md:text-6xl"
            >
              <span>
                <span className="mr-4 text-base font-normal not-italic text-neutral-500 md:text-xl">
                  0{i + 1}
                </span>
                {c}
              </span>
              <span aria-hidden>→</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}