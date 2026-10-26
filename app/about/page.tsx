import type { Metadata } from "next";
import AboutSlides from "@/components/about/AboutSlides";

export const metadata: Metadata = {
  title: "Tentang VOXNATIVE | Global News, Pop Culture, and Everything In-Between",
  description:
    "Tempat paling pas buat mantengin update berita dunia, nemenin waktu luang lewat racikan meme, quote, dan konten harian redaksi.",
};

export default function AboutPage() {
  return <AboutSlides />;
}