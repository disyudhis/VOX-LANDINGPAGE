import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      {children}
    </SmoothScroll>
  );
}