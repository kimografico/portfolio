import { describe, expect, it } from 'vitest';
import {
  addMediaItem,
  addUniqueStringValue,
  createEmptyImage,
  createInitialForm,
  filterNonEmptyMediaItems,
  filterNonEmptyStrings,
  removeItemAtIndex,
  reorderItems,
  toggleStringValue,
  updateMediaItem,
} from '../../../src/pages/Kimo/Admin/addProjectFormHelpers';

describe('addProjectFormHelpers', () => {
  it('crea un formulario inicial coherente', () => {
    // El formulario arranca listo para editar, con elementos vacíos mínimos y fecha de hoy.
    const form = createInitialForm();

    expect(form.type).toBe('');
    expect(form.visible).toBe(true);
    expect(form.imagenes).toHaveLength(1);
    expect(form.videos).toHaveLength(1);
    expect(form.extras).toEqual(['']);
  });

  it('actualiza, añade, elimina y reordena items sin mutar el array original', () => {
    // Estos helpers simplifican la lógica del formulario y mantienen actualizaciones inmutables.
    const images = [createEmptyImage(), { image: 'b.jpg', label: 'B' }];

    expect(updateMediaItem(images, 1, 'label', 'B2')).toEqual([
      { image: '', label: '' },
      { image: 'b.jpg', label: 'B2' },
    ]);
    expect(addMediaItem(images, createEmptyImage)).toHaveLength(3);
    expect(removeItemAtIndex(images, 0)).toEqual([{ image: 'b.jpg', label: 'B' }]);
    expect(reorderItems(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });

  it('gestiona listas de strings y filtra entradas vacías', () => {
    // La lógica de stacks y extras evita duplicados y limpia valores en blanco.
    expect(toggleStringValue(['React'], 'Vue')).toEqual(['React', 'Vue']);
    expect(toggleStringValue(['React', 'Vue'], 'React')).toEqual(['Vue']);
    expect(addUniqueStringValue(['React'], '  Vue  ')).toEqual(['React', 'Vue']);
    expect(addUniqueStringValue(['React'], 'React')).toEqual(['React']);
    expect(filterNonEmptyStrings(['', 'uno', '  ', 'dos'])).toEqual(['uno', 'dos']);
    expect(
      filterNonEmptyMediaItems([
        { image: '', label: '' },
        { image: 'a.jpg', label: '' },
      ]),
    ).toEqual([{ image: 'a.jpg', label: '' }]);
  });
});
