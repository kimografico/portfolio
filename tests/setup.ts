import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extender los matchers de expect con los de jest-dom
expect.extend(matchers);

// Mock de HTMLCanvasElement para jsdom (MyClients usa canvas)
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  drawImage: vi.fn(),
  getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(),
  canvas: { width: 0, height: 0 },
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,');

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});

// Asegurar que React está en modo development para tests
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'test';
}
