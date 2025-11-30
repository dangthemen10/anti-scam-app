import { useRef, useEffect } from 'react';
import {
  Download,
  Home,
  RefreshCw,
  Info,
  Brain,
  Eye,
  Zap,
  Activity,
  Lock,
} from 'lucide-react';
import { GameStats } from '@/types/game';
import { RadarChart } from '@/components/RadarChart';
import { getSuggestions } from '@/utils/gameUtils';
import { drawCertificate, downloadCertificate } from '@/utils/certificateUtils';
import { GAME_CONFIG } from '@/constants/gameConfig';

interface ResultScreenProps {
  userName: string;
  stats: GameStats;
  onReset: () => void;
  onPlayAgain: () => void;
}

export const ResultScreen = ({
  userName,
  stats,
  onReset,
  onPlayAgain,
}: ResultScreenProps): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const passed = stats.totalScore10 >= GAME_CONFIG.CERTIFICATE_MIN_SCORE;

  useEffect(() => {
    if (passed && canvasRef.current) {
      drawCertificate(canvasRef.current, userName, stats);
    }
  }, [passed, userName, stats]);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCertificate(canvasRef.current, userName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center p-4 text-white font-sans overflow-y-auto relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-slate-700 my-8 relative z-10 animate-in fade-in zoom-in duration-700">
        {/* Header with trophy */}
        <div className="text-center mb-6">
          <div className="inline-block relative mb-4">
            <div className="text-6xl animate-bounce">
              {passed ? '🏆' : stats.totalScore10 >= 5 ? '🎖️' : '📚'}
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            {passed ? 'XUẤT SẮC!' : stats.totalScore10 >= 5 ? 'TỐT!' : 'CỐ GẮNG!'}
          </h2>
          <div className="text-slate-300 text-lg">
            Chiến binh: <span className="text-white font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-8">
          {/* Radar Chart with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700">
              <RadarChart stats={stats} />
            </div>
          </div>

          {/* Stats cards - Enhanced */}
          <div className="space-y-3 w-full md:w-auto">
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-600/10 backdrop-blur-sm p-3 rounded-xl border border-blue-500/30 flex justify-between gap-6 items-center shadow-lg">
              <span className="text-blue-400 flex gap-2 items-center font-semibold">
                <Brain size={18} /> Kiến thức
              </span>
              <span className="font-black text-xl text-white">{stats.knowledge}%</span>
            </div>
            <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-600/10 backdrop-blur-sm p-3 rounded-xl border border-yellow-500/30 flex justify-between gap-6 items-center shadow-lg">
              <span className="text-yellow-400 flex gap-2 items-center font-semibold">
                <Eye size={18} /> Cảnh giác
              </span>
              <span className="font-black text-xl text-white">{stats.vigilance}%</span>
            </div>
            <div className="bg-gradient-to-r from-green-600/20 to-green-600/10 backdrop-blur-sm p-3 rounded-xl border border-green-500/30 flex justify-between gap-6 items-center shadow-lg">
              <span className="text-green-400 flex gap-2 items-center font-semibold">
                <Zap size={18} /> Tốc độ
              </span>
              <span className="font-black text-xl text-white">{stats.speed}%</span>
            </div>
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-600/10 backdrop-blur-sm p-3 rounded-xl border border-purple-500/30 flex justify-between gap-6 items-center shadow-lg">
              <span className="text-purple-400 flex gap-2 items-center font-semibold">
                <Activity size={18} /> Phân tích
              </span>
              <span className="font-black text-xl text-white">{stats.analysis}%</span>
            </div>
            <div className="bg-gradient-to-r from-pink-600/20 to-pink-600/10 backdrop-blur-sm p-3 rounded-xl border border-pink-500/30 flex justify-between gap-6 items-center shadow-lg">
              <span className="text-pink-400 flex gap-2 items-center font-semibold">
                <Lock size={18} /> Tư duy
              </span>
              <span className="font-black text-xl text-white">{stats.mindset}%</span>
            </div>

            {/* Total score - Enhanced */}
            <div className="mt-6 pt-4 border-t-2 border-slate-600 text-center bg-gradient-to-br from-slate-800 to-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1">
                <span>⭐</span> Điểm Tổng Kết <span>⭐</span>
              </span>
              <div className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mt-2">
                {stats.totalScore10.toFixed(1)}/10
              </div>
            </div>
          </div>
        </div>

        {/* Expert feedback - Enhanced */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-blue-500/30 shadow-xl">
          <h3 className="font-black text-xl mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            <Info size={24} className="text-blue-400" /> 
            Đánh Giá Từ Chuyên Gia
          </h3>
          <ul className="space-y-3">
            {getSuggestions(stats).map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-200 leading-relaxed bg-slate-900/50 p-3 rounded-lg">
                <span className="text-blue-400 font-black text-lg">•</span>
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons - Enhanced */}
        <div className="space-y-4">
          {passed ? (
            <>
              <canvas ref={canvasRef} className="hidden" />
              <button
                onClick={handleDownload}
                className="group relative w-full py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center gap-2">
                  <Download size={24} className="animate-bounce" /> 
                  Tải Chứng Nhận Danh Dự
                </span>
              </button>
            </>
          ) : (
            <div className="text-center bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 mb-2">
              <p className="text-red-400 font-bold flex items-center justify-center gap-2">
                <span className="text-2xl">⚠️</span>
                Bạn cần đạt ít nhất 7/10 điểm để nhận chứng chỉ
                <span className="text-2xl">⚠️</span>
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="group py-4 bg-gradient-to-br from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-xl">
              <Home size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              Trang Chủ
            </button>
            <button
              onClick={onPlayAgain}
              className="group py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-xl">
              <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" /> 
              Chơi Lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
