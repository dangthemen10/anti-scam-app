import { Shield } from 'lucide-react';

interface IntroScreenProps {
  userName: string;
  setUserName: (name: string) => void;
  onStart: () => void;
}

export const IntroScreen = ({
  userName,
  setUserName,
  onStart,
}: IntroScreenProps): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-slate-950"></div>
      <div className="max-w-md w-full text-center space-y-8 z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center">
              <Shield size={64} className="text-blue-400" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-black bg-linear-to-br from-white to-slate-400 bg-clip-text text-transparent">
          SCAM HUNTER
        </h1>
        <p className="text-slate-400 text-lg px-4">
          Đối mặt với 10 cạm bẫy tinh vi. <br />
          Bạn là &quot;Gà mờ&quot; hay &quot;Chuyên gia&quot;?
        </p>
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nhập tên biệt danh..."
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white text-center text-xl placeholder:text-slate-600 transition-all"
          />
        </div>
        <button
          onClick={onStart}
          className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-xl shadow-lg shadow-blue-900/30 transition-all active:scale-95">
          Bắt đầu Săn Lừa Đảo
        </button>
      </div>
    </div>
  );
};
