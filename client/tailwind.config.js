/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberDark: "#0A0F1F",
        cyberCard: "#111827",
        neonPink: "#FF2E9F",
        neonBlue: "#00F5FF",
        neonPurple: "#8A2BE2",
      },
      boxShadow: {
        neon: "0 0 10px #00F5FF, 0 0 20px #FF2E9F",
      }
    },
  },
  plugins: [],
}