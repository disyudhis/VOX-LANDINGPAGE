"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { robotoBlackItalic, robotoText } from "./fonts";

/**
 * ABOUT / Slide 04 — Meet the Voices
 * Two stages inside ONE slide (the deck owns the page scroll, so stages are switched with
 * the pill stepper / "Lanjut" button instead of ScrollTrigger):
 *   0 THE CREW — group photo + "MEET THE VOICES."
 *   1 THE FACES — group photo breaks into overlapping portrait cards (hover / tap = name + role)
 *
 * CONTENT: names and roles are placeholders until you fill TEAM below. Nothing is invented.
 * The member-N.jpg portraits are crops of your real group photo, so swap them freely.
 */
const P = "/team";
const CREW_SRC = `${P}/team.png`;
const FALLBACK = `${P}/team-placeholder.jpg`;

type Member = { id: string; src: string; name?: string; role?: string; accent: string };

const TEAM: Member[] = [
    { id: "m1", src: `${P}/valez.png`, name: "Valez", role: "Founder", accent: "#D9F24A" },
    { id: "m2", src: `${P}/sasa.png`, name: "Sasa", role: "Co-Founder", accent: "#4DB5F5" },
    { id: "m3", src: `${P}/jul.png`, name: "Julius", role: "Project Officer", accent: "#F2432E" },
    { id: "m4", src: `${P}/yudhis.png`, name: "Yudhis", role: "Marketing Officer", accent: "#F26B9B" },
    { id: "m5", src: `${P}/vino.png`, name: "Vino", role: "Social Media Specialist", accent: "#A98BFA" },
    // fill in:  name: "…", role: "…"
];

/* card layouts per stage: left/top in % of the slide, width in vw */
type L = { left: number; top: number; w: number; rot: number };
const DESK: L[] = [
    { left: 6, top: 40, w: 16, rot: -5 },
    { left: 20, top: 55, w: 13, rot: 4 },
    { left: 33, top: 34, w: 18, rot: -2 },
    { left: 53, top: 50, w: 14, rot: 5 },
    { left: 66, top: 28, w: 17, rot: -4 },
    { left: 81, top: 52, w: 13, rot: 3 },
];
const MOB: L[] = [
    { left: 3, top: 25, w: 36, rot: -4 },
    { left: 52, top: 28, w: 36, rot: 3 },
    { left: 9, top: 45, w: 36, rot: 3 },
    { left: 50, top: 48, w: 36, rot: -3 },
    { left: 4, top: 65, w: 36, rot: -2 },
    { left: 54, top: 67, w: 36, rot: 4 },
];

const STEPS = ["THE CREW", "THE FACES"];
type Props = { active?: boolean };

