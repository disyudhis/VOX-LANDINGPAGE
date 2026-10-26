"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

declare global {
    interface Window {
        instgrm?: { Embeds: { process: () => void } };
    }
}

export default function ReelModal({ url }: { url: string }) {
    const [open, setOpen] = useState(false);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (!open) return;

        if (!scriptLoaded.current) {
            const script = document.createElement("script");
            script.src = "https://www.instagram.com/embed.js";
            script.async = true;
            script.onload = () => window.instgrm?.Embeds.process();
            document.body.appendChild(script);
            scriptLoaded.current = true;
        } else {
            window.instgrm?.Embeds.process();
        }

        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute inset-0 z-10"
                aria-label="Tonton Reel"
            />
            {open &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
                        onClick={() => setOpen(false)}
                    >
                        <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] overflow-auto">
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink={url}
                                data-instgrm-version="14"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="absolute right-6 top-6 text-3xl text-white"
                            aria-label="Tutup"
                        >
                            ×
                        </button>
                    </div>,
                    document.body
                )}
        </>
    );
}