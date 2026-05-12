import { describe, expect, it } from 'vitest';
import { slugify } from '../../../src/utils/slugify';

describe('slugify', () => {
  it('convierte un texto en un slug estable y seguro', () => {
    // El helper normaliza espacios, mayúsculas y caracteres especiales para crear IDs.
    expect(slugify('  ¡Hola, Mundo!  ')).toBe('hola-mundo');
  });

  it('elimina acentos y recorta el resultado a la longitud máxima', () => {
    // La normalización evita diferencias por tildes y el slice protege IDs demasiado largos.
    const longText = 'Árbol ñandú '.repeat(10);

    expect(slugify(longText)).toHaveLength(80);
    expect(slugify(longText)).toMatch(/^[a-z0-9-]+$/);
  });
});
