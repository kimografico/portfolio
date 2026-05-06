import type { ResumeBasicsArea, ResumeData } from '../interfaces/resume';

const CATEGORY_OPTIONS = [
  { value: 'design', label: 'Diseño' },
  { value: 'development', label: 'Desarrollo' },
] as const;

type CategoryValue = (typeof CATEGORY_OPTIONS)[number]['value'];

export function normalizeCategory(value?: string | string[]): CategoryValue[] {
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

export function normalizeBasicsArea(area: ResumeBasicsArea): ResumeBasicsArea {
  return {
    ...area,
    hide: area.hide ?? false,
    category: normalizeCategory(area.category),
  };
}

export function normalizeResume(data: ResumeData): ResumeData {
  return {
    ...data,
    basics: {
      ...data.basics,
      hide: data.basics.hide ?? false,
      category: normalizeCategory(data.basics.category),
      design: normalizeBasicsArea(data.basics.design),
      development: normalizeBasicsArea(data.basics.development),
    },
    skills: data.skills.map((item) => ({
      ...item,
      hide: item.hide ?? false,
      category: normalizeCategory(item.category),
    })),
    software: data.software.map((item) => ({
      ...item,
      hide: item.hide ?? false,
      category: normalizeCategory(item.category),
    })),
    languages: data.languages.map((item) => ({
      ...item,
      hide: item.hide ?? false,
      category: normalizeCategory(item.category),
    })),
    experience: data.experience.map((item) => ({
      ...item,
      hide: item.hide ?? false,
      category: normalizeCategory(item.category),
    })),
    education: data.education.map((item) => ({
      ...item,
      hide: item.hide ?? false,
      category: normalizeCategory(item.category),
    })),
    courses: data.courses.map((item) => ({
      ...item,
      hide: item.hide ?? false,
      category: normalizeCategory(item.category),
    })),
    workshops: data.workshops.map((item) => ({
      ...item,
      hide: item.hide ?? false,
      category: normalizeCategory(item.category),
    })),
  };
}
