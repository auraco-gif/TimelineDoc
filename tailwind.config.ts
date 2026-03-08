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
        canvas: "#f0f0ef",
      },
      boxShadow: {
        page: "0 1px 3px 0 rgba(0,0,0,0.08), 0 4px 16px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
