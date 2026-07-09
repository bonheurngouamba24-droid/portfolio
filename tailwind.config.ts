import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#0B0E11",     // fond neutre, base des deux univers
        panel: "#12161B",        // fond des cartes
        steel: "#2A323C",        // bordures / séparateurs
        // Univers A — Génie Industriel (panneau de contrôle)
        signal: "#F2A93B",       // ambre, voyant industriel
        blueprint: "#3E6B8A",    // bleu plan technique
        // Univers B — Finance Quant (terminal de marché)
        ticker: "#33FFA3",       // vert phosphore, hausse
        tickerDown: "#FF5C5C",   // rouge, baisse
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(rgba(62,107,138,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(62,107,138,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
} satisfies Config;
