import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RefObject } from 'react';
import DataActionBar from '../../../src/components/compositions/DataActionBar';
import EditableFieldList from '../../../src/components/compositions/EditableFieldList';
import TechStackTags from '../../../src/components/compositions/TechStackTags';
import ImageDropZone from '../../../src/components/compositions/ImageDropZone';

describe('form-like components', () => {
  it('muestra las acciones de selección masiva en DataActionBar', () => {
    // Esta barra centraliza acciones destructivas para que el usuario no las haga una a una.
    const onCancel = vi.fn();

    render(
      <DataActionBar
        selectedCount={2}
        loading={false}
        error=""
        onMarkHidden={vi.fn()}
        onMarkVisible={vi.fn()}
        onDelete={vi.fn()}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByText('2 proyectos seleccionados')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('permite añadir, editar y eliminar valores en EditableFieldList', () => {
    // El componente abstrae listas de inputs repetidas con y sin etiqueta.
    const onChange = vi.fn();
    const onAdd = vi.fn();
    const onRemove = vi.fn();

    render(
      <EditableFieldList
        label="Extras"
        values={[
          { value: 'Uno', label: 'Etiqueta' },
          { value: 'Dos', label: 'Etiqueta 2' },
        ]}
        dataIdBase="extras"
        onChange={onChange}
        onAdd={onAdd}
        onRemove={onRemove}
        withLabel
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /\+ añadir/i }));
    expect(onAdd).toHaveBeenCalledOnce();

    fireEvent.change(screen.getByDisplayValue('Uno'), { target: { value: 'UnoX' } });
    expect(onChange).toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('gestiona el stack tecnológico con opciones, custom y chips eliminables', () => {
    // TechStackTags convierte un conjunto de tecnologías en chips interactivas.
    const onToggle = vi.fn();
    const onAddCustom = vi.fn();

    render(
      <TechStackTags
        stack={['React']}
        options={['React', 'Vue']}
        onToggle={onToggle}
        onAddCustom={onAddCustom}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Vue' }));
    expect(onToggle).toHaveBeenCalledWith('Vue');

    const customInput = screen.getByPlaceholderText('Otra tecnología…');
    fireEvent.change(customInput, { target: { value: 'Svelte' } });
    fireEvent.keyDown(customInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(onAddCustom).toHaveBeenCalledWith('Svelte');

    fireEvent.click(screen.getByRole('button', { name: /eliminar react/i }));
    expect(onToggle).toHaveBeenCalledWith('React');
  });

  it('permite previsualizar, reordenar y borrar imágenes en ImageDropZone', () => {
    // Esta zona encapsula la UX de subida y edición manual de imágenes de proyecto.
    const onSelectFilesClick = vi.fn();
    const onAddImage = vi.fn();
    const onFileSelect = vi.fn();
    const onDropZoneDragOver = vi.fn();
    const onDropZoneDrop = vi.fn();
    const onImageDragStart = vi.fn();
    const onImageDragOver = vi.fn();
    const onImageDrop = vi.fn();
    const onImageDragEnd = vi.fn();
    const onImageChange = vi.fn();
    const onRemoveImage = vi.fn();
    const onImageError = vi.fn();
    const fileInputRef = { current: null } as RefObject<HTMLInputElement | null>;

    render(
      <ImageDropZone
        images={[{ image: 'cover.jpg', label: 'Portada' }]}
        imgErrors={{}}
        dragIndex={null}
        dragOverIndex={null}
        fileInputRef={fileInputRef}
        onSelectFilesClick={onSelectFilesClick}
        onAddImage={onAddImage}
        onFileSelect={onFileSelect}
        onDropZoneDragOver={onDropZoneDragOver}
        onDropZoneDrop={onDropZoneDrop}
        onImageDragStart={onImageDragStart}
        onImageDragOver={onImageDragOver}
        onImageDrop={onImageDrop}
        onImageDragEnd={onImageDragEnd}
        onImageChange={onImageChange}
        onRemoveImage={onRemoveImage}
        onImageError={onImageError}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /seleccionar archivos/i }));
    fireEvent.click(screen.getByRole('button', { name: /\+ añadir url/i }));
    expect(onSelectFilesClick).toHaveBeenCalledTimes(1);
    expect(onAddImage).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue('cover.jpg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Portada')).toBeInTheDocument();
  });
});
