/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      blue: "#618BCB",
      black: "#000000",
      white: "#FFFFFF",
      starYellow: "#FFEA00",
      darkGrey: "#141414",
      grey: "#222222",
      lightGrey2: "#cfcccc",
      lightGrey: "#E5E4E2",
      gold: "#C5AB57",
      green: "#119900",
      yellowGreen: "#669900",
      yellow: "#CC9900",
      orange: "#FF6600",
      red: "#FF0000",
      darkWhite: "#F2F2F2",
      placeholder: "#45414b",
    },
  },
  plugins: [],
};
