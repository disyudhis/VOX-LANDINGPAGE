export default function SlidePlaceholder({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0B0B] px-6 text-center text-white">
      <p className="mb-4 font-mono text-xs text-white/40">Slide 0{index}</p>
      <h2 className="text-4xl font-bold italic tracking-tight md:text-6xl">{title}</h2>
      <p className="mt-4 max-w-sm text-sm text-white/40">
        Menunggu konten dari kamu.
      </p>
    </div>
  );
}