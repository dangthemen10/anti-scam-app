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
          {/* Header */}
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

          {/* Buttons */}
          {data.interactive && (
            <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-4 shrink-0 pb-2">
              <p className="text-center text-sm font-bold text-slate-400 mb-2">
                Bạn sẽ làm gì?
              </p>
              {data.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSwipe(opt.action)}
                  className="w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
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
};
