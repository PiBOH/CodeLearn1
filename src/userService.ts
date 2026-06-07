import { supabase } from './supabaseClient';
import { APP_VERSION } from './context/AppContext';

/**
 * Salva e sincronizza i progressi dell'utente su Supabase usando la funzione
 * merge_progress (RPC lato database). La logica di merge è nel DB:
 *   - XP: prende il valore più alto tra DB e dispositivo
 *   - completedLessons: unione dei due array (nessuna perdita)
 *   - badges: unione dei due array (nessuna perdita)
 *   - level, streak: prende il valore più alto
 *
 * In questo modo Web (Vercel) e Android APK non si sovrascrivono mai a vicenda.
 *
 * @param username  Il nickname dell'utente (da localStorage 'current_user')
 * @param progressData  Snapshot aggiornato del progresso locale
 * @returns Il progressData finale dopo il merge (o null in caso di errore)
 */
export async function saveUserProgress(
  username: string,
  progressData: object,
): Promise<object | null> {

  // Non sincronizzare utenti locali o ospiti
  if (!username || username.endsWith('-LOCAL') || username.endsWith('-GUEST')) {
    console.log('[Sync] Utente locale/ospite — salvataggio Supabase saltato.');
    return null;
  }

  const platform = window.navigator.userAgent.includes('Android')
    ? 'Android APK'
    : 'Web (Vercel)';
  const deviceInfo = window.navigator.userAgent.slice(0, 255);

  try {
    // Chiama la funzione merge_progress definita in SUPABASE_SCHEMA.sql.
    // Questa funzione fa un INSERT se l'utente non esiste, altrimenti un UPDATE
    // con merge intelligente: non sovrascrive, ma unisce i progressi.
    const { data, error } = await supabase.rpc('merge_progress', {
      p_username:    username,
      p_new_data:    progressData,
      p_version:     APP_VERSION,
      p_platform:    platform,
      p_device_info: deviceInfo,
    });

    if (error) {
      console.error('[Sync] Errore merge_progress:', error.message);
      return null;
    }

    console.log('[Sync] Progressi sincronizzati su Supabase ✓');
    return data as object;

  } catch (err) {
    console.error('[Sync] Errore di rete:', err);
    return null;
  }
}

/**
 * Carica i progressi dell'utente dal cloud (Supabase).
 * Usato al login per recuperare i dati salvati da un altro dispositivo.
 *
 * @param username  Il nickname dell'utente
 * @returns Il progressData salvato su Supabase, o null se non trovato
 */
export async function loadUserProgress(username: string): Promise<object | null> {
  if (!username || username.endsWith('-LOCAL') || username.endsWith('-GUEST')) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress_data, updated_at')
      .ilike('username', username)
      .limit(1)
      .single();

    if (error || !data) {
      // Utente non ancora nel cloud — normale al primo accesso
      return null;
    }

    console.log('[Sync] Progressi caricati dal cloud ✓ (aggiornati il', data.updated_at, ')');
    return data.progress_data as object;

  } catch (err) {
    console.error('[Sync] Errore caricamento progressi:', err);
    return null;
  }
}
