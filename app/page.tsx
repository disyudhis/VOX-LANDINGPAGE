import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import VoxNative from "@/components/VoxNative";
import Career from "@/components/Career";
import Collab from "@/components/Collab";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <VoxNative />
        <Career />
        <Collab />
      </main>
    </>
  );
}