import type { Config } from "tailwindcss";
export default {
  darkMode: "class", content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "rgb(var(--ink) / <alpha-value>)", paper: "rgb(var(--paper) / <alpha-value>)", muted: "rgb(var(--muted) / <alpha-value>)", line: "rgb(var(--line) / <alpha-value>)", accent: "rgb(var(--accent) / <alpha-value>)", lime: "rgb(var(--lime) / <alpha-value>)" },
    fontFamily: { sans: ["var(--font-inter)", "sans-serif"], serif: ["var(--font-playfair)", "serif"] },
    boxShadow: { soft: "0 16px 60px rgba(20,20,18,.08)" },
    animation: { "marquee": "marquee 25s linear infinite" },
    keyframes: { marquee: { to: { transform: "translateX(-50%)" } } }
  }}, plugins: []
} satisfies Config;
