import { Shield, LogOut, Flame, Zap } from 'lucide-react';

interface GameHeaderProps {
  currentIndex: number;
  totalScenarios: number;
  streak: number;
  onExit: () => void;
}

export const GameHeader = ({
  currentIndex,
  totalScenarios,
  streak,
  onExit,
}: GameHeaderProps): React.JSX.Element => {
  const progress = ((currentIndex + 1) / totalScenarios) * 100;
  
  return (
    <div className="h-20 flex items-center justify-between px-4 md:px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-slate-700 shadow-xl">
      {/* Left section */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onExit}
          className="group p-2.5 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-red-600 hover:to-red-700 rounded-xl text-slate-300 hover:text-white transition-all duration-300 shadow-lg active:scale-95"
          title="Thoát game">
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
        </button>
        <div className="font-black text-white flex items-center gap-2 text-sm md:text-base">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/50 blur-lg"></div>
            <Shield size={24} className="relative text-blue-400 animate-pulse" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Scam Hunter
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Streak indicator - Enhanced */}
        {streak > 1 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full text-white font-black text-sm shadow-lg animate-pulse">
            <Flame size={18} className="fill-yellow-300 animate-bounce" />
            <span className="hidden sm:inline">×{streak}</span>
            <span className="sm:hidden">{streak}</span>
          </div>
        )}

        {/* Progress section - Enhanced */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400 font-bold tracking-wider flex items-center gap-1">
              <Zap size={14} className="text-yellow-400" />
              <span className="hidden sm:inline">Câu</span> {currentIndex + 1}/{totalScenarios}
            </div>
          </div>
          <div className="w-28 md:w-32 h-2.5 bg-slate-700 rounded-full overflow-hidden shadow-inner border border-slate-600">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg relative"
              style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
