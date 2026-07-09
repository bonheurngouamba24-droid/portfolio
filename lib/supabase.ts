import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variables d'environnement Supabase manquantes. Vérifie NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local (voir .env.example)."
  );
}

// Le client est utilisable côté serveur (Server Components) et côté client.
// Il ne manipule que des données en lecture publique (RLS), donc la clé anon suffit.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: {
    // Permet à Next.js de mettre en cache / revalider les appels comme du fetch natif (ISR 60s)
    fetch: (input, init = {}) =>
      fetch(input, { ...init, next: { revalidate: 60 } }),
  },
});
