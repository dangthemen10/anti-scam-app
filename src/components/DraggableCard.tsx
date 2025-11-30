import { useState, useRef } from 'react';
import { Search, MousePointerClick } from 'lucide-react';
import { Scenario } from '@/types/game';
import { ScenarioIcon } from '@/components/ScenarioIcon';
import { MESSAGE_STYLE_TYPES, GAME_CONFIG } from '@/constants/gameConfig';

interface DraggableCardProps {
  data: Scenario;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const DraggableCard = ({
  data,
  onSwipe,
}: DraggableCardProps): React.JSX.Element => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    if (data.interactive) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - startPos.current.x,
      y: clientY - startPos.current.y,
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (position.x > GAME_CONFIG.MIN_SWIPE_DISTANCE) onSwipe('right');
    else if (position.x < -GAME_CONFIG.MIN_SWIPE_DISTANCE) onSwipe('left');
    else setPosition({ x: 0, y: 0 });
  };

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => handleStart(e.clientX, e.clientY),
    onMouseMove: (e: React.MouseEvent) => handleMove(e.clientX, e.clientY),
    onMouseUp: handleEnd,
    onMouseLeave: () => isDragging && handleEnd(),
    onTouchStart: (e: React.TouchEvent) =>
      handleStart(e.touches[0].clientX, e.touches[0].clientY),
    onTouchMove: (e: React.TouchEvent) =>
      handleMove(e.touches[0].clientX, e.touches[0].clientY),
    onTouchEnd: handleEnd,
  };

  const rotate = position.x * GAME_CONFIG.ROTATION_MULTIPLIER;
  const opacityRight = Math.min(position.x / GAME_CONFIG.MIN_SWIPE_DISTANCE, 1);
  const opacityLeft = Math.min(
    Math.abs(position.x) / GAME_CONFIG.MIN_SWIPE_DISTANCE,
    1
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isMessageStyle = MESSAGE_STYLE_TYPES.includes(data.type as any);

  return (
    <div
      className="relative w-full max-w-sm h-[70vh] md:h-[75vh] min-h-[550px] perspective-1000"
      {...handlers}>
      <div
        ref={cardRef}
        className={`w-full h-full bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden select-none absolute top-0 left-0 flex flex-col ${
          !data.interactive ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotate}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}>
        {!data.interactive && (
          <>
            {/* Trust overlay - Enhanced */}
            <div
              className="absolute top-6 left-6 border-4 border-green-500 text-green-500 font-black px-6 py-3 rounded-2xl text-3xl z-10 transform -rotate-12 bg-green-50/90 backdrop-blur-md shadow-xl"
              style={{ opacity: opacityRight }}>
              ✓ TIN
            </div>
            {/* Scam overlay - Enhanced */}
            <div
              className="absolute top-6 right-6 border-4 border-red-500 text-red-500 font-black px-6 py-3 rounded-2xl text-3xl z-10 transform rotate-12 bg-red-50/90 backdrop-blur-md shadow-xl"
              style={{ opacity: opacityLeft }}>
              ✗ LỪA
            </div>
          </>
        )}

        <div className="flex-1 p-6 flex flex-col items-center overflow-y-auto custom-scrollbar">
          {/* Header - Enhanced */}
          <div className="w-full flex flex-col items-center mb-6 shrink-0">
            <div className="mt-2 mb-4 relative">
              <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"></div>
              <div className="relative">
                <ScenarioIcon type={data.type} />
              </div>
            </div>
            <div className="w-full flex justify-center mb-3">
              <span
                className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wide shadow-md ${
                  data.difficulty === 'hard'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                }`}>
                {data.difficulty === 'hard' ? 'Khó' : 'Dễ'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center leading-tight px-2">
              {data.title}
            </h2>
          </div>

          {/* Content */}
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

          {/* Buttons - Enhanced */}
          {data.interactive && (
            <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-4 shrink-0 pb-2">
              <p className="text-center text-sm font-black text-slate-600 mb-3 uppercase tracking-wide">
                🤔 Bạn sẽ làm gì?
              </p>
              {data.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSwipe(opt.action)}
                  className="group relative w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative text-base">{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {!data.interactive && (
            <div className="mt-auto text-center shrink-0 bg-slate-100 py-3 px-4 rounded-xl">
              <p className="text-slate-600 text-sm font-medium flex items-center justify-center gap-2">
                <span className="animate-pulse">👆</span>
                Kéo thẻ để quyết định
                <span className="animate-pulse">👆</span>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-3 left-0 w-full h-full bg-slate-800 rounded-3xl -z-10 scale-95 opacity-50 translate-y-2"></div>
    </div>
  );
};
