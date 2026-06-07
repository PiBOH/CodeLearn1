# 🗄️ Guida Completa — Sincronizzazione Supabase
### CodeLearn BETA V1.1.2c-3 · The Synch Update

Questa guida spiega come configurare Supabase per sincronizzare automaticamente
i progressi tra **Android APK** e **sito Vercel** ogni volta che l'utente
completa una lezione o un corso.

---

## 📋 Indice

1. [Come funziona la sincronizzazione](#1-come-funziona)
2. [Creare il progetto Supabase](#2-creare-il-progetto-supabase)
3. [Eseguire lo schema SQL](#3-eseguire-lo-schema-sql)
4. [Configurare le variabili d'ambiente](#4-variabili-dambiente)
5. [Configurare Vercel](#5-configurare-vercel)
6. [Come funziona il merge intelligente](#6-merge-intelligente)
7. [Verificare che la sync funzioni](#7-verifica)
8. [Troubleshooting](#8-troubleshooting)
9. [Struttura del database](#9-struttura-database)

---

## 1. Come funziona

```
┌─────────────────┐        upsert/merge        ┌───────────────────┐
│  Android APK    │ ────────────────────────►  │                   │
│  (telefono)     │                            │   Supabase DB     │
│                 │ ◄────────────────────────  │   (cloud)         │
└─────────────────┘       load on login        │                   │
                                               │                   │
┌─────────────────┐        upsert/merge        │                   │
│  Web Vercel     │ ────────────────────────►  │                   │
│  (browser)      │                            │                   │
│                 │ ◄────────────────────────  │                   │
└─────────────────┘       load on login        └───────────────────┘
```

**Flusso automatico:**
1. L'utente completa una lezione (su qualsiasi dispositivo)
2. `handleComplete()` in `LessonView.tsx` chiama `saveUserProgress()`
3. `saveUserProgress()` chiama la funzione SQL `merge_progress` su Supabase
4. Il DB fonde i progressi locali con quelli già salvati (logica "prendi il meglio")
5. La prossima volta che l'utente fa login su un altro dispositivo, trova i progressi aggiornati

**Non si perde mai nulla:** se hai fatto 10 lezioni su Android e 5 sul browser,
il merge risultante avrà tutte e 15 le lezioni completate.

---

## 2. Creare il progetto Supabase

### 2.1 Crea account e progetto

1. Vai su **https://supabase.com** e fai **Sign Up** (gratuito)
2. Clicca **New project**
3. Compila:
   - **Name:** `codelearn`
   - **Database Password:** scegli una password sicura e **salvala**
   - **Region:** `West EU (Ireland)` o la più vicina a te
4. Clicca **Create new project** e aspetta ~2 minuti

### 2.2 Copia le credenziali

1. Vai su **Settings** → **API**
2. Copia:
   - **Project URL** → `https://xxxxxxxxxxxx.supabase.co`
   - **anon public** key → `eyJhbGciOi...`

> ⚠️ **NON usare la `service_role` key** nell'app — è riservata al backend.
> La `anon` key è sicura per browser e APK.

---

## 3. Eseguire lo schema SQL

Il file `SUPABASE_SCHEMA.sql` contiene tutto: tabella, indici, trigger,
funzione di merge intelligente, e politiche di sicurezza (RLS).

### Passi

1. Nel pannello Supabase, clicca **SQL Editor** → **New query**
2. Apri `SUPABASE_SCHEMA.sql` dalla root del progetto
3. Seleziona tutto (Ctrl+A), copia, e incolla nell'editor
4. Clicca **Run ▶**
5. Dovresti vedere `Success. No rows returned`

### Verifica

- **Table Editor** → tabella `users` con colonne `id, username, progress_data...`
- **Database** → **Functions** → `merge_progress` nella lista

---

## 4. Variabili d'ambiente

### 4.1 Sviluppo locale (`npm run dev`)

Crea/modifica il file `.env` nella root:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Il file `.env` è in `.gitignore` — non viene mai committato su GitHub.

### 4.2 Build Android (APK)

Il build (`vite build`) include le variabili nel bundle.
Assicurati che `.env` sia presente prima di buildare l'APK.
Per il build automatico via GitHub Actions → usa i **Secrets** (sezione 5.2).

---

## 5. Configurare Vercel

### 5.1 Environment Variables su Vercel

1. **https://vercel.com** → il tuo progetto → **Settings** → **Environment Variables**
2. Aggiungi:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production, Preview, Development |

3. **Save** → fai un nuovo deploy (push su GitHub o **Redeploy** manuale)

### 5.2 Secrets per GitHub Actions (build APK)

1. **GitHub** → repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**:

| Secret name | Valore |
|-------------|--------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` |

Il workflow `.github/workflows/android-build.yml` legge questi secrets automaticamente.

---

## 6. Merge intelligente

La funzione SQL `merge_progress` applica la logica **"prendi il meglio"**:

| Campo | Logica |
|-------|--------|
| `xp` | `MAX(xp_db, xp_locale)` — non si perde mai XP |
| `completedLessons` | `UNION` dei due array — nessuna lezione persa |
| `badges` | `UNION` dei due array — nessun badge perso |
| `level` | `MAX(level_db, level_locale)` |
| `streak` | `MAX(streak_db, streak_locale)` |

**Esempio pratico:**
```
Browser Vercel:   completedLessons: ["py-1","py-2","py-3"]  xp: 75
Android APK:      completedLessons: ["py-1","py-4","py-5"]  xp: 50

Dopo merge:
  completedLessons: ["py-1","py-2","py-3","py-4","py-5"]
  xp: 75   ← il più alto tra i due
```

---

## 7. Verifica

### 7.1 Dal browser (Vercel)

1. Vai su **https://code-learn-ruddy.vercel.app**
2. Fai login → completa una lezione
3. Supabase → **Table Editor** → `users` → il tuo record → `progress_data` aggiornato
4. Console browser (F12): `[Sync] Progressi sincronizzati su Supabase ✓`

### 7.2 Dall'APK (Android)

1. Installa/aggiorna l'APK
2. Fai login con lo **stesso username** usato sul browser
3. Completa una lezione diversa
4. Supabase → `users` → `completedLessons` contiene lezioni di **entrambi** i dispositivi

### 7.3 Log da cercare in Console

```
[Sync] Progressi sincronizzati su Supabase ✓      → tutto ok
[Sync] Progressi caricati dal cloud ✓              → load al login ok
[Sync] Utente locale/ospite — salvataggio saltato  → normale per guest
[Sync] Errore merge_progress: ...                  → problema config
```

---

## 8. Troubleshooting

### ❌ Build Vercel fallisce con TS2307
Il file `src/userServide.ts` (con typo) potrebbe ancora esistere.
Deve esistere solo `src/userService.ts` con `import './supabaseClient'`.

### ❌ "ERRORE: Chiavi di Supabase non trovate"
Il file `.env` non esiste o le variabili si chiamano diversamente.
Devono essere esattamente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

### ❌ Nessun log di sync in console
- L'username finisce in `-LOCAL` o `-GUEST` (utenti non cloud, normale)
- Le env vars sono vuote in produzione (controlla Vercel Environment Variables)

### ❌ "permission denied" (403)
RLS non configurato. Riesegui il blocco `── 5. RLS` dal `SUPABASE_SCHEMA.sql`.

### ❌ "merge_progress: function does not exist"
Funzione RPC non creata. Riesegui l'intero `SUPABASE_SCHEMA.sql`.

---

## 9. Struttura database

```
TABLE public.users
  id            UUID        PK generato automaticamente
  username      TEXT        UNIQUE case-insensitive
  last_version  TEXT        es. "1.1.2c-3"
  platform      TEXT        "Web (Vercel)" | "Android APK"
  device_info   TEXT        User-Agent (max 255 chars)
  progress_data JSONB       progressi dell'utente
  created_at    TIMESTAMPTZ automatico
  updated_at    TIMESTAMPTZ aggiornato dal trigger ad ogni UPDATE

JSONB progress_data:
  {
    "completedLessons": ["py-1", "py-2", "js-1"],
    "xp":             150,
    "level":          2,
    "streak":         5,
    "badges":         ["first-step", "coder"],
    "courseProgress": { "python": 3, "javascript": 1 },
    "startedCourses": ["python", "javascript"]
  }

FUNCTION public.merge_progress(p_username, p_new_data, p_version, p_platform, p_device_info)
  → RETURNS JSONB (progressi dopo il merge)
  → INSERT se è la prima volta
  → UPDATE con merge intelligente se l'utente esiste già

VIEW public.users_public
  → Dati pubblici per la leaderboard
  → Ordinata per XP DESC
  → Nasconde device_info
```

---

## 📁 File rilevanti nel progetto

```
CodeLearn_BETA_V1.1.2c-3/
├── .env                          ← Chiavi Supabase locali (NON su Git)
├── .env.example                  ← Template da committare
├── SUPABASE_SCHEMA.sql           ← ⭐ Schema da eseguire su Supabase
├── GUIDA_SUPABASE_SYNC.md        ← Questo file
└── src/
    ├── supabaseClient.ts         ← Client SDK (@supabase/supabase-js)
    ├── userService.ts            ← saveUserProgress + loadUserProgress
    ├── services/
    │   └── userService.ts        ← Stesso file (usato da LessonView.tsx)
    ├── lib/
    │   └── supabase.ts           ← Client REST (usato da AppContext)
    ├── components/
    │   └── LessonView.tsx        ← ⭐ Chiama saveUserProgress() al completamento
    └── context/
        └── AppContext.tsx        ← Gestione stato + sync cloud automatica
```

---

*CodeLearn BETA V1.1.2c-3 — The Synch Update*
