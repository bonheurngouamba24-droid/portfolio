import { getAllProjects } from "@/lib/queries";
import type { Universe } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

export const revalidate = 60; // ISR : relit Supabase toutes les 60s max

const TABS: { key: Universe | "all"; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "industrial", label: "Génie Industriel" },
  { key: "finance", label: "Finance Quant" },
];

export default async function ProjetsPage({
  searchParams,
}: {
  searchParams: { universe?: string };
}) {
  const active = (searchParams.universe as Universe | undefined) ?? undefined;
  const projects = await getAllProjects(active);

  return (
    <main className="min-h-screen bg-graphite px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">
          Portfolio
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Tous les projets</h1>

        <nav className="mt-8 flex gap-2 border-b border-steel pb-4">
          {TABS.map((tab) => {
            const isActive =
              (tab.key === "all" && !active) || tab.key === active;
            return (
              <Link
                key={tab.key}
                href={tab.key === "all" ? "/projets" : `/projets?universe=${tab.key}`}
                className={`rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  isActive
                    ? "bg-white text-graphite"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {projects.length === 0 ? (
          <p className="mt-10 font-mono text-sm text-white/40">
            Aucun projet pour l'instant dans cette catégorie — ajoute-en un depuis le
            Dashboard Supabase (table <code>projects</code>).
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
