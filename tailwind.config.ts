import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.mdx"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      // Brand palette (placeholder — swap for your own). Named like SafetyWing's
      // `bluewood` / `confetti` rather than generic primary/secondary.
      colors: {
        ink: {
          DEFAULT: "#16213A",
          light: "#24324F",
          muted: "#5B6478",
        },
        sun: {
          DEFAULT: "#F2C94C",
          dark: "#D9AE2B",
        },
        mist: "#F4F5F7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      // Motion vocabulary from the SafetyWing teardown (docs/animations.md).
      keyframes: {
        "follow-path": { to: { offsetDistance: "100%" } },
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        blink: "blink 0.7s step-end infinite",
      },
    },
  },
  plugins: [typography, animate],
};

export default config;
