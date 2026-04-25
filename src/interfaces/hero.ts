import type { ReactNode } from 'react';

export interface HeroSectionProps {
  label?: string;
  title: ReactNode;
  description: string;
  ctas?: Array<{ label: string; href: string }>;
  decorator?: string;
}
