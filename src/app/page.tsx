'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  ChevronRight,
  Info,
  Award,
} from 'lucide-react';
import { SCENARIOS } from '@/libs/scenarios';
import liff from '@line/liff';

// 1. Icon Generator based on type
const ScenarioIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'scam':
      return (
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={48} className="text-red-500" />
        </div>
      );
    case 'phishing':
      return (
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <XCircle size={48} className="text-orange-500" />
        </div>
      );
    case 'safe':
      return (
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield size={48} className="text-green-600" />
        </div>
      );
    case 'deepfake':
      return (
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <div className="text-4xl">🤖</div>
        </div>
      );
    default:
      return (
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Info size={48} className="text-blue-500" />
        </div>
      );
  }
};

export default function Home() {
  const [gameState, setGameState] = useState('intro');
  const [userName, setUserName] = useState<any>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<any>(null);

  useEffect(() => {
    liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' }).then(() => {
      if (liff.isLoggedIn()) {
        liff.getProfile().then(setUserName);
      } else {
        liff.login();
      }
    });
  }, []);

  // Canvas Ref for Certificate
  const canvasRef = useRef(null);

  // --- LOGIC: GAME CONTROL ---

  const startGame = () => {
    if (!userName.trim()) {
      alert('Vui lòng nhập tên của bạn để bắt đầu!');
      return;
    }
    setScore(0);
    setCurrentIndex(0);
    setGameState('playing');
  };

  const handleChoice = (direction: any) => {
    const currentScenario = SCENARIOS[currentIndex];
    const isTrusting = direction === 'right';

    let isCorrect = false;
    if (currentScenario.isScam && !isTrusting) isCorrect = true;
    if (!currentScenario.isScam && isTrusting) isCorrect = true;

    if (isCorrect) setScore((prev) => prev + 1);

    setLastFeedback({
      correct: isCorrect,
      explanation: currentScenario.explanation,
      userChoice: direction,
    });
    setGameState('feedback');
  };

  const nextCard = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setGameState('playing');
    } else {
      setGameState('result');
    }
  };

  // --- LOGIC: CERTIFICATE GENERATION ---
  useEffect(() => {
    const drawCertificate: any = () => {
      const canvas: any = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas size (High resolution)
      canvas.width = 1200;
      canvas.height = 800;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
      gradient.addColorStop(0, '#1e3a8a'); // dark blue
      gradient.addColorStop(1, '#3b82f6'); // blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Border
      ctx.strokeStyle = '#fbbf24'; // amber
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, 1120, 720);

      // Text Settings
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';

      // Title
      ctx.font = 'bold 60px Arial';
      ctx.fillText('CHỨNG NHẬN', 600, 180);

      ctx.font = '40px Arial';
      ctx.fillText('HOÀN THÀNH KHÓA HUẤN LUYỆN', 600, 250);
      ctx.fillText('NHẬN DIỆN LỪA ĐẢO TRỰC TUYẾN', 600, 300);

      // User Name
      ctx.font = 'italic bold 80px "Times New Roman"';
      ctx.fillStyle = '#fbbf24'; // Gold color
      ctx.fillText(userName, 600, 450);

      // Score & Date
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px Arial';
      ctx.fillText(
        `Đã xuất sắc đạt điểm tối đa: ${score}/${SCENARIOS.length}`,
        600,
        550
      );

      const date = new Date().toLocaleDateString('vi-VN');
      ctx.fillText(`Ngày cấp: ${date}`, 600, 600);

      // Stamp circle
      ctx.beginPath();
      ctx.arc(1000, 650, 80, 0, 2 * Math.PI);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();
      ctx.save();
      ctx.translate(1000, 650);
      ctx.rotate(-Math.PI / 6);
      ctx.font = 'bold 30px Arial';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('ĐÃ KIỂM TRA', 0, 10);
      ctx.restore();
    };

    if (
      gameState === 'result' &&
      score === SCENARIOS.length &&
      canvasRef.current
    ) {
      drawCertificate();
    }
  }, [gameState, score, userName]);

  const downloadCertificate = () => {
    const canvas: any = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ChungNhan_AntiScam_${userName}.png`;
    link.href = image;
    link.click();
  };

  // --- SUB-COMPONENTS ---

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield size={80} className="text-blue-500" />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full text-black">
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Anti-Scam Master
          </h1>
          <p className="text-slate-300 text-lg">
            Bạn có tự tin mình không bị lừa đảo trên mạng? <br />
            Hãy thử thách bản thân qua 6 tình huống thực tế!
          </p>

          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <label className="block text-left text-sm font-medium mb-2 text-slate-400">
              Tên của bạn để in lên chứng nhận
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white"
            />
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-xl shadow-lg shadow-blue-900/50 transition-transform active:scale-95">
            Bắt đầu ngay
          </button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (gameState === 'result') {
    const isPerfect = score === SCENARIOS.length;
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white font-sans">
        <div className="max-w-lg w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700 text-center">
          <h2 className="text-3xl font-bold mb-6">Kết quả huấn luyện</h2>

          <div className="text-6xl font-black mb-4 bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {score}/{SCENARIOS.length}
          </div>

          <p className="text-xl mb-8 text-slate-300">
            {isPerfect
              ? 'Xuất sắc! Bạn có kiến thức phòng chống lừa đảo rất vững vàng.'
              : 'Bạn vẫn cần cảnh giác hơn. Hãy thử lại để nắm vững kiến thức nhé!'}
          </p>

          {isPerfect ? (
            <div className="space-y-4">
              {/* Hidden Canvas but rendered to DOM for export */}
              <canvas ref={canvasRef} className="hidden" />

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 mb-4">
                <Award className="mx-auto text-yellow-400 mb-2" size={40} />
                <p className="text-sm text-slate-400">
                  Chứng nhận của bạn đã sẵn sàng
                </p>
              </div>

              <button
                onClick={downloadCertificate}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
                <Download size={20} /> Tải chứng nhận về máy
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setScore(0);
                setCurrentIndex(0);
                setGameState('playing');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
              <RefreshCw size={20} /> Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  // Playing & Feedback State Container
  const currentCard = SCENARIOS[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900">
        <div className="font-bold text-white flex items-center gap-2">
          <Shield size={20} className="text-blue-500" /> Anti-Scam
        </div>
        <div className="text-slate-400 font-medium text-sm">
          Câu {currentIndex + 1}/{SCENARIOS.length}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>

        {gameState === 'playing' && (
          <DraggableCard data={currentCard} onSwipe={handleChoice} />
        )}

        {gameState === 'feedback' && (
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300 z-20">
            <div className="flex flex-col items-center text-center">
              {lastFeedback.correct ? (
                <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              ) : (
                <XCircle className="text-red-500 w-16 h-16 mb-4" />
              )}

              <h3
                className={`text-2xl font-bold mb-2 ${
                  lastFeedback.correct ? 'text-green-600' : 'text-red-600'
                }`}>
                {lastFeedback.correct ? 'Chính xác!' : 'Sai rồi!'}
              </h3>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {lastFeedback.explanation}
              </p>

              <button
                onClick={nextCard}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                Tiếp tục <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Swipe Indicators (Visual Guide) */}
        {gameState === 'playing' && (
          <div className="absolute bottom-8 flex w-full max-w-md justify-between px-8 text-white text-sm font-medium opacity-50 pointer-events-none">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center">
                <XCircle className="text-red-500" />
              </div>
              <span className="text-red-400">Lừa đảo (Trái)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center">
                <CheckCircle className="text-green-500" />
              </div>
              <span className="text-green-400">Tin tưởng (Phải)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Draggable Card Component
// Handles touch and mouse logic to simulate Tinder swipe
function DraggableCard({ data, onSwipe }: any) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: any, clientY: any) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: any, clientY: any) => {
    if (!isDragging) return;
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    setIsDragging(false);
    const threshold = 100; // Pixels to trigger swipe

    if (position.x > threshold) {
      onSwipe('right'); // Trust
    } else if (position.x < -threshold) {
      onSwipe('left'); // Scam
    } else {
      // Reset
      setPosition({ x: 0, y: 0 });
    }
  };

  // Mouse Events
  const onMouseDown = (e: any) => handleStart(e.clientX, e.clientY);
  const onMouseMove = (e: any) => handleMove(e.clientX, e.clientY);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) handleEnd();
  };

  // Touch Events
  const onTouchStart = (e: any) =>
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove = (e: any) =>
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = () => handleEnd();

  // Rotation logic based on X position
  const rotate = position.x * 0.05;
  const opacityRight = Math.min(position.x / 100, 1);
  const opacityLeft = Math.min(Math.abs(position.x) / 100, 1);

  return (
    <div
      className="relative w-full max-w-sm h-[60vh] perspective-1000"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      <div
        ref={cardRef}
        className="w-full h-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden cursor-grab active:cursor-grabbing select-none absolute top-0 left-0"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotate}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}>
        {/* Overlay Indicators when swiping */}
        {position.x > 0 && (
          <div
            className="absolute top-4 left-4 border-4 border-green-500 text-green-500 font-bold px-4 py-2 rounded-lg text-2xl z-10 transform -rotate-12"
            style={{ opacity: opacityRight }}>
            TIN TƯỞNG
          </div>
        )}
        {position.x < 0 && (
          <div
            className="absolute top-4 right-4 border-4 border-red-500 text-red-500 font-bold px-4 py-2 rounded-lg text-2xl z-10 transform rotate-12"
            style={{ opacity: opacityLeft }}>
            LỪA ĐẢO
          </div>
        )}

        <div className="h-full flex flex-col p-6 pointer-events-none">
          <div className="flex-1 flex flex-col items-center justify-center">
            <ScenarioIcon type={data.imageType} />
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">
              {data.title}
            </h2>
            <p className="text-slate-600 text-center text-lg leading-relaxed">
              {data.description}
            </p>
          </div>

          <div className="mt-auto pt-6 text-center text-slate-400 text-sm">
            Vuốt trái hoặc phải để quyết định
          </div>
        </div>
      </div>

      {/* Cards Stack Effect Background */}
      <div className="absolute top-2 left-0 w-full h-full bg-slate-800 rounded-3xl -z-10 scale-95 opacity-50 translate-y-2"></div>
      <div className="absolute top-4 left-0 w-full h-full bg-slate-900 rounded-3xl -z-20 scale-90 opacity-30 translate-y-4"></div>
    </div>
  );
}
