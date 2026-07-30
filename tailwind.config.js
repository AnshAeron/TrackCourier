/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1a56db",
          blueDark: "#0f2d6b",
          navy: "#0b1f4d",
          red: "#e02424",
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(16, 42, 90, 0.15)",
        soft: "0 4px 20px -6px rgba(16, 42, 90, 0.10)",
      },
    },
  },
  plugins: [],
};
