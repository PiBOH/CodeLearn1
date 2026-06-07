# Guida Build APK Android — CodeLearn BETA V1.1.1a-5

## Prerequisiti
- Node.js 18+
- Android Studio (con SDK Android 34+)
- Java JDK 17+

## Passi

### 1. Installa dipendenze
```bash
npm install
```

### 2. Build web
```bash
npm run build
```

### 3. Sync Capacitor
```bash
npx cap sync android
```

### 4. Apri in Android Studio
```bash
npx cap open android
```

### 5. Build APK
In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

L'APK si trova in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Variabili d'ambiente per APK
Le variabili `.env` vengono incluse nel build web prima del sync.
Assicurati di eseguire `npm run build` DOPO aver configurato `.env`.

## Note
- Per APK di release (firmato) usa: Build → Generate Signed Bundle / APK
- Il `capacitor.config.ts` punta alla build web in `dist/`
