'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ORIGINAL_SCENARIOS } from '@/constants/scenarios';
import { shuffleArray, calculateStats } from '@/utils/gameUtils';
import { IntroScreen } from '@/components/screens/IntroScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { MultiplayerMenu } from '@/components/screens/MultiplayerMenu';
import { LobbyScreen } from '@/components/screens/LobbyScreen';
import { GameHeader } from '@/components/GameHeader';
import { DraggableCard } from '@/components/DraggableCard';
import { FeedbackCard } from '@/components/FeedbackCard';
import { GameState, UserAnswer, Scenario, Feedback, BattleRoom, Player } from '@/types/game';
import { GAME_STATES } from '@/constants/gameConfig';
import { createRoom, joinRoom, generatePlayerId, roomStorage } from '@/utils/multiplayerUtils';
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

  // Multiplayer state
  const [battleRoom, setBattleRoom] = useState<BattleRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

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

  // Multiplayer functions
  const openMultiplayer = () => {
    if (!userName.trim()) return alert('Hãy nhập tên chiến binh trước!');
    setGameState(GAME_STATES.MULTIPLAYER);
  };

  const createBattleRoom = () => {
    const shuffled = shuffleArray(ORIGINAL_SCENARIOS).map(s => ({
      ...s,
      id: String(s.id),
      difficulty: s.difficulty as 'easy' | 'hard',
    })) as Scenario[];
    const room = createRoom(userName, shuffled);
    const host = room.players[0];
    
    setBattleRoom(room);
    setCurrentPlayer(host);
    roomStorage.saveRoom(room);
    setGameState(GAME_STATES.LOBBY);
  };

  const joinBattleRoom = (roomCode: string) => {
    const room = roomStorage.getRoom(roomCode);
    
    if (!room) {
      alert('Không tìm thấy phòng! Kiểm tra lại mã phòng.');
      return;
    }

    if (room.players.length >= 2) {
      alert('Phòng đã đầy!');
      return;
    }

    const player = joinRoom(roomCode, userName);
    room.players.push(player);
    
    setBattleRoom(room);
    setCurrentPlayer(player);
    roomStorage.saveRoom(room);
    setGameState(GAME_STATES.LOBBY);
  };

  const handlePlayerReady = () => {
    if (!battleRoom || !currentPlayer) return;
    
    const updatedPlayer = { ...currentPlayer, isReady: true };
    const updatedRoom = {
      ...battleRoom,
      players: battleRoom.players.map(p => 
        p.id === currentPlayer.id ? updatedPlayer : p
      ),
    };
    
    setCurrentPlayer(updatedPlayer);
    setBattleRoom(updatedRoom);
    roomStorage.saveRoom(updatedRoom);
  };

  const startBattle = () => {
    if (!battleRoom) return;
    
    const updatedRoom = {
      ...battleRoom,
      status: 'playing' as const,
      startedAt: Date.now(),
    };
    
    setBattleRoom(updatedRoom);
    setScenarios(battleRoom.scenarios);
    setCurrentIndex(0);
    setUserAnswers([]);
    setStreak(0);
    setGameState(GAME_STATES.BATTLE);
    setStartTime(Date.now());
    roomStorage.saveRoom(updatedRoom);
  };

  const leaveBattleRoom = () => {
    if (battleRoom) {
      roomStorage.deleteRoom(battleRoom.id);
    }
    setBattleRoom(null);
    setCurrentPlayer(null);
    setGameState(GAME_STATES.INTRO);
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
        onMultiplayer={openMultiplayer}
      />
    );
  }

  if (gameState === GAME_STATES.MULTIPLAYER) {
    return (
      <MultiplayerMenu
        userName={userName}
        onCreateRoom={createBattleRoom}
        onJoinRoom={joinBattleRoom}
        onBack={() => setGameState(GAME_STATES.INTRO)}
      />
    );
  }

  if (gameState === GAME_STATES.LOBBY && battleRoom && currentPlayer) {
    return (
      <LobbyScreen
        room={battleRoom}
        currentPlayer={currentPlayer}
        onReady={handlePlayerReady}
        onStart={startBattle}
        onLeave={leaveBattleRoom}
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

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {gameState === GAME_STATES.PLAYING && (
          <DraggableCard data={currentCard} onSwipe={handleChoice} />
        )}
        {gameState === GAME_STATES.FEEDBACK && lastFeedback && (
          <FeedbackCard feedback={lastFeedback} onNext={nextCard} />
        )}
        {gameState === GAME_STATES.PLAYING && !currentCard.interactive && (
          <div className="absolute bottom-6 flex w-full max-w-sm justify-between px-4 text-white text-xs font-medium opacity-40 pointer-events-none">
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
