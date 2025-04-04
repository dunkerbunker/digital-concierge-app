// tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"], // Required for ShadCN UI dark mode
  content: [
    './pages/**/*.{ts,tsx}', // Keep if you might have pages dir later (unlikely for this project)
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}', // Include src if you have/plan one
	],
  prefix: "", // You can add a prefix if needed, but usually leave empty
  theme: {
    container: { // Default container settings (ShadCN might override/extend)
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: { // Required for ShadCN UI animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: { // Required for ShadCN UI animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Required for ShadCN UI animations
} satisfies Config

export default config