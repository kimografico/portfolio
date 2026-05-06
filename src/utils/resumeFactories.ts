import type {
  Skill,
  Software,
  Language,
  Experience,
  Education,
  Course,
  Workshop,
} from '../interfaces/resume';

export function createEmptySkill(): Skill {
  return { name: '', category: ['design'], hide: false };
}

export function createEmptySoftware(): Software {
  return { name: '', category: ['design'], hide: false };
}

export function createEmptyLanguage(): Language {
  return { name: '', level: '', category: ['design', 'development'], hide: false };
}

export function createEmptyExperience(): Experience {
  return {
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
    name: '',
    institution: '',
    year: 'HOY',
    category: ['design'],
    hide: false,
  };
}

export function createEmptyWorkshop(): Workshop {
  return {
    name: '',
    year: 'HOY',
    category: ['design'],
    hide: false,
  };
}
