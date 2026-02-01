module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["\"Manrope\"", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(15, 23, 42, 0.06), 0 18px 45px -20px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};
