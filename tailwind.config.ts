import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        champagne: {
          50: "#faf7f2",
          100: "#f5efe5",
          200: "#ebe0cc",
          300: "#dfd0b3",
          400: "#d2c099",
          500: "#c6b080",
          600: "#b09a66",
          700: "#9a8452",
          800: "#7d6b42",
          900: "#665638",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Montserrat", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
      },
      letterSpacing: {
        elegant: "0.05em",
        luxury: "0.1em",
      },
      textShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
        DEFAULT: "0 2px 4px rgba(0, 0, 0, 0.1)",
        lg: "0 8px 16px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addUtilities }) => {
      const newUtilities = {
        ".text-shadow-sm": {
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        },
        ".text-shadow": {
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        ".text-shadow-lg": {
          textShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        },
        ".text-shadow-gold": {
          textShadow: "0 2px 4px rgba(218, 165, 32, 0.3)",
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config

