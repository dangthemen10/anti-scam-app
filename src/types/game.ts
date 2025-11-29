export interface Scenario {
  id: string;
  type: string;
  title: string;
  description: string;
  isScam: boolean;
  difficulty: 'easy' | 'hard';
  details: string;
  interactive?: boolean;
  options?: ScenarioOption[];
  sender?: string;
}

export interface ScenarioOption {
  label: string;
  action: 'left' | 'right';
}

export interface UserAnswer {
  scenarioId: string;
  isCorrect: boolean;
  timeTaken: number;
  difficulty: 'easy' | 'hard';
  isScam: boolean;
  userTrusted: boolean;
}

export interface GameStats {
  knowledge: number;
  speed: number;
  vigilance: number;
  analysis: number;
  mindset: number;
  totalScore10: number;
}

export interface Feedback {
  correct: boolean;
  details: string;
  explanation: string;
}

export type GameState = 'intro' | 'playing' | 'feedback' | 'result';
