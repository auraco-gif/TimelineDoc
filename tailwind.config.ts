import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // canvas = the scrollable document area background
        canvas: "#F7F3EE",
        // warm = primary neutral scale (replaces cool neutral-*)
        warm: {
          25:  "#FFFDFC", // surface-primary  (navbar, cards, panels)
          50:  "#F7F3EE", // bg-app            (page root, canvas)
          100: "#F2ECE4", // surface-muted     (upload zone, tags)
          200: "#E6DED3", // border-default    (all dividers/borders)
          300: "#EADFD2", // highlight
          500: "#8A7E74", // text-muted
          600: "#5C5148", // text-secondary
          900: "#1F1A17", // text-primary
        },
        // terracotta = primary action (Upload Photos)
        terracotta: {
          100: "#F3E2D8",
          500: "#C67B5C",
          600: "#B56C4E",
        },
        // sage = success/export action (Export PDF)
        sage: {
          100: "#DCEFE4",
          600: "#2F7D57",
          700: "#27684A",
        },
      },
      boxShadow: {
        page: "0 1px 3px 0 rgba(0,0,0,0.08), 0 4px 16px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
