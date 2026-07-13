import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#08090B",     // noir profond, fond partagé des deux univers
        panel: "#111418",        // fond des cartes
        steel: "#3A4048",        // gris métallisé — bordures / séparateurs
        // Univers A — Génie Industriel
        signal: "#C6752B",       // orange cuivre, accent principal industriel
        blueprint: "#4A7FB5",    // bleu industriel, accent secondaire / plans techniques
        // Univers B — Marchés Financiers
        ticker: "#10B981",       // vert émeraude, accent principal finance
        tickerDown: "#8B5CF6",   // violet, accent secondaire finance
        navy: "#111C33",         // bleu nuit, teinte de fond finance
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(rgba(74,127,181,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(74,127,181,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
} satisfies Config;
