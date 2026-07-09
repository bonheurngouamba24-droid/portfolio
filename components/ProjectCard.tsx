import Link from "next/link";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  const isFinance = project.universe === "finance";
  const accent = isFinance ? "text-ticker" : "text-signal";
  const border = isFinance ? "hover:border-ticker/50" : "hover:border-signal/50";

  return (
    <Link
      href={`/projets/${project.slug}`}
      className={`group block rounded-md border border-steel bg-panel p-5 transition-colors ${border}`}
    >
      <p className={`font-mono text-[10px] uppercase tracking-widest ${accent}`}>
        {isFinance ? "Finance Quant" : "Génie Industriel"}
      </p>
      <h3 className="mt-2 font-display text-xl leading-snug">{project.title}</h3>
      {project.subtitle && (
        <p className="mt-1 text-sm text-white/60">{project.subtitle}</p>
      )}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <li
              key={tech}
              className="rounded-sm border border-steel px-2 py-1 font-mono text-[10px] text-white/50"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      <span className={`mt-4 inline-block font-mono text-xs ${accent} opacity-0 transition-opacity group-hover:opacity-100`}>
        Voir le détail →
      </span>
    </Link>
  );
}
