import { UserAnswer, GameStats } from '@/types/game';
import { STAT_THRESHOLDS } from '@/constants/gameConfig';

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const calculateStats = (
  userAnswers: UserAnswer[],
  totalScenarios: number
): GameStats => {
  if (userAnswers.length === 0) {
    return {
      knowledge: 0,
      speed: 0,
      vigilance: 0,
      analysis: 0,
      mindset: 0,
      totalScore10: 0,
    };
  }

  const totalCorrect = userAnswers.filter((a) => a.isCorrect).length;
  const totalScore10 = (totalCorrect / totalScenarios) * 10;

  // Knowledge score
  const knowledge = Math.round((totalCorrect / totalScenarios) * 100);

  // Speed score
  const avgTime =
    userAnswers.reduce((acc, curr) => acc + curr.timeTaken, 0) /
    userAnswers.length;
  let speed = 0;
  if (avgTime < STAT_THRESHOLDS.SPEED.FAST) speed = 40;
  else if (avgTime <= STAT_THRESHOLDS.SPEED.MEDIUM) speed = 100;
  else if (avgTime <= STAT_THRESHOLDS.SPEED.SLOW) speed = 70;
  else speed = 50;

  // Vigilance score (scam detection)
  const scamScenarios = userAnswers.filter((a) => a.isScam);
  const correctScams = scamScenarios.filter((a) => a.isCorrect).length;
  const vigilance = scamScenarios.length
    ? Math.round((correctScams / scamScenarios.length) * 100)
    : 100;

  // Analysis score (hard scenarios)
  const hardScenarios = userAnswers.filter((a) => a.difficulty === 'hard');
  const correctHard = hardScenarios.filter((a) => a.isCorrect).length;
  const analysis = hardScenarios.length
    ? Math.round((correctHard / hardScenarios.length) * 100)
    : 100;

  // Mindset score (safe scenarios)
  const safeScenarios = userAnswers.filter((a) => !a.isScam);
  const correctSafe = safeScenarios.filter((a) => a.isCorrect).length;
  const mindset = safeScenarios.length
    ? Math.round((correctSafe / safeScenarios.length) * 100)
    : 100;

  return { knowledge, speed, vigilance, analysis, mindset, totalScore10 };
};

export const getSuggestions = (stats: GameStats): string[] => {
  const suggestions: string[] = [];
  
  if (stats.knowledge < STAT_THRESHOLDS.KNOWLEDGE.GOOD)
    suggestions.push(
      'Kiến thức chung: Hãy đọc kỹ các lời giải thích để hiểu rõ bản chất.'
    );
  if (stats.speed < STAT_THRESHOLDS.SPEED_RATING.GOOD)
    suggestions.push('Tốc độ: Bạn thao tác quá nhanh hoặc quá chậm.');
  if (stats.vigilance < STAT_THRESHOLDS.VIGILANCE.GOOD)
    suggestions.push(
      'Cảnh giác: Bạn dễ bị mắc bẫy lừa đảo. Hãy luôn nghi ngờ.'
    );
  if (stats.mindset < STAT_THRESHOLDS.MINDSET.GOOD)
    suggestions.push(
      'Tư duy: Bạn hơi đa nghi quá mức với cả dịch vụ an toàn.'
    );
  if (stats.knowledge === 100)
    suggestions.push('Hoàn hảo! Bạn có tố chất chuyên gia.');
    
  return suggestions.length
    ? suggestions
    : ['Hãy tiếp tục duy trì phong độ này!'];
};
