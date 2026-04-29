/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        uga: {
          red: "#BA0C2F",
          paper: "#F7F3E8",
          tape: "#555555",
          ink: "#080808",
        },
      },
      fontFamily: {
        ransom: ["Impact", "Arial Black", "system-ui", "sans-serif"],
        hand: ["Comic Sans MS", "Bradley Hand", "Marker Felt", "cursive"],
      },
      boxShadow: {
        paper: "0 12px 24px rgba(0,0,0,.38)",
        taped: "0 18px 32px rgba(0,0,0,.48)",
      },
    },
  },
  plugins: [],
};
