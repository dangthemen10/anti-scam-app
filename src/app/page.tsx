'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  ChevronRight,
  Info,
  Zap,
  Eye,
  Brain,
  Home,
  Search,
  LogOut,
  MessageCircle,
  MousePointerClick,
  Activity,
  Flame,
  Lock,
} from 'lucide-react';
import { ORIGINAL_SCENARIOS } from '@/libs/scenarios';
// import liff from '@line/liff';

// --- UTILS ---
const shuffleArray = (array: any) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- HELPER COMPONENTS ---
const ScenarioIcon = ({ type }: any) => {
  const baseClass =
    'w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 shadow-inner transition-transform hover:scale-105 flex-shrink-0';
  switch (type) {
    case 'scam':
      return (
        <div className={`${baseClass} bg-red-100`}>
          <Zap size={32} className="text-red-500" />
        </div>
      );
    case 'phishing':
      return (
        <div className={`${baseClass} bg-orange-100`}>
          <Search size={32} className="text-orange-500" />
        </div>
      );
    case 'ceo_fraud':
      return (
        <div className={`${baseClass} bg-gray-200`}>
          <div className="text-3xl">👔</div>
        </div>
      );
    case 'qr_scam':
      return (
        <div className={`${baseClass} bg-yellow-100`}>
          <div className="text-3xl">📱</div>
        </div>
      );
    case 'chat_scam':
      return (
        <div className={`${baseClass} bg-blue-100`}>
          <MessageCircle size={32} className="text-blue-500" />
        </div>
      );
    case 'romance':
      return (
        <div className={`${baseClass} bg-pink-100`}>
          <div className="text-3xl">💔</div>
        </div>
      );
    case 'malware':
      return (
        <div className={`${baseClass} bg-slate-200`}>
          <AlertTriangle size={32} className="text-slate-600" />
        </div>
      );
    case 'safe':
    case 'shopping':
    case 'security':
      return (
        <div className={`${baseClass} bg-green-100`}>
          <Shield size={32} className="text-green-600" />
        </div>
      );
    default:
      return (
        <div className={`${baseClass} bg-blue-100`}>
          <Info size={32} className="text-blue-500" />
        </div>
      );
  }
};

