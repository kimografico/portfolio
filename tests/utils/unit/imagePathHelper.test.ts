import { describe, expect, it } from 'vitest';
import {
  buildDeveloperImagePath,
  buildGraphicDesignImagePath,
  processImageObject,
  processImagePath,
  processProjectImages,
  processProjectsImages,
} from '../../../src/data/config/imagePathHelper';

describe('imagePathHelper', () => {
  it('adapta rutas antiguas al basename actual de la app', () => {
    // El helper mantiene compatibilidad con JSON antiguos que aún usan /portfolio/ hardcodeado.
    expect(processImagePath('/portfolio/images/portfolio/web/vanilla/test.jpg')).toBe(
      '/portfolio/images/portfolio/web/vanilla/test.jpg',
    );
  });

  it('construye rutas completas para diseño gráfico y desarrollo', () => {
    // Cada rama usa su carpeta raíz correcta para que la app no mezcle assets entre dominios.
    expect(buildGraphicDesignImagePath('editorial', 'cover.jpg')).toBe(
      '/portfolio/images/portfolio/design/editorial/cover.jpg',
    );
    expect(buildDeveloperImagePath('wordpress', 'home.jpg')).toBe(
      '/portfolio/images/portfolio/web/wordpress/home.jpg',
    );
  });

  it('procesa objetos y colecciones sin tocar campos que no son imagen', () => {
    // Los helpers se apoyan en copias inmutables, así que solo cambian la propiedad image.
    expect(processImageObject({ image: '/portfolio/a.jpg', label: 'A' })).toEqual({
      image: '/portfolio/a.jpg',
      label: 'A',
    });

    const project = { imagenes: [{ image: '/portfolio/b.jpg', label: 'B' }] };
    expect(processProjectImages(project)).toEqual(project);
    expect(processProjectsImages([project])).toEqual([project]);
  });
});
