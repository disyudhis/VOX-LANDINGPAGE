export default function Collab() {
    return (
        <section
            id="contact"
            className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center"
        >
            <h2 className="text-5xl font-bold italic leading-none md:text-9xl">
                Punya brand?
                <br />
                Ayo kolaborasi.
            </h2>
            <p className="max-w-md text-lg text-neutral-400">
                VOX terbuka untuk kolaborasi review brand, hotel, cafe, dan lainnya.
            </p>
            <a
                href="https://wa.me/62XXXXXXXXXX"
                className="rounded-full bg-white px-10 py-4 text-lg font-bold italic text-black"
            >
                Hubungi Kami
            </a>
            <footer className="mt-16 text-sm text-neutral-600">
                © {new Date().getFullYear()} VOX. Bandung.
            </footer>
        </section>
    );
}