import { supabase } from "./supabase";
import type { Universe, Profile, Education, Experience, Project, Skill } from "./types";

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from("profile").select("*").maybeSingle();
  if (error) return null;
  return data as Profile | null;
}

export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return (data ?? []) as Education[];
}

export async function getExperiences(universe?: Universe): Promise<Experience[]> {
  let query = supabase.from("experiences").select("*").order("display_order");
  if (universe) query = query.eq("universe", universe);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Experience[];
}

export async function getAllProjects(universe?: Universe): Promise<Project[]> {
  let query = supabase.from("projects").select("*").order("display_order");
  if (universe) query = query.eq("universe", universe);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function getFeaturedProjects(universe: Universe, limit = 3): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("universe", universe)
    .eq("featured", true)
    .order("display_order")
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Project[];
}

/** Utilisé par generateStaticParams() pour pré-générer toutes les pages projet au build. */
export async function getAllProjectSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("projects").select("slug");
  if (error) throw error;
  return ((data ?? []) as { slug: string }[]).map((p) => p.slug);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return data as Project | null;
}

export async function getSkills(universe?: Universe): Promise<Skill[]> {
  let query = supabase.from("skills").select("*").order("display_order");
  if (universe) query = query.eq("universe", universe);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Skill[];
}

/** Transforme un objet metrics ({accuracy: "98%", ...}) en paires label/valeur affichables. */
export function metricsToStats(
  metrics: Record<string, string> | null | undefined,
  fallback: { label: string; value: string }[]
): { label: string; value: string }[] {
  if (!metrics || Object.keys(metrics).length === 0) return fallback;
  return Object.entries(metrics)
    .slice(0, 3)
    .map(([key, value]) => ({ label: humanizeKey(key), value }));
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
