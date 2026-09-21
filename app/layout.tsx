import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOX | Media Partner Pioneer di Bandung",
  description:
    "VOX adalah media partner pioneer di Bandung. Lewat VOX Native, kami mereview hotel, cafe, dan brand pilihan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={roboto.variable}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}