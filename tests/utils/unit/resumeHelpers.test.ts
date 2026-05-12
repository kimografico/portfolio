import { describe, expect, it } from 'vitest';
import type { Dispatch, SetStateAction } from 'react';
import {
  createEmptyCourse,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyLanguage,
  createEmptySkill,
  createEmptySoftware,
  createEmptyWorkshop,
} from '../../../src/utils/resumeFactories';
import {
  normalizeBasicsArea,
  normalizeCategory,
  normalizeResume,
} from '../../../src/utils/resumeNormalization';
import {
  addSectionItem,
  removeSectionItem,
  toggleCategory,
  toggleHide,
  updateBasicsArea,
  updateBasicsField,
} from '../../../src/utils/resumeStateHelpers';
import type { ResumeData } from '../../../src/interfaces/resume';

const baseResumeData: ResumeData = {
  basics: {
    name: 'Kimografico',
    location: 'Valencia',
    website: 'https://example.com',
    category: [],
    design: { title: 'Diseño', summary: 'Resumen diseño' },
    development: { title: 'Dev', summary: 'Resumen dev' },
  },
  skills: [{ id: 'skill-1', name: 'CSS', category: 'common' }],
  software: [{ id: 'soft-1', name: 'Figma', category: ['design'] }],
  languages: [{ id: 'lang-1', name: 'ES', level: 'Nativo', category: ['development'] }],
  experience: [
    {
      id: 'exp-1',
      role: 'Dev',
      company: 'Studio',
      start: '2024',
      end: 'HOY',
      description: 'Trabajo',
      category: ['common'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Design',
      institution: 'School',
      start: '2020',
      end: '2022',
      category: [],
    },
  ],
  courses: [{ id: 'course-1', name: 'Course', institution: 'Academy', year: '2023' }],
  workshops: [{ id: 'work-1', name: 'Workshop', year: '2022' }],
};

function createStateSetter(initialValue: ResumeData | null) {
  let state = initialValue;

  const setState: Dispatch<SetStateAction<ResumeData | null>> = (value) => {
    state = typeof value === 'function' ? value(state) : value;
  };

  return { getState: () => state, setState };
}

describe('resume helpers', () => {
  it('normaliza categorías y áreas básicas', () => {
    // La normalización homogeneiza el contenido del JSON para editarlo sin sorpresas.
    expect(normalizeCategory('common')).toEqual(['design', 'development']);
    expect(normalizeBasicsArea(baseResumeData.basics.design)).toEqual({
      title: 'Diseño',
      summary: 'Resumen diseño',
      hide: false,
      category: [],
    });
  });

  it('normaliza un resume completo e inyecta ids cuando faltan', () => {
    // Cada sección conserva su contenido pero gana valores consistentes para editar en la UI.
    const normalized = normalizeResume(baseResumeData);

    expect(normalized.basics.hide).toBe(false);
    expect(normalized.basics.category).toEqual([]);
    expect(normalized.skills[0].category).toEqual(['design', 'development']);
    expect(normalized.software[0].hide).toBe(false);
    expect(normalized.languages[0].hide).toBe(false);
    expect(normalized.experience[0].hide).toBe(false);
    expect(normalized.education[0].hide).toBe(false);
    expect(normalized.courses[0].hide).toBe(false);
    expect(normalized.workshops[0].hide).toBe(false);
    expect(normalized.skills[0].id).toMatch(/skill-1|[a-z0-9]/i);
  });

  it('crea elementos vacíos para cada bloque del resume', () => {
    // Las factories simplifican la inserción de filas nuevas con un estado inicial coherente.
    expect(createEmptySkill()).toMatchObject({ name: '', category: ['development'], hide: false });
    expect(createEmptySoftware()).toMatchObject({
      name: '',
      category: ['development'],
      hide: false,
    });
    expect(createEmptyLanguage()).toMatchObject({ level: '', category: ['development'] });
    expect(createEmptyExperience()).toMatchObject({ role: '', start: 'HOY', end: 'HOY' });
    expect(createEmptyEducation()).toMatchObject({ degree: '', start: 'HOY', end: 'HOY' });
    expect(createEmptyCourse()).toMatchObject({ name: '', year: 'HOY' });
    expect(createEmptyWorkshop()).toMatchObject({ name: '', year: 'HOY' });
  });

  it('actualiza el estado del resume de forma inmutable', () => {
    // Las helpers de estado encapsulan la lógica de edición del formulario de resume.
    const { getState, setState } = createStateSetter(baseResumeData);

    updateBasicsField(setState, 'location', 'Barcelona');
    expect(getState()?.basics.location).toBe('Barcelona');

    updateBasicsArea(setState, 'design', 'title', 'Diseño UX');
    expect(getState()?.basics.design.title).toBe('Diseño UX');

    addSectionItem(setState, 'skills', {
      id: 'skill-2',
      name: 'HTML',
      category: ['design'],
      hide: false,
    });
    expect(getState()?.skills).toHaveLength(2);

    toggleCategory(setState, 'skills', 0, 'design');
    expect(getState()?.skills[0].category).toEqual(['development']);

    toggleHide(setState, 'skills', 0, true);
    expect(getState()?.skills[0].hide).toBe(true);

    removeSectionItem(setState, 'skills', 1);
    expect(getState()?.skills).toHaveLength(1);
  });
});
