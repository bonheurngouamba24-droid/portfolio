# Portfolio Dual Universe — Gloire Bonheur

## Fichiers livrés dans cette première étape

| Fichier | Rôle |
|---|---|
| `lib/schema.sql` | Schéma Supabase (Postgres) : `profile`, `experiences`, `projects`, `skills`, `education`, avec RLS en lecture publique |
| `lib/seed-data.json` | Données réelles 2026, au format exact des tables — à copier dans Supabase Table Editor ou à utiliser comme fixture de dev |
| `tailwind.config.ts` | Tokens de design (couleurs, polices) des deux univers |
| `components/DualUniverseHero.tsx` | Composant de page d'accueil avec le commutateur "relais" |

## À ajouter dans `app/layout.tsx` (polices + animation)

```tsx
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## À ajouter dans `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Utilisation dans `app/page.tsx`

```tsx
import DualUniverseHero from "@/components/DualUniverseHero";

export default function Home() {
  return <DualUniverseHero />;
}
```

## Étape 2 — Supabase réel + pages projets + déploiement continu

### Fichiers ajoutés

| Fichier | Rôle |
|---|---|
| `lib/types.ts` | Types TypeScript + typage minimal `Database` pour `createClient<Database>()` |
| `lib/supabase.ts` | Client Supabase unique (clé anon, lecture publique via RLS), fetch mis en cache 60s pour coller au modèle ISR de Next |
| `lib/queries.ts` | Toutes les fonctions de lecture : `getProfile`, `getAllProjects`, `getFeaturedProjects`, `getProjectBySlug`, `getAllProjectSlugs`, `getExperiences`, `getSkills`, `getEducation`, + `metricsToStats()` pour transformer le JSON `metrics` en paires label/valeur |
| `components/DualUniverseHero.tsx` | Refactorisé : n'a plus de données en dur. Reçoit `industrial`/`finance` (`{ lede, stats }`) en props. Le "chrome" éditorial (titre accrocheur, CTA) reste statique — c'est un choix de copywriting, pas une donnée |
| `components/ProjectCard.tsx` | Carte projet réutilisable, couleur d'accent selon `universe` |
| `app/page.tsx` | Page d'accueil : Server Component qui va chercher `profile` + le projet vedette de chaque univers dans Supabase et les passe à `DualUniverseHero`. **Filet de sécurité intégré** : si Supabase est vide ou injoignable, retombe sur un contenu par défaut crédible plutôt que d'afficher des trous |
| `app/projets/page.tsx` | Liste des projets avec onglets de filtrage par univers (`?universe=industrial\|finance`) |
| `app/projets/[slug]/page.tsx` | Page détail, générée statiquement pour chaque projet via `generateStaticParams`, avec `generateMetadata` pour le SEO |
| `.env.example` | Modèle des variables d'environnement à copier en `.env.local` |

### Installer les dépendances

```bash
npm install @supabase/supabase-js
```

(`next`, `react`, `tailwindcss` sont supposés déjà présents dans ton projet — sinon `npx create-next-app@latest` avec App Router + TypeScript + Tailwind avant d'ajouter ces fichiers.)

### Créer le projet Supabase

1. [supabase.com](https://supabase.com) → New Project.
2. SQL Editor → coller le contenu de `lib/schema.sql` → Run.
3. Table Editor → remplir `profile`, `education`, `experiences`, `projects`, `skills` à la main, **ou** importer les lignes de `lib/seed-data.json` (Table Editor → Insert → Import data from CSV/JSON, un tableau à la fois).
4. Project Settings → API → copier `Project URL` et `anon public key`.

### Variables d'environnement

```bash
cp .env.example .env.local
# puis colle l'URL et la clé anon dedans
```

### Pousser sur GitHub (`bonheurngouamba24-droid`)

```bash
cd portfolio
git init
git add .
git commit -m "Init: dual-universe portfolio + Supabase"
git branch -M main
git remote add origin https://github.com/bonheurngouamba24-droid/portfolio.git
git push -u origin main
```

(Crée d'abord le repo vide sur GitHub si ce n'est pas fait : github.com/new, sans README/gitignore pour éviter les conflits avec le premier push.)

### Connecter Vercel (déploiement automatique à chaque push)

1. [vercel.com](https://vercel.com) → Add New → Project → importer `bonheurngouamba24-droid/portfolio`.
2. Vercel détecte Next.js automatiquement, aucune config manuelle nécessaire.
3. Dans **Environment Variables**, ajouter `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (les mêmes que `.env.local`) — coche Production **et** Preview.
4. Deploy. Ensuite, chaque `git push` sur `main` redéploie automatiquement ; chaque push sur une autre branche génère une Preview URL séparée.

### Modifier le contenu sans toucher au code

Une fois en ligne, toute modification (nouveau projet, texte des bios, compétences) se fait dans **Supabase → Table Editor**. Grâce à `revalidate = 60` (ISR), le site reprend les changements en moins d'une minute, sans nouveau déploiement.

## Étape 3 (à venir)

- Sections `Expériences`, `Compétences`, `Formation` sur la page d'accueil, alimentées par `getExperiences`, `getSkills`, `getEducation`.
- Formulaire de contact (Supabase Edge Function ou Resend).
- Interface d'administration simplifiée (Supabase Studio suffit pour l'instant, mais un mini-dashboard maison reste possible plus tard).

Dis-moi quand tu veux enchaîner sur l'étape 3.
