/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["sans-serif"],
        mont: ["Montserrat"],
      },
      fontSize: {
        "32px": "32px",
        "40px": "40px",
        "64px": "64px",
      },
    },
  },
  variants: {},
  plugins: [],
};
