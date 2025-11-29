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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 text-white font-sans overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 my-8">
        <h2 className="text-3xl font-bold text-center mb-2">Hồ sơ năng lực</h2>
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
              </span>
              <span className="font-bold">{stats.knowledge}%</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
              <span className="text-yellow-400 flex gap-2">
                <Eye size={16} /> Cảnh giác
              </span>
              <span className="font-bold">{stats.vigilance}%</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
              <span className="text-green-400 flex gap-2">
                <Zap size={16} /> Tốc độ
              </span>
              <span className="font-bold">{stats.speed}%</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
              <span className="text-purple-400 flex gap-2">
                <Activity size={16} /> Phân tích
              </span>
              <span className="font-bold">{stats.analysis}%</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between gap-4">
              <span className="text-pink-400 flex gap-2">
                <Lock size={16} /> Tư duy
              </span>
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
            <Info size={20} className="text-blue-500" /> Đánh giá từ chuyên gia
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            {getSuggestions(stats).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          {passed ? (
            <>
              <canvas ref={canvasRef} className="hidden" />
              <button
                onClick={handleDownload}
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
              onClick={onReset}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
              <Home size={20} /> Màn hình chính
            </button>
            <button
              onClick={onPlayAgain}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
              <RefreshCw size={20} /> Chơi lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
