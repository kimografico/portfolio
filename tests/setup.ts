import '@testing-library/jest-dom';

// Asegurar que React está en modo development para tests
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'test';
}
