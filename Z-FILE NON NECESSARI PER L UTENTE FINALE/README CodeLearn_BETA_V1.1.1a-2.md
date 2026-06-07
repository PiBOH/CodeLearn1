# CodeLearn — BETA V1.1.1a-2 "The Synch Update"

App educativa per imparare a programmare, distribuita su Vercel (web) e come APK Android.

## Stack tecnologico
- **Frontend**: React 19 + TypeScript + Vite
- **Stile**: Tailwind CSS v4
- **Animazioni**: Framer Motion
- **Database cloud**: Supabase (PostgreSQL via REST API)
- **APK Android**: Capacitor 8

## Novità v1.1.0a-2
- ☁️ Salvataggio cloud ibrido (Supabase)
- 👻 Modalità Ospite con suffisso `-TEMP`
- 🔍 Suggerimenti nome in tempo reale
- 🔀 "Non sei tu?" per creare nuovo account
- ℹ️ Sezione Info Sistema nel profilo

## Avvio rapido

```bash
npm install
cp .env.example .env   # compila VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

## Configurazione Supabase
1. Crea un progetto su https://supabase.com
2. Esegui `SUPABASE_SCHEMA.sql` nel SQL Editor
3. Copia URL + anon key in `.env`

> Senza `.env` configurato l'app funziona completamente in modalità locale.

## Build per Vercel
```bash
npm run build
# oppure collega il repo a Vercel — build command: npm run build, output: dist/
```

## Build APK Android
Vedi `BUILD_APK_GUIDA.md` per le istruzioni complete.

---
Made with ❤️ by **PiBOH**
