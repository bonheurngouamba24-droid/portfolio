import DualUniverseHero, { type UniverseData } from "@/components/DualUniverseHero";
import { getProfile, getFeaturedProjects, metricsToStats } from "@/lib/queries";

export const revalidate = 60; // ISR : relit Supabase toutes les 60s max, pas de rebuild manuel

// Filet de sécurité : si Supabase est vide (site tout juste créé) ou injoignable,
// la page reste crédible plutôt que d'afficher des trous.
const FALLBACK: Record<"industrial" | "finance", UniverseData> = {
  industrial: {
    lede: "Étudiant en cycle préparatoire intégré à l'ESTEM, je travaille sur la maintenance prédictive, l'automatisme et l'optimisation des flux — du capteur à la donnée exploitable.",
    stats: [
      { label: "Accuracy — détection anomalies", value: "98%" },
      { label: "Sensibilité du modèle", value: "99%" },
      { label: "Échantillonnage", value: "20 kHz" },
    ],
  },
  finance: {
    lede: "En parallèle du génie industriel, je développe des scripts de backtesting et d'analyse quantitative pour évaluer des stratégies momentum sous contrainte de gestion du risque.",
    stats: [
      { label: "Approche", value: "Momentum" },
      { label: "Discipline", value: "Risk-managed" },
      { label: "Méthode", value: "Backtest-first" },
    ],
  },
};

export default async function Home() {
  const [profile, industrialProject, financeProject] = await Promise.all([
    getProfile().catch(() => null),
    getFeaturedProjects("industrial", 1)
      .then((rows) => rows[0] ?? null)
      .catch(() => null),
    getFeaturedProjects("finance", 1)
      .then((rows) => rows[0] ?? null)
      .catch(() => null),
  ]);

  const industrial: UniverseData = {
    lede: profile?.bio_industrial || FALLBACK.industrial.lede,
    stats: metricsToStats(industrialProject?.metrics, FALLBACK.industrial.stats),
  };
  const finance: UniverseData = {
    lede: profile?.bio_finance || FALLBACK.finance.lede,
    stats: metricsToStats(financeProject?.metrics, FALLBACK.finance.stats),
  };

  return <DualUniverseHero industrial={industrial} finance={finance} />;
}
