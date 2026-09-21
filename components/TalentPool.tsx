"use client";

import { useState } from "react";

const roles = [
  "Content Creator",
  "Videographer & Editor",
  "Social Media Specialist",
  "Copywriter",
  "Magang / Internship",
];

const inputClass =
  "w-full rounded-none border-2 border-black bg-transparent px-4 py-3 text-base font-bold italic placeholder:font-normal placeholder:not-italic placeholder:text-neutral-400 focus:bg-black focus:text-white focus:outline-none";

export default function TalentPool() {
  const [picked, setPicked] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const toggle = (r: string) =>
    setPicked((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const ready = picked.length > 0 && name.trim().length > 0;

  const message = [
    `Halo VOX! Saya ${name.trim() || "..."}.`,
    `Saya tertarik bergabung sebagai: ${
      picked.length ? picked.join(", ") : "..."
    }.`,
    link.trim() ? `Portofolio: ${link.trim()}` : null,
    "Mohon kabari saya kalau ada lowongan yang dibuka.",
  ]
    .filter(Boolean)
    .join("\n");

  const href = `mailto:career@vox.id?subject=${encodeURIComponent(
    `Talent Pool VOX: ${name.trim()}`
  )}&body=${encodeURIComponent(message)}`;

  return (
    <section className="bg-white px-6 py-24 text-black md:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:gap-20">
        {/* Kiri: pilih peran */}
        <div>
          <p className="mb-4 text-sm uppercase tracking-widest text-neutral-500">
            Talent pool
          </p>
          <h2 className="text-5xl font-bold italic leading-none md:text-7xl">
            Masuk daftar
            <br />
            tunggu.
          </h2>
          <p className="mb-3 mt-10 text-sm font-bold uppercase tracking-widest">
            1. Peran yang kamu minati
          </p>

          <ul className="border-t-2 border-black">
            {roles.map((r) => {
              const on = picked.includes(r);
              return (
                <li key={r} className="border-b-2 border-black">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(r)}
                    className={`flex w-full items-center justify-between gap-4 px-3 py-4 text-left transition-colors duration-200 ${
                      on ? "bg-black text-white" : ""
                    }`}
                  >
                    <span>
                      <span className="block text-xl font-bold italic md:text-2xl">
                        {r}
                      </span>
                      <span className="text-xs uppercase tracking-widest opacity-60">
                        Belum dibuka
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border-2 border-current px-3 py-1 text-sm font-bold italic">
                      {on ? "✓ Diminati" : "+ Minati"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Kanan: form + preview */}
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest">
            2. Kenalan dulu
          </p>
          <div className="space-y-3">
            <label className="block">
              <span className="sr-only">Nama</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                autoComplete="name"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="sr-only">Link portofolio</span>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link portofolio / Instagram / Drive"
                autoComplete="url"
                className={inputClass}
              />
            </label>
          </div>

          <p className="mb-3 mt-8 text-sm font-bold uppercase tracking-widest">
            3. Pesan kamu
          </p>
          <div
            aria-live="polite"
            className="whitespace-pre-line break-words rounded-3xl rounded-br-md bg-black p-6 text-base leading-relaxed text-white md:text-lg"
          >
            {message}
          </div>

            <a
            href={ready ? href : undefined}
            aria-disabled={!ready}
            className={`mt-6 inline-block self-end rounded-full border-2 border-black px-8 py-3 font-bold italic transition-opacity ${
              ready ? "" : "pointer-events-none opacity-30"
            }`}
          >
            Kirim via Email →
          </a>
          <p className="mt-3 text-right text-xs text-neutral-500">
            Aplikasi email kamu akan terbuka. Lampirkan CV di sana.
          </p>
        </div>
      </div>
    </section>
  );
}