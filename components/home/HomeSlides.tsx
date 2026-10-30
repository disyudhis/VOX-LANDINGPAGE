"use client";

import HomeDeck from "@/components/home/HomeDeck";
import type { HomeSlide } from "@/components/home/HomeDeck";
import Hero from "@/components/Hero";
import VoxNative from "@/components/VoxNative";
import JoinRoster from "@/components/home/JoinRoster";
import Collab from "@/components/Collab";

// Client component karena `render` berupa fungsi (tidak bisa dikirim dari server component).
// `id` slide = id anchor yang dipakai link di seluruh situs.
const slides: HomeSlide[] = [
  { id: "hero", title: "Opening", render: ({ active, deck }) => <Hero active={active} deck={deck} /> },
  { id: "segments", title: "Yang kami bikin", render: (s) => <VoxNative {...s} /> },
  { id: "career", title: "Join the movement", render: ({ active, deck }) => <JoinRoster active={active} deck={deck} /> },
  { id: "contact", title: "Kolaborasi", render: ({ active, deck }) => <Collab active={active} deck={deck} /> },
];

export default function HomeSlides() {
  return <HomeDeck slides={slides} />;
}