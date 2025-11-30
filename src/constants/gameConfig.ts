// constants/gameConfig.ts
export const GAME_CONFIG = {
  MIN_SWIPE_DISTANCE: 100,
  ROTATION_MULTIPLIER: 0.05,
  CERTIFICATE_MIN_SCORE: 7,
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
} as const;

export const GAME_STATES = {
  INTRO: 'intro',
  PLAYING: 'playing',
  FEEDBACK: 'feedback',
  RESULT: 'result',
  MULTIPLAYER: 'multiplayer',
  LOBBY: 'lobby',
  BATTLE: 'battle',
  BATTLE_RESULT: 'battle-result',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  HARD: 'hard',
} as const;

export const SCENARIO_TYPES = {
  SCAM: 'scam',
  PHISHING: 'phishing',
  CEO_FRAUD: 'ceo_fraud',
  QR_SCAM: 'qr_scam',
  CHAT_SCAM: 'chat_scam',
  ROMANCE: 'romance',
  MALWARE: 'malware',
  SAFE: 'safe',
  SHOPPING: 'shopping',
  SECURITY: 'security',
} as const;

export const MESSAGE_STYLE_TYPES = [
  SCENARIO_TYPES.PHISHING,
  SCENARIO_TYPES.CHAT_SCAM,
  SCENARIO_TYPES.CEO_FRAUD,
  SCENARIO_TYPES.ROMANCE,
];

export const STAT_THRESHOLDS = {
  SPEED: {
    FAST: 1500,
    MEDIUM: 5000,
    SLOW: 8000,
  },
  KNOWLEDGE: {
    GOOD: 80,
  },
  VIGILANCE: {
    GOOD: 70,
  },
  MINDSET: {
    GOOD: 70,
  },
  SPEED_RATING: {
    GOOD: 60,
  },
} as const;