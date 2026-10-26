"use client";

import SlideDeck from "@/components/about/SlideDeck";
import Slide1Hero from "@/components/about/Slide1Hero";
import Slide2BeyondMedia from "@/components/about/Slide2BeyondMedia";
import Slide3Ecosystem from "@/components/about/Slide3Ecosystem";
import Slide4Team from "@/components/about/Slide4Team";
import Slide5Next from "@/components/about/Slide5Next";
import SlidePlaceholder from "@/components/about/SlidePlaceholder";

export default function AboutSlides() {
  const slides = [
    { id: "hero", title: "Intro", tag: "HERO PITCH", render: (active: boolean) => <Slide1Hero active={active} /> },
    { id: "who", title: "Beyond Media", tag: "BEYOND MEDIA", render: (active: boolean) => <Slide2BeyondMedia active={active} /> },
    { id: "proof", title: "Our Ecosystem", tag: "OUR ECOSYSTEM", render: (active: boolean) => <Slide3Ecosystem active={active} /> },
    { id: "team", title: "Tim", tag: "THE TEAM", render: (active: boolean) => <Slide4Team active={active} /> },
    { id: "cta", title: "Kolaborasi", tag: "LET'S TALK", render: (active: boolean) => <Slide5Next active={active} /> },
  ];

  return <SlideDeck slides={slides} />;
}