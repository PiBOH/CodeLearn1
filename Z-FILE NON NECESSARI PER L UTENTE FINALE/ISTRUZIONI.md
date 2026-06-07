# Istruzioni — CodeLearn BETA V1.1.2c-3

## Avvio locale

```bash
npm install
npm run dev
```
Apri http://localhost:5173

## Configurazione cloud (opzionale)

1. Crea un progetto su https://supabase.com (piano gratuito)
2. Vai su **SQL Editor** ed esegui il contenuto di `SUPABASE_SCHEMA.sql`
3. Copia `.env.example` → `.env`
4. Incolla **Project URL** e **anon key** (da Supabase → Settings → API)
5. Riavvia `npm run dev`

Se non configuri `.env`, l'app funziona normalmente in modalità locale.

## Modalità Ospite

Inserisci un nome che termina con `-TEMP` (es. `Mario-TEMP`):
- I progressi vengono salvati solo in locale
- Vengono cancellati automaticamente alla chiusura dell'app/tab
- Nessun dato viene inviato al cloud

## Struttura cartelle

```
src/
├── components/     # Componenti React UI
├── context/        # AppContext (stato globale + sync)
├── data/           # courses.ts (dati corsi)
├── lib/            # supabase.ts, deviceInfo.ts, icons.ts
└── App.tsx         # Router principale
```

## Build per produzione

```bash
npm run build
# Output nella cartella dist/
```
