import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PlatformExplorer from "@/components/PlatformExplorer";
import BriefBuilder from "@/components/BriefBuilder";

export const metadata: Metadata = {
  title: "Platform | VOX Media Partner Bandung",
  description:
    "Jangkau audiens Bandung lewat Instagram, TikTok, dan Threads VOX. Susun kolaborasi brand kamu sekarang.",
};

export default function PlatformPage() {
  return (
    <main className="pt-16">
      <Reveal className="px-6 pb-8 pt-24 md:pb-12 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <p
            data-reveal
            className="mb-6 text-sm uppercase tracking-widest text-neutral-500"
          >
            Platform
          </p>
          <h1
            data-reveal
            className="text-6xl font-bold italic leading-[0.9] tracking-tighter md:text-9xl"
          >
            Satu suara,
            <br />
            tiga panggung.
          </h1>
          <p data-reveal className="mt-8 max-w-xl text-lg text-neutral-400">
            Pilih platform di bawah untuk melihat bagaimana VOX bercerita di
            tiap panggung.
          </p>
        </div>
      </Reveal>

      <PlatformExplorer />
      <BriefBuilder />

      <Reveal className="px-6 py-24 text-center md:py-36">
        <div className="mx-auto max-w-4xl">
          <h2
            data-reveal
            className="text-5xl font-bold italic leading-none md:text-8xl"
          >
            Punya ide
            <br />
            lain?
          </h2>
          <Link
            data-reveal
            href="/#contact"
            className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-lg font-bold italic text-black"
          >
            Ngobrol dengan VOX
          </Link>
          <p data-reveal className="mt-16 text-sm text-neutral-600">
            © {new Date().getFullYear()} VOX. Bandung.
          </p>
        </div>
      </Reveal>
    </main>
  );
}