const RadarChart = ({ stats }: any) => {
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const axis = 5;

  const getPoint = (value: any, index: any) => {
    const angle = (Math.PI * 2 * index) / axis - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const points = [
    stats.knowledge,
    stats.speed,
    stats.vigilance,
    stats.analysis,
    stats.mindset,
  ].map((val, i) => getPoint(val, i));
  const pathData =
    points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ') +
    'Z';
  const labels = [
    'Kiến thức',
    'Tốc độ',
    'Cảnh giác',
    'Phân tích',
    'Tư duy',
  ].map((label, i) => {
    const angle = (Math.PI * 2 * i) / axis - Math.PI / 2;
    const r = radius + 25;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      text: label,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
        ))}
        {points.map((_, i) => {
          const end = getPoint(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#cbd5e1"
            />
          );
        })}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.5)"
          stroke="#2563eb"
          strokeWidth="2"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1d4ed8" />
        ))}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-slate-300">
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default function AntiScamApp() {
  const [gameState, setGameState] = useState('intro');
  const [userName, setUserName] = useState<any>('');
  const [scenarios, setScenarios] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any>([]);
  const [startTime, setStartTime] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const canvasRef = useRef<any>(null);

  // useEffect(() => {
  //   liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' }).then(() => {
  //     if (liff.isLoggedIn()) {
  //       liff.getProfile().then(setUserName);
  //     } else {
  //       liff.login();
  //     }
  //   });
  // }, []);

  // --- LOGIC ---
  const startGame = () => {
    if (!userName.trim()) return alert('Hãy nhập tên chiến binh!');
    setUserAnswers([]);
    // Shuffle scenarios at start
    setScenarios(shuffleArray(ORIGINAL_SCENARIOS));
    setCurrentIndex(0);
    setStreak(0);
    setGameState('playing');
    setStartTime(Date.now());
  };

  const goHome = () => {
    if (confirm('Bạn có chắc muốn thoát? Mọi kết quả sẽ bị hủy.')) {
      setGameState('intro');
      setUserName('');
      setUserAnswers([]);
      setCurrentIndex(0);
      setStreak(0);
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setUserName('');
    setUserAnswers([]);
    setCurrentIndex(0);
    setStreak(0);
  };

  const handleChoice = (direction: any) => {
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

    const answerData = {
      scenarioId: currentScenario.id,
      isCorrect,
      timeTaken,
      difficulty: currentScenario.difficulty,
      isScam: currentScenario.isScam,
      userTrusted: isTrusting,
    };

    setUserAnswers((prev: any) => [...prev, answerData]);

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
    setGameState('feedback');
  };

  const nextCard = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setGameState('playing');
      setStartTime(Date.now());
    } else {
      setGameState('result');
    }
  };

  // --- ANALYTICS ---
  const stats = useMemo(() => {
    if (userAnswers.length === 0)
      return {
        knowledge: 0,
        speed: 0,
        vigilance: 0,
        analysis: 0,
        mindset: 0,
        totalScore10: 0,
      };

    const totalCorrect = userAnswers.filter((a: any) => a.isCorrect).length;
    const totalScore10 = (totalCorrect / scenarios.length) * 10;

    const knowledge = Math.round((totalCorrect / scenarios.length) * 100);

    const avgTime =
      userAnswers.reduce((acc: any, curr: any) => acc + curr.timeTaken, 0) /
      userAnswers.length;
    let speed = 0;
    if (avgTime < 1500) speed = 40;
    else if (avgTime <= 5000) speed = 100;
    else if (avgTime <= 8000) speed = 70;
    else speed = 50;

    const scamScenarios = userAnswers.filter((a: any) => a.isScam);
    const correctScams = scamScenarios.filter((a: any) => a.isCorrect).length;
    const vigilance = scamScenarios.length
      ? Math.round((correctScams / scamScenarios.length) * 100)
      : 100;

    const hardScenarios = userAnswers.filter(
      (a: any) => a.difficulty === 'hard'
    );
    const correctHard = hardScenarios.filter((a: any) => a.isCorrect).length;
    const analysis = hardScenarios.length
      ? Math.round((correctHard / hardScenarios.length) * 100)
      : 100;

    const safeScenarios = userAnswers.filter((a: any) => !a.isScam);
    const correctSafe = safeScenarios.filter((a: any) => a.isCorrect).length;
    const mindset = safeScenarios.length
      ? Math.round((correctSafe / safeScenarios.length) * 100)
      : 100;

    return { knowledge, speed, vigilance, analysis, mindset, totalScore10 };
  }, [userAnswers, scenarios.length]);

  const getSuggestions = () => {
    const suggestions = [];
    if (stats.knowledge < 80)
      suggestions.push(
        'Kiến thức chung: Hãy đọc kỹ các lời giải thích để hiểu rõ bản chất.'
      );
    if (stats.speed < 60)
      suggestions.push('Tốc độ: Bạn thao tác quá nhanh hoặc quá chậm.');
    if (stats.vigilance < 70)
      suggestions.push(
        'Cảnh giác: Bạn dễ bị mắc bẫy lừa đảo. Hãy luôn nghi ngờ.'
      );
    if (stats.mindset < 70)
      suggestions.push(
        'Tư duy: Bạn hơi đa nghi quá mức với cả dịch vụ an toàn.'
      );
    if (stats.knowledge === 100)
      suggestions.push('Hoàn hảo! Bạn có tố chất chuyên gia.');
    return suggestions.length
      ? suggestions
      : ['Hãy tiếp tục duy trì phong độ này!'];
  };

  // --- CERTIFICATE ---
  useEffect(() => {
    const drawCertificate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = 1200;
      canvas.height = 800;

      const grad = ctx.createLinearGradient(0, 0, 1200, 800);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 800);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 15;
      ctx.strokeRect(50, 50, 1100, 700);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 50px Arial';
      ctx.fillText('CHỨNG NHẬN ANTI-SCAM', 600, 200);

      ctx.font = 'italic 40px Arial';
      ctx.fillText('Trao tặng cho chiến binh:', 600, 300);

      ctx.font = 'bold 80px "Times New Roman"';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(userName, 600, 420);

      ctx.font = '30px Arial';
      ctx.fillStyle = '#e5e7eb';
      ctx.fillText(
        `Điểm Tổng Kết: ${stats.totalScore10.toFixed(1)}/10`,
        600,
        520
      );
      ctx.font = '24px Arial';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(
        `Kiến thức: ${stats.knowledge}% - Cảnh giác: ${stats.vigilance}% - Tư duy: ${stats.mindset}%`,
        600,
        570
      );
      ctx.fillText(
        `Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}`,
        600,
        620
      );
    };
    
    if (
      gameState === 'result' &&
      stats.totalScore10 >= 7 &&
      canvasRef.current
    ) {
      drawCertificate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, stats]);

  const downloadCertificate = () => {
    const link = document.createElement('a');
    link.download = `AntiScam_Certificate_${userName}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  // --- RENDER ---
  const currentCard = scenarios[currentIndex];

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-slate-950"></div>
        <div className="max-w-md w-full text-center space-y-8 z-10 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center">
                <Shield size={64} className="text-blue-400" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black bg-linear-to-br from-white to-slate-400 bg-clip-text text-transparent">
            SCAM HUNTER
          </h1>
          <p className="text-slate-400 text-lg px-4">
            Đối mặt với 10 cạm bẫy tinh vi. <br />
            Bạn là &quot;Gà mờ&quot; hay &quot;Chuyên gia&quot;?
          </p>
          <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nhập tên biệt danh..."
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white text-center text-xl placeholder:text-slate-600 transition-all"
            />
          </div>
          <button
            onClick={startGame}
            className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-xl shadow-lg shadow-blue-900/30 transition-all active:scale-95">
            Bắt đầu Săn Lừa Đảo
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const passed = stats.totalScore10 >= 7;
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 text-white font-sans overflow-y-auto">
        <div className="w-full max-w-2xl bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 my-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Hồ sơ năng lực
          </h2>
          <div className="text-center text-slate-400 mb-6">
            Người chơi: <span className="text-white font-bold">{userName}</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-full shadow-inner">
              <RadarChart stats={stats} />
            </div>

            <div className="space-y-3 w-full md:w-auto text-sm">
              <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
                <span className="text-blue-400 flex gap-2">
                  <Brain size={16} /> Kiến thức
                </span>{' '}
                <span className="font-bold">{stats.knowledge}%</span>
              </div>
              <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
                <span className="text-yellow-400 flex gap-2">
                  <Eye size={16} /> Cảnh giác
                </span>{' '}
                <span className="font-bold">{stats.vigilance}%</span>
              </div>
              <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
                <span className="text-green-400 flex gap-2">
                  <Zap size={16} /> Tốc độ
                </span>{' '}
                <span className="font-bold">{stats.speed}%</span>
              </div>
              <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
                <span className="text-purple-400 flex gap-2">
                  <Activity size={16} /> Phân tích
                </span>{' '}
                <span className="font-bold">{stats.analysis}%</span>
              </div>
              <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
                <span className="text-pink-400 flex gap-2">
                  <Lock size={16} /> Tư duy
                </span>{' '}
                <span className="font-bold">{stats.mindset}%</span>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-700 text-center">
                <span className="text-slate-400 text-xs uppercase tracking-widest">
                  Điểm Tổng Kết
                </span>
                <div className="text-4xl font-black text-white">
                  {stats.totalScore10.toFixed(1)}/10
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5 mb-8 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Info size={20} className="text-blue-500" /> Đánh giá từ chuyên
              gia
            </h3>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              {getSuggestions().map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            {passed ? (
              <>
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={downloadCertificate}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
                  <Download size={20} /> Tải chứng nhận danh dự
                </button>
              </>
            ) : (
              <div className="text-center text-red-400 mb-2 italic">
                Bạn cần đạt ít nhất 7/10 điểm để nhận chứng chỉ.
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
                <Home size={20} /> Màn hình chính
              </button>
              <button
                onClick={() => {
                  setGameState('playing');
                  setCurrentIndex(0);
                  setUserAnswers([]);
                  setStreak(0);
                  setScenarios(shuffleArray(ORIGINAL_SCENARIOS));
                  setStartTime(Date.now());
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
                <RefreshCw size={20} /> Chơi lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
      <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={goHome}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Thoát game">
            <LogOut size={20} />
          </button>
          <div className="font-bold text-white flex items-center gap-2">
            <Shield size={20} className="text-blue-500" /> Scam Hunter
          </div>
        </div>

        {/* Streak & Level Display */}
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 text-orange-500 font-bold animate-pulse">
              <Flame size={20} className="fill-orange-500" />
              <span>Streak: {streak}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Level {currentIndex + 1}/{scenarios.length}
            </div>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${(currentIndex / scenarios.length) * 100}%`,
                }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {gameState === 'playing' && (
          <DraggableCard data={currentCard} onSwipe={handleChoice} />
        )}
        {gameState === 'feedback' && (
          <FeedbackCard feedback={lastFeedback} onNext={nextCard} />
        )}
        {gameState === 'playing' && !currentCard.interactive && (
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

// --- SUB COMPONENTS ---

function DraggableCard({ data, onSwipe }: any) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: any, clientY: any) => {
    if (data.interactive) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };
  const handleMove = (clientX: any, clientY: any) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - startPos.current.x,
      y: clientY - startPos.current.y,
    });
  };
  const handleEnd = () => {
    setIsDragging(false);
    if (position.x > 100) onSwipe('right');
    else if (position.x < -100) onSwipe('left');
    else setPosition({ x: 0, y: 0 });
  };

  const handlers = {
    onMouseDown: (e: any) => handleStart(e.clientX, e.clientY),
    onMouseMove: (e: any) => handleMove(e.clientX, e.clientY),
    onMouseUp: handleEnd,
    onMouseLeave: () => isDragging && handleEnd(),
    onTouchStart: (e: any) =>
      handleStart(e.touches[0].clientX, e.touches[0].clientY),
    onTouchMove: (e: any) =>
      handleMove(e.touches[0].clientX, e.touches[0].clientY),
    onTouchEnd: handleEnd,
  };

  const rotate = position.x * 0.05;
  const opacityRight = Math.min(position.x / 100, 1);
  const opacityLeft = Math.min(Math.abs(position.x) / 100, 1);

  // Check if this scenario should look like a message
  const isMessageStyle = ['phishing', 'chat_scam', 'ceo_fraud', 'romance'].includes(data.type);

  return (
    <div
      className="relative w-full max-w-sm h-[70vh] md:h-[75vh] min-h-[550px] perspective-1000"
      {...handlers}>
      <div
        ref={cardRef}
        className={`w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden select-none absolute top-0 left-0 flex flex-col ${
          !data.interactive ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotate}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}>
        {!data.interactive && (
          <>
            <div
              className="absolute top-6 left-6 border-4 border-green-500 text-green-500 font-black px-4 py-2 rounded-lg text-3xl z-10 transform -rotate-12 bg-white/50 backdrop-blur-sm"
              style={{ opacity: opacityRight }}>
              TIN
            </div>
            <div
              className="absolute top-6 right-6 border-4 border-red-500 text-red-500 font-black px-4 py-2 rounded-lg text-3xl z-10 transform rotate-12 bg-white/50 backdrop-blur-sm"
              style={{ opacity: opacityLeft }}>
              LỪA
            </div>
          </>
        )}

        <div className="flex-1 p-6 flex flex-col items-center overflow-y-auto custom-scrollbar">
          {/* Header with Title and Difficulty */}
          <div className="w-full flex flex-col items-center mb-6 shrink-0">
            <div className="mt-2 mb-3">
              <ScenarioIcon type={data.type} />
            </div>
            <div className="w-full flex justify-center mb-2">
              <span
                className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  data.difficulty === 'hard'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                Độ khó: {data.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 text-center leading-tight">
              {data.title}
            </h2>
          </div>

          {/* Content Area - Conditional Styling */}
          <div className="w-full flex-1 flex flex-col justify-center mb-4">
            {isMessageStyle ? (
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 relative mx-2">
                <div className="absolute -top-3 -left-1 w-4 h-4 bg-slate-100 border-l border-t border-slate-200 transform -rotate-45"></div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/50">
                  <div className="font-bold text-xs text-slate-500 uppercase">
                    {data.sender || 'Người lạ'}
                  </div>
                  <div className="text-xs text-slate-400 ml-auto">Vừa xong</div>
                </div>
                <p className="text-slate-800 text-lg leading-relaxed font-medium">
                  {data.description}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative mx-2">
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                  {data.interactive ? (
                    <MousePointerClick size={16} />
                  ) : (
                    <Search size={16} />
                  )}
                </div>
                <p className="text-slate-600 text-center text-lg leading-relaxed font-medium">
                  {data.description}
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          {data.interactive && (
            <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-4 shrink-0 pb-2">
              <p className="text-center text-sm font-bold text-slate-400 mb-2">
                Bạn sẽ làm gì?
              </p>
              {data.options.map((opt: any, idx: any) => (
                <button
                  key={idx}
                  onClick={() => onSwipe(opt.action)}
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2
                           bg-blue-600 hover:bg-blue-700
                        `}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {!data.interactive && (
            <div className="mt-auto text-center shrink-0">
              <p className="text-slate-400 text-sm italic">
                Kéo thẻ để quyết định
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-3 left-0 w-full h-full bg-slate-800 rounded-3xl -z-10 scale-95 opacity-50 translate-y-2"></div>
    </div>
  );
}

function FeedbackCard({ feedback, onNext }: any) {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300 z-20 text-center max-h-[80vh] overflow-y-auto custom-scrollbar">
      {feedback.correct ? (
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>
      ) : (
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="text-red-600 w-10 h-10" />
        </div>
      )}

      <h3
        className={`text-2xl font-black mb-2 ${
          feedback.correct ? 'text-green-600' : 'text-red-600'
        }`}>
        {feedback.correct ? 'CHÍNH XÁC!' : 'SAI RỒI!'}
      </h3>

      <p className="text-slate-800 font-medium mb-2">{feedback.explanation}</p>

      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 mb-4 text-left border border-slate-200">
        <span className="font-bold block mb-1 text-slate-800">
          🔍 Giải thích:
        </span>
        {feedback.details}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
        Tiếp tục <ChevronRight size={20} />
      </button>
    </div>
  );
}
