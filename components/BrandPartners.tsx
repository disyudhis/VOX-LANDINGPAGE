import Reveal from "./Reveal";

type Variant = "solid" | "outline" | "invert";

const rows: {
    items: string[];
    variant: Variant;
    duration: string;
    reverse: boolean;
}[] = [
        {
            items: ["Brand Satu", "Brand Dua", "Brand Tiga"],
            variant: "solid",
            duration: "40s",
            reverse: false,
        },
        {
            items: ["Brand Empat", "Brand Lima", "Brand Enam"],
            variant: "outline",
            duration: "50s",
            reverse: true,
        },
        {
            items: ["Brand Tujuh", "Brand Delapan", "Brand Sembilan"],
            variant: "invert",
            duration: "35s",
            reverse: false,
        },
    ];

const rowStyle: Record<Variant, string> = {
    solid: "text-white",
    outline: "text-outline",
    invert: "bg-white text-black",
};

const allBrands = rows.flatMap((r) => r.items);

export default function BrandPartners() {
    return (
        <section className="py-24 md:py-36">
            <Reveal className="mx-auto mb-14 max-w-6xl px-6">
                <p
                    data-reveal
                    className="mb-4 text-sm uppercase tracking-widest text-neutral-500"
                >
                    Brand partner
                </p>
                <h2
                    data-reveal
                    className="text-5xl font-bold italic leading-none md:text-8xl"
                >
                    Yang pernah
                    <br />
                    bareng VOX.
                </h2>
            </Reveal>

            {/* Versi teks biasa untuk screen reader & SEO */}
            <ul className="sr-only">
                {allBrands.map((b) => (
                    <li key={b}>{b}</li>
                ))}
            </ul>

            <div aria-hidden>
                {rows.map((row, i) => {
                    // Diulang 2x per grup supaya cukup lebar untuk layar besar
                    const group = [...row.items, ...row.items];

                    return (
                        <div
                            key={i}
                            className={`brand-row overflow-hidden py-3 md:py-4 ${rowStyle[row.variant]}`}
                        >
                            <div
                                className="brand-track flex w-max will-change-transform"
                                style={
                                    {
                                        "--dur": row.duration,
                                        "--dir": row.reverse ? "reverse" : "normal",
                                    } as React.CSSProperties
                                }
                            >
                                {[0, 1].map((copy) => (
                                    <div
                                        key={copy}
                                        className={`flex shrink-0 whitespace-nowrap text-5xl font-bold italic leading-none tracking-tighter md:text-8xl ${copy === 1 ? "brand-dup" : ""
                                            }`}
                                    >
                                        {group.map((name, j) => (
                                            <span key={j} className="flex items-center">
                                                <span className="px-6 md:px-10">{name}</span>
                                                <span className="text-3xl md:text-5xl">✦</span>
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}