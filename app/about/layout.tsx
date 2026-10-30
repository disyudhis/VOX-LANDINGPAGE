import Navbar from "@/components/Navbar";

// Navbar yang sama dengan homepage / career / platform, supaya navigasi universal.
// Catatan: Lenis (SmoothScroll) sengaja TIDAK dipakai di sini, karena deck About mengatur scroll sendiri.
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}