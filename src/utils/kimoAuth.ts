const AUTH_STORAGE_KEY = 'kimo-authenticated';
const AUTH_STORAGE_VALUE = 'true';

export interface KimoPasswordCheckResult {
  hash: string;
  configuredHash: string;
  isValid: boolean;
}

export function getKimoConfiguredHash(): string {
  return import.meta.env.VITE_KIMO_PASSWORD_HASH?.trim() ?? '';
}

export function isKimoHashReady(): boolean {
  return /^[a-f0-9]{64}$/i.test(getKimoConfiguredHash());
}

export function isKimoAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === AUTH_STORAGE_VALUE;
}

export function setKimoAuthenticated(isAuthenticated: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (isAuthenticated) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, AUTH_STORAGE_VALUE);
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function sanitizeKimoRedirect(redirect: string | null): string {
  if (!redirect) {
    return '/kimo';
  }

  if (
    !redirect.startsWith('/') ||
    redirect.startsWith('//') ||
    !redirect.startsWith('/kimo') ||
    redirect.startsWith('/kimo/login')
  ) {
    return '/kimo';
  }

  return redirect;
}

export async function hashKimoPassword(password: string): Promise<string> {
  const cryptoSubtle = globalThis.crypto?.subtle;

  if (!cryptoSubtle) {
    throw new Error('No se ha podido acceder a Web Crypto para generar el hash.');
  }

  const passwordBytes = new TextEncoder().encode(password);
  const digest = await cryptoSubtle.digest('SHA-256', passwordBytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function checkKimoPassword(password: string): Promise<KimoPasswordCheckResult> {
  const hash = await hashKimoPassword(password);
  // console.log('KIMO password hash:', hash); // CAMBIAR PASSWORD PARA LOGIN
  const configuredHash = getKimoConfiguredHash();

  return {
    hash,
    configuredHash,
    isValid: isKimoHashReady() && hash === configuredHash,
  };
}
