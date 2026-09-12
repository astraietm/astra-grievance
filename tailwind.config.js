/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#070b14",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(30, 41, 59, 0.8)",
          glow: "#06b6d4",
          accent: "#3b82f6",
          purple: "#8b5cf6",
          dark: "#0a0f1d",
          muted: "#94a3b8"
        }
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 70%), linear-gradient(rgba(15, 23, 42, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.8) 1px, transparent 1px)",
        'cyber-gradient': "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(139, 92, 246, 0.15) 100%)",
      },
      boxShadow: {
        'cyber-glow': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'cyber-border': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
