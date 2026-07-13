"use client";

import { useState } from "react";
import type { Experience, Skill, Education, Certification } from "@/lib/types";

export type UniverseKey = "industrial" | "finance";

export interface UniverseData {
  lede: string;
  stats: { label: string; value: string }[];
}

export interface DualUniverseHeroProps {
  industrial: UniverseData;
  finance: UniverseData;
  experiences: { industrial: Experience[]; finance: Experience[] };
  skills: { industrial: Skill[]; finance: Skill[] };
  education: Education[];
  certifications: { industrial: Certification[]; finance: Certification[] };
}

// Habillage éditorial (titre accrocheur, libellés) : choix de copywriting fixes.
// Le contenu factuel (lede, stats) arrive en props depuis Supabase — voir app/page.tsx.
const CHROME: Record<
  UniverseKey,
  { eyebrow: string; title: string; ctaPrimary: string; ctaSecondary: string }
> = {
  industrial: {
    eyebrow: "UNIVERS A — GÉNIE INDUSTRIEL",
    title: "Je conçois des systèmes qui ne tombent pas en panne sans prévenir.",
    ctaPrimary: "Voir les projets industriels",
    ctaSecondary: "Stage Maroc Organic — SEO & Flux Digitaux",
  },
  finance: {
    eyebrow: "UNIVERS B — TRADING QUANTITATIF",
    title: "Je teste mes convictions de marché avant de les croire.",
    ctaPrimary: "Voir les projets quant",
    ctaSecondary: "Dashboard de visualisation de marché",
  },
};

