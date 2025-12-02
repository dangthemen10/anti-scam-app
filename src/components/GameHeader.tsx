import { Shield, LogOut, Flame } from 'lucide-react';

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
  return (
    <div className="h-16 flex items-center justify-between px-4 sm:px-6 bg-slate-900 border-b border-slate-800 shrink-0 z-50">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onExit}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Thoát game">
          <LogOut size={16} />
        </button>
        <div className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
          <Shield size={20} className="text-blue-500 shrink-0" />
          <span className="hidden sm:inline">Scam Hunter</span>
        </div>
      </div>

      {/* Streak & Level Display */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className={`flex items-center gap-1 text-orange-500 font-bold animate-pulse transition-all ${
            streak > 1
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 w-0 overflow-hidden'
          }`}>
          <Flame size={16} className="fill-orange-500 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base whitespace-nowrap">
            Streak: {streak}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Level {currentIndex + 1}/{totalScenarios}
          </div>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${(currentIndex / totalScenarios) * 100}%`,
              }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
