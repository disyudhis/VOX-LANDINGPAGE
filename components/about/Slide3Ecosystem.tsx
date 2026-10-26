"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { robotoBlackItalic, robotoText } from "./fonts";

/**
 * ABOUT / Slide 03 — Our Ecosystem
 * Same contract as the other slides: intro plays when `active` turns true, resets when false.
 * Cards reveal their description on hover / keyboard focus (desktop) and on tap (touch).
 * No partner / creator names or stats are used on purpose — copy is descriptive only.
 *
 * Swap the photo paths to real assets. Missing files fall back to a dark gradient.
 */
const P = "/logo";

type Card = {
    id: "c1" | "c2" | "c3";
    title: string;
    sub: string;
    desc: string;
    pill: string;
    accent: string;
    src: string;
    rot: number;
    depth: number;
    future?: boolean;
};

const CARDS: Card[] = [
    {
        id: "c1",
        title: "VOXNATIVE",
        sub: "Platform utama",
        desc: "Rumah utama kami. Berita, studi ilmiah, meme, quote, dan reels dibuat di sini.",
        pill: "PLATFORM",
        accent: "#D9F24A",
        src: `${P}/vox-mark.png`,
        rot: -3,
        depth: 1,
    },
    {
        id: "c2",
        title: "FRIXSIDE",
        sub: "Intellectual Property",
        desc: "Kanal media dengan audiens dan identitasnya sendiri, tumbuh bareng jaringan VOX.",
        pill: "PARTNERS",
        accent: "#4DB5F5",
        src: `${P}/frix-logo.png`,
        rot: 2,
        depth: 0.7,
    },
    {
        id: "c3",
        title: "Creators & Influencers",
        sub: "Segera hadir",
        desc: "Jaringan kreator dan influencer lagi kami siapkan. Tunggu kabar selanjutnya.",
        pill: "COMING SOON",
        accent: "#F26B9B",
        src: `${P}/eco-3.jpg`,
        rot: -2,
        depth: 1.3,
        future: true,
    },
];

type Props = { active?: boolean };

