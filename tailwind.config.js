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
        // listan kustomointivärit:
        pictonblue: "#00A7E1",
        midnightgreen: "#114B5F",
        lavenderpink: "#E6AACE",
        mindaro: "#E6F9AF",
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
