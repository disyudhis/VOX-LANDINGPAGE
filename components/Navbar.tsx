"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";


gsap.registerPlugin(useGSAP, ScrollTrigger);

const links = [
    { label: "About", href: "/about" },
    { label: "Platform", href: "/platform" },
    { label: "Career", href: "/career" },
    { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const header = useRef<HTMLElement>(null);
    const overlay = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useGSAP(
        () => {
            // 1. Sembunyi saat scroll turun, muncul saat scroll naik
            let hidden = false;
            ScrollTrigger.create({
                start: 0,
                end: "max",
                onUpdate: (self) => {
                    const shouldHide = self.direction === 1 && self.scroll() > 80;
                    if (shouldHide === hidden) return;
                    hidden = shouldHide;
                    gsap.to(header.current, {
                        yPercent: hidden ? -100 : 0,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true,
                    });
                },
            });

            // 2. Timeline buka/tutup menu mobile
            const reduce = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            tl.current = gsap
                .timeline({ paused: true, defaults: { ease: "power3.out" } })
                .to(overlay.current, { autoAlpha: 1, duration: reduce ? 0 : 0.3 })
                .from(
                    ".menu-link",
                    { yPercent: 110, duration: reduce ? 0 : 0.7, stagger: 0.08 },
                    "-=0.1"
                );
        },
        { scope: root }
    );

    useEffect(() => {
        if (open) tl.current?.play();
        else tl.current?.reverse();

        document.body.style.overflow = open ? "hidden" : "";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <div ref={root}>
            <header
                ref={header}
                className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-black"
            >
                <nav
                    aria-label="Navigasi utama"
                    className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
                >
                    <a
                        href="#"
                        onClick={() => setOpen(false)}
                        className="text-2xl font-bold italic tracking-tighter"
                    >
                        VOX
                    </a>

                    {/* Desktop */}
                    <ul className="hidden items-center gap-8 md:flex">
                        {links.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    className={
                                        l.label === "Contact"
                                            ? "rounded-full bg-white px-5 py-2 font-bold italic text-black"
                                            : "font-bold italic underline-offset-8 hover:underline"
                                    }
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Tombol hamburger (HP) */}
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label={open ? "Tutup menu" : "Buka menu"}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        className="relative -mr-2 h-10 w-10 md:hidden"
                    >
                        <span
                            className={`absolute left-2 top-[14px] h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""
                                }`}
                        />
                        <span
                            className={`absolute left-2 top-[24px] h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""
                                }`}
                        />
                    </button>
                </nav>
            </header>

            {/* Menu layar penuh (HP) */}
            <div
                id="mobile-menu"
                ref={overlay}
                className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-black px-6 pb-10 pt-24 opacity-0 md:hidden"
            >
                <ul className="border-t border-white/15">
                    {links.map((l, i) => (
                        <li key={l.href} className="overflow-hidden border-b border-white/15">
                            <a
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="menu-link flex items-baseline justify-between py-5 text-5xl font-bold italic"
                            >
                                <span>{l.label}</span>
                                <span className="text-base font-normal not-italic text-neutral-500">
                                    0{i + 1}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-neutral-500">
                    Media partner pioneer di Bandung.
                </p>
            </div>
        </div>
    );
}