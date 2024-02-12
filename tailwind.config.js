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
        bluegradient:
          "linear-gradient(90deg, hsla(217, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%);",
        greengradient:
          "linear-gradient(90deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%);",
        yellowgradient:
          "linear-gradient(90deg, hsla(33, 100%, 53%, 1) 0%, hsla(58, 100%, 68%, 1) 100%);",
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
