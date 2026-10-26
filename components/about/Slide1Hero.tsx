"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { robotoBlackItalic, robotoText } from "./fonts";

/**
 * ABOUT / Slide 01 — The Statement (Hero)
 * Driven by the deck's `active` flag: intro plays each time the slide becomes active,
 * and resets when the slide is left. (Native page scroll doesn't exist inside the deck,
 * so ScrollTrigger isn't used here; pointer parallax adds depth instead.)
 *
 * Swap these to your real /public assets.
 */
const LOGO_SRC = "/vox-native-logo.png";
const PHOTO_SRC = "/hero/collage-wallpaper.png";

const PILLS = [
    { label: "NEWS", bg: "#4DB5F5", rot: -8, style: { top: "14%", left: "-4%" } },
    { label: "MEME", bg: "#D9F24A", rot: 7, style: { top: "47%", right: "-3%" } },
    { label: "CHALLENGE", bg: "#F2432E", rot: -5, style: { bottom: "9%", left: "6%" }, light: true },
];

type Props = { active?: boolean; showNav?: boolean };

export default function Slide1Hero({ active = true, showNav = true }: Props) {
    const root = useRef<HTMLElement>(null);
    const intro = useRef<gsap.core.Timeline | null>(null);
    const loops = useRef<gsap.core.Timeline | null>(null);
    const activeRef = useRef(active);
    activeRef.current = active;

    /* build timelines once (paused) */
    useLayoutEffect(() => {
        if (!root.current) return;
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const ctx = gsap.context(() => {
                const q = gsap.utils.selector(root);

                const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
                tl.from(q(".vx-nav > *"), { autoAlpha: 0, y: -12, duration: 0.6, stagger: 0.08 }, 0.1)
                    .fromTo(
                        q(".vx-photo"),
                        { clipPath: "inset(100% 0% 0% 0%)" },
                        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
                        0.15
                    )
                    .from(q(".vx-photo img"), { scale: 1.45, duration: 1.9, ease: "expo.out" }, 0.15)
                    .fromTo(
                        q(".vx-logo"),
                        { clipPath: "inset(0% 100% 0% 0%)", x: -30 },
                        { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 1.1, ease: "expo.out" },
                        0.55
                    )
                    .from(
                        q(".vx-line > span"),
                        { yPercent: 118, rotate: 5, skewY: 6, duration: 1.1, stagger: 0.13 },
                        0.8
                    )
                    .from(q(".vx-hash"), { autoAlpha: 0, x: -24, skewX: -12, duration: 0.8 }, 1.5)
                    .fromTo(
                        q(".vx-pill"),
                        { scale: 0, rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot) - 28 },
                        {
                            scale: 1,
                            rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot),
                            duration: 0.7,
                            ease: "back.out(2.4)",
                            stagger: 0.14,
                        },
                        1.55
                    )
                    .from(q(".vx-scroll"), { autoAlpha: 0, duration: 0.8 }, 1.9);
                tl.progress(0); // apply hidden start state immediately
                intro.current = tl;

                // idle loops (pill float + scroll cue), only run while active
                const lp = gsap.timeline({ paused: true });
                lp.to(
                    q(".vx-pill > span"),
                    {
                        y: -7,
                        duration: 2.2,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                        stagger: { each: 0.35, from: "random" },
                    },
                    0
                ).fromTo(
                    q(".vx-scroll i"),
                    { scaleY: 0, transformOrigin: "top" },
                    { scaleY: 1, duration: 1.1, ease: "power2.inOut", repeat: -1, repeatDelay: 0.3 },
                    0
                );
                loops.current = lp;

                // pointer parallax (fine pointers only)
                if (window.matchMedia("(pointer: fine)").matches) {
                    const layers = [
                        { el: ".vx-photo img", f: 16 },
                        { el: ".vx-logo", f: -10 },
                        { el: ".vx-headline", f: 22 },
                        { el: ".vx-pill", f: -28 },
                    ].map(({ el, f }) => ({
                        f,
                        x: q(el).map((n) => gsap.quickTo(n, "x", { duration: 0.9, ease: "power3.out" })),
                        y: q(el).map((n) => gsap.quickTo(n, "y", { duration: 0.9, ease: "power3.out" })),
                    }));
                    const onMove = (e: PointerEvent) => {
                        if (!activeRef.current) return;
                        const nx = e.clientX / window.innerWidth - 0.5;
                        const ny = e.clientY / window.innerHeight - 0.5;
                        layers.forEach((l) => {
                            l.x.forEach((fn) => fn(nx * l.f));
                            l.y.forEach((fn) => fn(ny * l.f));
                        });
                    };
                    window.addEventListener("pointermove", onMove);
                    return () => window.removeEventListener("pointermove", onMove);
                }
            }, root);

            return () => {
                intro.current = null;
                loops.current = null;
                ctx.revert();
            };
        });

        return () => mm.revert();
    }, []);

    /* play / reset with the deck */
    useEffect(() => {
        const tl = intro.current;
        const lp = loops.current;
        if (!tl || !lp) return; // reduced motion: static, always visible
        if (active) {
            tl.restart();
            lp.play();
        } else {
            lp.pause();
            tl.pause(0);
        }
    }, [active]);

    return (
        <section
            ref={root}
            className={`vx-hero ${robotoText.className}`}
            aria-label="About VOXNATIVE"
        >
            <style>{css}</style>

            {showNav && (
                <nav className="vx-nav" aria-label="About navigation">
                    <Link href="/" className="vx-nav-link">Home</Link>
                    <span className="vx-nav-here" aria-current="page">About</span>
                </nav>
            )}

            <div className="vx-photo-wrap">
                <div className="vx-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={PHOTO_SRC}
                        alt=""
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
                    />
                </div>
                {PILLS.map((p) => (
                    <div
                        key={p.label}
                        className="vx-pill"
                        data-rot={p.rot}
                        style={{ ...p.style, transform: `rotate(${p.rot}deg)` }}
                    >
                        <span
                            className={robotoBlackItalic.className}
                            style={{ background: p.bg, color: p.light ? "#fff" : "#000" }}
                        >
                            {p.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="VOXNATIVE" className="vx-logo" />

            <div className="vx-headline">
                <h1 className={robotoBlackItalic.className} aria-label="More than a media partner.">
                    <span className="vx-line" aria-hidden="true"><span>MORE THAN</span></span>
                    <span className="vx-line vx-indent" aria-hidden="true"><span>A MEDIA</span></span>
                    <span className="vx-line" aria-hidden="true"><span>PARTNER.</span></span>
                </h1>
                <p className={`vx-hash ${robotoBlackItalic.className}`}>#OurVoicesAreTheMove</p>
            </div>

            <div className="vx-scroll" aria-hidden="true">
                <i />
                <span>Scroll dulu ya</span>
            </div>
        </section>
    );
}

const css = `
.vx-hero{
  --vx-pad: clamp(20px, 5vw, 72px);
  position:relative; width:100%; height:100%; min-height:100svh;
  background:#000; color:#fff; overflow:hidden; isolation:isolate;
}
.vx-nav{position:absolute; z-index:30; top:clamp(18px,3vw,36px); left:var(--vx-pad);
  display:flex; gap:22px; align-items:center; font-weight:700; font-size:15px;}
.vx-hero .vx-nav a.vx-nav-link{color:#fff !important; -webkit-text-fill-color:#fff; text-decoration:none; opacity:.75; transition:opacity .2s}
.vx-hero .vx-nav a.vx-nav-link:hover,.vx-hero .vx-nav a.vx-nav-link:focus-visible{opacity:1}
.vx-nav-link:focus-visible{outline:2px solid #fff; outline-offset:4px; border-radius:4px}
.vx-hero .vx-nav .vx-nav-here{padding:6px 14px; background:#fff; color:#000 !important; border-radius:999px}

.vx-photo-wrap{position:absolute; right:0; top:11svh; bottom:0; width:min(52vw, 760px)}
.vx-photo{position:absolute; z-index:1; inset:0; overflow:hidden; background:linear-gradient(160deg,#2a2a2a 0%,#0d0d0d 70%)}
.vx-photo img{position:absolute; inset:-8% 0 -8% 0; width:100%; height:116%; object-fit:cover;
  filter:grayscale(1) contrast(1.12) brightness(.82); will-change:transform}
.vx-photo::after{content:""; position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,.65), transparent 45%)}

.vx-pill{position:absolute; z-index:5; will-change:transform}
.vx-pill > span{display:inline-block; padding:10px 20px; border-radius:999px;
  font-style:italic; font-weight:900; font-size:clamp(13px,1.3vw,18px); letter-spacing:.01em;
  box-shadow:0 6px 0 rgba(0,0,0,.55)}

.vx-logo{position:absolute; z-index:8; mix-blend-mode:normal; top:clamp(64px,11svh,110px); left:var(--vx-pad);
  width:clamp(190px, min(30vw, 44svh), 480px); height:auto; display:block}

.vx-headline{position:absolute; z-index:4; left:var(--vx-pad); right:var(--vx-pad);
  bottom:clamp(56px,10svh,110px); pointer-events:none}
.vx-headline h1{margin:0; font-weight:900; font-style:italic;
  font-size:clamp(2.6rem, min(10.2vw, 19svh), 11rem); line-height:.84; letter-spacing:-.035em;
  mix-blend-mode:difference; color:#fff}
.vx-line{display:block; overflow:hidden; padding:.04em .06em .08em 0; margin-right:-.06em}
.vx-line > span{display:inline-block; will-change:transform; transform-origin:0 100%}
.vx-indent{padding-left:clamp(0px,8vw,140px)}
.vx-hash{margin:clamp(14px,2.2vw,28px) 0 0; font-weight:900; font-style:italic;
  font-size:clamp(1.05rem, 2.2vw, 2rem); letter-spacing:-.01em; padding-left:.1em}

.vx-scroll{position:absolute; z-index:6; left:var(--vx-pad); bottom:clamp(18px,3.2svh,34px);
  display:flex; align-items:center; gap:12px; font-size:13px; font-weight:500; color:rgba(255,255,255,.65)}
.vx-scroll i{display:block; width:2px; height:34px; background:#fff}

@media (max-width: 768px){
  .vx-photo-wrap{width:78vw; top:24svh; bottom:18svh}
  .vx-logo{width:min(68vw, 320px); top:68px}
  .vx-indent{padding-left:6vw}
  .vx-headline{bottom:11svh}
  .vx-headline h1{font-size:min(15vw, 15svh)}
  .vx-pill:nth-of-type(1){left:-6% !important}
  .vx-pill:nth-of-type(2){right:-4% !important}
}
`;