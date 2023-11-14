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
        gray: "#323231"
      }
    }
  },
  plugins: []
}
