'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ORIGINAL_SCENARIOS } from '@/constants/scenarios';
import { shuffleArray, calculateStats } from '@/utils/gameUtils';
import { IntroScreen } from '@/components/screens/IntroScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { GameHeader } from '@/components/GameHeader';
import { DraggableCard } from '@/components/DraggableCard';
import { FeedbackCard } from '@/components/FeedbackCard';
import { GameState, UserAnswer, Scenario, Feedback } from '@/types/game';
import { GAME_STATES } from '@/constants/gameConfig';
// import liff from '@line/liff';

export default function AntiScamApp() {
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.INTRO);
  const [userName, setUserName] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scenarios, setScenarios] = useState<Scenario[] | any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [streak, setStreak] = useState(0);

  // useEffect(() => {
  //   liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' }).then(() => {
  //     if (liff.isLoggedIn()) {
  //       liff.getProfile().then(setUserName);
  //     } else {
  //       liff.login();
  //     }
  //   });
  // }, []);

  // Start Game
  const startGame = () => {
    if (!userName.trim()) return alert('Hãy nhập tên chiến binh!');
    setUserAnswers([]);
    setScenarios(shuffleArray(ORIGINAL_SCENARIOS));
    setCurrentIndex(0);
    setStreak(0);
    setGameState(GAME_STATES.PLAYING);
    setStartTime(Date.now());
  };

  // Go Home
  const goHome = () => {
    if (confirm('Bạn có chắc muốn thoát? Mọi kết quả sẽ bị hủy.')) {
      setGameState(GAME_STATES.INTRO);
      setUserName('');
      setUserAnswers([]);
      setCurrentIndex(0);
      setStreak(0);
    }
  };

  // Reset Game
  const resetGame = () => {
    setGameState(GAME_STATES.INTRO);
    setUserName('');
    setUserAnswers([]);
    setCurrentIndex(0);
    setStreak(0);
  };

  // Play Again
  const playAgain = () => {
    setGameState(GAME_STATES.PLAYING);
    setCurrentIndex(0);
    setUserAnswers([]);
    setStreak(0);
    setScenarios(shuffleArray(ORIGINAL_SCENARIOS));
    setStartTime(Date.now());
  };

  // Handle Choice
  const handleChoice = (direction: 'left' | 'right') => {
    const timeTaken = Date.now() - startTime;
    const currentScenario = scenarios[currentIndex];
    const isTrusting = direction === 'right';

    let isCorrect = false;
    if (currentScenario.isScam && !isTrusting) isCorrect = true;
    if (!currentScenario.isScam && isTrusting) isCorrect = true;

    // Handle Streak
    if (isCorrect) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    const answerData: UserAnswer = {
      scenarioId: currentScenario.id,
      isCorrect,
      timeTaken,
      difficulty: currentScenario.difficulty,
      isScam: currentScenario.isScam,
      userTrusted: isTrusting,
    };

    setUserAnswers((prev) => [...prev, answerData]);

    setLastFeedback({
      scenario: currentScenario,
      correct: isCorrect,
      details: currentScenario.details,
      explanation: isCorrect
        ? streak >= 2
          ? `Xuất sắc! Chuỗi ${streak + 1} câu đúng liên tiếp!`
          : 'Tuyệt vời! Bạn đã quyết định đúng.'
        : currentScenario.isScam
        ? 'Cảnh báo! Đây là lừa đảo.'
        : 'Bạn quá đa nghi rồi! Đây là an toàn.',
    });
    setGameState(GAME_STATES.FEEDBACK);
  };

  // Next Card
  const nextCard = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setGameState(GAME_STATES.PLAYING);
      setStartTime(Date.now());
    } else {
      setGameState(GAME_STATES.RESULT);
    }
  };

  // Calculate Stats
  const stats = useMemo(
    () => calculateStats(userAnswers, scenarios.length),
    [userAnswers, scenarios.length]
  );

  // Render based on game state
  if (gameState === GAME_STATES.INTRO) {
    return (
      <IntroScreen
        userName={userName}
        setUserName={setUserName}
        onStart={startGame}
      />
    );
  }

  if (gameState === GAME_STATES.RESULT) {
    return (
      <ResultScreen
        userName={userName}
        stats={stats}
        onReset={resetGame}
        onPlayAgain={playAgain}
      />
    );
  }

  const currentCard = scenarios[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
      <GameHeader
        currentIndex={currentIndex}
        totalScenarios={scenarios.length}
        streak={streak}
        onExit={goHome}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 relative w-full max-w-full overflow-hidden">
        {gameState === GAME_STATES.PLAYING && (
          <DraggableCard
            key={currentCard.id}
            data={currentCard}
            onSwipe={handleChoice}
          />
        )}
        {gameState === GAME_STATES.FEEDBACK && lastFeedback && (
          <FeedbackCard feedback={lastFeedback} onNext={nextCard} />
        )}
        {gameState === GAME_STATES.PLAYING && !currentCard.interactive && (
          <div className="absolute bottom-6 flex w-full max-w-sm justify-between px-4 text-white text-[10px] sm:text-xs font-medium opacity-40 pointer-events-none">
            <div className="flex items-center gap-1 text-red-400">
              <XCircle size={16} /> Kéo Trái: Lừa Đảo
            </div>
            <div className="flex items-center gap-1 text-green-400">
              Kéo Phải: An Toàn <CheckCircle size={16} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
