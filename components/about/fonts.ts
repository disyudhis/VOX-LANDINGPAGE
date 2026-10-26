import { Roboto } from "next/font/google";

export const robotoBlackItalic = Roboto({
  subsets: ["latin"],
  weight: ["900"],
  style: ["italic"],
  display: "swap",
});

// NEW: supporting text (nav, scroll cue, body copy in later sections)
export const robotoText = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal"],
  display: "swap",
});