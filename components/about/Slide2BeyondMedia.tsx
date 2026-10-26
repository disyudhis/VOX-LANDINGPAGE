"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { robotoBlackItalic, robotoText } from "./fonts";

/**
 * ABOUT / Slide 02 — Beyond Media
 * Same contract as Slide1Hero: intro plays when `active` turns true, resets when it turns false.
 * The collage is decorative (aria-hidden); the real message lives in the <h2>.
 *
 * Swap the photo paths to real assets. Missing files fall back to a dark gradient.
 */
const P = "/feeds";
const R = "/reels";

type Tile = {
    id: string;
    kind: "photo" | "news" | "quote" | "meme"; // news/quote/meme keep their natural image ratio so baked-in text is never cropped
    src: string;
    pill: string;
    bg: string;
    fg?: string;
    rot: number;
    depth: number;
};

const TILES: Tile[] = [
    { id: "t1", kind: "photo", src: `${P}/studi.jpg`, pill: "STUDI", bg: "#A98BFA", rot: -4, depth: 0.6 },
    { id: "t2", kind: "news", src: `${P}/news.jpg`, pill: "NEWS", bg: "#4DB5F5", rot: 3, depth: 1 },
    { id: "t3", kind: "photo", src: `${R}/cinematic.jpg`, pill: "CINEMATIC", bg: "#F2432E", fg: "#fff", rot: 2, depth: 0.8 },
    { id: "t4", kind: "quote", src: `${P}/quote.jpg`, pill: "QUOTE", bg: "#F26B9B", rot: -5, depth: 1.2 },
    { id: "t5", kind: "meme", src: `${P}/meme.jpg`, pill: "MEME", bg: "#D9F24A", rot: 4, depth: 0.7 },
    { id: "t6", kind: "photo", src: `${R}/challenge.jpg`, pill: "REVIEW", bg: "#F2432E", fg: "#fff", rot: -6, depth: 1.4 },
];

type Props = { active?: boolean };

