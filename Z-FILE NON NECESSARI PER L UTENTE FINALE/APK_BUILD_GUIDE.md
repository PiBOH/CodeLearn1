# APK Build Guide — CodeLearn BETA V1.1.1a-5

## Requirements
- Node.js 18+
- Android Studio with Android SDK 34+
- Java JDK 17+

## Steps

### 1. Install dependencies
```bash
npm install
```

### 2. Build web assets
```bash
npm run build
```

### 3. Sync with Capacitor
```bash
npx cap sync android
```

### 4. Open Android Studio
```bash
npx cap open android
```

### 5. Build APK
In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

## Environment variables
Environment variables from `.env` are embedded at build time.
Always run `npm run build` after editing `.env`, then `npx cap sync android`.
