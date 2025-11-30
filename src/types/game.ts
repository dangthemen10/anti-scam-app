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

export type GameState = 'intro' | 'playing' | 'feedback' | 'result' | 'multiplayer' | 'lobby' | 'battle' | 'battle-result';

// Multiplayer Types
export interface Player {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  answers: UserAnswer[];
  isReady: boolean;
  isHost: boolean;
}

export interface BattleRoom {
  id: string;
  hostId: string;
  players: Player[];
  scenarios: Scenario[];
  currentScenarioIndex: number;
  status: 'waiting' | 'ready' | 'playing' | 'finished';
  createdAt: number;
  startedAt?: number;
}

export interface BattleAnswer {
  playerId: string;
  scenarioId: string;
  isCorrect: boolean;
  timeTaken: number;
  timestamp: number;
}
