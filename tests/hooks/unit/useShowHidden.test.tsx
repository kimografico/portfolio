import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useShowHidden } from '../../../src/hooks/useShowHidden';

describe('useShowHidden', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('lee el valor persistido y lo actualiza', () => {
    // El hook comparte una preferencia global para mostrar u ocultar datos en la UI.
    window.localStorage.setItem('kimo-show-hidden', 'true');

    const { result } = renderHook(() => useShowHidden());

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(false);
    expect(window.localStorage.getItem('kimo-show-hidden')).toBe('false');
  });
});
