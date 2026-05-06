// Tipos para los datos del currículum (resume)

export interface Skill {
  id: string;
  name: string;
  category: 'design' | 'development' | string[];
  hide?: boolean;
}

export interface Software {
  id: string;
  name: string;
  category: 'design' | 'development' | string[];
  hide?: boolean;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  category?: 'design' | 'development' | string[];
  hide?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  start: string; // YYYY or YYYY-MM
  end: string; // YYYY, YYYY-MM, 'HOY', 'Actualidad', etc.
  description: string;
  category?: 'design' | 'development' | string[];
  hide?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  start: string;
  end: string;
  category?: 'design' | 'development' | string[];
  hide?: boolean;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  year: string | number;
  category?: 'design' | 'development' | string[];
  hide?: boolean;
}

export interface Workshop {
  id: string;
  name: string;
  year: string | number;
  category?: 'design' | 'development' | string[];
  hide?: boolean;
}

export interface ResumeBasicsArea {
  title: string;
  summary: string;
  additionalInfo?: string;
  hide?: boolean;
  category?: ('design' | 'development')[];
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
