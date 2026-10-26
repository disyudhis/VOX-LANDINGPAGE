"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

type Role = {
    title: string;
    type: string;
    blurb: string;
    color: string;
};

// Ganti blurb sesuai kebutuhan asli tiap posisi. Warna dipinjam dari palet VOX Native.
const roles: Role[] = [
    {
        title: "Content Creator",
        type: "Full-time",
        blurb:
            "Ikut riset, syuting, sampai nge-host konten harian VOX & VOX Native. Cocok buat yang gak takut kamera dan suka ngulik tren.",
        color: "#FF6B9A",
    },
    {
        title: "Videographer & Editor",
        type: "Freelance",
        blurb:
            "Dari footage mentah jadi Reels yang enak ditonton. Paham ritme cepat, cut yang presisi, dan storytelling visual singkat.",
        color: "#38BDF8",
    },
    {
        title: "Social Media Specialist",
        type: "Part-time",
        blurb:
            "Ngatur jadwal post, pantau performa feeds & reels, dan ikut nentuin arah konten minggu depan.",
        color: "#D7FF3F",
    },
];

const grainStyle: CSSProperties = {
    backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
};

type Frame =
    | { kind: "title" }
    | { kind: "role"; role: Role; index: number }
    | { kind: "closing" };

export default function Career() {
    const container = useRef<HTMLElement>(null);
    const desktopRefs = useRef<(HTMLDivElement | null)[]>([]);
    const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
    const mobileRefs = useRef<(HTMLDivElement | null)[]>([]);
    const stRef = useRef<ScrollTrigger | null>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    const frames: Frame[] = [
        { kind: "title" },
        ...roles.map((r, i) => ({ kind: "role" as const, role: r, index: i })),
        { kind: "closing" },
    ];

    const jumpTo = (index: number) => {
        const st = stRef.current;
        if (!st) {
            mobileRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        const fraction = index / (frames.length - 1);
        const targetY = st.start + fraction * (st.end - st.start);
        gsap.to(window, { duration: 1, ease: "power2.inOut", scrollTo: { y: targetY, autoKill: true } });
    };

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
                const cards = desktopRefs.current.filter(Boolean) as HTMLDivElement[];
                const overlays = overlayRefs.current.filter(Boolean) as HTMLDivElement[];
                if (!cards.length) return;

                // Set awal: semua lapisan peredup transparan (kartu pertama memang belum butuh diredupkan)
                gsap.set(overlays, { opacity: 0 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container.current,
                        start: "top top",
                        end: () => `+=${Math.round((cards.length - 1) * window.innerHeight * 1.4)}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            const idx = Math.round(self.progress * (cards.length - 1));
                            setActiveIdx(idx);
                        },
                    },
                });
                stRef.current = tl.scrollTrigger ?? null;

                cards.forEach((card, i) => {
                    if (i === 0) return;
                    const t = i - 1;

                    // Kartu baru meluncur naik menimpa kartu sebelumnya
                    tl.fromTo(card, { yPercent: 101 }, { yPercent: 0, ease: "power3.out", duration: 0.65 }, t);

                    // Kartu sebelumnya cuma diredupkan lewat lapisan opacity — jauh lebih ringan
                    // daripada menganimasikan filter CSS langsung di kartu seukuran layar penuh.
                    tl.to(overlays[i - 1], { opacity: 0.55, ease: "power2.out", duration: 0.65 }, t);

                    // Jeda "napas" sebelum kartu berikutnya mulai bergerak
                    tl.to({}, { duration: 0.35 }, t + 0.65);
                });

                return () => {
                    tl.scrollTrigger?.kill();
                    stRef.current = null;
                };
            });

            mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
                gsap.from(".career-card-mobile", {
                    y: 40,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: { trigger: container.current, start: "top 75%", once: true },
                });
            });
        },
        { scope: container }
    );

    return (
        <section id="career" ref={container} className="relative border-t border-white/15 bg-black">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]" style={grainStyle} />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]"
            />

            {/* ===== Desktop: tumpukan kartu penuh layar ===== */}
            <div className="relative hidden h-svh overflow-hidden md:block">
                {frames.map((f, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            desktopRefs.current[i] = el;
                        }}
                        className="will-change-transform absolute inset-0 flex flex-col justify-center border-t border-white/10 bg-black px-6 md:px-16"
                        style={{ zIndex: i + 1 }}
                    >
                        <CardBody f={f} totalRoles={roles.length} />
                        {/* Lapisan peredup, diam di atas kartu, cuma opacity-nya yang dianimasikan */}
                        <div
                            ref={(el) => {
                                overlayRefs.current[i] = el;
                            }}
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-black"
                        />
                    </div>
                ))}

                <div className="pointer-events-auto absolute right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3 md:right-10">
                    {frames.map((f, i) => {
                        const dotColor = f.kind === "role" ? f.role.color : "#fff";
                        const on = activeIdx === i;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => jumpTo(i)}
                                aria-label={`Ke bagian ${i + 1}`}
                                aria-pressed={on}
                                className="h-2 w-2 rounded-full border transition-all"
                                style={{
                                    borderColor: on ? dotColor : "rgba(255,255,255,0.4)",
                                    background: on ? dotColor : "transparent",
                                    transform: on ? "scale(1.3)" : "scale(1)",
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ===== HP: kartu bertumpuk vertikal biasa ===== */}
            <div className="flex flex-col gap-4 px-6 py-24 md:hidden">
                {frames.map((f, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            mobileRefs.current[i] = el;
                        }}
                        className="career-card-mobile relative overflow-hidden rounded-2xl border border-white/15 bg-black p-6"
                    >
                        <CardBody f={f} totalRoles={roles.length} compact />
                    </div>
                ))}
            </div>
        </section>
    );
}

function CardBody({
    f,
    totalRoles,
    compact,
}: {
    f: Frame;
    totalRoles: number;
    compact?: boolean;
}) {
    if (f.kind === "title") {
        return (
            <div className="relative text-white">
                <h2
                    className={`font-bold italic leading-none ${compact ? "text-5xl" : "text-6xl md:text-8xl"
                        }`}
                >
                    Mau Jadi
                    <br />
                    Bagian dari Kami?
                </h2>
                <p className="mt-6 max-w-md text-lg text-neutral-400">
                    Kirim CV kamu, siapa tau kamulah selanjutnya!
                </p>
                {!compact && (
                    <div className="mt-10 flex items-center gap-2">
                        {roles.map((r) => (
                            <span
                                key={r.title}
                                className="h-1.5 w-8 rounded-full"
                                style={{ background: r.color }}
                            />
                        ))}
                        <p className="ml-2 text-xs text-neutral-600">Scroll buat info lanjutnya ya ↓</p>
                    </div>
                )}
            </div>
        );
    }

    if (f.kind === "role") {
        const c = f.role.color;
        return (
            <div className="relative text-white">
                {/* Garis aksen di tepi kiri kartu */}
                <span
                    aria-hidden
                    className="absolute -left-6 top-0 h-full w-1.5 md:-left-16"
                    style={{ background: c }}
                />
                {!compact && (
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 text-[22rem] font-bold italic leading-none md:text-[26rem]"
                        style={{ color: `${c}14` }}
                    >
                        0{f.index + 1}
                    </span>
                )}
                <p
                    className="relative text-sm font-bold uppercase tracking-widest"
                    style={{ color: c }}
                >
                    0{f.index + 1} / 0{totalRoles}
                </p>
                <h3
                    className={`relative mt-4 font-bold italic leading-none ${compact ? "text-3xl" : "text-5xl md:text-7xl"
                        }`}
                >
                    {f.role.title}
                </h3>
                <span
                    className="relative mt-4 inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest"
                    style={{ borderColor: c, color: c }}
                >
                    {f.role.type}
                </span>
                <p className="relative mt-6 max-w-md text-neutral-400">{f.role.blurb}</p>
                <a
                    href={`mailto:career@vox.id?subject=${encodeURIComponent(`Lamar sebagai ${f.role.title}`)}`}
                    className="relative mt-8 inline-block rounded-full px-6 py-3 text-sm font-bold italic text-black"
                    style={{ background: c }}
                >
                    Lamar posisi ini ↗
                </a>
            </div>
        );
    }

    return (
        <div className="relative text-white">
            <p className="text-sm uppercase tracking-widest text-neutral-500">Fin</p>
            <h3
                className={`mt-4 font-bold italic leading-none ${compact ? "text-3xl" : "text-5xl md:text-7xl"
                    }`}
            >
                Gak nemu
                <br />
                yang cocok?
            </h3>
            <p className="mt-6 max-w-md text-neutral-400">
                Kirim CV kamu, kami kabari kalau ada posisi yang pas.
            </p>
            <a
                href="mailto:career@vox.id"
                className="mt-8 inline-block rounded-full border-2 border-white px-6 py-3 text-sm font-bold italic text-white"
            >
                Kirim CV ↗
            </a>
        </div>
    );
}