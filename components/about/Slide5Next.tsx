"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import gsap from "gsap";
import { robotoBlackItalic, robotoText } from "./fonts";

/**
 * ABOUT / Slide 05 — What's Next (closing)
 * Same contract as the other slides: intro plays when `active` turns true, resets when false.
 * Echoes the hero: same logo wipe, masked photo reveal (mirrored direction), sticker pills.
 *
 * TODO: set CONTACT_HREF to your real contact / collaboration route or anchor.
 * Logo + photo reuse the hero's assets (keep in sync with Slide1Hero).
 */
const CONTACT_HREF = "/#contact";
const LOGO_SRC = "/vox-native-logo.png";
const PHOTO_SRC = "/logo/illustration.png";

const PILLS = [
    { t: "NEWS", bg: "#4DB5F5", fg: "#000", rot: -8, pos: { top: "24%", right: "30%" } },
    { t: "MEME", bg: "#D9F24A", fg: "#000", rot: 7, pos: { top: "52%", right: "6%" } },
    { t: "LET'S TALK", bg: "#F2432E", fg: "#fff", rot: -5, pos: { bottom: "21%", right: "32%" } },
];

/** splits text into per-character spans so the headline can drop in letter by letter */
function Chars({ text }: { text: string }) {
    return (
        <>
            {Array.from(text).map((ch, i) => (
                <span key={i} className="nx-c">{ch === " " ? "\u00A0" : ch}</span>
            ))}
        </>
    );
}

type Props = { active?: boolean };

