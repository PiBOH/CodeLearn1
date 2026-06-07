# 🗄️ Guida Completa — Sincronizzazione Supabase
### CodeLearn BETA V1.1.2c-3 · The Synch Update

Questa guida ti accompagna passo per passo in tutto quello che devi fare
**sul tuo PC**, su **Supabase**, su **Vercel** e su **GitHub** per attivare
la sincronizzazione automatica dei progressi tra Android APK e sito web.

---

## 📋 Indice

**PARTE A — Setup una-tantum (fai questi passi una sola volta)**
1. [Prerequisiti sul PC](#1-prerequisiti-sul-pc)
2. [Creare il progetto Supabase](#2-creare-il-progetto-supabase)
3. [Eseguire lo schema SQL su Supabase](#3-eseguire-lo-schema-sql)
4. [Modificare il file .env sul PC](#4-modificare-il-file-env)
5. [Testare in locale con npm run dev](#5-testare-in-locale)
6. [Configurare Vercel](#6-configurare-vercel)
7. [Configurare i Secrets GitHub per il build APK](#7-secrets-github)

**PARTE B — Workflow normale (ogni aggiornamento)**
8. [Aggiornare il sito Vercel](#8-aggiornare-vercel)
9. [Buildare e aggiornare l'APK Android](#9-buildare-lapk)

**PARTE C — Reference**
10. [Come funziona il merge intelligente](#10-merge-intelligente)
11. [Verificare che la sync funzioni](#11-verifica)
12. [Troubleshooting](#12-troubleshooting)
13. [Struttura del database](#13-struttura-database)

---

# PARTE A — Setup una-tantum

## 1. Prerequisiti sul PC

Prima di tutto, verifica di avere installato questi strumenti.
Apri il **Terminale** (PowerShell su Windows) e lancia questi comandi:

```powershell
node --version      # deve essere v18 o superiore
npm --version       # deve essere v9 o superiore
git --version       # qualsiasi versione recente
```

Se un comando non viene riconosciuto:
- **Node.js / npm** → scarica e installa da https://nodejs.org (versione LTS)
- **Git** → scarica da https://git-scm.com

### 1.1 Apri il progetto sul PC

1. Estrai lo ZIP `CodeLearn_BETA_V1.1.2c-3.zip` in una cartella a tua scelta,
   ad esempio `C:\CodeLearn\`
2. Apri PowerShell **nella cartella del progetto**:
   - Metodo rapido: tieni premuto **Shift** + click destro nella cartella → "Apri finestra PowerShell qui"
   - Oppure: apri PowerShell → `cd "C:\CodeLearn\CodeLearn_BETA_V1.1.2c-3"`
3. Installa le dipendenze:
   ```powershell
   npm install
   ```
   Attendi che finisca (può volerci un minuto). I warning su pacchetti deprecati sono normali, ignorali.

---

## 2. Creare il progetto Supabase

> Se hai già un progetto Supabase attivo con lo schema caricato, salta al passo 4.

### 2.1 Crea account (gratuito)

1. Vai su **https://supabase.com** → **Start your project**
2. Registrati con GitHub o email

### 2.2 Crea un nuovo progetto

1. Nel pannello, clicca **New project**
2. Compila:
   - **Organization:** la tua (es. il tuo nome)
   - **Name:** `codelearn`
   - **Database Password:** scegli una password sicura → **salvala in un posto sicuro**
   - **Region:** `West EU (Ireland)` — è la più vicina all'Italia
3. Clicca **Create new project**
4. Aspetta ~2 minuti che il DB si avvii (barra di caricamento verde)

### 2.3 Copia le tue credenziali

1. Nel pannello del tuo progetto, clicca **Settings** (ingranaggio in basso a sinistra)
2. Clicca **API** nel sottomenu
3. Copia e salva in un blocco note:
   - **Project URL** → es. `https://abcdefghij.supabase.co`
   - **anon public** → la chiave lunga che inizia con `eyJhbGci...`

> ⚠️ **Non usare la `service_role` key** — quella è solo per backend sicuro.
> La `anon` key è l'unica che serve nell'app.

---

## 3. Eseguire lo schema SQL

Lo schema crea la tabella `users`, gli indici, il trigger `updated_at` automatico,
la funzione `merge_progress` per la sincronizzazione intelligente, e le policy RLS.

### 3.1 Apri il file SUPABASE_SCHEMA.sql

Sul tuo PC, apri il file `SUPABASE_SCHEMA.sql` che trovi nella root del progetto.
Puoi aprirlo con Blocco Note, VS Code, o qualsiasi editor di testo.

Seleziona tutto il contenuto (**Ctrl+A**) e copialo (**Ctrl+C**).

### 3.2 Esegui su Supabase

1. Nel pannello Supabase, clicca **SQL Editor** nel menu laterale (icona terminale)
2. Clicca **New query** (pulsante in alto a sinistra)
3. Clicca dentro l'area di testo e incolla (**Ctrl+V**) tutto lo schema
4. Clicca **Run ▶** (in alto a destra)
5. Dovresti vedere in basso: `Success. No rows returned`

> Se vedi un errore del tipo `already exists`, va bene — lo schema usa
> `CREATE IF NOT EXISTS` e `DROP ... IF EXISTS`, quindi è rieseguibile senza problemi.

### 3.3 Verifica che tutto sia stato creato

- Clicca **Table Editor** nel menu laterale → dovresti vedere la tabella **users**
- Clicca **Database** → **Functions** → dovresti vedere **merge_progress** nella lista

---

## 4. Modificare il file .env

Il file `.env` contiene le tue credenziali Supabase e dice all'app come
connettersi al cloud. **Non viene mai caricato su GitHub** (è in `.gitignore`).

### 4.1 Apri il file .env

Nella root del progetto trovi già un file `.env` con le chiavi del progetto
Supabase di sviluppo. Aprilo con un editor di testo (VS Code, Blocco Note, ecc.).

```
Percorso: C:\CodeLearn\CodeLearn_BETA_V1.1.2c-3\.env
```

> Su Windows, i file che iniziano con `.` potrebbero non essere visibili in
> Esplora Risorse. In VS Code invece li vedi normalmente nel pannello laterale.

### 4.2 Sostituisci i valori

Il file ha questo aspetto:

```env
VITE_SUPABASE_URL=https://besgxztsmuiyzmlhsuss.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Sostituisci i valori con quelli che hai copiato al passo 2.3:

```env
VITE_SUPABASE_URL=https://TUOCODICE.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Salva il file (**Ctrl+S**).

> ⚠️ Nessuno spazio intorno all'`=`, nessuna virgoletta, nessun commento
> dopo il valore sulla stessa riga. Solo `CHIAVE=valore`.

---

## 5. Testare in locale

Ora verifichiamo che tutto funzioni prima di aggiornare Vercel e l'APK.

### 5.1 Avvia il server di sviluppo

Nel terminale PowerShell nella cartella del progetto:

```powershell
npm run dev
```

Dovresti vedere:

```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Apri il browser su **http://localhost:5173** e usa l'app normalmente.

### 5.2 Verifica la sync

1. Fai login con un username (non deve finire in `-LOCAL` o `-GUEST`)
2. Completa una lezione
3. Apri la Console del browser (**F12** → tab **Console**)
4. Dovresti vedere: `[Sync] Progressi sincronizzati su Supabase ✓`
5. Vai su Supabase → **Table Editor** → `users` → il tuo record deve essere comparso

Se vedi l'errore `[Sync] Errore merge_progress:`, controlla che:
- Le chiavi nel `.env` siano corrette
- Lo schema SQL sia stato eseguito (funzione `merge_progress` presente)
- Non ci siano spazi extra nel `.env`

### 5.3 Ferma il server

Quando hai finito di testare, nel terminale premi **Ctrl+C**.

---

## 6. Configurare Vercel

Vercel usa le sue variabili d'ambiente separate dal tuo `.env` locale.
Devi aggiungerle manualmente nel pannello Vercel.

### 6.1 Aggiungi le variabili d'ambiente

1. Vai su **https://vercel.com** → il tuo progetto CodeLearn
2. Clicca **Settings** → **Environment Variables**
3. Per ciascuna delle due variabili, clicca **Add** e compila:

**Prima variabile:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://TUOCODICE.supabase.co`
- Environments: spunta **Production**, **Preview**, **Development**
- Clicca **Save**

**Seconda variabile:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGci...` (la chiave lunga)
- Environments: spunta **Production**, **Preview**, **Development**
- Clicca **Save**

### 6.2 Rideploya il sito

Le variabili d'ambiente vengono lette solo al momento del build, quindi devi
fare un nuovo deploy per applicarle.

**Metodo 1 — Push su GitHub (consigliato):**
```powershell
git add .
git commit -m "feat: attiva sync Supabase V1.1.2c-3"
git push
```
Vercel rileva automaticamente il push e fa il deploy. Attendi ~1-2 minuti.

**Metodo 2 — Redeploy manuale:**
Vercel → il tuo progetto → **Deployments** → clicca sui tre puntini
dell'ultimo deployment → **Redeploy** → **Redeploy** (senza cache).

### 6.3 Verifica il deploy

1. Vai su **https://code-learn-ruddy.vercel.app**
2. Fai login → completa una lezione
3. Controlla Supabase → `users` → il record aggiornato

---

## 7. Secrets GitHub per il build APK

Il file `.env` non viene mai caricato su GitHub, quindi il workflow di build
Android non troverebbe le chiavi Supabase. Devi aggiungerle come **Secrets**.

### 7.1 Aggiungi i Secrets

1. Vai su **https://github.com** → il tuo repository `CodeLearn`
2. Clicca **Settings** (in alto nel repository)
3. Nel menu laterale: **Secrets and variables** → **Actions**
4. Clicca **New repository secret** per ciascuna:

**Primo secret:**
- Name: `VITE_SUPABASE_URL`
- Secret: `https://TUOCODICE.supabase.co`
- Clicca **Add secret**

**Secondo secret:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Secret: `eyJhbGci...`
- Clicca **Add secret**

### 7.2 Come vengono usati

Il file `.github/workflows/android-build.yml` già legge questi secrets
durante il `npm run build` che viene fatto prima di buildare l'APK.
Non devi modificare nulla nel file `.yml`.

---

# PARTE B — Workflow normale

## 8. Aggiornare il sito Vercel

Ogni volta che modifichi il codice e vuoi aggiornare il sito:

```powershell
# Nella cartella del progetto:
git add .
git commit -m "descrizione delle modifiche"
git push
```

Vercel si aggiorna automaticamente in ~1-2 minuti. Puoi seguire il
progresso su vercel.com → il tuo progetto → **Deployments**.

---

## 9. Buildare l'APK Android

### 9.1 Build tramite GitHub Actions (consigliato)

Il workflow `.github/workflows/android-build.yml` fa tutto in automatico:

1. Fai un push su GitHub (come al passo 8)
2. Vai su GitHub → il tuo repository → **Actions**
3. Clicca sul workflow in esecuzione per vedere il progresso
4. Al termine, vai su **Artifacts** per scaricare l'APK compilato

### 9.2 Build manuale sul PC (alternativa)

Se preferisci buildare in locale:

```powershell
# 1. Crea il bundle web ottimizzato
npm run build

# 2. Sincronizza il bundle nel progetto Android
npx cap sync android

# 3. Apri Android Studio per compilare l'APK
npx cap open android
```

In Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
L'APK si trova in `android/app/build/outputs/apk/debug/app-debug.apk`.

---

# PARTE C — Reference

## 10. Merge intelligente

Quando salvi i progressi da due dispositivi diversi, la funzione SQL
`merge_progress` applica la logica **"prendi il meglio"** — nessun progresso
viene mai perso:

| Campo | Logica |
|-------|--------|
| `xp` | Prende il valore più alto tra DB e dispositivo |
| `completedLessons` | Unione dei due array (nessun duplicato) |
| `badges` | Unione dei due array (nessun duplicato) |
| `level` | Prende il valore più alto |
| `streak` | Prende il valore più alto |

**Esempio:**
```
Vercel (browser):  lezioni: ["py-1","py-2","py-3"]  xp: 75
Android APK:       lezioni: ["py-1","py-4","py-5"]  xp: 50

Dopo sync:
  lezioni: ["py-1","py-2","py-3","py-4","py-5"]
  xp: 75
```

---

## 11. Verifica

### Dalla Console del browser (F12)

```
[Sync] Progressi sincronizzati su Supabase ✓      → sync riuscita
[Sync] Progressi caricati dal cloud ✓              → load al login ok
[Sync] Utente locale/ospite — salvataggio saltato  → normale per guest
[Sync] Errore merge_progress: ...                  → problema di config
```

### Da Supabase Table Editor

**Table Editor** → `users` → dovresti vedere:
- Il tuo record con `username` e `progress_data` aggiornati
- `updated_at` con data/ora dell'ultima sync
- `platform` con `"Web (Vercel)"` o `"Android APK"` a seconda del dispositivo

---

## 12. Troubleshooting

### ❌ npm install fallisce
Assicurati di avere Node.js v18+: `node --version`.
Se la versione è vecchia, scarica la LTS da https://nodejs.org e reinstalla.

### ❌ "ERRORE: Chiavi di Supabase non trovate nel file .env!"
Il file `.env` non esiste oppure le chiavi hanno nomi sbagliati.
Controlla che si chiamino **esattamente** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
senza spazi, virgolette o commenti sulla stessa riga del valore.

### ❌ Vercel build fallisce: "Cannot find module"
Le variabili d'ambiente non sono state aggiunte su Vercel (passo 6.1).
Aggiungile e fai Redeploy.

### ❌ "merge_progress: function does not exist"
Lo schema SQL non è stato eseguito. Ripeti il passo 3 (SQL Editor → Run ▶).

### ❌ "permission denied" (403 da Supabase)
Le policy RLS non sono attive. Nel SQL Editor riesegui solo il blocco
`── 5. Row Level Security` dal file `SUPABASE_SCHEMA.sql`.

### ❌ Il .env non è visibile in Esplora Risorse
Windows nasconde i file che iniziano con `.` per default.
Aprilo con VS Code oppure da PowerShell: `notepad .env`

### ❌ La sync funziona in locale ma non su Vercel
Le variabili d'ambiente su Vercel non corrispondono a quelle del tuo `.env`.
Verifica che siano state salvate correttamente (passo 6.1) e rideploya.

---

## 13. Struttura database

```
TABLE public.users
  id            UUID        PK (generato automaticamente)
  username      TEXT        UNIQUE, case-insensitive
  last_version  TEXT        es. "1.1.2c-3"
  platform      TEXT        "Web (Vercel)" | "Android APK"
  device_info   TEXT        User-Agent string (max 255 chars)
  progress_data JSONB       Tutti i progressi dell'utente
  created_at    TIMESTAMPTZ Automatico alla creazione
  updated_at    TIMESTAMPTZ Aggiornato automaticamente dal trigger

JSONB progress_data:
{
  "completedLessons": ["py-1", "py-2", "js-1"],
  "xp":             150,
  "level":          2,
  "streak":         5,
  "badges":         ["first-step", "coder", "explorer"],
  "courseProgress": { "python": 3, "javascript": 1 },
  "startedCourses": ["python", "javascript"]
}

FUNCTION public.merge_progress(
  p_username TEXT, p_new_data JSONB,
  p_version TEXT, p_platform TEXT, p_device_info TEXT
)
  → RETURNS JSONB con i progressi dopo il merge
  → INSERT se è la prima volta che l'utente si connette
  → UPDATE con merge intelligente se l'utente esiste già

VIEW public.users_public
  → Leaderboard pubblica, ordinata per XP DESC
  → Non espone device_info
```

---

## 📁 File rilevanti nel progetto

```
CodeLearn_BETA_V1.1.2c-3/
│
├── .env                           ← ⭐ Chiavi Supabase (NON su Git, modifica tu)
├── .env.example                   ← Template vuoto da leggere
├── .gitignore                     ← Include .env — non viene mai pushato
│
├── SUPABASE_SCHEMA.sql            ← ⭐ Incolla su Supabase SQL Editor (1 volta)
├── GUIDA_SUPABASE_SYNC.md         ← Questo file
├── GUIDA_SUPABASE_SYNC_OLD.md     ← Versione precedente della guida
│
└── src/
    ├── supabaseClient.ts          ← Client Supabase SDK
    ├── userService.ts             ← saveUserProgress() + loadUserProgress()
    ├── services/
    │   └── userService.ts         ← Stessa logica (importata da LessonView)
    ├── lib/
    │   └── supabase.ts            ← Client REST alternativo (AppContext)
    ├── components/
    │   └── LessonView.tsx         ← ⭐ Chiama saveUserProgress() al completamento
    └── context/
        └── AppContext.tsx         ← Stato globale + sync cloud automatica
```

---

## ✅ Checklist setup completo

- [ ] Node.js v18+ installato sul PC
- [ ] `npm install` eseguito nella cartella del progetto
- [ ] Progetto Supabase creato e credenziali copiate
- [ ] `SUPABASE_SCHEMA.sql` eseguito su Supabase SQL Editor
- [ ] File `.env` aggiornato con URL e chiave anon reali
- [ ] `npm run dev` funziona e la sync appare in Console
- [ ] Variabili d'ambiente aggiunte su Vercel
- [ ] Sito Vercel rideploy con le nuove variabili
- [ ] Secrets `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` aggiunti su GitHub
- [ ] APK ricompilato con le nuove credenziali incluse
- [ ] Testato login con stesso username su browser e APK → progressi sincronizzati ✓

---

*CodeLearn BETA V1.1.2c-3 — The Synch Update*
