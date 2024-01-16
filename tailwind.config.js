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
        medium: "#3C3844",
        light: "#787885",
        dark: "#4E4957",
        "gray-blue": "#605B6A",
        navy: "#17151C",
        teal: "#2B662E",
        emerald: "#37833B",
        indigo: "#4F91FF",
        sky: "#65B168",
        seafoam: "#87C289",
        lime: "#133774",
        olive: "#1F4921",
        brown: "#9590A0",
        tan: "#B1ACBB",
        lavender: "#D8E6FF",
        "blue-purple": "#2264D1",
        primary: "#7A7585",
        secondary: "#EEECF1",
        tertiary: "#A9D3AB",
        red: "#C8372D",
        orange: "#D1941A"
      }
    }
  },
  plugins: []
}
