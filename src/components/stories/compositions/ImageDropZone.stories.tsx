import { useState, type ChangeEvent, type DragEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import ImageDropZone, { type ProjectImageItem } from '../../compositions/ImageDropZone';

const meta = {
  title: 'compositions/ImageDropZone',
  component: ImageDropZone,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    fileInputRef: { table: { disable: true } },
    imgErrors: { table: { disable: true } },
    dragIndex: { table: { disable: true } },
    dragOverIndex: { table: { disable: true } },
    onSelectFilesClick: { table: { disable: true } },
    onAddImage: { table: { disable: true } },
    onFileSelect: { table: { disable: true } },
    onDropZoneDragOver: { table: { disable: true } },
    onDropZoneDrop: { table: { disable: true } },
    onImageDragStart: { table: { disable: true } },
    onImageDragOver: { table: { disable: true } },
    onImageDrop: { table: { disable: true } },
    onImageDragEnd: { table: { disable: true } },
    onImageChange: { table: { disable: true } },
    onRemoveImage: { table: { disable: true } },
    onImageError: { table: { disable: true } },
  },
} satisfies Meta<typeof ImageDropZone>;

export default meta;

type Story = StoryObj<typeof ImageDropZone>;

function InteractiveStory() {
  const [images, setImages] = useState<ProjectImageItem[]>([
    {
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      label: 'Portada',
    },
    {
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      label: 'Interior',
    },
  ]);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleSelectFilesClick = () => undefined;
  const handleAddImage = () => {
    setImages((prev) => [...prev, { image: '', label: '' }]);
  };
  const handleFileSelect = (_e: ChangeEvent<HTMLInputElement>) => undefined;
  const handleDropZoneDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  const handleDropZoneDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleImageDragStart = (index: number) => {
    setDragIndex(index);
  };
  const handleImageDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };
  const handleImageDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleImageDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleImageChange = (index: number, field: 'image' | 'label', value: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)));
    setImgErrors((prev) => ({ ...prev, [index]: false }));
  };
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImgErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };
  const handleImageError = (index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <ImageDropZone
      images={images}
      imgErrors={imgErrors}
      dragIndex={dragIndex}
      dragOverIndex={dragOverIndex}
      fileInputRef={{ current: null }}
      onSelectFilesClick={handleSelectFilesClick}
      onAddImage={handleAddImage}
      onFileSelect={handleFileSelect}
      onDropZoneDragOver={handleDropZoneDragOver}
      onDropZoneDrop={handleDropZoneDrop}
      onImageDragStart={handleImageDragStart}
      onImageDragOver={handleImageDragOver}
      onImageDrop={handleImageDrop}
      onImageDragEnd={handleImageDragEnd}
      onImageChange={handleImageChange}
      onRemoveImage={handleRemoveImage}
      onImageError={handleImageError}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveStory />,
};