export default function Slide5Next({ active = true }: Props) {
    const root = useRef<HTMLElement>(null);
    const intro = useRef<gsap.core.Timeline | null>(null);
    const drift = useRef<gsap.core.Tween | null>(null);
    const activeRef = useRef(active);
    activeRef.current = active;

    useLayoutEffect(() => {
        if (!root.current) return;
        const mm = gsap.matchMedia();

        // reduced motion: everything static, outlined word already filled
        mm.add("(prefers-reduced-motion: reduce)", () => {
            root.current?.querySelector(".nx-out")?.classList.add("is-fill");
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const ctx = gsap.context(() => {
                const q = gsap.utils.selector(root);
                const out = q(".nx-out")[0];

                const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
                tl.fromTo(
                    q(".nx-photo"),
                    { clipPath: "inset(0% 0% 100% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
                    0.1
                )
                    .from(q(".nx-photo img"), { scale: 1.4, duration: 1.9, ease: "expo.out" }, 0.1)
                    .fromTo(
                        q(".nx-logo"),
                        { clipPath: "inset(0% 100% 0% 0%)", x: -30 },
                        { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 1.1, ease: "expo.out" },
                        0.5
                    )
                    // headline: letters drop in with a springy overshoot
                    .from(
                        q(".nx-c"),
                        { yPercent: 120, rotate: 9, skewY: 9, duration: 0.95, ease: "back.out(1.7)", stagger: { each: 0.035 } },
                        0.7
                    )
                    .call(() => out?.classList.add("is-fill"), undefined, 1.9) // outlined word fills in
                    .from(q(".nx-copy"), { autoAlpha: 0, x: -20, skewX: -10, duration: 0.8 }, 1.8)
                    .from(q(".nx-cta"), { autoAlpha: 0, y: 24, duration: 0.8 }, 2.0)
                    .fromTo(
                        q(".nx-pill"),
                        { scale: 0, rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot) - 28 },
                        {
                            scale: 1,
                            rotation: (_i: number, el: HTMLElement) => Number(el.dataset.rot),
                            duration: 0.7,
                            ease: "back.out(2.4)",
                            stagger: 0.14,
                        },
                        1.9
                    )
                    .call(() => drift.current?.play(), undefined, 2.4);
                tl.progress(0);
                intro.current = tl;

                // slow image drift once the intro has landed
                drift.current = gsap.to(q(".nx-photo img"), {
                    scale: 1.1,
                    duration: 14,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    paused: true,
                });

                // pointer parallax (fine pointers only)
                if (window.matchMedia("(pointer: fine)").matches) {
                    const targets = [
                        { el: ".nx-photo", f: 18 },
                        { el: ".nx-logo", f: -10 },
                        { el: ".nx-pill", f: -26 },
                    ].map(({ el, f }) => ({
                        f,
                        x: q(el).map((n) => gsap.quickTo(n, "x", { duration: 0.9, ease: "power3.out" })),
                        y: q(el).map((n) => gsap.quickTo(n, "y", { duration: 0.9, ease: "power3.out" })),
                    }));
                    const onMove = (e: PointerEvent) => {
                        if (!activeRef.current) return;
                        const nx = e.clientX / window.innerWidth - 0.5;
                        const ny = e.clientY / window.innerHeight - 0.5;
                        targets.forEach((t) => {
                            t.x.forEach((fn) => fn(nx * t.f));
                            t.y.forEach((fn) => fn(ny * t.f));
                        });
                    };
                    window.addEventListener("pointermove", onMove);
                    return () => window.removeEventListener("pointermove", onMove);
                }
            }, root);

            return () => {
                intro.current = null;
                drift.current = null;
                ctx.revert();
            };
        });

        return () => mm.revert();
    }, []);

    useEffect(() => {
        const tl = intro.current;
        if (!tl) return; // reduced motion: static
        const out = root.current?.querySelector(".nx-out");
        if (active) {
            out?.classList.remove("is-fill");
            drift.current?.pause(0);
            tl.restart();
        } else {
            drift.current?.pause();
            tl.pause(0);
            out?.classList.remove("is-fill");
        }
    }, [active]);

    return (
        <section ref={root} className={`nx ${robotoText.className}`} aria-label="What's next">
            <style>{css}</style>

            <div className="nx-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTO_SRC} alt="" onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")} />
            </div>

            <div className="nx-grain" aria-hidden="true" />

            <div className="nx-headline">
                <h2 className={robotoBlackItalic.className} aria-label="We're just getting started.">
                    <span className="nx-line nx-l1" aria-hidden="true">
                        <span className="nx-small"><Chars text="WE'RE" /></span>
                        <span className="nx-out"><Chars text=" JUST" /></span>
                    </span>
                    <span className="nx-line" aria-hidden="true"><Chars text="GETTING" /></span>
                    <span className="nx-line nx-i" aria-hidden="true"><Chars text="STARTED." /></span>
                </h2>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="VOXNATIVE" className="nx-logo" />

            <p className={`nx-copy ${robotoBlackItalic.className}`}>Ada ide? Yuk ngobrol.</p>

            <Link href={CONTACT_HREF} className={`nx-cta ${robotoBlackItalic.className}`}>
                Kolaborasi dengan VOX
            </Link>

            {PILLS.map((p) => (
                <span
                    key={p.t}
                    className={`nx-pill ${robotoBlackItalic.className}`}
                    data-rot={p.rot}
                    aria-hidden="true"
                    style={{ ...p.pos, background: p.bg, color: p.fg, transform: `rotate(${p.rot}deg)` } as CSSProperties}
                >
                    {p.t}
                </span>
            ))}
        </section>
    );
}

