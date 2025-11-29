import {
  Shield,
  AlertTriangle,
  Zap,
  Search,
  MessageCircle,
} from 'lucide-react';

interface ScenarioIconProps {
  type: string;
}

export const ScenarioIcon = ({ type }: ScenarioIconProps): React.JSX.Element => {
  const baseClass =
    'w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 shadow-inner transition-transform hover:scale-105 flex-shrink-0';

  switch (type) {
    case 'scam':
      return (
        <div className={`${baseClass} bg-red-100`}>
          <Zap size={32} className="text-red-500" />
        </div>
      );
    case 'phishing':
      return (
        <div className={`${baseClass} bg-orange-100`}>
          <Search size={32} className="text-orange-500" />
        </div>
      );
    case 'ceo_fraud':
      return (
        <div className={`${baseClass} bg-gray-200`}>
          <div className="text-3xl">👔</div>
        </div>
      );
    case 'qr_scam':
      return (
        <div className={`${baseClass} bg-yellow-100`}>
          <div className="text-3xl">📱</div>
        </div>
      );
    case 'chat_scam':
      return (
        <div className={`${baseClass} bg-blue-100`}>
          <MessageCircle size={32} className="text-blue-500" />
        </div>
      );
    case 'romance':
      return (
        <div className={`${baseClass} bg-pink-100`}>
          <div className="text-3xl">💔</div>
        </div>
      );
    case 'malware':
      return (
        <div className={`${baseClass} bg-slate-200`}>
          <AlertTriangle size={32} className="text-slate-600" />
        </div>
      );
    case 'safe':
    case 'shopping':
    case 'security':
      return (
        <div className={`${baseClass} bg-green-100`}>
          <Shield size={32} className="text-green-600" />
        </div>
      );
    default:
      return (
        <div className={`${baseClass} bg-blue-100`}>
          <Shield size={32} className="text-blue-500" />
        </div>
      );
  }
};
