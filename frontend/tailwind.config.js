/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F5F0E8",
        sepia: { 50: "#FDF8F0", 100: "#F5EDD8", 200: "#EBDBB5", 300: "#D4BC82", 400: "#BFA05A", 500: "#A68B42", 600: "#8A7235", 700: "#6E5A2B", 800: "#524321", 900: "#3A2F18" },
        ink: { 50: "#F4F3F1", 100: "#E0DEDB", 200: "#C1BCB5", 300: "#9E9689", 400: "#7A7060", 500: "#5C5347", 600: "#474035", 700: "#342F27", 800: "#231F19", 900: "#14120E" },
        stamp: { red: "#B8382E", blue: "#2E5A88", green: "#3A6B4A", gold: "#C9993A" },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Source Serif 4"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
