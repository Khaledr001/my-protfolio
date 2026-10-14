/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0F17",
          900: "#0F1420",
          850: "#121826",
          800: "#182033",
          700: "#232C42",
        },
        fg: {
          DEFAULT: "#E9E6DF",
          muted: "#B2B6C3",
          subtle: "#8B93A7",
        },
        // Warm lamp / coffee light: the primary accent.
        accent: {
          DEFAULT: "#F2A65A",
          soft: "#F7C08A",
          deep: "#D9822B",
        },
        // Cool monitor glow: the secondary accent.
        cool: {
          DEFAULT: "#4FD1C5",
          soft: "#81E6D9",
        },
      },
      fontFamily: {
        sans: ['"Geist Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      screens: {
        xs: "450px",
      },
      keyframes: {
        "scroll-cue": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "45%": { transform: "scaleY(1)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
        pulse_dot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "scroll-cue": "scroll-cue 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "pulse-dot": "pulse_dot 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