export default function Slide4Team({ active = true }: Props) {
    const root = useRef<HTMLElement>(null);
    const [stage, setStage] = useState(0);
    const [open, setOpen] = useState<string | null>(null);
    const stageRef = useRef(0);
    const activeRef = useRef(active);
    activeRef.current = active;
    const goRef = useRef<(n: number, instant?: boolean) => void>(() => { });
    const resetRef = useRef<() => void>(() => { });

    useLayoutEffect(() => {
        if (!root.current) return;
        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(root);
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const isMob = () => window.innerWidth <= 768;
            const lay = () => (isMob() ? MOB : DESK);
            let prev = -1; // -1 = nothing shown yet
            let tl: gsap.core.Timeline | null = null;

            const hidden = () => {
                gsap.set(q(".tm-hd"), { autoAlpha: 0 });
                gsap.set(q(".tm-photo"), { autoAlpha: 0 });
                gsap.set(q(".tm-label"), { autoAlpha: 0, scale: 0 });
                gsap.set(q(".tm-card"), { autoAlpha: 0 });
                gsap.set(q(".tm-cue"), { autoAlpha: 0 });
            };
            hidden();

            const show = (n: number, instant = false) => {
                const d = instant || reduced ? 0 : 1;
                tl?.kill();
                tl = gsap.timeline({ defaults: { ease: "power4.out" } });

                // headlines: outgoing lines slide up, incoming lines rise with the same skew snap as the other slides
                q(".tm-hd").forEach((h, i) => {
                    const lines = h.querySelectorAll(".tm-line > span");
                    if (i === n) {
                        tl!.set(h, { autoAlpha: 1 }, 0).fromTo(
                            lines,
                            { yPercent: 118, rotate: 5, skewY: 6 },
                            { yPercent: 0, rotate: 0, skewY: 0, duration: 1.1 * d, stagger: 0.13 * d },
                            0.3 * d
                        );
                    } else if (prev === i) {
                        tl!.to(lines, { yPercent: -118, duration: 0.45 * d, stagger: 0.04 * d, ease: "power3.in" }, 0).set(h, { autoAlpha: 0 }, 0.55 * d);
                    } else {
                        tl!.set(h, { autoAlpha: 0 }, 0);
                    }
                });

                // group photo: masked reveal in, wiped away when the crew breaks into portraits
                const photo = q(".tm-photo")[0];
                const pimg = q(".tm-photo img")[0];
                if (n === 0) {
                    tl.set(photo, { autoAlpha: 1 }, 0)
                        .fromTo(photo, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 * d, ease: "expo.inOut" }, 0.4 * d)
                        .fromTo(pimg, { scale: 1.35 }, { scale: 1, duration: 1.8 * d, ease: "expo.out" }, 0.4 * d);
                } else if (prev === 0) {
                    tl.to(photo, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9 * d, ease: "expo.inOut" }, 0).set(photo, { autoAlpha: 0 }, 0.95 * d);
                } else {
                    tl.set(photo, { autoAlpha: 0 }, 0);
                }

                // small label under the headline (stage 0 only)
                if (n === 0) tl.set(q(".tm-label"), { autoAlpha: 1 }, 0).fromTo(q(".tm-label"), { scale: 0, rotation: -12 }, { scale: 1, rotation: -3, duration: 0.7 * d, ease: "back.out(2.4)" }, 1.5 * d);
                else tl.to(q(".tm-label"), { autoAlpha: 0, scale: 0, duration: 0.3 * d }, 0);

                // portrait cards
                q(".tm-card").forEach((c, i) => {
                    if (n === 0) {
                        tl!.to(c, { autoAlpha: 0, scale: 0.3, left: "46%", top: "38%", rotation: 0, duration: 0.7 * d, ease: "power3.in" }, i * 0.04 * d);
                        return;
                    }
                    const L = lay()[i];
                    const to = { left: `${L.left}%`, top: `${L.top}%`, width: `${L.w}vw`, rotation: L.rot, autoAlpha: 1, scale: 1 };
                    if (prev <= 0) {
                        // burst out of the group photo
                        tl!.fromTo(
                            c,
                            { left: "46%", top: "38%", width: `${L.w}vw`, rotation: 0, autoAlpha: 0, scale: 0.3 },
                            { ...to, duration: 1.2 * d, ease: "expo.out" },
                            (0.5 + i * 0.09) * d
                        );
                    } else {
                        tl!.to(c, { ...to, duration: 1.2 * d, ease: "expo.inOut" }, i * 0.06 * d);
                    }
                });

                // cue toward the next slide (last stage only)
                tl.to(q(".tm-cue"), { autoAlpha: n === 1 ? 1 : 0, duration: (n === 1 ? 0.8 : 0.3) * d }, (n === 1 ? 1.6 : 0) * d);

                prev = n;
                stageRef.current = n;
            };

            goRef.current = show;
            resetRef.current = () => {
                tl?.kill();
                hidden();
                prev = -1;
                stageRef.current = 0;
            };

            // re-apply the current stage instantly when the breakpoint / size changes
            let raf = 0;
            const onResize = () => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    if (activeRef.current && prev >= 0) show(stageRef.current, true);
                });
            };
            window.addEventListener("resize", onResize);

            // pointer parallax (fine pointers, motion allowed)
            let offMove = () => { };
            if (!reduced && window.matchMedia("(pointer: fine)").matches) {
                const layers = q(".tm-card").map((card) => {
                    const inner = card.querySelector(".tm-in") as HTMLElement;
                    const dpt = (0.6 + Math.random() * 0.9) * 18;
                    return {
                        dpt,
                        x: gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" }),
                        y: gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" }),
                    };
                });
                const onMove = (e: PointerEvent) => {
                    if (!activeRef.current) return;
                    const nx = e.clientX / window.innerWidth - 0.5;
                    const ny = e.clientY / window.innerHeight - 0.5;
                    layers.forEach((l) => { l.x(-nx * l.dpt); l.y(-ny * l.dpt); });
                };
                window.addEventListener("pointermove", onMove);
                offMove = () => window.removeEventListener("pointermove", onMove);
            }

            return () => {
                window.removeEventListener("resize", onResize);
                cancelAnimationFrame(raf);
                offMove();
            };
        }, root);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (active) {
            setStage(0);
            setOpen(null);
            goRef.current(0);
        } else {
            resetRef.current();
            setStage(0);
            setOpen(null);
        }
    }, [active]);

    const go = (n: number) => {
        if (n === stageRef.current) return;
        setOpen(null);
        setStage(n);
        goRef.current(n);
    };

    return (
        <section ref={root} className={`tm ${robotoText.className}`} aria-label="Meet the voices">
            <style>{css}</style>

            {/* stage 0: group photo */}
            <div className="tm-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CREW_SRC} alt="Foto bersama tim VOXNATIVE" />
            </div>

            {/* headlines (one per stage, stacked) */}
            <div className="tm-hd tm-hd0">
                <h2 className={robotoBlackItalic.className} aria-label="Meet the voices.">
                    <span className="tm-line" aria-hidden="true"><span>MEET THE</span></span>
                    <span className="tm-line tm-i" aria-hidden="true"><span>VOICES.</span></span>
                </h2>
                <p className={`tm-label ${robotoBlackItalic.className}`}>THE PEOPLE BEHIND THE FEED.</p>
            </div>
            <div className="tm-hd tm-hd1">
                <h2 className={robotoBlackItalic.className} aria-label="Every voice has a face.">
                    <span className="tm-line" aria-hidden="true"><span>EVERY VOICE</span></span>
                    <span className="tm-line tm-i" aria-hidden="true"><span>HAS A FACE.</span></span>
                </h2>
            </div>

            {/* portraits */}
            <ul className="tm-list">
                {TEAM.map((m) => {
                    const isOpen = open === m.id;
                    const ph = !m.name;
                    return (
                        <li key={m.id} className={`tm-card${isOpen ? " is-open" : ""}`} style={{ ["--accent" as string]: m.accent } as CSSProperties}>
                            <button type="button" className="tm-in" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : m.id)}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={m.src}
                                    alt=""
                                    loading="lazy"
                                    onError={(e) => {
                                        const img = e.currentTarget as HTMLImageElement;
                                        if (!img.dataset.fb) { img.dataset.fb = "1"; img.src = FALLBACK; }
                                    }}
                                />
                                <span className="tm-info">
                                    <span className={`tm-name ${robotoBlackItalic.className}${ph ? " is-ph" : ""}`}>{m.name ?? "[ Nama anggota ]"}</span>
                                    <span className={`tm-role${ph ? " is-ph" : ""}`}>{m.role ?? "[ Role / posisi ]"}</span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="tm-cue" aria-hidden="true"><i /><span>Scroll dulu ya</span></div>

            {/* stage stepper */}
            <nav className="tm-step" aria-label="Bagian tim">
                {STEPS.map((s, i) => (
                    <button
                        key={s}
                        type="button"
                        className={`tm-step-b ${robotoBlackItalic.className}${stage === i ? " is-on" : ""}`}
                        aria-label={s}
                        aria-current={stage === i ? "step" : undefined}
                        onClick={() => go(i)}
                    >
                        <span className="tm-step-t">{s}</span>
                    </button>
                ))}
                {stage < STEPS.length - 1 && (
                    <button type="button" className={`tm-next ${robotoBlackItalic.className}`} onClick={() => go(stage + 1)}>
                        Lanjut
                    </button>
                )}
            </nav>
        </section>
    );
}

const css = `
.tm{--tm-pad:clamp(20px,5vw,72px); position:relative; width:100%; height:100%; min-height:100svh;
  background:#000; color:#fff; overflow:hidden; isolation:isolate}

/* group photo */
.tm-photo{position:absolute; z-index:1; right:0; bottom:0; width:min(74vw,142svh); aspect-ratio:2576/1449; overflow:hidden; background:#cfcfcf}
.tm-photo img{width:100%; height:100%; object-fit:cover; display:block; filter:grayscale(1) contrast(1.05); will-change:transform}

/* headlines */
.tm-hd{position:absolute; z-index:6; left:var(--tm-pad); top:clamp(70px,12svh,110px); pointer-events:none}
.tm-hd h2{margin:0; font-weight:900; font-style:italic; color:#fff; mix-blend-mode:difference; line-height:.86; letter-spacing:-.035em}
.tm-hd0 h2{font-size:clamp(2.8rem,min(11vw,20svh),11rem)}
.tm-hd1 h2{font-size:clamp(2.2rem,min(6.4vw,11.5svh),7.5rem)}
.tm-line{display:block; overflow:hidden; padding:.04em .06em .08em 0; margin-right:-.06em}
.tm-line > span{display:inline-block; will-change:transform; transform-origin:0 100%}
.tm-i{padding-left:clamp(0px,7vw,120px)}
.tm-label{display:inline-block; margin:clamp(12px,2vw,26px) 0 0 .2em; padding:8px 16px; background:#D9F24A; color:#000;
  font-style:italic; font-weight:900; font-size:clamp(11px,1.15vw,16px); letter-spacing:.01em; box-shadow:0 5px 0 rgba(255,255,255,.18)}

/* portraits */
.tm-list{list-style:none; margin:0; padding:0; position:absolute; inset:0; z-index:3}
.tm-card{position:absolute; aspect-ratio:4/5; will-change:transform}
.tm-card:hover,.tm-card:focus-within,.tm-card.is-open{z-index:20}
.tm-in{all:unset; box-sizing:border-box; position:relative; display:block; width:100%; height:100%; overflow:hidden; cursor:pointer;
  background:#111; border:3px solid #ececec; transition:scale .4s cubic-bezier(.2,.8,.2,1)}
.tm-in:focus-visible{outline:3px solid var(--accent); outline-offset:4px}
.tm-in img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:grayscale(1) contrast(1.1)}
.tm-card.is-open .tm-in{scale:1.04}
.tm-info{position:absolute; left:0; right:0; bottom:0; display:block; background:#fff; color:#000; border-top:4px solid var(--accent);
  padding:clamp(8px,.9vw,14px) clamp(10px,1vw,16px); transform:translateY(101%); transition:transform .4s cubic-bezier(.2,.8,.2,1)}
.tm-name{display:block; font-style:italic; font-weight:900; font-size:clamp(.85rem,1.4vw,1.5rem); line-height:1; letter-spacing:-.02em; text-transform:uppercase}
.tm-role{display:block; margin-top:.35em; font-size:clamp(.65rem,.85vw,.9rem); font-weight:700; opacity:.65}
.is-ph{opacity:.55; font-style:italic}
.tm-card.is-open .tm-info,.tm-in:focus-visible .tm-info{transform:translateY(0)}
@media (hover:hover){
  .tm-card:hover .tm-in{scale:1.05}
  .tm-card:hover .tm-info{transform:translateY(0)}
}

/* cue (same language as the hero) */
.tm-cue{position:absolute; z-index:6; left:var(--tm-pad); bottom:clamp(18px,3.2svh,34px); display:flex; align-items:center; gap:12px;
  font-size:13px; font-weight:500; color:rgba(255,255,255,.65)}
.tm-cue i{display:block; width:2px; height:34px; background:#fff}

/* stepper */
.tm-step{position:absolute; z-index:30; right:clamp(56px,6vw,96px); bottom:clamp(18px,3.2svh,34px); display:flex; gap:8px; align-items:center}
.tm-step-b,.tm-next{all:unset; box-sizing:border-box; cursor:pointer; padding:8px 16px; border-radius:999px; font-style:italic; font-weight:900;
  font-size:12px; transition:background .2s,color .2s}
.tm-step-b{border:2px solid rgba(255,255,255,.55); color:#fff}
.tm-step-b:hover{border-color:#fff}
.tm-step-b.is-on{background:#fff; color:#000; border-color:#fff}
.tm-next{background:#D9F24A; color:#000; margin-left:6px; box-shadow:0 4px 0 rgba(255,255,255,.2)}
.tm-step-b:focus-visible,.tm-next:focus-visible{outline:3px solid #fff; outline-offset:3px}

@media (max-width:768px){
  .tm-hd{top:68px}
  .tm-hd0 h2{font-size:min(17vw,12svh)}
  .tm-hd1 h2{font-size:min(11vw,7.5svh)}
    .tm-i{padding-left:5vw}
  .tm-photo{width:100vw; bottom:14svh}
  .tm-cue{display:none}
  .tm-step{right:auto; left:var(--tm-pad); right:var(--tm-pad); justify-content:space-between; bottom:18px}
  .tm-step-b{width:14px; height:14px; padding:0; border-width:2px}
  .tm-step-t{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0)}
  .tm-step > .tm-step-b + .tm-step-b{margin-left:0}
  .tm-next{margin-left:auto}
  .tm-name{font-size:.8rem}.tm-role{font-size:.62rem}
}
`;