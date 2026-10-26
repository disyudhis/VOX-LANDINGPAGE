import type { Metadata } from "next";
import AboutSlides from "@/components/about/AboutSlides";

export const metadata: Metadata = {
  title: "About Us | VOXNATIVE NETWORKS",
  description:
    "More Than A Media Partner",
};

export default function AboutPage() {
  return <AboutSlides />;
}