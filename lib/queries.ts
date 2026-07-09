import { supabase } from "./supabase";
import type { Universe } from "./types";

export async function getProfile() {
  const { data, error } = await supabase.from("profile").select("*").single();
  if (error) throw error;
  return data;
}

export async function getEducation() {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return data;
}

export async function getExperiences(universe?: Universe) {
  let query = supabase.from("experiences").select("*").order("display_order");
  if (universe) query = query.eq("universe", universe);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAllProjects(universe?: Universe) {
  let query = supabase.from("projects").select("*").order("display_order");
  if (universe) query = query.eq("universe", universe);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFeaturedProjects(universe: Universe, limit = 3) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("universe", universe)
    .eq("featured", true)
    .order("display_order")
    .limit(limit);
  if (error) throw error;
  return data;
}

/** Utilisé par generateStaticParams() pour pré-générer toutes les pages projet au build. */
export async function getAllProjectSlugs() {
  const { data, error } = await supabase.from("projects").select("slug");
  if (error) throw error;
  return (data ?? []).map((p) => p.slug);
}

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getSkills(universe?: Universe) {
  let query = supabase.from("skills").select("*").order("display_order");
  if (universe) query = query.eq("universe", universe);
  const { data, error } = await query;
  if (error) throw error;
  return data;
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
