import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import BrandPartners from "@/components/BrandPartners";

export const metadata: Metadata = {
    title: "Tentang VOX | Media Partner Pioneer di Bandung",
    description:
        "Kenali VOX, media partner pioneer di Bandung, VOX Native, dan brand yang pernah berkolaborasi dengan kami.",
};

export default function AboutPage() {
    return (
        <main className="pt-16">
            {/* Intro */}
            <Reveal className="px-6 pb-20 pt-24 md:pb-32 md:pt-40">
                <div className="mx-auto max-w-6xl">
                    <p data-reveal className="mb-6 text-sm uppercase tracking-widest text-neutral-500">
                        Tentang VOX
                    </p>
                    <h1 data-reveal className="text-5xl font-bold italic leading-[0.95] tracking-tighter md:text-9xl">
                        Kami bukan sekadar media. Kami suara kota.
                    </h1>
                    <p data-reveal className="mt-8 max-w-xl text-lg text-neutral-400">
                        Ganti paragraf ini dengan cerita VOX: kapan mulai, kenapa disebut
                        pioneer, dan apa yang membedakan kalian.
                    </p>
                </div>
            </Reveal>

            {/* Angka */}
            <div className="mx-auto max-w-6xl px-6">
                <Stats />
            </div>

            {/* Apa yang kami lakukan */}
            <Reveal className="px-6 py-24 md:py-36">
                <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
                    <div data-reveal className="border border-white/25 p-8 md:p-12">
                        <p className="text-sm text-neutral-500">01</p>
                        <h2 className="mb-4 mt-16 text-4xl font-bold italic md:text-6xl">
                            VOX
                        </h2>
                        <p className="text-neutral-400">
                            Media partner pioneer di Bandung. Menghubungkan brand dengan
                            audiens lewat konten yang dekat dengan kehidupan kota.
                        </p>
                    </div>
                    <div data-reveal className="bg-white p-8 text-black md:p-12">
                        <p className="text-sm text-neutral-500">02</p>
                        <h2 className="mb-4 mt-16 text-4xl font-bold italic md:text-6xl">
                            VOX Native
                        </h2>
                        <p className="text-neutral-700">
                            Review jujur hotel, cafe, kuliner, dan brand. Terbuka untuk
                            kolaborasi review bersama VOX.
                        </p>
                    </div>
                </div>
            </Reveal>

            {/* Brand partner */}
            <BrandPartners />

            {/* CTA */}
            <Reveal className="border-t border-white/25 px-6 py-24 text-center md:py-36">
                <div className="mx-auto max-w-4xl">
                    <h2 data-reveal className="text-5xl font-bold italic leading-none md:text-8xl">
                        Brand kamu
                        <br />
                        berikutnya?
                    </h2>
                    <Link
                        data-reveal
                        href="/#contact"
                        className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-lg font-bold italic text-black"
                    >
                        Ayo kolaborasi
                    </Link>
                    <p data-reveal className="mt-16 text-sm text-neutral-600">
                        © {new Date().getFullYear()} VOX. Bandung.
                    </p>
                </div>
            </Reveal>
        </main>
    );
}