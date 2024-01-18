/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        jade: "#04A777",
        dogwood: "#D3BDB0",
        blue: "#72A1E5",
        pink: "#EF476F",
        darkblue: "#26547C",
      },
      scale: {
        120: "1.20",
        130: "1.30",
        175: "1.75",
      },
      fontFamily: {
        quicksand: ["quicksand"],
      },
      width: {
        bigScreenshot: "60em",
      },
    },
  },
  plugins: [],
};
