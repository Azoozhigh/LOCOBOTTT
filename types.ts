
export enum ArchitectMode {
  WEB = 'WEB',
  GAMES = 'GAMES',
  APPS = 'APPS',
  AUTOMATION = 'AUTOMATION',
  LEARNING = 'LEARNING'
}

export interface GenerationState {
  isGenerating: boolean;
  result: string | null;
  mode: ArchitectMode;
  progress: number;
}

export interface ProjectConfig {
  name: string;
  description: string;
  features: string[];
  techStack: string;
}

export interface MentorStep {
  title: string;
  content: string;
  codeSnippet?: string;
}
