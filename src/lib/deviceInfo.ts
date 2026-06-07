// ─────────────────────────────────────────────────────────────────────────────
// deviceInfo.ts — Rilevamento dinamico del dispositivo tramite User Agent
// CodeLearn v1.1.0a - The Synch Update
// ─────────────────────────────────────────────────────────────────────────────

export interface DeviceInfo {
  /** Piattaforma leggibile: "Android APK", "PC Windows", "iOS Web", ecc. */
  platform: string;
  /** Dettagli del dispositivo: modello o browser */
  deviceDetails: string;
  /** Stringa completa User Agent */
  userAgent: string;
}

/** Restituisce true se l'app gira dentro Capacitor (APK nativo) */
function isCapacitorNative(): boolean {
  try {
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
    return typeof cap?.isNativePlatform === 'function' ? cap.isNativePlatform() : false;
  } catch {
    return false;
  }
}

/** Estrae il nome del browser dalla UA */
function getBrowserName(ua: string): string {
  if (/edg\//i.test(ua))     return 'Microsoft Edge';
  if (/opr\//i.test(ua))     return 'Opera';
  if (/firefox/i.test(ua))   return 'Firefox';
  if (/chrome/i.test(ua))    return 'Chrome';
  if (/safari/i.test(ua))    return 'Safari';
  return 'Browser';
}

/** Estrae il sistema operativo Windows dalla UA */
function getWindowsVersion(ua: string): string {
  if (/Windows NT 10\.0/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6\.3/i.test(ua))  return 'Windows 8.1';
  if (/Windows NT 6\.1/i.test(ua))  return 'Windows 7';
  return 'Windows';
}

/** Estrae il modello Android dalla UA (se disponibile) */
function getAndroidModel(ua: string): string {
  const match = ua.match(/;\s([^;)]+)\sBuild\//);
  return match ? match[1].trim() : 'Dispositivo Android';
}

/**
 * Rileva il dispositivo corrente tramite User Agent.
 * Priorità: Capacitor/APK > Android > iOS > Windows > Mac > Linux > Web
 */
export function detectDevice(): DeviceInfo {
  const ua = navigator.userAgent;
  const isNative = isCapacitorNative();

  // ── App nativa Capacitor ────────────────────────────────────────────
  if (isNative) {
    if (/android/i.test(ua)) {
      return {
        platform: 'Android APK',
        deviceDetails: getAndroidModel(ua),
        userAgent: ua,
      };
    }
    if (/iphone/i.test(ua)) {
      return { platform: 'iOS APK', deviceDetails: 'iPhone', userAgent: ua };
    }
    if (/ipad/i.test(ua)) {
      return { platform: 'iOS APK', deviceDetails: 'iPad', userAgent: ua };
    }
    return { platform: 'APK', deviceDetails: 'Dispositivo Nativo', userAgent: ua };
  }

  // ── Browser mobile Android ──────────────────────────────────────────
  if (/android/i.test(ua)) {
    const vMatch = ua.match(/Android\s([\d.]+)/i);
    const version = vMatch ? ` ${vMatch[1]}` : '';
    return {
      platform: 'Android Web',
      deviceDetails: `Android${version} — ${getBrowserName(ua)}`,
      userAgent: ua,
    };
  }

  // ── iPhone ──────────────────────────────────────────────────────────
  if (/iphone/i.test(ua)) {
    return {
      platform: 'iOS Web',
      deviceDetails: `iPhone — ${getBrowserName(ua)}`,
      userAgent: ua,
    };
  }

  // ── iPad ────────────────────────────────────────────────────────────
  if (/ipad/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
    return {
      platform: 'iOS Web',
      deviceDetails: `iPad — ${getBrowserName(ua)}`,
      userAgent: ua,
    };
  }

  // ── Windows ─────────────────────────────────────────────────────────
  if (/windows/i.test(ua)) {
    return {
      platform: 'PC Windows',
      deviceDetails: `${getWindowsVersion(ua)} — ${getBrowserName(ua)}`,
      userAgent: ua,
    };
  }

  // ── macOS ───────────────────────────────────────────────────────────
  if (/macintosh|mac os x/i.test(ua)) {
    return {
      platform: 'Mac Web',
      deviceDetails: `macOS — ${getBrowserName(ua)}`,
      userAgent: ua,
    };
  }

  // ── Linux desktop ───────────────────────────────────────────────────
  if (/linux/i.test(ua)) {
    return {
      platform: 'Linux Web',
      deviceDetails: `Linux — ${getBrowserName(ua)}`,
      userAgent: ua,
    };
  }

  // ── Fallback ────────────────────────────────────────────────────────
  return {
    platform: 'Vercel Web',
    deviceDetails: getBrowserName(ua),
    userAgent: ua,
  };
}

/** Formatta piattaforma + dettagli in una stringa compatta per il DB */
export function formatPlatformString(info: DeviceInfo): string {
  return info.deviceDetails ? `${info.platform} (${info.deviceDetails})` : info.platform;
}
