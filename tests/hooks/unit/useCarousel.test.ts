/**
 * Tests para el hook `useCarousel`.
 *
 * El hook tiene dos modos:
 * 1. Con `initialImages`: no hace fetch, usa los datos inyectados.
 * 2. Sin `initialImages`: hace GET /api/carousel al montar.
 *
 * Testeamos ambos modos y también la función `save`.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCarousel } from '../../../src/hooks/useCarousel';
import type { CarouselUiItem } from '../../../src/hooks/useCarousel';

// --- Helpers de mock de fetch ------------------------------------------------

function mockFetchGet(data: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data }),
  });
}

function mockFetchPut() {
  return vi.fn().mockImplementation(async (_url: string, options: RequestInit) => {
    const body = JSON.parse(String(options.body ?? '{}'));
    return {
      ok: true,
      json: async () => ({ success: true, data: body.data }),
    };
  });
}

// ---------------------------------------------------------------------------

// Datos en formato API (como los devuelve el backend)
const API_IMAGES = [
  { src: '/portfolio/images/foo.jpg', alt: 'Foo' },
  { src: '/portfolio/images/bar.jpg', alt: 'Bar' },
];

// Los mismos datos en formato UI (como los expone el hook)
const UI_IMAGES: CarouselUiItem[] = [
  { image: '/portfolio/images/foo.jpg', label: 'Foo' },
  { image: '/portfolio/images/bar.jpg', label: 'Bar' },
];

describe('useCarousel', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('con initialImages (sin llamadas al backend)', () => {
    it('convierte al formato UI y arranca en idle', () => {
      const { result } = renderHook(() => useCarousel(API_IMAGES));

      expect(result.current.status).toBe('idle');
      // El hook convierte { src, alt } → { image, label }
      expect(result.current.images).toEqual(UI_IMAGES);
      expect(result.current.errorMsg).toBe('');
    });

    it('con array vacío también arranca en idle', () => {
      const { result } = renderHook(() => useCarousel([]));

      expect(result.current.status).toBe('idle');
      expect(result.current.images).toEqual([]);
    });
  });

  describe('sin initialImages (hace fetch al montar)', () => {
    it('carga los datos del backend, los convierte a formato UI y pasa a idle', async () => {
      global.fetch = mockFetchGet(API_IMAGES) as typeof fetch;

      const { result } = renderHook(() => useCarousel());

      expect(result.current.status).toBe('loading');

      await waitFor(() => expect(result.current.status).toBe('idle'));

      // El hook devuelve los datos ya convertidos al formato UI
      expect(result.current.images).toEqual(UI_IMAGES);
    });
  });

  describe('save()', () => {
    it('guarda los items en formato UI, los convierte a API y pone status saved', async () => {
      const fetchMock = mockFetchPut();
      global.fetch = fetchMock as typeof fetch;

      const { result } = renderHook(() => useCarousel([]));

      const newUiImages: CarouselUiItem[] = [{ image: '/portfolio/images/new.jpg', label: 'New' }];

      await act(async () => {
        await result.current.save(newUiImages);
      });

      expect(result.current.status).toBe('saved');
      expect(result.current.images).toEqual(newUiImages);

      // El fetch recibió los datos ya convertidos a formato API ({ src, alt })
      expect(fetchMock).toHaveBeenCalledOnce();
      const fetchInit = (fetchMock.mock.calls[0] as [string, RequestInit])[1];
      const callBody = JSON.parse((fetchInit?.body as string) ?? '{}');
      expect(callBody.data).toEqual([{ src: '/portfolio/images/new.jpg', alt: 'New' }]);
    });

    it('pone status error si el backend falla', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Fallo de red')) as typeof fetch;

      const { result } = renderHook(() => useCarousel([]));

      await act(async () => {
        await result.current.save([]);
      });

      expect(result.current.status).toBe('error');
      expect(result.current.errorMsg).toContain('Fallo de red');
    });
  });
});
