export type PlatformId = "instagram" | "tiktok" | "threads";

export type Platform = {
  id: PlatformId;
  name: string;
  handle: string;
  url: string;
  stat: string;
  statLabel: string;
  tagline: string;
  formats: string[];
};

// Semua data di bawah hanya contoh. Ganti dengan data VOX yang asli.
export const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@vox.bandung",
    url: "https://instagram.com/USERNAME",
    stat: "50K",
    statLabel: "Followers",
    tagline: "Rumah utama konten VOX: review visual, liputan, dan kolaborasi brand.",
    formats: ["Reels", "Carousel", "Story", "Live"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "@vox.bandung",
    url: "https://tiktok.com/@USERNAME",
    stat: "80K",
    statLabel: "Followers",
    tagline: "Video pendek yang cepat menyebar: food tour, staycation, dan tren Bandung.",
    formats: ["Video pendek", "Live", "Duet & Stitch"],
  },
  {
    id: "threads",
    name: "Threads",
    handle: "@vox.bandung",
    url: "https://threads.net/@USERNAME",
    stat: "20K",
    statLabel: "Followers",
    tagline: "Ruang obrolan: opini, rekomendasi cepat, dan interaksi langsung dengan audiens.",
    formats: ["Thread", "Polling", "Reply & diskusi"],
  },
];