export default function Slide3Ecosystem({ active = true }: Props) {
    const root = useRef<HTMLElement>(null);
    const intro = useRef<gsap.core.Timeline | null>(null);
    const activeRef = useRef(active);
    activeRef.current = active;
    const [open, setOpen] = useState<string | null>(null);

    useLayoutEffect(() => {
        if (!root.current) return;
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const ctx = gsap.context(() => {
                const q = gsap.utils.selector(root);
                const rot = (el: HTMLElement) => Number(el.dataset.rot);

                const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
                tl.from(q(".eco-line > span"), { yPercent: 118, rotate: 5, skewY: 6, duration: 1.1, stagger: 0.14 }, 0.15)
                    .fromTo(
                        q(".eco-card"),
                        { autoAlpha: 0, y: 160, rotation: (_i: number, el: HTMLElement) => rot(el) + 10 },
                        {
                            autoAlpha: 1, y: 0,
                            rotation: (_i: number, el: HTMLElement) => rot(el),
                            duration: 1.2, ease: "expo.out", stagger: 0.15,
                        },
                        0.35
                    )
                    .fromTo(
                        q(".eco-photo"),
                        { clipPath: "inset(100% 0% 0% 0%)" },
                        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", stagger: 0.15 },
                        0.35
                    )
                    .from(q(".eco-info"), { yPercent: 100, duration: 0.8, stagger: 0.15 }, 1.0)
                    .fromTo(
                        q(".eco-pill"),
                        { scale: 0, rotation: -30 },
                        { scale: 1, rotation: (i: number) => (i % 2 ? 5 : -6), duration: 0.65, ease: "back.out(2.4)", stagger: 0.12 },
                        1.15
                    );
                tl.progress(0);
                intro.current = tl;

                // pointer parallax on the inner layer (hover scale/rotate use CSS individual transform props)
                if (window.matchMedia("(pointer: fine)").matches) {
                    const layers = q(".eco-card").map((card) => {
                        const inner = card.querySelector(".eco-in") as HTMLElement;
                        const d = Number(card.getAttribute("data-depth")) * 18;
                        return {
                            d,
                            x: gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" }),
                            y: gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" }),
                        };
                    });
                    const head = q(".eco-headline")[0];
                    const hx = gsap.quickTo(head, "x", { duration: 1, ease: "power3.out" });
                    const hy = gsap.quickTo(head, "y", { duration: 1, ease: "power3.out" });
                    const onMove = (e: PointerEvent) => {
                        if (!activeRef.current) return;
                        const nx = e.clientX / window.innerWidth - 0.5;
                        const ny = e.clientY / window.innerHeight - 0.5;
                        layers.forEach((l) => { l.x(-nx * l.d); l.y(-ny * l.d); });
                        hx(nx * 12); hy(ny * 12);
                    };
                    window.addEventListener("pointermove", onMove);
                    return () => window.removeEventListener("pointermove", onMove);
                }
            }, root);

            return () => { intro.current = null; ctx.revert(); };
        });

        return () => mm.revert();
    }, []);

    useEffect(() => {
        const tl = intro.current;
        if (!active) setOpen(null);
        if (!tl) return; // reduced motion: static
        if (active) tl.restart();
        else tl.pause(0);
    }, [active]);

    return (
        <section ref={root} className={`eco ${robotoText.className}`} aria-label="Our ecosystem">
            <style>{css}</style>

            <div className="eco-headline">
                <h2 className={robotoBlackItalic.className} aria-label="Different voices. One network.">
                    <span className="eco-line" aria-hidden="true"><span>DIFFERENT VOICES.</span></span>
                    <span className="eco-line eco-i1" aria-hidden="true"><span>ONE NETWORK.</span></span>
                </h2>
            </div>

            <ul className="eco-list">
                {CARDS.map((c) => {
                    const isOpen = open === c.id;
                    return (
                        <li
                            key={c.id}
                            className={`eco-card ${c.id}${c.future ? " eco-future" : ""}${isOpen ? " is-open" : ""}`}
                            data-rot={c.rot}
                            data-depth={c.depth}
                            style={{ transform: `rotate(${c.rot}deg)`, ["--r" as string]: `${c.rot}deg`, ["--accent" as string]: c.accent } as CSSProperties}
                        >
                            <button
                                type="button"
                                className="eco-in"
                                aria-expanded={isOpen}
                                onClick={() => setOpen(isOpen ? null : c.id)}
                            >
                                <span className="eco-photo">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={c.src}
                                        alt=""
                                        loading="lazy"
                                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
                                    />
                                </span>

                                {c.future && (
                                    <span className={`eco-stamp ${robotoBlackItalic.className}`} aria-hidden="true">
                                        COMING SOON
                                    </span>
                                )}

                                <span className={`eco-pill ${robotoBlackItalic.className}`} style={{ background: c.accent }}>
                                    {c.pill}
                                </span>

                                <span className="eco-info">
                                    <span className={`eco-title ${robotoBlackItalic.className}`}>{c.title}</span>
                                    <span className="eco-sub">{c.sub}</span>
                                    <span className="eco-desc">
                                        <span>{c.desc}</span>
                                    </span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

const css = `
.eco{--eco-pad:clamp(20px,5vw,72px); position:relative; width:100%; height:100%; min-height:100svh;
  background:#000; color:#fff; overflow:hidden; isolation:isolate}

.eco-headline{position:absolute; z-index:6; left:var(--eco-pad); top:clamp(70px,12svh,110px); pointer-events:none}
.eco-headline h2{margin:0; font-weight:900; font-style:italic; color:#fff; mix-blend-mode:difference;
  font-size:clamp(2.2rem, min(7.4vw, 13svh), 8.5rem); line-height:.86; letter-spacing:-.035em}
.eco-line{display:block; overflow:hidden; padding:.04em .06em .08em 0; margin-right:-.06em}
.eco-line > span{display:inline-block; will-change:transform; transform-origin:0 100%}
.eco-i1{padding-left:clamp(0px,9vw,150px)}

.eco-list{list-style:none; margin:0; padding:0; position:absolute; inset:0; z-index:2}
.eco-card{position:absolute; will-change:transform}
.eco-card:hover,.eco-card:focus-within,.eco-card.is-open{z-index:12}

.c1{left:5%;  top:34%; width:28vw; height:62svh}
.c2{left:31%; top:29%; width:29vw; height:62svh}
.c3{left:60%; top:38%; width:30vw; height:58svh}

/* card = one button (keyboard + touch) */
.eco-in{all:unset; box-sizing:border-box; position:relative; display:block; width:100%; height:100%; cursor:pointer;
  overflow:hidden; background:#111; border:3px solid #ececec;
  transition:scale .4s cubic-bezier(.2,.8,.2,1), rotate .4s cubic-bezier(.2,.8,.2,1), translate .4s cubic-bezier(.2,.8,.2,1)}
.eco-card:hover .eco-in,.eco-card.is-open .eco-in{scale:1.04; rotate:calc(var(--r) * -1); translate:0 -2%}
.eco-in:focus-visible{outline:3px solid var(--accent); outline-offset:4px}
.eco-future .eco-in{border-style:dashed; background:#0b0b0b}

.eco-photo{position:absolute; inset:0; display:block; background:linear-gradient(160deg,#2b2b2b,#0c0c0c)}
.eco-photo img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  filter:grayscale(1) contrast(1.1) brightness(.9); transition:filter .4s}
.eco-card:hover .eco-photo img,.eco-card.is-open .eco-photo img{filter:grayscale(.2) contrast(1.05) brightness(.95)}
.eco-future .eco-photo img{filter:grayscale(1) contrast(1.1) brightness(.6)}

.eco-stamp{position:absolute; z-index:2; left:50%; top:38%; translate:-50% -50%; rotate:-9deg; white-space:nowrap;
  font-style:italic; font-weight:900; font-size:clamp(1.6rem,3.4vw,3.6rem); letter-spacing:-.02em; color:transparent;
  -webkit-text-stroke:2px #fff; pointer-events:none}
.eco-pill{position:absolute; top:-2px; left:-2px; z-index:3; padding:7px 15px; border-radius:0 0 14px 0; color:#000;
  font-style:italic; font-weight:900; font-size:clamp(10px,1vw,14px); box-shadow:0 4px 0 rgba(0,0,0,.55); transform:rotate(-6deg); transform-origin:0 0}

/* info band (grows upward to reveal the description) */
.eco-info{position:absolute; left:0; right:0; bottom:0; z-index:2; display:block; background:#fff; color:#000; padding:clamp(10px,1.1vw,18px) clamp(12px,1.3vw,22px)}
.eco-future .eco-info{background:#000; color:#fff; border-top:3px dashed #ececec}
.eco-title{display:block; font-style:italic; font-weight:900; font-size:clamp(1.15rem,2.3vw,2.5rem); line-height:.95; letter-spacing:-.03em}
.eco-sub{display:block; margin-top:.4em; font-size:clamp(.7rem,.9vw,.95rem); font-weight:700; opacity:.65}
.eco-desc{display:grid; grid-template-rows:0fr; transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1)}
.eco-desc > span{display:block; overflow:hidden; font-size:clamp(.78rem,1vw,1.05rem); line-height:1.3; font-weight:500}
.eco-desc > span::before{content:""; display:block; height:.7em}
.eco-card:hover .eco-desc,.eco-in:focus-visible .eco-desc,.eco-card.is-open .eco-desc{grid-template-rows:1fr}

@media (max-width:768px){
  .eco-headline{top:68px}
  .eco-headline h2{font-size:min(8.2vw, 7svh)}
  .eco-i1{padding-left:4vw}
  .c1{left:4%;  top:22svh; width:80vw; height:25svh}
  .c2{left:16%; top:46svh; width:80vw; height:25svh}
  .c3{left:5%;  top:70svh; width:82vw; height:25svh}
  .eco-title{font-size:1.2rem}
  .eco-sub{font-size:.7rem}
  .eco-desc > span{font-size:.78rem}
  .eco-card:hover .eco-in{scale:1; rotate:0deg; translate:0 0}
  .eco-card.is-open .eco-in{scale:1.02; rotate:0deg; translate:0 -2%}
}

@media (hover:none){
  .eco-card:hover .eco-desc{grid-template-rows:0fr}
  .eco-card.is-open .eco-desc{grid-template-rows:1fr}
}
`;