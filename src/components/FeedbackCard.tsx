import {
  CheckCircle,
  XCircle,
  ChevronRight,
  Brain,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Feedback } from '@/types/game';
import { useState } from 'react';
import { callGeminiAPI } from '@/utils/openai';

interface FeedbackCardProps {
  feedback: Feedback;
  onNext: () => void;
}

export const FeedbackCard = ({
  feedback,
  onNext,
}: FeedbackCardProps): React.JSX.Element => {
  const [analysis, setAnalysis] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const fetchAnalysis = async () => {
    if (analysis) return;
    setIsLoadingAnalysis(true);

    const prompt = `Phân tích tình huống này dưới góc độ tâm lý tội phạm và an ninh mạng:
    Tình huống: "${feedback.scenario.description}"
    Kết quả thực tế: ${
      feedback.scenario.isScam ? 'Đây là lừa đảo' : 'Đây là an toàn'
    }.
    
    Hãy viết 3 gạch đầu dòng ngắn gọn (mỗi dòng dưới 20 từ) giải thích:
    1. Đòn tâm lý đã dùng (nếu lừa đảo) hoặc Dấu hiệu xác thực (nếu an toàn).
    2. Tại sao người dùng dễ mắc bẫy (hoặc dễ nhầm lẫn).
    3. Bài học rút ra.`;

    const result = await callGeminiAPI(prompt);
    setAnalysis(result);
    setIsLoadingAnalysis(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300 z-20 text-center max-h-[85vh] overflow-y-auto custom-scrollbar mx-4">
      {feedback.correct ? (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <CheckCircle className="text-green-600 w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      ) : (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <XCircle className="text-red-600 w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      )}

      <h3
        className={`text-xl sm:text-2xl font-black mb-2 ${
          feedback.correct ? 'text-green-600' : 'text-red-600'
        }`}>
        {feedback.correct ? 'CHÍNH XÁC!' : 'SAI RỒI!'}
      </h3>

      <p className="text-slate-800 font-medium mb-2 text-sm sm:text-base">
        {feedback.explanation}
      </p>

      <div className="bg-slate-50 p-3 sm:p-4 rounded-xl text-xs sm:text-sm text-slate-600 mb-4 text-left border border-slate-200">
        <span className="font-bold block mb-1 text-slate-800">
          🔍 Giải thích:
        </span>
        {feedback.details}
      </div>

      {/* Gemini Analysis Button */}
      <div className="mb-4">
        {analysis ? (
          <div className="bg-indigo-50 border border-indigo-200 p-3 sm:p-4 rounded-xl text-left text-xs sm:text-sm text-indigo-900 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold mb-2 text-indigo-700">
              <Brain size={16} /> Phân tích chuyên sâu từ AI:
            </div>
            <div className="whitespace-pre-line leading-relaxed">
              {analysis}
            </div>
          </div>
        ) : (
          <button
            onClick={fetchAnalysis}
            disabled={isLoadingAnalysis}
            className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-sm sm:text-base touch-manipulation">
            {isLoadingAnalysis ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} className="text-yellow-300" />
            )}
            {isLoadingAnalysis
              ? 'Đang phân tích dữ liệu...'
              : 'AI Phân tích chi tiết'}
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation">
        Tiếp tục <ChevronRight size={20} />
      </button>
    </div>
  );
};
