const roles = [
    { title: "Content Creator", type: "Full-time" },
    { title: "Videographer & Editor", type: "Freelance" },
    { title: "Social Media Specialist", type: "Part-time" },
];

export default function Career() {
    return (
        <section id="career" className="border-t border-white/15 px-6 py-28 md:py-40">
            <div className="mx-auto max-w-4xl">
                <p className="mb-4 text-sm uppercase tracking-widest text-neutral-500">
                    Career
                </p>
                <h2 className="mb-6 text-5xl font-bold italic leading-none md:text-8xl">
                    Gabung bareng VOX.
                </h2>
                <p className="mb-12 max-w-xl text-lg text-neutral-400">
                    Kami mencari orang-orang yang suka bercerita dan cinta Bandung.
                </p>

                <ul className="border-t border-white/30">
                    {roles.map((r) => (
                        <li
                            key={r.title}
                            className="flex items-center justify-between border-b border-white/30 py-5 md:py-7"
                        >
                            <span className="text-2xl font-bold italic md:text-4xl">
                                {r.title}
                            </span>
                            <span className="text-sm text-neutral-500 md:text-base">
                                {r.type}
                            </span>
                        </li>
                    ))}
                </ul>
                <a
                    href="mailto:career@vox.id"
                    className="mt-10 inline-block rounded-full border-2 border-white px-8 py-3 font-bold italic"
                >
                    Kirim CV
                </a>
            </div>
        </section>
    );
}