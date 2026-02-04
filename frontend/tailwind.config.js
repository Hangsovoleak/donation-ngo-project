/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#495867",
          blue: "#577399",
          soft: "#BDD5EA",
          base: "#F7F7FF",
          black: "#000000",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "ui-serif", "serif"],
      },
    },
  },
  plugins: [],
}
