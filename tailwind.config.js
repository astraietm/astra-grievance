/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Pixelify Sans"', '"Press Start 2P"', 'monospace', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'monospace', 'cursive'],
        mono: ['"Space Mono"', 'monospace', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        neo: {
          bg: "#0C0C12",
          dark: "#0C0C12",
          card: "#161622",
          cardHover: "#1E1E2E",
          yellow: "#FFE600",
          cyan: "#00F0FF",
          pink: "#FF2E93",
          green: "#00FF66",
          orange: "#FF6B00",
          purple: "#A855F7",
          red: "#FF3366",
          border: "#000000",
          borderLight: "#2E2E3E",
          muted: "#94A3B8",
        },
        cyber: {
          bg: "#0C0C12",
          card: "#161622",
          border: "#000000",
          glow: "#00F0FF",
          accent: "#FFE600",
          purple: "#FF2E93",
          dark: "#0C0C12",
          muted: "#94A3B8"
        }
      },
      backgroundImage: {
        'pixel-grid': "radial-gradient(circle, rgba(0,240,255,0.15) 1px, transparent 1px)",
        'scanline': "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
        'cyber-grid': "linear-gradient(rgba(0, 240, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.07) 1px, transparent 1px)",
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
        'neo-cyan': '4px 4px 0px 0px #00F0FF',
        'neo-cyan-lg': '6px 6px 0px 0px #00F0FF',
        'neo-yellow': '4px 4px 0px 0px #FFE600',
        'neo-yellow-lg': '6px 6px 0px 0px #FFE600',
        'neo-pink': '4px 4px 0px 0px #FF2E93',
        'neo-pink-lg': '6px 6px 0px 0px #FF2E93',
        'neo-green': '4px 4px 0px 0px #00FF66',
        'neo-white': '4px 4px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      }
    },
  },
  plugins: [],
}
