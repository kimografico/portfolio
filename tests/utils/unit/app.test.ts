import { describe, expect, it } from 'vitest';
import { resolveAssetPath } from '../../../src/data/config/app';

describe('resolveAssetPath', () => {
  describe('desplegado en la raíz del dominio (basename vacío)', () => {
    it('deja las rutas de raíz tal cual', () => {
      expect(resolveAssetPath('/images/portfolio/x.jpg', '')).toBe('/images/portfolio/x.jpg');
    });

    it('no toca rutas con prefijo viejo /portfolio (dato legacy)', () => {
      // Con basename vacío no hay prefijo que resolver: se deja tal cual.
      expect(resolveAssetPath('/portfolio/images/foo.jpg', '')).toBe('/portfolio/images/foo.jpg');
    });

    it('deja pasar URLs absolutas, blob, data y anclas', () => {
      expect(resolveAssetPath('https://cdn.com/x.jpg', '')).toBe('https://cdn.com/x.jpg');
      expect(resolveAssetPath('blob:http://localhost/x', '/portfolio')).toBe(
        'blob:http://localhost/x',
      );
      expect(resolveAssetPath('data:image/png;base64,AAA', '/portfolio')).toBe(
        'data:image/png;base64,AAA',
      );
      expect(resolveAssetPath('#ancla', '/portfolio')).toBe('#ancla');
    });
  });

  describe('desplegado en subcarpeta (basename /portfolio)', () => {
    it('antepone /portfolio a rutas relativas a la raíz', () => {
      expect(resolveAssetPath('/images/portfolio/x.jpg', '/portfolio')).toBe(
        '/portfolio/images/portfolio/x.jpg',
      );
    });

    it('no duplica el prefijo si la ruta ya lo incluye', () => {
      expect(resolveAssetPath('/portfolio/images/foo.jpg', '/portfolio')).toBe(
        '/portfolio/images/foo.jpg',
      );
    });

    it('es idempotente (aplicar dos veces no duplica)', () => {
      const once = resolveAssetPath('/images/foo.jpg', '/portfolio');
      expect(resolveAssetPath(once, '/portfolio')).toBe(once);
    });
  });

  it('devuelve vacío/nulos sin romper', () => {
    expect(resolveAssetPath('')).toBe('');
  });
});
