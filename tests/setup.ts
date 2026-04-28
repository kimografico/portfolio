import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extender los matchers de expect con los de jest-dom
expect.extend(matchers);

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});

// Asegurar que React está en modo development para tests
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'test';
}
