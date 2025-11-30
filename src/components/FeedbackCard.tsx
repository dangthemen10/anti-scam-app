import { CheckCircle, XCircle, ChevronRight, Sparkles, AlertTriangle } from 'lucide-react';
import { Feedback } from '@/types/game';

interface FeedbackCardProps {
  feedback: Feedback;
  onNext: () => void;
}

export const FeedbackCard = ({
  feedback,
  onNext,
}: FeedbackCardProps): React.JSX.Element => {
  return (
    <div className="w-full max-w-md bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300 z-20 text-center max-h-[80vh] overflow-y-auto custom-scrollbar border-2 border-slate-200">
      {/* Icon with animation and glow effect */}
      {feedback.correct ? (
        <div className="relative mb-6 inline-block">
          <div className="absolute inset-0 bg-green-400/30 blur-2xl rounded-full animate-pulse"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-green-100 animate-bounce">
            <CheckCircle className="text-white w-12 h-12" strokeWidth={3} />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="text-yellow-400 w-6 h-6 animate-spin" />
          </div>
        </div>
      ) : (
        <div className="relative mb-6 inline-block">
          <div className="absolute inset-0 bg-red-400/30 blur-2xl rounded-full animate-pulse"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-red-100 animate-bounce">
            <XCircle className="text-white w-12 h-12" strokeWidth={3} />
          </div>
          <div className="absolute -top-2 -right-2">
            <AlertTriangle className="text-orange-400 w-6 h-6 animate-pulse" />
          </div>
        </div>
      )}

      {/* Title with gradient */}
      <h3
        className={`text-3xl font-black mb-3 animate-in slide-in-from-top-4 ${
          feedback.correct 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent'
        }`}>
        {feedback.correct ? '🎉 CHÍNH XÁC!' : '❌ SAI RỒI!'}
      </h3>

      {/* Explanation message */}
      <p className="text-slate-700 font-semibold mb-4 text-lg leading-relaxed px-2">
        {feedback.explanation}
      </p>

      {/* Details box with enhanced styling */}
      <div className={`p-5 rounded-2xl text-sm mb-6 text-left border-2 shadow-lg ${
        feedback.correct 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`font-black text-base ${
            feedback.correct ? 'text-green-700' : 'text-red-700'
          }`}>
            � Giải thích chi tiết:
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed font-medium">
          {feedback.details}
        </p>
      </div>

      {/* CTA Button with animation */}
      <button
        onClick={onNext}
        className="group relative w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-black text-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl active:scale-95 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <span className="relative flex items-center gap-2">
          Câu Tiếp Theo 
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
    </div>
  );
};
