/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        panel: "#121a2b",
        accent: "#f4a340",
        paper: "#f5f1e8",
      },
      boxShadow: {
        glow: "0 0 60px rgba(244,163,64,.12)",
      },
    },
  },
  plugins: [],
};
