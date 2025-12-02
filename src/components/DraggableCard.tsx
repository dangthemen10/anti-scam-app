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
  const opacityRight = Math.min(position.x / GAME_CONFIG.MIN_SWIPE_DISTANCE, 1);
  const opacityLeft = Math.min(
    Math.abs(position.x) / GAME_CONFIG.MIN_SWIPE_DISTANCE,
    1
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isMessageStyle = MESSAGE_STYLE_TYPES.includes(data.type as any);

  return (
    <div
      className="relative w-full max-w-md h-[75vh] min-h-[500px] perspective-1000 px-2 sm:px-0"
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

        <div className="flex-1 p-4 sm:p-6 flex flex-col items-center overflow-y-auto custom-scrollbar">
          <div className="w-full flex flex-col items-center mb-4 sm:mb-6 flex-shrink-0">
            <div className="mt-2 mb-3">
              <ScenarioIcon type={data.type} />
            </div>
            <div className="w-full flex justify-center mb-2">
              <span
                className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded uppercase ${
                  data.difficulty === 'hard'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                Độ khó: {data.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center leading-tight">
              {data.title}
            </h2>
          </div>

          <div className="w-full flex-1 flex flex-col justify-center mb-4 min-h-0">
            {isMessageStyle ? (
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 relative mx-1 sm:mx-2 h-auto max-h-full overflow-y-auto">
                <div className="absolute -top-3 -left-1 w-4 h-4 bg-slate-100 border-l border-t border-slate-200 transform -rotate-45"></div>
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/50">
                  <div className="font-bold text-xs text-slate-500 uppercase">
                    {data.sender || 'Người lạ'}
                  </div>
                  <div className="text-xs text-slate-400 ml-auto">Vừa xong</div>
                </div>
                <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
                  {data.description}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 relative mx-1 sm:mx-2 h-auto max-h-full overflow-y-auto">
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                  {data.interactive ? (
                    <MousePointerClick size={16} />
                  ) : (
                    <Search size={16} />
                  )}
                </div>
                <p className="text-slate-600 text-center text-base sm:text-lg leading-relaxed font-medium">
                  {data.description}
                </p>
              </div>
            )}
          </div>

          {/* Gemini Hint Button */}
          <div className="w-full mb-3 px-1 sm:px-2 shrink-0">
            {hint ? (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-sm text-yellow-800 animate-in fade-in slide-in-from-bottom-4 flex items-start gap-2 max-h-24 overflow-y-auto">
                <Sparkles size={16} className="mt-1 shrink-0 text-yellow-600" />
                <span>{hint}</span>
              </div>
            ) : (
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={fetchHint}
                disabled={isLoadingHint}
                className="w-full py-3 sm:py-2 border-2 border-blue-100 hover:border-blue-300 text-blue-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 group touch-manipulation">
                {isLoadingHint ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Zap
                    size={16}
                    className="group-hover:text-yellow-500 transition-colors"
                  />
                )}
                {isLoadingHint ? 'AI đang suy nghĩ...' : 'Hỏi gợi ý từ AI'}
              </button>
            )}
          </div>

          {data.interactive && (
            <div className="w-full space-y-2 sm:space-y-3 animate-in fade-in slide-in-from-bottom-4 flex-shrink-0 pb-1 sm:pb-2">
              <p className="text-center text-xs sm:text-sm font-bold text-slate-400 mb-1 sm:mb-2">
                Bạn sẽ làm gì?
              </p>
              {data.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSwipe(opt.action)}
                  className={`w-full py-3 sm:py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2
                           bg-blue-600 hover:bg-blue-700 text-sm sm:text-base touch-manipulation
                        `}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {!data.interactive && (
            <div className="mt-auto text-center shrink-0">
              <p className="text-slate-400 text-xs sm:text-sm italic">
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
