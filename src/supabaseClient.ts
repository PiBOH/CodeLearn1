import { createClient } from '@supabase/supabase-js';

// Legge le variabili dal file .env che hai appena corretto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRORE: Chiavi di Supabase non trovate nel file .env!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);