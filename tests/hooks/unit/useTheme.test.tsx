import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useTheme } from '../../../src/hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('lee el tema persistido, lo aplica al documento y alterna entre light y dark', async () => {
    // El hook sincroniza la preferencia visual y la expone de forma reactiva a toda la app.
    window.localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
    expect(result.current[0]).toBe('dark');

    act(() => {
      result.current[1]();
    });

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'light'));
    expect(result.current[0]).toBe('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });
});
