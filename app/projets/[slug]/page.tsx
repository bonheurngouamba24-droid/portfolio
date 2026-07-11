import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/queries";

export const revalidate = 3600; // ISR : régénère la page 1x/heure max
// Si un projet a été ajouté dans Supabase après le build, sa page se génère
// quand même à la demande au lieu de renvoyer 404 (comportement par défaut,
// explicité ici pour éviter toute ambiguïté).
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Gloire Bonheur`,
    description: project.subtitle ?? project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const isFinance = project.universe === "finance";
  const accent = isFinance ? "text-ticker" : "text-signal";
  const backHref = `/projets?universe=${project.universe}`;

  return (
    <main className="min-h-screen bg-graphite px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href={backHref}
          className="font-mono text-xs text-white/40 hover:text-white"
        >
          ← Retour aux projets
        </Link>

        <p className={`mt-6 font-mono text-xs uppercase tracking-widest ${accent}`}>
          {isFinance ? "Finance Quant" : "Génie Industriel"}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          {project.title}
        </h1>
        {project.subtitle && (
          <p className="mt-3 text-lg text-white/60">{project.subtitle}</p>
        )}

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/80">
          {project.description}
        </p>

        {project.metrics && Object.keys(project.metrics).length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-steel bg-steel sm:grid-cols-3">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="bg-panel px-4 py-3">
                <dt className="font-mono text-[10px] uppercase leading-tight text-white/50">
                  {key.replace(/_/g, " ")}
                </dt>
                <dd className={`mt-1 font-mono text-xl ${accent}`}>{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Stack
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-sm border border-steel px-2 py-1 font-mono text-xs text-white/60"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.external_url && (
          <a
            href={project.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-10 inline-block rounded-sm px-5 py-3 font-mono text-xs uppercase tracking-wide ${
              isFinance ? "bg-ticker text-graphite" : "bg-signal text-graphite"
            }`}
          >
            Voir le repo / la démo
          </a>
        )}
      </div>
    </main>
  );
}
