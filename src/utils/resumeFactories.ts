import type {
  Skill,
  Software,
  Language,
  Experience,
  Education,
  Course,
  Workshop,
} from '../interfaces/resume';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createEmptySkill(): Skill {
  return { id: generateId(), name: '', category: ['design'], hide: false };
}

export function createEmptySoftware(): Software {
  return { id: generateId(), name: '', category: ['design'], hide: false };
}

export function createEmptyLanguage(): Language {
  return {
    id: generateId(),
    name: '',
    level: '',
    category: ['design', 'development'],
    hide: false,
  };
}

export function createEmptyExperience(): Experience {
  return {
    id: generateId(),
    role: '',
    company: '',
    start: 'HOY',
    end: 'HOY',
    description: '',
    category: ['design'],
    hide: false,
  };
}

export function createEmptyEducation(): Education {
  return {
    id: generateId(),
    degree: '',
    institution: '',
    start: 'HOY',
    end: 'HOY',
    category: ['design'],
    hide: false,
  };
}

export function createEmptyCourse(): Course {
  return {
    id: generateId(),
    name: '',
    institution: '',
    year: 'HOY',
    category: ['design'],
    hide: false,
  };
}

export function createEmptyWorkshop(): Workshop {
  return {
    id: generateId(),
    name: '',
    year: 'HOY',
    category: ['design'],
    hide: false,
  };
}
