import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
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
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300 z-20 text-center max-h-[80vh] overflow-y-auto custom-scrollbar">
      {feedback.correct ? (
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>
      ) : (
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="text-red-600 w-10 h-10" />
        </div>
      )}

      <h3
        className={`text-2xl font-black mb-2 ${
          feedback.correct ? 'text-green-600' : 'text-red-600'
        }`}>
        {feedback.correct ? 'CHÍNH XÁC!' : 'SAI RỒI!'}
      </h3>

      <p className="text-slate-800 font-medium mb-2">{feedback.explanation}</p>

      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 mb-4 text-left border border-slate-200">
        <span className="font-bold block mb-1 text-slate-800">
          🔍 Giải thích:
        </span>
        {feedback.details}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
        Tiếp tục <ChevronRight size={20} />
      </button>
    </div>
  );
};
