"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// iOS Safari menciutkan/membesarkan toolbar saat scroll dan itu memicu "resize" (tinggi saja).
// Tanpa ini ScrollTrigger menghitung ulang posisi pin dan layar terasa melompat.
ScrollTrigger.config({ ignoreMobileResize: true });

const NAV_OFFSET = 64; // tinggi navbar (h-16), dipakai saat klik link #anchor

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Posisi pin dihitung dari tinggi halaman. Hitung ulang setelah font & aset selesai dimuat,
    // supaya section sesudah pin tidak bergeser.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    // Hormati prefers-reduced-motion: biarkan scroll native, tanpa momentum tambahan
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic, kerasa "mengerem" halus
    });

    // Satu RAF loop dipakai bareng GSAP, supaya Lenis & ScrollTrigger tidak saling kejar
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Menu mobile (Navbar) mengunci scroll lewat body { overflow: hidden }, tapi Lenis tetap
    // menggeser halaman di belakangnya. Hentikan Lenis selama menu terbuka.
    // Mode deck homepage (data-deck di <html>) juga menghentikan Lenis: slide digerakkan oleh deck, bukan scroll.
    const syncLock = () => {
      if (document.body.style.overflow === "hidden" || document.documentElement.hasAttribute("data-deck")) lenis.stop();
      else lenis.start();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-deck"] });
    syncLock();

    // Klik link #segments, #contact, dst ikut discroll halus oleh Lenis,
    // bukan lompat instan ala browser bawaan
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -NAV_OFFSET });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("load", refresh);
      lockObserver.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}