const nativewind = require("nativewind/preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        background: "#F9F5FF",
        surface: "#FFFFFF",
        "surface-highlight": "#F0EBF8",
        foreground: "#1A1A1A",
        muted: "#706E77",
        accent: "#998FC7",
        "cosmic-lavender": "#D4C2FC",
        "cosmic-cobalt": "#14248A",
        "cosmic-gold": "#B8A06E",
      },
      fontFamily: {
        serif: ["VeasSerif", "serif"],
        serifItalic: ["VeasSerifItalic", "serif"],
        sans: ["VeasSans", "System"],
      },
    },
  },
  plugins: [],
};
