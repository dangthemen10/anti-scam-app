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
  const score = stats.totalScore10;

  // Tìm điểm yếu nhất (chỉ số thấp nhất)
  const weakestStat = Math.min(stats.knowledge, stats.vigilance, stats.analysis, stats.mindset);
  const strongestStat = Math.max(stats.knowledge, stats.vigilance, stats.analysis, stats.mindset);

  // Xác định level tổng quan
  let level = '';
  let topPercent = '';
  if (score >= 9.5) {
    level = '👑 HUYỀN THOẠI';
    topPercent = 'Top 1%';
  } else if (score >= 8.5) {
    level = '💎 KIM CƯƠNG';
    topPercent = 'Top 10%';
  } else if (score >= 7) {
    level = '🎖️ VÀNG';
    topPercent = 'Top 25%';
  } else if (score >= 5.5) {
    level = '🥈 BẠC';
    topPercent = 'Top 40%';
  } else if (score >= 4) {
    level = '🥉 ĐỒNG';
    topPercent = 'Top 60%';
  } else {
    level = '� TÂN BINH';
    topPercent = 'Cần cải thiện';
  }

  // Xây dựng câu nhận xét thông minh dựa trên phân tích tổng hợp
  let feedback = '';

  // Case 1: Perfect Score (10/10)
  if (score === 10 && stats.knowledge === 100) {
    feedback = `${level} (${topPercent})! 🌟 Bạn đạt điểm tuyệt đối với tất cả ${strongestStat}% chỉ số hoàn hảo - chỉ 1/100 người làm được điều này! Bạn là bậc thầy chống lừa đảo thực thụ. Hãy chia sẻ kỹ năng này để bảo vệ cộng đồng!`;
  }
  // Case 2: Excellent (9.5-10) - Almost perfect
  else if (score >= 9.5) {
    feedback = `${level} (${topPercent})! 🏆 Bạn xuất sắc với ${stats.knowledge}% kiến thức, nhưng ${weakestStat < 80 ? 'cảnh giác vẫn cần cải thiện thêm' : 'gần như hoàn hảo rồi'}. ${score < 10 ? 'Chơi thêm 1 lượt để đạt 10/10 điểm tuyệt đối!' : 'Bạn đã đạt đỉnh cao!'}`;
  }
  // Case 3: Very Good (8.5-9.5) - Diamond level
  else if (score >= 8.5) {
    feedback = `${level} (${topPercent})! 💪 Bạn có khả năng tự bảo vệ tốt với ${stats.knowledge}% kiến thức. ${stats.vigilance < 80 ? '⚠️ Tuy nhiên cảnh giác với scam còn yếu - hãy nghi ngờ nhiều hơn!' : stats.speed < 70 ? '⚡ Tốc độ phản ứng cần nhanh hơn để xử lý thực tế!' : 'Tiếp tục duy trì để lên Top 5%!'}`;
  }
  // Case 4: Good (7-8.5) - Gold level, passed
  else if (score >= 7) {
    feedback = `${level} (${topPercent})! 🎉 Bạn đã đạt chứng chỉ với ${stats.knowledge}% kiến thức. ${stats.vigilance < 70 ? '🚨 Nhưng cảnh giác với lừa đảo chỉ ' + stats.vigilance + '% - đây là điểm yếu lớn!' : stats.analysis < 70 ? '� Khả năng phân tích tình huống phức tạp còn hạn chế.' : 'Chơi thêm để vươn lên Kim Cương!'}`;
  }
  // Case 5: Average (5.5-7) - Silver, close to passing
  else if (score >= 5.5) {
    feedback = `${level} (${topPercent})! 📚 Bạn hiểu cơ bản với ${stats.knowledge}% kiến thức, nhưng ${stats.vigilance < 60 ? '😴 cảnh giác quá thấp - bạn dễ bị lừa!' : stats.analysis < 60 ? '🎭 gặp scammer chuyên nghiệp sẽ bị qua mặt!' : 'cần thêm kinh nghiệm!'}. Chỉ cần ${(7 - score).toFixed(1)} điểm nữa để đạt chứng chỉ!`;
  }
  // Case 6: Below Average (4-5.5) - Bronze
  else if (score >= 4) {
    feedback = `${level} (${topPercent}). ⚠️ Với ${stats.knowledge}% kiến thức và ${stats.vigilance}% cảnh giác, bạn đang ở nhóm nguy cơ bị lừa cao. ${stats.vigilance < 50 ? '� Radar phát hiện scam của bạn gần như không hoạt động!' : stats.speed === 40 ? '🏃‍♂️ Bạn quyết định quá nhanh mà không suy nghĩ!' : 'Cần chơi thêm ít nhất 5 lượt để nâng cao kỹ năng tự vệ!'}`;
  }
  // Case 7: Poor (< 4) - Beginner, high risk
  else {
    feedback = `${level}! 💀 Với ${stats.knowledge}% kiến thức và ${stats.vigilance}% cảnh giác, bạn là mục tiêu dễ dàng của scammer! ${stats.vigilance < 40 ? '😴 Bạn đã sập bẫy hơn 60% lừa đảo!' : stats.knowledge < 30 ? '🚨 Kiến thức phòng thủ gần như bằng 0!' : 'Tình trạng nghiêm trọng!'} Chơi lại ngay để tự cứu mình - mỗi lần chơi tăng 15-20% khả năng phát hiện lừa đảo!`;
  }

  return [feedback];
};