const css = `
.nx{--nx-pad:clamp(20px,5vw,72px); position:relative; width:100%; height:100%; min-height:100svh;
  background:#000; color:#fff; overflow:hidden; isolation:isolate}

.nx-photo{position:absolute; z-index:1; right:0; top:11svh; bottom:0; width:min(38vw,560px); overflow:hidden;
  background:linear-gradient(160deg,#2a2a2a,#0d0d0d 70%)}
.nx-photo img{position:absolute; inset:-6% 0; width:100%; height:112%; object-fit:cover;
  filter:grayscale(1) contrast(1.12) brightness(.8); will-change:transform}
.nx-photo::after{content:""; position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.6),transparent 50%)}

/* film grain */
.nx-grain{position:absolute; inset:-50%; z-index:5; pointer-events:none; opacity:.11; mix-blend-mode:screen;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation:nx-grain 1s steps(6) infinite}
@keyframes nx-grain{
  0%{transform:translate(0,0)} 20%{transform:translate(-4%,3%)} 40%{transform:translate(3%,-5%)}
  60%{transform:translate(-5%,-2%)} 80%{transform:translate(4%,4%)} 100%{transform:translate(0,0)}}
@media (prefers-reduced-motion:reduce){.nx-grain{animation:none}}

/* headline */
.nx-headline{position:absolute; z-index:6; left:var(--nx-pad); top:clamp(64px,10svh,100px); pointer-events:none}
.nx-headline h2{margin:0; font-weight:900; font-style:italic; color:#fff; mix-blend-mode:difference;
  font-size:clamp(2.8rem,min(10.4vw,18.5svh),11rem); line-height:.84; letter-spacing:-.035em}
.nx-line{display:block; overflow:hidden; padding:.04em .06em .1em 0; margin-right:-.06em; white-space:nowrap}
.nx-c{display:inline-block; will-change:transform; transform-origin:0 100%}
.nx-i{padding-left:clamp(0px,7vw,120px)}
.nx-l1{display:flex; align-items:baseline; gap:.12em}
.nx-small{font-size:.42em; letter-spacing:-.01em}
.nx-out{font-size:.62em}
.nx-out .nx-c{color:transparent; -webkit-text-stroke:2px #fff; transition:color .5s ease}
.nx-out.is-fill .nx-c{color:#fff}

/* logo = visual anchor */
.nx-logo{position:absolute; z-index:7; left:var(--nx-pad); bottom:clamp(70px,13svh,130px); width:clamp(220px,min(44vw,70svh),640px); height:auto; display:block}

.nx-copy{position:absolute; z-index:7; left:var(--nx-pad); bottom:clamp(30px,6.5svh,60px); margin:0; font-style:italic; font-weight:900;
  font-size:clamp(1rem,1.7vw,1.6rem); letter-spacing:-.01em}

.nx-cta{position:absolute; z-index:9; right:clamp(56px,6vw,96px); bottom:clamp(24px,5.5svh,52px); display:inline-block; padding:16px 30px; border-radius:999px;
  background:#fff; color:#000; text-decoration:none; font-style:italic; font-weight:900; font-size:clamp(.95rem,1.25vw,1.2rem);
  box-shadow:0 6px 0 rgba(255,255,255,.2); transition:transform .25s cubic-bezier(.2,.8,.2,1), background .2s, color .2s}
.nx-cta:hover{transform:translateY(-3px) rotate(-2deg); background:#D9F24A}
.nx-cta:focus-visible{outline:3px solid #fff; outline-offset:4px}

.nx-pill{position:absolute; z-index:8; padding:9px 18px; border-radius:999px; white-space:nowrap; will-change:transform;
  font-style:italic; font-weight:900; font-size:clamp(11px,1.2vw,17px); box-shadow:0 5px 0 rgba(0,0,0,.6); pointer-events:none}

@media (max-width:768px){
  .nx-photo{width:46vw; top:30svh; bottom:24svh}
  .nx-headline{top:68px}
  .nx-headline h2{font-size:min(15vw,13svh)}
  .nx-i{padding-left:5vw}
  .nx-logo{width:min(80vw,380px); bottom:calc(14svh + 16px)}
  .nx-copy{bottom:calc(14svh - 24px); font-size:1rem}
  .nx-cta{right:auto; left:var(--nx-pad); bottom:22px; padding:14px 24px}
  .nx-pill{padding:6px 12px; font-size:10px}
  .nx-pill:nth-of-type(1){top:30svh !important; right:auto !important; left:52% !important}
  .nx-pill:nth-of-type(2){top:45svh !important; right:3% !important}
  .nx-pill:nth-of-type(3){display:none}
}
`;