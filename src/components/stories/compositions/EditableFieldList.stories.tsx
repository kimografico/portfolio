import { useState } from 'react';
import EditableFieldList, {
  type EditableFieldListValue,
} from '../../compositions/EditableFieldList';

const meta = {
  title: 'Compositions/EditableFieldList',
  component: EditableFieldList,
  parameters: {
    // Oculta props irrelevantes en la UI de Storybook
    controls: { expanded: true },
  },
  argTypes: {
    onChange: { table: { disable: true } },
    onAdd: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    dataIdBase: { table: { disable: true } },
  },
};

export default meta;

function TextListExample() {
  const [values, setValues] = useState<string[]>(['Uno', 'Dos']);

  return (
    <EditableFieldList
      label="Etiquetas"
      values={values}
      inputType="text"
      placeholder="Añade una etiqueta"
      dataIdBase="story-text-list"
      onChange={(index, value) =>
        setValues((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)))
      }
      onAdd={() => setValues((items) => [...items, ''])}
      onRemove={(index) =>
        setValues((items) => items.filter((_, itemIndex) => itemIndex !== index))
      }
      addBtnLabel="+ Añadir etiqueta"
    />
  );
}

function UrlListExample() {
  const [values, setValues] = useState<string[]>(['https://ejemplo.com']);

  return (
    <EditableFieldList
      label="Enlaces"
      values={values}
      inputType="url"
      placeholder="Añade un enlace"
      dataIdBase="story-url-list"
      onChange={(index, value) =>
        setValues((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)))
      }
      onAdd={() => setValues((items) => [...items, ''])}
      onRemove={(index) =>
        setValues((items) => items.filter((_, itemIndex) => itemIndex !== index))
      }
      addBtnLabel="+ Añadir enlace"
    />
  );
}

function WithLabelExample() {
  const [values, setValues] = useState<EditableFieldListValue[]>([
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
      onChange={(index, value, label) =>
        setValues((items) =>
          items.map((item, itemIndex) =>
            itemIndex === index ? { value, label: label ?? '' } : item,
          ),
        )
      }
      onAdd={() => setValues((items) => [...items, { value: '', label: '' }])}
      onRemove={(index) =>
        setValues((items) => items.filter((_, itemIndex) => itemIndex !== index))
      }
      addBtnLabel="+ Añadir video"
    />
  );
}

export const TextList = {
  render: () => <TextListExample />,
};

export const UrlList = {
  render: () => <UrlListExample />,
};

export const WithLabel = {
  render: () => <WithLabelExample />,
};
