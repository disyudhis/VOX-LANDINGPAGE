import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CareerHero from "@/components/CareerHero";
import TalentPool from "@/components/TalentPool";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Career | VOX Media Partner Bandung",
  description:
    "Saat ini belum ada lowongan di VOX, tapi kamu bisa masuk daftar tunggu talenta dan kami kabari saat posisi dibuka.",
};

const traits = [
  { n: "01", title: "Cinta Bandung", desc: "Tahu kota ini luar dalam, dari gang kecil sampai tempat baru yang lagi hits." },
  { n: "02", title: "Pandai bercerita", desc: "Bisa mengubah satu tempat atau satu produk jadi cerita yang ingin ditonton sampai habis." },
  { n: "03", title: "Jujur & rapi", desc: "Review yang jujur, kerja yang tepat waktu, komunikasi yang jelas." },
];

export default function CareerPage() {
  return (
    <main>
      <CareerHero />

      {/* Yang kami cari */}
      <Reveal className="border-t border-white/25 px-6 py-24 md:py-36">
        <div className="mx-auto max-w-6xl">
          <p data-reveal className="mb-4 text-sm uppercase tracking-widest text-neutral-500">
            Yang kami cari
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {traits.map((t) => (
              <div key={t.n} data-reveal className="border border-white/25 p-8">
                <p className="text-sm text-neutral-500">{t.n}</p>
                <h3 className="mb-3 mt-12 text-3xl font-bold italic md:text-4xl">
                  {t.title}
                </h3>
                <p className="text-neutral-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <TalentPool />
      <Faq />

      <Reveal className="border-t border-white/25 px-6 py-24 text-center md:py-36">
        <div className="mx-auto max-w-4xl">
          <h2 data-reveal className="text-5xl font-bold italic leading-none md:text-8xl">
            Belum siap
            <br />
            gabung?
          </h2>
          <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
              className="rounded-full bg-white px-8 py-3 font-bold italic text-black"
            >
              Kenali VOX dulu
            </Link>
            <Link
              href="/#contact"
              className="rounded-full border-2 border-white px-8 py-3 font-bold italic"
            >
              Hubungi kami
            </Link>
          </div>
          <p data-reveal className="mt-16 text-sm text-neutral-600">
            © {new Date().getFullYear()} VOX. Bandung.
          </p>
        </div>
      </Reveal>
    </main>
  );
}