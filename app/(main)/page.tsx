// (main)/page.tsx
// Navbar dirender oleh (main)/layout.tsx. Empat bab homepage disusun sebagai deck di HomeSlides.
import HomeSlides from "@/components/home/HomeSlides";

export default function Home() {
  return (
    <main>
      <HomeSlides />
    </main>
  );
}