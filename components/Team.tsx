"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Person = {
  name: string;
  role: string;
  quote: string;
  bio?: string;
  photo?: string; // mis. "/team/nama.jpg". Kosongkan kalau belum ada foto
  instagram?: string;
};

// Placeholder. Ganti dengan data tim VOX yang sebenarnya.
const founder: Person = {
  name: "Nama Founder",
  role: "Founder & Creative Lead",
  quote: "Cerita yang jujur selalu menang.",
  bio: "Ganti dengan cerita singkat founder: kenapa VOX dimulai, dan apa yang ingin dibangun bersama audiens Gen Z.",
  photo: undefined, // "/team/founder.jpg"
  instagram: "https://instagram.com/USERNAME",
};

// Tambah atau hapus objek sesuai jumlah anggota tim
const members: Person[] = [
  {
    name: "Nama Anggota",
    role: "Videographer",
    quote: "Frame yang tepat bisa bicara lebih dari caption.",
    photo: undefined, // "/team/videographer.jpg"
  },
  {
    name: "Nama Anggota",
    role: "Content Writer",
    quote: "Kata-kata yang sederhana, tapi kena.",
    photo: undefined,
  },
  {
    name: "Nama Anggota",
    role: "Video Editor",
    quote: "Lima detik pertama menentukan segalanya.",
    photo: undefined,
  },
  {
    name: "Nama Anggota",
    role: "Community Lead",
    quote: "VOXTIZEN itu bukan followers, tapi teman.",
    photo: undefined,
  },
];

const stripes: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 14px)",
};
const outline: CSSProperties = {
  color: "transparent",
  WebkitTextStroke: "2px #fff",
};

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/* Foto kalau ada, placeholder kalau belum */
function Portrait({
  person,
  sizes,
  initialsClass,
}: {
  person: Person;
  sizes: string;
  initialsClass: string;
}) {
  if (person.photo) {
    return (
      <Image
        src={person.photo}
        alt={`${person.name}, ${person.role}`}
        fill
        sizes={sizes}
        className="object-cover object-top grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
      />
    );
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-neutral-950"
      style={stripes}
    >
      <span
        className={`font-bold italic leading-none ${initialsClass}`}
        style={outline}
      >
        {initials(person.name)}
      </span>
      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-neutral-600">
        Foto segera hadir
      </span>
    </div>
  );
}

export default function Team() {
  const section = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Judul
        gsap.from(".team-head", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".team-head", start: "top 85%", once: true },
        });

        // Teks founder muncul bertahap
        gsap.from(".founder-fade", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".founder", start: "top 75%", once: true },
        });

        // Kartu anggota muncul bergantian
        const cards = gsap.utils.toArray<HTMLElement>(".member-card");
        gsap.set(cards, { opacity: 0, y: 40 });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      });

      // Parallax foto founder, hanya desktop
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".founder-photo",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".founder",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: section }
  );

  return (
    <section
      id="team"
      ref={section}
      className="border-t border-white/15 bg-black px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        {/* Judul */}
        <p className="team-head mb-4 text-sm uppercase tracking-widest text-neutral-500">
          Tim
        </p>
        <h2 className="team-head mb-16 text-5xl font-bold italic leading-none md:mb-24 md:text-8xl">
          Orang-orang
          <br />
          di balik VOX.
        </h2>

        {/* ===== Founder ===== */}
        <div className="founder grid items-center gap-8 md:grid-cols-12 md:gap-14">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/20 md:col-span-5">
            <div
              className="founder-photo absolute inset-x-0"
              style={{ top: "-10%", bottom: "-10%" }}
            >
              <Portrait
                person={founder}
                sizes="(min-width: 768px) 40vw, 92vw"
                initialsClass="text-[9rem] md:text-[11rem]"
              />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold italic text-black">
              Founder
            </span>
          </div>

          <div className="md:col-span-7">
            <p className="founder-fade mb-4 text-sm uppercase tracking-widest text-neutral-500">
              00 · {founder.role}
            </p>
            <h3 className="founder-fade text-5xl font-bold italic leading-[0.95] tracking-tighter md:text-7xl">
              {founder.name}
            </h3>
            <p className="founder-fade mt-8 text-2xl font-bold italic leading-snug md:text-4xl">
              “{founder.quote}”
            </p>
            {founder.bio && (
              <p className="founder-fade mt-6 max-w-lg text-neutral-400 md:text-lg">
                {founder.bio}
              </p>
            )}
            {founder.instagram && (
              <a
                href={founder.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="founder-fade mt-8 inline-block rounded-full border-2 border-white px-6 py-2.5 text-sm font-bold italic"
              >
                Instagram ↗
              </a>
            )}
          </div>
        </div>

        {/* ===== Anggota tim ===== */}
        <div className="mb-8 mt-24 flex items-end justify-between border-t border-white/15 pt-8 md:mt-36">
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Anggota tim
          </p>
          <p className="text-xs text-neutral-500 md:hidden">
            Tap kartu untuk baca kutipan
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {members.map((m, i) => {
            const isOpen = open === i;
            return (
              <li key={`${m.name}-${i}`} className="member-card">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/20">
                    <Portrait
                      person={m}
                      sizes="(min-width: 768px) 22vw, 46vw"
                      initialsClass="text-7xl md:text-8xl"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                      0{i + 1}
                    </span>
                    <div
                      className={`absolute inset-x-0 bottom-0 bg-white p-4 text-black transition-transform duration-300 group-focus-visible:translate-y-0 group-hover:translate-y-0 ${isOpen ? "translate-y-0" : "translate-y-full"
                        }`}
                    >
                      <p className="text-sm font-bold italic leading-snug">
                        “{m.quote}”
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xl font-bold italic leading-none md:text-2xl">
                    {m.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">{m.role}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}