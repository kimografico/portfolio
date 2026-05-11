export const WithLabel: Story = {
  render: () => {
    const [values, setValues] = useState([
      { value: 'https://video1.com', label: 'Intro' },
      { value: 'https://video2.com', label: 'Demo' },
    ]);
    return (
      <EditableFieldList
        label="Vídeos"
        values={values}
        inputType="url"
        placeholder="URL del video"
        dataIdBase="story-video-list"
        withLabel
        labelPlaceholder="Descripción"
        onChange={(i, value, label) =>
          setValues((arr) => arr.map((x, j) => (i === j ? { value, label: label ?? '' } : x)))
        }
        onAdd={() => setValues((arr) => [...arr, { value: '', label: '' }])}
        onRemove={(i) => setValues((arr) => arr.filter((_, j) => i !== j))}
        addBtnLabel="+ Añadir video"
      />
    );
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import EditableFieldList from '../../compositions/EditableFieldList';

const meta: Meta<typeof EditableFieldList> = {
  title: 'Compositions/EditableFieldList',
  component: EditableFieldList,
};
export default meta;

type Story = StoryObj<typeof EditableFieldList>;

export const TextList: Story = {
  render: () => {
    const [values, setValues] = useState(['Uno', 'Dos']);
    return (
      <EditableFieldList
        label="Etiquetas"
        values={values}
        inputType="text"
        placeholder="Añade una etiqueta"
        dataIdBase="story-text-list"
        onChange={(i, v) => setValues((arr) => arr.map((x, j) => (i === j ? v : x)))}
        onAdd={() => setValues((arr) => [...arr, ''])}
        onRemove={(i) => setValues((arr) => arr.filter((_, j) => i !== j))}
        addBtnLabel="+ Añadir etiqueta"
      />
    );
  },
};

export const UrlList: Story = {
  render: () => {
    const [values, setValues] = useState(['https://ejemplo.com']);
    return (
      <EditableFieldList
        label="Enlaces"
        values={values}
        inputType="url"
        placeholder="Añade un enlace"
        dataIdBase="story-url-list"
        onChange={(i, v) => setValues((arr) => arr.map((x, j) => (i === j ? v : x)))}
        onAdd={() => setValues((arr) => [...arr, ''])}
        onRemove={(i) => setValues((arr) => arr.filter((_, j) => i !== j))}
        addBtnLabel="+ Añadir enlace"
      />
    );
  },
};
