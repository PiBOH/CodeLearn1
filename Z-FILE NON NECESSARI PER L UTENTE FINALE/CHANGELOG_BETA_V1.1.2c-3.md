# Changelog — CodeLearn BETA V1.1.2c-3

## [1.1.2c-3] — 2026-05-24

### ⚠️ Nota
- Il build della versione precedente (1.1.2c-2) era in realtà **completamente
  funzionante** — npm run build, cap sync e gradlew assembleDebug erano tutti
  andati a buon fine. Il `(!)` di Vite era solo un avviso sul chunk size (705 kB
  > 500 kB), non un errore bloccante.

### 🛠 Miglioramenti
- **`vite.config.ts`**: aggiunto code splitting con `manualChunks` per separare
  React e Supabase SDK dall'app principale. Il bundle viene ora suddiviso in
  più chunk più piccoli, eliminando l'avviso di Vite.
  Alzato anche `chunkSizeWarningLimit` a 600 kB come soglia di sicurezza.

---

# Changelog — CodeLearn BETA V1.1.2c-2

## [1.1.2c-2] — 2026-05-24

### 🐛 Fix
- **Fix import in `src/userService.ts`**: le righe
  `import { supabase } from '../supabaseClient'` e
  `import { APP_VERSION } from '../context/AppContext'` usavano `../`
  che usciva dalla cartella `src/`. Corretti in `./supabaseClient` e
  `./context/AppContext`.
- `npm run build` non produceva più errori TS2307.

---

# Changelog — CodeLearn BETA V1.1.2c-1

## [1.1.2c-1] — 2026-05-23

### ✨ Novità
- **GUIDA_SUPABASE_SYNC.md riscritta**: guida completamente rifatta con tutti
  i passi che devi fare sul PC — prerequisiti Node.js, modifica .env, npm install,
  npm run dev, push GitHub, configurazione Vercel, Secrets GitHub Actions,
  build APK manuale e via Actions. Include checklist finale e troubleshooting.
- **GUIDA_SUPABASE_SYNC_OLD.md**: la versione precedente della guida conservata
  con suffisso _OLD.

### 🛠 Modifiche
- Versione aggiornata a `1.1.2c-1` ovunque.
- `SUPABASE_SCHEMA.sql`: versione interna aggiornata.

---

# Changelog — CodeLearn BETA V1.1.2b-1

## [1.1.2b-1] — 2026-05-23

### ✨ Novità
- **Merge intelligente Supabase**: `saveUserProgress()` ora usa la funzione RPC
  `merge_progress` (definita in `SUPABASE_SCHEMA.sql`) invece di un semplice `upsert`.
  Web e Android non si sovrascrivono più — i progressi vengono sempre fusi
  prendendo XP più alto, unione di lezioni completate e badge.
- **loadUserProgress()**: nuova funzione in `src/services/userService.ts` per
  caricare i progressi dal cloud al momento del login.
- **GUIDA_SUPABASE_SYNC.md**: guida completa step-by-step per configurare
  Supabase, le variabili d'ambiente su Vercel e i Secrets per GitHub Actions.

### 🛠 Modifiche tecniche
- `src/services/userService.ts`: sostituito `supabase.upsert()` con
  `supabase.rpc('merge_progress', {...})`. Aggiunta funzione `loadUserProgress()`.
- `src/userService.ts`: aggiornato in sincronia.
- `SUPABASE_SCHEMA.sql`: versione aggiornata a `1.1.2b-1`.

### 🐛 Fix (da versione precedente 1.1.2a-3)
- Rinomina `userServide.ts` → `userService.ts` (typo rimosso).
- Fix import `'../supabaseClient'` → `'./supabaseClient'` in `src/userService.ts`.

---
