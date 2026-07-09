export type Universe = "industrial" | "finance";

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio_industrial: string | null;
  bio_finance: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  cv_url: string | null;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  specialization: string | null;
  start_date: string | null;
  end_date: string | null;
  display_order: number;
}

export interface Experience {
  id: string;
  universe: Universe;
  title: string;
  organization: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  summary: string | null;
  bullet_points: string[] | null;
  display_order: number;
}

export interface Project {
  id: string;
  universe: Universe;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  cover_image_url: string | null;
  tech_stack: string[] | null;
  metrics: Record<string, string> | null;
  external_url: string | null;
  featured: boolean;
  display_order: number;
}

export interface Skill {
  id: string;
  universe: Universe;
  category: string;
  name: string;
  proficiency: number;
  display_order: number;
}

// Typage minimal pour createClient<Database>() — suffisant pour l'autocomplétion
// des .from("table").select() sur les tables utilisées par le site.
export interface Database {
  public: {
    Tables: {
      profile: { Row: Profile };
      education: { Row: Education };
      experiences: { Row: Experience };
      projects: { Row: Project };
      skills: { Row: Skill };
    };
  };
}
