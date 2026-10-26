"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const navLinks = [
    { label: "About", href: "/about" },
    { label: "Platform", href: "/platform" },
    { label: "Career", href: "/career" },
];
const ctaLink = { label: "Contact", href: "/#contact" };
const mobileLinks = [...navLinks, ctaLink];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const root = useRef<HTMLDivElement>(null);
    const header = useRef<HTMLElement>(null);
    const overlay = useRef<HTMLDivElement>(null);
    const logo = useRef<HTMLAnchorElement>(null);
    const navList = useRef<HTMLUListElement>(null);
    const pill = useRef<HTMLSpanElement>(null);
    const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const tl = useRef<gsap.core.Timeline | null>(null);

    const { contextSafe } = useGSAP(
        () => {
            // 1. Sembunyi saat scroll turun, muncul saat scroll naik, solid saat discroll
            let hidden = false;

            ScrollTrigger.create({
                start: 0,
                end: "max",
                onUpdate: (self) => {
                    const y = self.scroll();
                    const shouldHide = self.direction === 1 && y > 80;
                    if (shouldHide !== hidden) {
                        hidden = shouldHide;
                        gsap.to(header.current, {
                            yPercent: hidden ? -100 : 0,
                            duration: 0.3,
                            ease: "power2.out",
                            overwrite: true,
                        });
                    }
                    setScrolled(y > 4);
                },
            });

            // 2. Timeline buka/tutup menu mobile
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            tl.current = gsap
                .timeline({ paused: true, defaults: { ease: "power3.out" } })
                .to(overlay.current, { autoAlpha: 1, duration: reduce ? 0 : 0.35 })
                .from(
                    ".menu-link",
                    {
                        yPercent: 110,
                        duration: reduce ? 0 : 0.75,
                        stagger: 0.07,
                        ease: "back.out(1.6)",
                    },
                    "-=0.15"
                );
        },
        { scope: root }
    );

    // Gerakkan pill ke posisi sebuah link
    const movePillTo = contextSafe((el: HTMLElement | null) => {
        if (!el || !pill.current || !navList.current) return;
        const listBox = navList.current.getBoundingClientRect();
        const linkBox = el.getBoundingClientRect();
        gsap.to(pill.current, {
            x: linkBox.left - listBox.left,
            width: linkBox.width,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
        });
    });

    const hidePill = contextSafe(() => {
        gsap.to(pill.current, { opacity: 0, duration: 0.25 });
    });

    const resetPillToActive = () => {
        const activeEl = linkRefs.current[pathname] ?? null;
        if (activeEl) movePillTo(activeEl);
        else hidePill();
    };

    useEffect(() => {
        resetPillToActive();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        window.addEventListener("resize", resetPillToActive);
        return () => window.removeEventListener("resize", resetPillToActive);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const bounceLogo = contextSafe((hover: boolean) => {
        gsap.to(logo.current, {
            rotate: hover ? -8 : 0,
            scale: hover ? 1.08 : 1,
            duration: 0.35,
            ease: "back.out(2)",
        });
    });

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
                className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${scrolled
                    ? "border-white/20 bg-black shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    : "border-transparent bg-transparent"
                    }`}
            >
                <nav
                    aria-label="Navigasi utama"
                    className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
                >
                    <Link
                        href="/"
                        ref={logo}
                        onClick={() => setOpen(false)}
                        onPointerEnter={() => bounceLogo(true)}
                        onPointerLeave={() => bounceLogo(false)}
                        className="flex items-center gap-2.5"
                    >
                        <Image
                            src="/vox-mark.png"
                            alt="VOX"
                            width={1911}
                            height={2040}
                            priority
                            className="h-7 w-auto"
                        />
                    </Link>

                    {/* Desktop */}
                    <div className="hidden items-center gap-3 md:flex">
                        <ul
                            ref={navList}
                            onPointerLeave={resetPillToActive}
                            className="relative flex items-center gap-1"
                        >
                            <span
                                ref={pill}
                                aria-hidden
                                className="pointer-events-none absolute left-0 top-1/2 h-9 -translate-y-1/2 rounded-full bg-white opacity-0"
                            />
                            {navLinks.map((l) => (
                                <li key={l.href} className="relative z-10">
                                    <Link
                                        href={l.href}
                                        ref={(el) => {
                                            linkRefs.current[l.href] = el;
                                        }}
                                        onPointerEnter={(e) => movePillTo(e.currentTarget)}
                                        className="mix-blend-difference block rounded-full px-5 py-2 font-bold italic text-white"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={ctaLink.href}
                            className="rounded-full bg-white px-5 py-2 font-bold italic text-black"
                        >
                            {ctaLink.label}
                        </Link>
                    </div>

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
                className="invisible fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-black px-6 pb-10 pt-24 opacity-0 md:hidden"
            >
                <Image
                    src="/vox-mark.png"
                    alt=""
                    width={1911}
                    height={2040}
                    className="pointer-events-none absolute -right-12 -top-12 h-64 w-auto opacity-[0.06]"
                />

                <ul className="relative border-t border-white/15">
                    {mobileLinks.map((l, i) => {
                        const active = pathname === l.href;
                        return (
                            <li
                                key={l.href}
                                className="overflow-hidden border-b border-white/15"
                            >
                                <Link
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="menu-link flex items-baseline justify-between py-5 text-5xl font-bold italic"
                                >
                                    <span className="flex items-center gap-3">
                                        {l.label}
                                        {active && (
                                            <span
                                                className="h-2.5 w-2.5 rounded-full bg-white"
                                                aria-hidden
                                            />
                                        )}
                                    </span>
                                    <span className="text-base font-normal not-italic text-neutral-500">
                                        0{i + 1}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <p className="relative text-sm text-neutral-500">
                    Media partner pioneer di Bandung.
                </p>
            </div>
        </div>
    );
}