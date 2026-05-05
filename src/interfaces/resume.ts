// Tipos para los datos del currículum (resume)

export interface Skill {
  name: string;
  category: 'design' | 'development' | 'common' | string[];
  hide?: boolean;
}

export interface Software {
  name: string;
  category: 'design' | 'development' | 'common' | string[];
  hide?: boolean;
}

export interface Language {
  name: string;
  level: string;
  category?: 'design' | 'development' | 'common' | string[];
  hide?: boolean;
}

export interface Experience {
  role: string;
  company: string;
  start: string; // YYYY or YYYY-MM
  end: string; // YYYY, YYYY-MM, 'HOY', 'Actualidad', etc.
  description: string;
  category?: 'design' | 'development' | 'common' | string[];
  hide?: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  start: string;
  end: string;
  category?: 'design' | 'development' | 'common' | string[];
  hide?: boolean;
}

export interface Course {
  name: string;
  institution: string;
  year: string | number;
  category?: 'design' | 'development' | 'common' | string[];
  hide?: boolean;
}

export interface Workshop {
  name: string;
  year: string | number;
  category?: 'design' | 'development' | 'common' | string[];
  hide?: boolean;
}

export interface ResumeBasicsArea {
  title: string;
  summary: string;
  additionalInfo?: string;
}

export interface ResumeBasics {
  name: string;
  location: string;
  website: string;
  category: string[];
  hide?: boolean;
  design: ResumeBasicsArea;
  development: ResumeBasicsArea;
}

export interface ResumeData {
  basics: ResumeBasics;
  skills: Skill[];
  software: Software[];
  languages: Language[];
  experience: Experience[];
  education: Education[];
  courses: Course[];
  workshops: Workshop[];
}
