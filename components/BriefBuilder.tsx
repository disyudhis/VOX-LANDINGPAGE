"use client";

import { useState } from "react";
import { platforms, type PlatformId } from "@/lib/platforms";
import PlatformIcon from "./PlatformIcon";

const goals = ["Awareness", "Engagement", "Penjualan", "Grand opening"];

export default function BriefBuilder() {
  const [picked, setPicked] = useState<PlatformId[]>([]);
  const [goal, setGoal] = useState(goals[0]);

  const toggle = (id: PlatformId) =>
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const names = platforms
    .filter((p) => picked.includes(p.id))
    .map((p) => p.name);

  const message =
    names.length > 0
      ? `Halo VOX! Kami ingin kolaborasi.\nPlatform: ${names.join(", ")}\nTujuan: ${goal}`
      : "Pilih minimal satu platform dulu ya...";

  const href = `https://wa.me/62XXXXXXXXXX?text=${encodeURIComponent(message)}`;
  const ready = names.length > 0;

  return (
    <section className="bg-white px-6 py-24 text-black md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="mb-4 text-sm uppercase tracking-widest text-neutral-500">
            Brief builder
          </p>
          <h2 className="text-5xl font-bold italic leading-none md:text-8xl">
            Susun
            <br />
            kolaborasimu.
          </h2>

          <p className="mb-3 mt-10 text-sm font-bold uppercase tracking-widest">
            1. Platform
          </p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => {
              const on = picked.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(p.id)}
                  className={`flex items-center gap-2 rounded-full border-2 border-black px-5 py-2.5 font-bold italic transition-colors ${
                    on ? "bg-black text-white" : ""
                  }`}
                >
                  <PlatformIcon id={p.id} className="h-5 w-5" />
                  {p.name}
                </button>
              );
            })}
          </div>

          <p className="mb-3 mt-8 text-sm font-bold uppercase tracking-widest">
            2. Tujuan
          </p>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={goal === g}
                onClick={() => setGoal(g)}
                className={`rounded-full border-2 border-black px-5 py-2.5 font-bold italic transition-colors ${
                  goal === g ? "bg-black text-white" : ""
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Bubble chat */}
        <div className="flex flex-col justify-center">
          <div
            aria-live="polite"
            className="whitespace-pre-line rounded-3xl rounded-br-md bg-black p-6 text-lg leading-relaxed text-white md:p-8 md:text-xl"
          >
            {message}
          </div>
                <a
          
            href={ready ? href : undefined}
            aria-disabled={!ready}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 inline-block self-end rounded-full border-2 border-black px-8 py-3 font-bold italic transition-opacity ${
              ready ? "" : "pointer-events-none opacity-30"
            }`}
          >
            Kirim via WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}