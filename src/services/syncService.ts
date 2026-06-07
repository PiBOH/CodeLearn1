// ─────────────────────────────────────────────────────────────────────────────
// syncService.ts — Sincronizzazione bidirezionale con Supabase
// CodeLearn BETA V1.1.2b-1 - The Synch Update
//
// Questa classe gestisce la sync tra dispositivi (web ↔ Android APK):
//   - mergeAndSave()  → invia i progressi locali e riceve il merge dal server
//   - loadFromCloud() → scarica i progressi più aggiornati dal DB
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '../supabaseClient';
import type { UserProgress } from '../context/AppContext';

const APP_VERSION = '1.1.2b-1';

function getPlatform(): string {
  if (typeof window === 'undefined') return 'Unknown';
  return window.navigator.userAgent.includes('Android')
    ? 'Android APK'
    : 'Web (Vercel)';
}

function getDeviceInfo(): string {
  return typeof window !== 'undefined' ? window.navigator.userAgent : '';
}

// ── Tipi ──────────────────────────────────────────────────────────────────────

export interface SyncResult {
  success: boolean;
  mergedProgress?: UserProgress;
  error?: string;
}

// ── Funzioni pubbliche ────────────────────────────────────────────────────────

/**
 * Invia i progressi locali a Supabase invocando la funzione SQL `merge_progress`.
 * Il server applica la logica "prendi il meglio" (XP più alto, unione lezioni)
 * e restituisce il progresso unificato, che va salvato anche in localStorage.
 *
 * @param username   Username dell'utente (da localStorage 'current_user')
 * @param localProgress  Oggetto progresso attuale dal contesto React
 * @returns SyncResult con il progresso finale dopo il merge
 */
export async function mergeAndSave(
  username: string,
  localProgress: UserProgress,
): Promise<SyncResult> {
  if (!username || username.endsWith('-LOCAL') || username.endsWith('-GUEST')) {
    return { success: false, error: 'Utente locale/ospite: sync saltato.' };
  }

  try {
    const { data, error } = await supabase.rpc('merge_progress', {
      p_username:    username,
      p_new_data:    localProgress,
      p_version:     APP_VERSION,
      p_platform:    getPlatform(),
      p_device_info: getDeviceInfo(),
    });

    if (error) {
      console.error('[SyncService] merge_progress error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('[SyncService] Merge completato con successo.');
    return { success: true, mergedProgress: data as UserProgress };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[SyncService] Eccezione durante merge:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Scarica i progressi dell'utente dal cloud (usato al login per
 * ripristinare i progressi su un nuovo dispositivo).
 *
 * @param username  Username da cercare nel DB
 * @returns Il progress_data salvato su Supabase, o null se non trovato
 */
export async function loadFromCloud(username: string): Promise<UserProgress | null> {
  if (!username) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress_data')
      .ilike('username', username)
      .limit(1)
      .single();

    if (error || !data) return null;
    return data.progress_data as UserProgress;
  } catch {
    return null;
  }
}

/**
 * Salva i progressi su Supabase con un semplice upsert (senza merge).
 * Usato come fallback se merge_progress non è disponibile.
 */
export async function saveUserProgress(
  username: string,
  progressData: UserProgress | object,
): Promise<void> {
  if (!username || username.endsWith('-LOCAL') || username.endsWith('-GUEST')) {
    console.log('[SyncService] Utente locale/ospite: upsert saltato.');
    return;
  }

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        username,
        last_version:  APP_VERSION,
        platform:      getPlatform(),
        device_info:   getDeviceInfo(),
        progress_data: progressData,
      },
      { onConflict: 'username' },
    );

  if (error) {
    console.error('[SyncService] Errore upsert:', error.message);
  } else {
    console.log('[SyncService] Progressi salvati su Supabase.');
  }
}
