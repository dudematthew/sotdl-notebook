export interface Spell {
  id: string;
  title: string;
  area?: string;
  duration?: string;
  description: string;
  tradition?: string;
  level?: number;
  sourceBook?: string;
  tags?: string[];
  images?: string[];
  createdAt: number;
  updatedAt: number;
}

export enum SpellBoundaryType {
  TITLE = 'title',
  AREA = 'area',
  DURATION = 'duration',
  DESCRIPTION = 'description',
}

export interface SpellBoundary {
  id: string;
  type: SpellBoundaryType;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export enum SpellLanguage {
  ENGLISH = 'english',
  POLISH = 'polish',
} 