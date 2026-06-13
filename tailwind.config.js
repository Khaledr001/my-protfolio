/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#b8b5cc",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        // shadcn/ui tokens (dark-themed to match the portfolio)
        foreground: "#fafafa",
        border: "#27272a",
        card: "#0a0a0a",
        "card-foreground": "#fafafa",
        muted: "#27272a",
        "muted-foreground": "#a1a1aa",
        background: "#050816",
        "primary-foreground": "#fafafa",
        "secondary-foreground": "#0a0a0a",
        destructive: "#ef4444",
        "destructive-foreground": "#fafafa",
        accent: "#27272a",
        "accent-foreground": "#fafafa",
        ring: "#a855f7",
        input: "#27272a",
      },
      borderColor: {
        DEFAULT: "#27272a",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.jpg')",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        loaderCircle: {
          "0%": {
            transform: "rotate(90deg)",
            boxShadow:
              "0 6px 12px 0 #38bdf8 inset, 0 12px 18px 0 #005dff inset, 0 36px 36px 0 #1e40af inset, 0 0 3px 1.2px rgba(56,189,248,0.3), 0 0 6px 1.8px rgba(0,93,255,0.2)",
          },
          "50%": {
            transform: "rotate(270deg)",
            boxShadow:
              "0 6px 12px 0 #60a5fa inset, 0 12px 6px 0 #0284c7 inset, 0 24px 36px 0 #005dff inset, 0 0 3px 1.2px rgba(56,189,248,0.3), 0 0 6px 1.8px rgba(0,93,255,0.2)",
          },
          "100%": {
            transform: "rotate(450deg)",
            boxShadow:
              "0 6px 12px 0 #4dc8fd inset, 0 12px 18px 0 #005dff inset, 0 36px 36px 0 #1e40af inset, 0 0 3px 1.2px rgba(56,189,248,0.3), 0 0 6px 1.8px rgba(0,93,255,0.2)",
          },
        },
        loaderLetter: {
          "0%, 100%": {
            opacity: "0.4",
            transform: "translateY(0)",
          },
          "20%": {
            opacity: "1",
            transform: "scale(1.15)",
          },
          "40%": {
            opacity: "0.7",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        loaderCircle: "loaderCircle 5s linear infinite",
        loaderLetter: "loaderLetter 3s infinite",
      },
    },
  },
  plugins: [],
};