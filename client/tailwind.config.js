/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      blue: "#477CB9",
      black: "#000000",
      white: "#FFFFFF",
      red: "#FF0033",
      yellow: "#FFEA00",
      darkGrey: "#141414",
      grey: "#222222",
      lightGrey: "#E5E4E2",
      gold: "#C5AB57",
    },
  },
  plugins: [],
};
