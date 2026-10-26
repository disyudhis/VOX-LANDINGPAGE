const items = ["MEDIA PARTNER", "REVIEW", "KOLABORASI"];

export default function Marquee() {
  const row = [...items, ...items];

  return (
    <div className="overflow-hidden bg-white py-4 text-black" aria-hidden>
      <div className="marquee-track flex w-max whitespace-nowrap text-2xl font-bold italic md:text-4xl">
        {[...row, ...row].map((text, i) => (
          <span key={i} className="px-5">
            {text} ✦
          </span>
        ))}
      </div>
    </div>
  );
}