export default function Slide2BeyondMedia({ active = true }: Props) {
    const root = useRef<HTMLElement>(null);
    const intro = useRef<gsap.core.Timeline | null>(null);
    const activeRef = useRef(active);
    activeRef.current = active;

    useLayoutEffect(() => {
        if (!root.current) return;
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const ctx = gsap.context(() => {
                const q = gsap.utils.selector(root);
                const rot = (el: HTMLElement) => Number(el.dataset.rot);

                const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
                tl
                    // layered collage entrance: tiles arrive from the right (where the hero photo sat),
                    // each unmasked like the hero photo, last tile lands first
                    .fromTo(
                        q(".bm-tile"),
                        { autoAlpha: 0, x: 160, y: 90, scale: 0.8, rotation: (_i: number, el: HTMLElement) => rot(el) + 16 },
                        {
                            autoAlpha: 1, x: 0, y: 0, scale: 1,
                            rotation: (_i: number, el: HTMLElement) => rot(el),
                            duration: 1.15, ease: "expo.out", stagger: { each: 0.11, from: "end" },
                        },
                        0.1
                    )
                    .fromTo(
                        q(".bm-tile-in"),
                        { clipPath: "inset(100% 0% 0% 0%)" },
                        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", stagger: { each: 0.11, from: "end" } },
                        0.1
                    )
                    .from(q(".bm-line > span"), { yPercent: 118, rotate: 5, skewY: 6, duration: 1.1, stagger: 0.14 }, 0.45)
                    .fromTo(
                        q(".bm-pill"),
                        { scale: 0, rotation: -30 },
                        { scale: 1, rotation: (i: number) => (i % 2 ? 5 : -6), duration: 0.65, ease: "back.out(2.4)", stagger: 0.09 },
                        1.1
                    )
                    .from(q(".bm-copy"), { autoAlpha: 0, x: -20, skewX: -10, duration: 0.8 }, 1.5);
                tl.progress(0);
                intro.current = tl;

                // pointer parallax: each tile moves at its own depth (inner layer, so it never fights the entrance)
                if (window.matchMedia("(pointer: fine)").matches) {
                    const layers = q(".bm-tile").map((tile) => {
                        const inner = tile.querySelector(".bm-tile-in") as HTMLElement;
                        const d = Number(tile.getAttribute("data-depth")) * 22;
                        return {
                            d,
                            x: gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" }),
                            y: gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" }),
                        };
                    });
                    const head = q(".bm-headline")[0];
                    const hx = gsap.quickTo(head, "x", { duration: 1, ease: "power3.out" });
                    const hy = gsap.quickTo(head, "y", { duration: 1, ease: "power3.out" });
                    const onMove = (e: PointerEvent) => {
                        if (!activeRef.current) return;
                        const nx = e.clientX / window.innerWidth - 0.5;
                        const ny = e.clientY / window.innerHeight - 0.5;
                        layers.forEach((l) => { l.x(-nx * l.d); l.y(-ny * l.d); });
                        hx(nx * 14); hy(ny * 14);
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
        if (!tl) return; // reduced motion: static
        if (active) tl.restart();
        else tl.pause(0);
    }, [active]);

    return (
        <section ref={root} className={`bm ${robotoText.className}`} aria-label="Beyond media">
            <style>{css}</style>

            {/* decorative collage */}
            <div className="bm-collage" aria-hidden="true">
                {TILES.map((t) => (
                    <div
                        key={t.id}
                        className={`bm-tile ${t.id} bm-k-${t.kind}`}
                        data-rot={t.rot}
                        data-depth={t.depth}
                        style={{ transform: `rotate(${t.rot}deg)` }}
                    >
                        <div className="bm-tile-in">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={t.src}
                                alt=""
                                loading="lazy"
                                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
                            />
                        </div>
                        <span
                            className={`bm-pill ${robotoBlackItalic.className}`}
                            style={{ background: t.bg, color: t.fg ?? "#000" }}
                        >
                            {t.pill}
                        </span>
                    </div>
                ))}
            </div>

            {/* headline */}
            <div className="bm-headline">
                <h2 className={robotoBlackItalic.className} aria-label="Media. Culture. Creativity.">
                    <span className="bm-line" aria-hidden="true"><span>MEDIA.</span></span>
                    <span className="bm-line bm-i1" aria-hidden="true"><span>CULTURE.</span></span>
                    <span className="bm-line bm-i2" aria-hidden="true"><span>CREATIVITY.</span></span>
                </h2>
            </div>

            <p className={`bm-copy ${robotoBlackItalic.className}`}>Bukan cuma feed. Ini cara kami ngobrol.</p>
        </section>
    );
}

const css = `
.bm{--bm-pad:clamp(20px,5vw,72px); position:relative; width:100%; height:100%; min-height:100svh;
  background:#000; color:#fff; overflow:hidden; isolation:isolate}

/* collage */
.bm-collage{position:absolute; inset:0; z-index:1}
.bm-tile{position:absolute; will-change:transform}
.bm-tile:hover{z-index:20}
.bm-tile-in{position:relative; width:100%; height:100%; overflow:hidden; background:linear-gradient(160deg,#2b2b2b,#0c0c0c);
  border:3px solid #ececec; transition:scale .35s cubic-bezier(.2,.8,.2,1)}
.bm-tile:hover .bm-tile-in{scale:1.05}
.bm-tile-in img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:grayscale(1) contrast(1.1) brightness(.9)}

.t1{top:9%; right:33%; width:15vw; aspect-ratio:3/4}
.t2{top:10%; right:4%; width:27vw}
.t3{top:41%; right:19%; width:25vw; aspect-ratio:4/3}
.t4{bottom:7%; right:3%; width:18vw}
.t5{bottom:5%; right:29%; width:15vw}
.t6{bottom:8%; left:31%; width:12vw; aspect-ratio:1}

/* text-in-image tiles keep their natural ratio (no crop, no overlay) */
.bm-k-news .bm-tile-in,.bm-k-quote .bm-tile-in,.bm-k-meme .bm-tile-in{height:auto; min-height:8vw}
.bm-k-news .bm-tile-in img,.bm-k-quote .bm-tile-in img,.bm-k-meme .bm-tile-in img{position:relative; display:block; height:auto}

/* pills */
.bm-pill{position:absolute; top:-12px; left:-10px; z-index:3; padding:6px 13px; border-radius:999px;
  font-style:italic; font-weight:900; font-size:clamp(10px,1vw,14px); box-shadow:0 4px 0 rgba(0,0,0,.6); transform:rotate(-6deg)}

/* headline (same difference-blend language as the hero) */
.bm-headline{position:absolute; z-index:6; left:var(--bm-pad); top:clamp(70px,16svh,150px); pointer-events:none}
.bm-headline h2{margin:0; font-weight:900; font-style:italic; color:#fff; mix-blend-mode:difference;
  font-size:clamp(2.4rem, min(9.4vw, 17svh), 10.5rem); line-height:.84; letter-spacing:-.035em}
.bm-line{display:block; overflow:hidden; padding:.04em .06em .08em 0; margin-right:-.06em}
.bm-line > span{display:inline-block; will-change:transform; transform-origin:0 100%}
.bm-i1{padding-left:clamp(0px,9vw,150px)}
.bm-i2{padding-left:clamp(0px,3vw,50px)}

.bm-copy{position:absolute; z-index:7; left:var(--bm-pad); bottom:clamp(24px,7svh,64px); margin:0; max-width:22vw;
  font-style:italic; font-weight:900; font-size:clamp(.95rem,1.7vw,1.6rem); line-height:1.1; letter-spacing:-.01em}

@media (max-width:768px){
  .bm-headline{top:70px}
  .bm-headline h2{font-size:min(14vw, 12svh)}
  .bm-i1{padding-left:6vw}
  .bm-i2{padding-left:2vw}
  .bm-copy{max-width:60vw; bottom:20px; font-size:1rem}
  .t1{top:34%; right:auto; left:4%; width:30vw}
  .t2{top:30%; right:3%; width:56vw}
  .t3{top:52%; right:6%; width:52vw}
  .t4{bottom:11%; right:auto; left:3%; width:36vw}
  .t5{bottom:9%; right:4%; width:32vw}
  .t6{display:none}
}
`;