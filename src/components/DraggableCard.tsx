import { useState, useRef, useEffect } from 'react';
import {
  Search,
  MousePointerClick,
  Sparkles,
  Loader2,
  Zap,
} from 'lucide-react';
import { Scenario } from '@/types/game';
import { ScenarioIcon } from '@/components/ScenarioIcon';
import { MESSAGE_STYLE_TYPES, GAME_CONFIG } from '@/constants/gameConfig';
import { callGeminiAPI } from '@/utils/openai';

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
  const [hint, setHint] = useState('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Reset hint on new card
  // useEffect(() => {
  //   setHint('');
  //   setIsLoadingHint(false);
  // }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchHint = async (e: any) => {
    e.stopPropagation();
    if (hint) return;
    setIsLoadingHint(true);

    const prompt = `Bạn là chuyên gia an ninh mạng. Người dùng đang chơi game nhận diện lừa đảo.
    Tình huống: "${data.description}".
    Nhiệm vụ: Đưa ra một gợi ý ngắn gọn (dưới 30 từ) giúp người dùng chú ý vào điểm đáng ngờ hoặc điểm an toàn. 
    KHÔNG được nói rõ đáp án là "Lừa đảo" hay "An toàn". Chỉ gợi mở.`;

    const result = await callGeminiAPI(prompt);
    setHint(result);
    setIsLoadingHint(false);
  };

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
  const opacityRight =
    position.x > 0
      ? Math.min(position.x / GAME_CONFIG.MIN_SWIPE_DISTANCE, 1)
      : 0;
  const opacityLeft =
    position.x < 0
      ? Math.min(Math.abs(position.x) / GAME_CONFIG.MIN_SWIPE_DISTANCE, 1)
      : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isMessageStyle = MESSAGE_STYLE_TYPES.includes(data.type as any);

  return (
    <div
      className="relative w-full max-w-md h-[50vh] min-h-[500px] perspective-1000 px-2 sm:px-0 sm:h-[70vh]"
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
        {/* Compact AI Hint Button Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={fetchHint}
            disabled={isLoadingHint}
            className="group relative w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors shadow-sm">
            {isLoadingHint ? (
              <Loader2 className="animate-spin text-blue-600" size={20} />
            ) : (
              <Sparkles
                size={20}
                className="text-blue-600 group-hover:text-yellow-500 transition-colors"
              />
            )}

            {/* Tooltip */}
            <span className="absolute right-full mr-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Hỏi gợi ý từ AI
            </span>
          </button>
        </div>

        {!data.interactive && (
          <>
            <div
              className="absolute top-16 left-6 border-4 border-green-500 text-green-500 font-black px-4 py-2 rounded-lg text-3xl z-10 transform -rotate-12 bg-white/50 backdrop-blur-sm"
              style={{ opacity: opacityRight }}>
              TIN
            </div>
            <div
              className="absolute top-16 right-6 border-4 border-red-500 text-red-500 font-black px-4 py-2 rounded-lg text-3xl z-10 transform rotate-12 bg-white/50 backdrop-blur-sm"
              style={{ opacity: opacityLeft }}>
              LỪA
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col h-full">
          <div className="flex flex-col items-center pt-6 pb-2 px-6 shrink-0">
            <ScenarioIcon type={data.type} />
            <div className="mb-2">
              <span
                className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded uppercase ${
                  data.difficulty === 'hard'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                Độ khó: {data.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center leading-tight line-clamp-2 px-8">
              {data.title}
            </h2>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 min-h-0 w-full">
            <div className="w-full flex flex-col pb-4 pt-6">
              {/* Scenario Description */}
              {isMessageStyle ? (
                <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 relative mb-4">
                  <div className="absolute -top-3 -left-1 w-4 h-4 bg-slate-100 border-l border-t border-slate-200 transform -rotate-45"></div>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/50">
                    <div className="font-bold text-xs text-slate-500 uppercase">
                      {data.sender || 'Người lạ'}
                    </div>
                    <div className="text-xs text-slate-400 ml-auto">
                      Vừa xong
                    </div>
                  </div>
                  <p className="text-slate-800 text-base leading-relaxed font-medium">
                    {data.description}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-200 p-6 rounded-xl border border-slate-100 relative mb-4 text-center mt-2">
                  {!data.interactive && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white border border-slate-100 text-blue-500 p-1.5 rounded-full shadow-sm z-10">
                      <Search size={16} />
                    </div>
                  )}
                  <p className="text-slate-600 text-base leading-relaxed font-medium pt-2">
                    {data.description}
                  </p>
                </div>
              )}

              {/* Hint Display (In-flow) */}
              {hint && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-sm text-yellow-800 animate-in fade-in slide-in-from-bottom-4 flex items-start gap-2 mb-4">
                  <Sparkles
                    size={16}
                    className="mt-1 shrink-0 text-yellow-600"
                  />
                  <span>{hint}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Action Area */}
          <div className="shrink-0 px-4 pb-4 pt-2 bg-white w-full">
            {data.interactive ? (
              <div className="space-y-2 w-full animate-in fade-in slide-in-from-bottom-2">
                <p className="text-center text-xs font-bold text-slate-400 mb-1">
                  Bạn sẽ làm gì?
                </p>
                {data.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSwipe(opt.action)}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2
                               bg-blue-600 hover:bg-blue-700 text-sm touch-manipulation
                            `}>
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-slate-300 text-xs italic">
                  Kéo thẻ sang trái hoặc phải
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-3 left-0 w-full h-full bg-slate-800 rounded-3xl -z-10 scale-95 opacity-50 translate-y-2"></div>
    </div>
  );
};
