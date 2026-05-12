import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import {
  checkKimoPassword,
  getKimoConfiguredHash,
  hashKimoPassword,
  isKimoAuthenticated,
  isKimoHashReady,
  sanitizeKimoRedirect,
  setKimoAuthenticated,
} from '../../../src/lib/kimoAuth';

describe('kimoAuth', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('lee, valida y sanitiza la configuración de acceso', () => {
    // Estas funciones protegen el acceso al área privada sin exponer rutas inválidas.
    vi.stubEnv('VITE_KIMO_PASSWORD_HASH', 'a'.repeat(64));

    expect(getKimoConfiguredHash()).toBe('a'.repeat(64));
    expect(isKimoHashReady()).toBe(true);
    expect(sanitizeKimoRedirect('/kimo/data?x=1')).toBe('/kimo/data?x=1');
    expect(sanitizeKimoRedirect('/admin')).toBe('/kimo');
  });

  it('gestiona la sesión en localStorage', () => {
    // El helper centraliza la persistencia para que el login y el guard compartan estado.
    expect(isKimoAuthenticated()).toBe(false);

    setKimoAuthenticated(true);
    expect(isKimoAuthenticated()).toBe(true);

    setKimoAuthenticated(false);
    expect(isKimoAuthenticated()).toBe(false);
  });

  it('hashéa y valida contraseñas con Web Crypto', async () => {
    // El test usa un digest mockeado para no depender del runtime real de Web Crypto.
    const expectedHash = createHash('sha256').update('secret').digest('hex');
    const digestBytes = Uint8Array.from(Buffer.from(expectedHash, 'hex'));

    const digest = vi.fn().mockResolvedValue(digestBytes.buffer.slice(0));
    vi.stubGlobal('crypto', { subtle: { digest } });
    vi.stubEnv('VITE_KIMO_PASSWORD_HASH', expectedHash);

    await expect(hashKimoPassword('secret')).resolves.toBe(expectedHash);
    await expect(checkKimoPassword('secret')).resolves.toEqual({
      hash: expectedHash,
      configuredHash: expectedHash,
      isValid: true,
    });
  });
});
