export type AddProjectMediaItem = {
  image: string;
  label: string;
};

export type AddProjectFormState = {
  type: '' | 'gd' | 'dev';
  category: string;
  title: string;
  cliente: string;
  descripcion: string;
  visible: boolean;
  date: string;
  imagenes: AddProjectMediaItem[];
  videos: AddProjectMediaItem[];
  extras: string[];
  stack: string[];
};

export function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function createEmptyImage(): AddProjectMediaItem {
  return { image: '', label: '' };
}

export function createEmptyVideo(): AddProjectMediaItem {
  return { image: '', label: '' };
}

export function createInitialForm(): AddProjectFormState {
  return {
    type: '',
    category: '',
    title: '',
    cliente: '',
    descripcion: '',
    visible: true,
    date: getTodayDate(),
    imagenes: [createEmptyImage()],
    videos: [createEmptyVideo()],
    extras: [''],
    stack: [],
  };
}

export function updateMediaItem(
  items: AddProjectMediaItem[],
  index: number,
  field: 'image' | 'label',
  value: string,
): AddProjectMediaItem[] {
  return items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
}

export function addMediaItem(
  items: AddProjectMediaItem[],
  createItem: () => AddProjectMediaItem,
): AddProjectMediaItem[] {
  return [...items, createItem()];
}

export function removeItemAtIndex<T>(items: T[], index: number): T[] {
  return items.filter((_, i) => i !== index);
}

export function reorderItems<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return items;
  const updated = [...items];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
}

export function toggleStringValue(items: string[], value: string): string[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export function addUniqueStringValue(items: string[], value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed || items.includes(trimmed)) return items;
  return [...items, trimmed];
}

export function filterNonEmptyStrings(values: string[]): string[] {
  return values.filter((value) => value.trim() !== '');
}

export function filterNonEmptyMediaItems(items: AddProjectMediaItem[]): AddProjectMediaItem[] {
  return items.filter((item) => item.image.trim() !== '');
}
