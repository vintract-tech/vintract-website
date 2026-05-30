/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#070912", 900: "#0b0f1a", 800: "#101524", 700: "#172033" },
        brand: { 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" },
        accent: { 400: "#34d399", 500: "#10b981" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
};
