/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Artstudio dark theme
        canvas: "#2B2C31",
        cream: { DEFAULT: "#FFFEDF", dim: "#A8A795", muted: "#5C5B52" },
        gold: { DEFAULT: "#DFBA69", dark: "#CF9C2C" },
        maroon: "#5A2E2E",
        // Legacy (used by admin pages)
        parchment: "#F8F4ED",
        sepia: { 50: "#FDF8F0", 100: "#F5EDD8", 200: "#EBDBB5", 300: "#D4BC82", 400: "#BFA05A", 500: "#A68B42", 600: "#8A7235", 700: "#6E5A2B", 800: "#524321", 900: "#3A2F18" },
        ink: { 50: "#F4F3F1", 100: "#E0DEDB", 200: "#C1BCB5", 300: "#9E9689", 400: "#7A7060", 500: "#5C5347", 600: "#474035", 700: "#342F27", 800: "#231F19", 900: "#14120E" },
        stamp: { red: "#C0392B", blue: "#2471A3", green: "#1E8449", gold: "#DFBA69", burgundy: "#6B1A1A" },
      },
      fontFamily: {
        display: ['"Nunito Sans"', "Arial", "sans-serif"],
        body: ['"Nunito Sans"', "Arial", "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
