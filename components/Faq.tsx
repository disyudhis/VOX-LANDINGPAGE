const faqs = [
  {
    q: "Kapan lowongan dibuka?",
    a: "Belum ada jadwal pasti. Anggota daftar tunggu akan kami kabari lebih dulu lewat email, sebelum diumumkan di sosial media.",
  },
  {
    q: "Boleh kirim CV meski belum ada lowongan?",
    a: "Boleh. Isi form di atas dan lampirkan CV atau portofolio. Kami simpan dan hubungi kalau ada peran yang cocok.",
  },
  {
    q: "Apakah VOX menerima magang atau freelance?",
    a: "Terkadang. Pilih 'Magang / Internship' di form, dan sebutkan ketersediaanmu di email.",
  },
  {
    q: "Harus tinggal di Bandung?",
    a: "Sebagian besar pekerjaan kami dilakukan di lapangan di Bandung, jadi domisili di sekitar Bandung sangat membantu.",
  },
  {
    q: "Mau kolaborasi sebagai kreator, bukan karyawan?",
    a: "Untuk kolaborasi kreator dan brand, silakan langsung ke halaman Contact.",
  },
];

export default function Faq() {
  return (
    <section className="px-6 py-24 md:py-36">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-neutral-500">
          FAQ
        </p>
        <h2 className="mb-10 text-5xl font-bold italic leading-none md:text-8xl">
          Yang sering
          <br />
          ditanyakan.
        </h2>

        <div className="border-t border-white/25">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-white/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-2xl font-bold italic md:text-4xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="shrink-0 text-4xl not-italic transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-lg text-neutral-400">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}