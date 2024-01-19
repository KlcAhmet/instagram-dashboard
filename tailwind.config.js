/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{tsx,ts,html}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        white: "#ffffff",
        black: "#000000",
        gray: "#323231",
        charcoal: "#2A2731",
        light: "#787885",
        dark: "#4E4957",
        navy: "#17151C",
        brown: "#9590A0",
        tan: "#B1ACBB"
      }
    }
  },
  plugins: []
}
