# CodeLearn BETA V1.1.0a-2 — "The Synch Update"

## Novità principali

### ☁️ Salvataggio Cloud Ibrido (Supabase)
- I progressi vengono sincronizzati automaticamente nel cloud (debounce 2s)
- Al login, i dati dell'utente vengono caricati dal DB se già esistenti
- Indicatore di stato sync (🔄 syncing / ✅ synced / ⚠️ errore) visibile nel Profilo
- Fallback completamente locale se Supabase non è configurato

### 👻 Modalità Ospite (-TEMP)
- Se il nome termina con `-TEMP` (es. `Luca-TEMP`) viene attivata la Modalità Ospite
- I progressi restano solo in localStorage e vengono **cancellati** alla chiusura dell'app
- Banner visivo durante l'onboarding e badge speciale nel Profilo

### 🔍 Suggerimenti Nome in Tempo Reale
- Mentre scrivi il nome, l'app cerca utenti esistenti su Supabase (debounce 350ms)
- Dropdown con: Nome Utente, Ultima Versione, Piattaforma
- Selezione con un tap carica i progressi cloud automaticamente

### 🔀 "Non sei tu?" — Forza Nuovo Account
- Link sotto il pulsante Inizia per ignorare i suggerimenti e creare un nuovo utente
- Genera automaticamente un nome univoco (es. `Luca2`, `Luca3`)
- Avvisa se il nome scelto è già presente nel DB

### ℹ️ Sezione Info Sistema nel Profilo
- Versione app: **v1.1.0a - The Synch Update** (hardcoded)
- Piattaforma rilevata dinamicamente da User Agent: Android APK / iOS / PC Windows / Mac / Linux
- Modello dispositivo o browser
- Stato sincronizzazione cloud in tempo reale
- Modalità utente (Ospite / Account registrato)

## Struttura DB Supabase

```
Tabella: users
├── id           UUID (PK)
├── username     TEXT
├── last_version TEXT  (es. "1.1.0a")
├── platform     TEXT  (es. "Android APK", "PC Windows")
├── device_info  TEXT  (es. "Samsung Galaxy S21", "Chrome")
├── progress_data JSONB
│   ├── completedLessons: string[]
│   ├── xp: number
│   ├── level: number
│   ├── streak: number
│   ├── badges: string[]
│   ├── courseProgress: Record<string, number>
│   └── startedCourses: string[]
├── created_at   TIMESTAMPTZ
└── updated_at   TIMESTAMPTZ
```

## File modificati/aggiunti
- `src/context/AppContext.tsx` — refactor completo con loginAs, syncToCloud, guest mode
- `src/components/Onboarding.tsx` — suggerimenti RT, dropdown, -TEMP, Non sei tu?
- `src/components/Profile.tsx` — sezione Info Sistema
- `src/lib/supabase.ts` — client REST Supabase (no SDK esterno)
- `src/lib/deviceInfo.ts` — rilevamento dispositivo da User Agent
- `SUPABASE_SCHEMA.sql` — schema SQL completo con RLS
- `.env.example` — template variabili d'ambiente
- `package.json` — versione aggiornata a BETA V1.1.0a-2

## Configurazione richiesta
1. Crea un progetto Supabase su https://supabase.com
2. Esegui `SUPABASE_SCHEMA.sql` nel SQL Editor di Supabase
3. Copia `.env.example` → `.env` e compila URL + anon key
4. `npm run dev` / `npm run build`

---

## Differenze BETA V1.1.0a-2 rispetto a V1.1.0a-1
- Versione aggiornata a `BETA V1.1.0a-2` in tutti i file
- Struttura `android/` config files inclusi nel zip (no build artifacts)
- `.gitignore`, `.vercelignore`, `eslint.config.js` inclusi
- `README.md` aggiornato
- Guide APK aggiornate con numero versione corretto

---

## BETA V1.1.1a-1 — Aggiornamento modalità utente

### 🆕 Nuova modalità: `-LOCAL` (Locale Persistente)
- Aggiungendo `-LOCAL` al nome (es. `Mario-LOCAL`) si attiva la **Modalità Locale Persistente**
- I progressi vengono salvati **solo in localStorage** (nessun sync cloud)
- I dati **non vengono cancellati** alla chiusura dell'app (differenza chiave rispetto a `-TEMP`/`-EXIT`)
- Icona dedicata: `HardDrive` 💾 in verde nei componenti Onboarding e Profile

### Riepilogo modalità utente

| Suffisso | Modalità | Storage | Cancellato alla chiusura | Cloud sync |
|----------|----------|---------|--------------------------|------------|
| *(nessuno)* | Cloud | localStorage + Supabase | No | ✅ |
| `-LOCAL` | Locale | localStorage only | **No** | ❌ |
| `-TEMP` / `-EXIT` | Ospite | localStorage only | **Sì** | ❌ |

### Modifiche tecniche
- `AppContext.tsx`: aggiunta `UserMode = 'guest' | 'local' | 'cloud'` al posto del booleano `isGuestMode`
  - Mantenuta retrocompat con `isGuestMode` (true solo per guest) e `isLocalMode` (true solo per local)
  - `LS_GUEST_MODE` rinominato in `LS_USER_MODE` con valori `'guest'|'local'|'cloud'`
  - Pulizia all'avvio solo se `LS_USER_MODE === 'guest'` (i dati `-LOCAL` sopravvivono)
  - Pulizia `beforeunload` solo se `userMode === 'guest'`
- `Onboarding.tsx`: banner verde per `-LOCAL`, legenda suffissi visibile nell'ultimo step
- `Profile.tsx`: avatar verde + `HardDrive` icon per modalità locale, label e colori distinti
- `package.json` / `app/build.gradle`: versione aggiornata a `1.1.1a-1` (versionCode: 5)
