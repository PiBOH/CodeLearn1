// ─────────────────────────────────────────────────────────────────────────────
// supabase.ts — Client Supabase via REST API (nessun SDK esterno)
// CodeLearn v1.1.0a - The Synch Update
//
// CONFIGURAZIONE: crea un file .env nella root del progetto con:
//   VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//
// SCHEMA SQL (esegui in Supabase → SQL Editor):
//   Vedi file SUPABASE_SCHEMA.sql nella root del progetto
// ─────────────────────────────────────────────────────────────────────────────

import type { UserProgress } from '../context/AppContext';

const SUPABASE_URL     = (import.meta.env.VITE_SUPABASE_URL     as string | undefined) ?? '';
const SUPABASE_ANON_KEY= (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';

/** True se le variabili d'ambiente Supabase sono configurate */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// ── Tipi ─────────────────────────────────────────────────────────────────────

export interface CloudUser {
  id: string;
  username: string;
  last_version: string;
  platform: string;
  device_info: string;
  progress_data: UserProgress;
  created_at: string;
  updated_at: string;
}

export interface UserSuggestion {
  id: string;
  username: string;
  last_version: string;
  platform: string;
}

// ── Fetch base ────────────────────────────────────────────────────────────────

async function sbFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  prefer = 'return=representation',
): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase non configurato.\n' +
      'Aggiungi VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nel file .env'
    );
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text();

  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text)?.message ?? text; } catch { /* noop */ }
    throw new Error(`Supabase [${res.status}]: ${msg}`);
  }

  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

// ── API pubbliche ─────────────────────────────────────────────────────────────

/**
 * Cerca utenti il cui username inizia con `query` (case-insensitive).
 * Usato per i suggerimenti in tempo reale nell'onboarding.
 */
export async function searchUsersByName(query: string): Promise<UserSuggestion[]> {
  if (!query || query.length < 2) return [];
  const encoded = encodeURIComponent(query);
  const results = await sbFetch<CloudUser[]>(
    `users?username=ilike.${encoded}*&select=id,username,last_version,platform&limit=6&order=username.asc`,
    {},
    '',
  );
  return (results ?? []).map(u => ({
    id: u.id,
    username: u.username,
    last_version: u.last_version,
    platform: u.platform,
  }));
}

/**
 * Recupera un utente per nome esatto (case-insensitive).
 */
export async function getUserByUsername(username: string): Promise<CloudUser | null> {
  const results = await sbFetch<CloudUser[]>(
    `users?username=ilike.${encodeURIComponent(username)}&select=*&limit=1`,
    {},
    '',
  );
  return results?.[0] ?? null;
}

/**
 * Crea un nuovo utente nel DB e restituisce il record creato.
 */
export async function createCloudUser(data: {
  username: string;
  last_version: string;
  platform: string;
  device_info: string;
  progress_data: UserProgress;
}): Promise<CloudUser> {
  const result = await sbFetch<CloudUser[]>(
    'users',
    { method: 'POST', body: JSON.stringify(data) },
  );
  const user = Array.isArray(result) ? result[0] : result;
  if (!user) throw new Error('Creazione utente fallita: nessun record restituito');
  return user as CloudUser;
}

/**
 * Aggiorna i dati di un utente esistente tramite ID.
 */
export async function updateCloudUser(
  id: string,
  data: Partial<{
    last_version: string;
    platform: string;
    device_info: string;
    progress_data: UserProgress;
  }>,
): Promise<void> {
  await sbFetch(
    `users?id=eq.${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
    },
    'return=minimal',
  );
}

/**
 * Genera un username univoco aggiungendo un suffisso numerico se necessario.
 * Es: "Luca" → "Luca2" → "Luca3" ...
 */
export async function generateUniqueUsername(base: string): Promise<string> {
  // Prima prova il nome base
  const existing = await getUserByUsername(base);
  if (!existing) return base;

  // Prova con suffisso numerico
  for (let i = 2; i <= 99; i++) {
    const candidate = `${base}${i}`;
    const check = await getUserByUsername(candidate);
    if (!check) return candidate;
  }

  // Fallback con timestamp
  return `${base}_${Date.now().toString(36)}`;
}