export default function DualUniverseHero({
  industrial,
  finance,
  experiences,
  skills,
  education,
  certifications,
}: DualUniverseHeroProps) {
  const [universe, setUniverse] = useState<UniverseKey>("industrial");
  const isFinance = universe === "finance";
  const chrome = CHROME[universe];
  const data = universe === "finance" ? finance : industrial;
  const currentExperiences = universe === "finance" ? experiences.finance : experiences.industrial;
  const currentSkills = universe === "finance" ? skills.finance : skills.industrial;
  const currentCertifications =
    universe === "finance" ? certifications.finance : certifications.industrial;

  return (
    <>
    <section className="relative min-h-screen w-full overflow-hidden bg-graphite text-white font-body">
      {/* Fond dynamique : grille de plan technique vs bandeau ticker */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          isFinance ? "opacity-0" : "opacity-100"
        } bg-blueprint-grid bg-grid`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          isFinance ? "opacity-100" : "opacity-0"
        }`}
      >
        <TickerBackground />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24">
        {/* Nom + statut */}
        <div className="mb-10 flex items-center justify-between">
          <span className="font-display text-lg tracking-tight">Gloire Bonheur</span>
          <span className="font-mono text-xs text-steel">Casablanca, MA · 2026</span>
        </div>

        {/* Le commutateur — élément signature, en forme de levier de relais */}
        <RelaySwitch universe={universe} onChange={setUniverse} />

        {/* Contenu dynamique */}
        <div key={universe} className="mt-12 max-w-2xl animate-[fadeIn_0.5s_ease]">
          <p
            className={`font-mono text-xs tracking-[0.2em] ${
              isFinance ? "text-ticker" : "text-signal"
            }`}
          >
            {chrome.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            {chrome.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">{data.lede}</p>

          {/* Readouts style panneau de contrôle / terminal de marché */}
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-steel bg-steel">
            {data.stats.map((s) => (
              <div key={s.label} className="bg-panel px-4 py-3">
                <dt className="font-mono text-[10px] uppercase leading-tight text-white/50">
                  {s.label}
                </dt>
                <dd
                  className={`mt-1 font-mono text-xl ${
                    isFinance ? "text-ticker" : "text-signal"
                  }`}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={`/projets?universe=${universe}`}
              className={`rounded-sm px-5 py-3 font-mono text-xs uppercase tracking-wide transition-colors ${
                isFinance
                  ? "bg-ticker text-graphite hover:bg-ticker/85"
                  : "bg-signal text-graphite hover:bg-signal/85"
              }`}
            >
              {chrome.ctaPrimary}
            </a>
            <span className="font-mono text-xs text-white/40">{chrome.ctaSecondary}</span>
          </div>
        </div>
      </div>
    </section>

      {/* Sections synchronisées avec le même commutateur univers */}
      <ExperienceSection experiences={currentExperiences} isFinance={isFinance} />
      <SkillsSection skills={currentSkills} isFinance={isFinance} />
      <CertificationsSection certifications={currentCertifications} isFinance={isFinance} />
      <EducationSection education={education} />
      <TimelineSection />
    </>
  );
}

/** Frise des expériences — filtrée par univers, style panneau de contrôle / terminal */
function ExperienceSection({
  experiences,
  isFinance,
}: {
  experiences: Experience[];
  isFinance: boolean;
}) {
  const accent = isFinance ? "text-ticker" : "text-signal";
  const border = isFinance ? "border-ticker/30" : "border-signal/30";

  if (experiences.length === 0) return null;

  return (
    <section className="bg-graphite px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className={`font-mono text-xs uppercase tracking-widest ${accent}`}>Parcours</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Expériences</h2>

        <div className="mt-8 space-y-8">
          {experiences.map((exp) => (
            <div key={exp.id} className={`border-l-2 ${border} pl-5`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg">{exp.title}</h3>
                <span className="font-mono text-xs text-white/40">
                  {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/60">
                {exp.organization}
                {exp.location ? ` — ${exp.location}` : ""}
              </p>
              {exp.summary && <p className="mt-2 text-sm text-white/70">{exp.summary}</p>}
              {exp.bullet_points && exp.bullet_points.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {exp.bullet_points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm text-white/70">
                      <span className={accent}>—</span>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDateRange(start: string, end: string | null, isCurrent: boolean): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
  if (isCurrent) return `Depuis ${fmt(start)}`;
  if (!end) return fmt(start);
  return `${fmt(start)} – ${fmt(end)}`;
}

/** Grille de compétences — filtrée par univers, groupées par catégorie */
function SkillsSection({ skills, isFinance }: { skills: Skill[]; isFinance: boolean }) {
  const accent = isFinance ? "text-ticker" : "text-signal";
  const barColor = isFinance ? "bg-ticker" : "bg-signal";

  if (skills.length === 0) return null;

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section className="border-t border-steel bg-graphite px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className={`font-mono text-xs uppercase tracking-widest ${accent}`}>Savoir-faire</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Compétences</h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {categories.map((category) => (
            <div key={category}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                {category}
              </p>
              <div className="mt-3 space-y-3">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <div key={skill.id}>
                      <p className="text-sm text-white/80">{skill.name}</p>
                      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-panel">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Certifications — filtrées par univers. Aucun fichier stocké : chaque carte pointe vers un lien externe. */
function CertificationsSection({
  certifications,
  isFinance,
}: {
  certifications: Certification[];
  isFinance: boolean;
}) {
  const accent = isFinance ? "text-ticker" : "text-signal";
  const btnColor = isFinance ? "bg-ticker text-graphite" : "bg-signal text-graphite";

  if (certifications.length === 0) return null;

  return (
    <section className="border-t border-steel bg-graphite px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className={`font-mono text-xs uppercase tracking-widest ${accent}`}>Reconnu par</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Certifications</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div key={cert.id} className="rounded-md border border-steel bg-panel p-5">
              <h3 className="font-display text-lg leading-snug">{cert.name}</h3>
              <p className="mt-1 text-sm text-white/60">
                {cert.organization}
                {cert.issue_date &&
                  ` — ${new Date(cert.issue_date).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}`}
              </p>
              {cert.description && (
                <p className="mt-2 text-sm text-white/70">{cert.description}</p>
              )}
              <a
                href={cert.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 inline-block rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wide ${btnColor}`}
              >
                Voir le certificat
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function EducationSection({ education }: { education: Education[] }) {
  if (education.length === 0) return null;

  return (
    <section className="border-t border-steel bg-graphite px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">Parcours académique</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Formation</h2>

        <div className="mt-8 space-y-6">
          {education.map((ed) => (
            <div key={ed.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-steel pb-4">
              <div>
                <h3 className="font-display text-lg">{ed.degree}</h3>
                <p className="mt-1 text-sm text-white/60">{ed.institution}</p>
                {ed.specialization && (
                  <p className="mt-1 text-sm text-white/50">{ed.specialization}</p>
                )}
              </div>
              {ed.start_date && (
                <span className="font-mono text-xs text-white/40">
                  {new Date(ed.start_date).getFullYear()}
                  {ed.end_date ? ` – ${new Date(ed.end_date).getFullYear()}` : ""}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Frise chronologique — trajectoire de carrière, commune aux deux univers */
const CAREER_MILESTONES: { year: string; label: string; isGoal?: boolean }[] = [
  { year: "2023", label: "Baccalauréat Sciences et Technologies — Maintenance Industrielle" },
  { year: "2024", label: "Entrée en cycle préparatoire intégré" },
  { year: "2026", label: "Fin du cycle préparatoire intégré" },
  { year: "2026", label: "Entrée en cycle ingénieur Génie Industriel" },
  {
    year: "Objectif",
    label:
      "Ingénieur industriel spécialisé en production, logistique, automatisation et systèmes intelligents",
    isGoal: true,
  },
];

function TimelineSection() {
  return (
    <section className="border-t border-steel bg-graphite px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">Trajectoire</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Ligne du temps</h2>

        <div className="mt-10 border-l border-steel pl-8">
          {CAREER_MILESTONES.map((m, i) => (
            <div key={i} className="relative pb-10 last:pb-0">
              <span
                className={`absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full ${
                  m.isGoal ? "bg-white" : "bg-steel"
                }`}
              />
              <p className="font-mono text-xs uppercase tracking-widest text-white/40">{m.year}</p>
              <p
                className={`mt-1 ${
                  m.isGoal ? "font-display text-lg text-white" : "text-sm text-white/70"
                }`}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function RelaySwitch({
  universe,
  onChange,
}: {
  universe: UniverseKey;
  onChange: (u: UniverseKey) => void;
}) {
  const isFinance = universe === "finance";
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={isFinance}
        aria-label="Basculer entre Génie Industriel et Trading Quant"
        onClick={() => onChange(isFinance ? "industrial" : "finance")}
        className="group relative h-16 w-32 rounded-sm border border-steel bg-panel p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <span
          className={`absolute inset-y-1 w-[58px] rounded-sm shadow-lg transition-all duration-300 ease-out ${
            isFinance ? "left-[68px] bg-ticker" : "left-1 bg-signal"
          }`}
        />
        <span className="relative z-10 flex h-full items-center justify-between px-2 font-mono text-[9px] uppercase tracking-wide">
          <span className={isFinance ? "text-white/40" : "text-graphite"}>Ind.</span>
          <span className={isFinance ? "text-graphite" : "text-white/40"}>Quant</span>
        </span>
      </button>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
        Double identité — cliquez pour basculer
      </span>
    </div>
  );
}

/** Motif de fond façon bandeau de cotations (chandeliers) pour l'univers Finance */
function TickerBackground() {
  const candles = Array.from({ length: 40 }, (_, i) => {
    const up = i % 3 !== 0;
    const height = 20 + ((i * 37) % 60);
    return { up, height, i };
  });
  return (
    <div className="flex h-full w-full items-end gap-3 px-6 opacity-[0.12]">
      {candles.map((c) => (
        <div
          key={c.i}
          className={`w-2 ${c.up ? "bg-ticker" : "bg-tickerDown"}`}
          style={{ height: `${c.height}%` }}
        />
      ))}
    </div>
  );
}
