import type { ResumeData, ResumeBasicsArea } from '../interfaces/resume';

const CATEGORY_OPTIONS = [
  { value: 'design', label: 'Diseño' },
  { value: 'development', label: 'Desarrollo' },
] as const;

type CategoryValue = (typeof CATEGORY_OPTIONS)[number]['value'];

type ArraySection =
  | 'skills'
  | 'software'
  | 'languages'
  | 'experience'
  | 'education'
  | 'courses'
  | 'workshops';

type EditableEntry = { category?: string | string[]; hide?: boolean };

type ArrayItem<K extends ArraySection> =
  ResumeData[K] extends Array<infer T> ? T & EditableEntry : never;

function normalizeCategory(value?: string | string[]): CategoryValue[] {
  if (!value) return [];
  if (value === 'common') return ['design', 'development'];
  if (Array.isArray(value)) {
    const normalized = value.flatMap<CategoryValue>((item) => {
      if (item === 'common') return ['design', 'development'];
      return CATEGORY_OPTIONS.some((option) => option.value === item)
        ? [item as CategoryValue]
        : [];
    });
    return [...new Set<CategoryValue>(normalized)];
  }
  return CATEGORY_OPTIONS.some((option) => option.value === value) ? [value as CategoryValue] : [];
}

export function updateBasicsField<K extends keyof ResumeData['basics']>(
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>,
  key: K,
  value: ResumeData['basics'][K],
) {
  setResumeData((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      basics: {
        ...prev.basics,
        [key]: value,
      },
    };
  });
}

export function updateBasicsArea<K extends keyof ResumeBasicsArea>(
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>,
  area: 'design' | 'development',
  key: K,
  value: ResumeBasicsArea[K],
) {
  setResumeData((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      basics: {
        ...prev.basics,
        [area]: {
          ...prev.basics[area],
          [key]: value,
        },
      },
    };
  });
}

export function updateSectionItem<K extends ArraySection>(
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>,
  section: K,
  index: number,
  updater: (item: ArrayItem<K>) => ArrayItem<K>,
) {
  setResumeData((prev) => {
    if (!prev) return prev;
    const nextSection = prev[section].map((item, itemIndex) =>
      itemIndex === index ? updater(item as unknown as ArrayItem<K>) : item,
    ) as ResumeData[K];
    return {
      ...prev,
      [section]: nextSection,
    };
  });
}

export function addSectionItem<K extends ArraySection>(
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>,
  section: K,
  item: ArrayItem<K>,
) {
  setResumeData((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      [section]: [...prev[section], item] as ResumeData[K],
    };
  });
}

export function removeSectionItem<K extends ArraySection>(
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>,
  section: K,
  index: number,
) {
  setResumeData((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      [section]: prev[section].filter((_, itemIndex) => itemIndex !== index) as ResumeData[K],
    };
  });
}

export function toggleCategory<K extends ArraySection>(
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>,
  section: K,
  index: number,
  category: CategoryValue,
) {
  updateSectionItem(setResumeData, section, index, (item) => {
    const current = normalizeCategory(item.category);
    const next = current.includes(category)
      ? current.filter((value) => value !== category)
      : [...current, category];
    return {
      ...item,
      category: next,
    };
  });
}

export function toggleHide<K extends ArraySection>(
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>,
  section: K,
  index: number,
  hide: boolean,
) {
  updateSectionItem(setResumeData, section, index, (item) => ({
    ...item,
    hide,
  }));
}
