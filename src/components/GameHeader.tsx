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
    <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Thoát game">
          <LogOut size={20} />
        </button>
        <div className="font-bold text-white flex items-center gap-2">
          <Shield size={20} className="text-blue-500" /> Scam Hunter
        </div>
      </div>

      <div className="flex items-center gap-4">
        {streak > 1 && (
          <div className="hidden sm:flex items-center gap-1 text-orange-500 font-bold animate-pulse">
            <Flame size={20} className="fill-orange-500" />
            <span>Streak: {streak}</span>
          </div>
        )}
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
