import { Shield, Sparkles, Target, TrendingUp, Users } from 'lucide-react';

interface IntroScreenProps {
  userName: string;
  setUserName: (name: string) => void;
  onStart: () => void;
  onMultiplayer?: () => void;
}

export const IntroScreen= ({
  userName,
  setUserName,
  onStart,
  onMultiplayer,
}: IntroScreenProps): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full text-center space-y-6 z-10 animate-in fade-in zoom-in duration-700">
        {/* Logo with enhanced effects */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse transition duration-300"></div>
            <div className="relative w-28 h-28 bg-gradient-to-br from-slate-900 to-slate-800 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-blue-500/20">
              <Shield size={56} className="text-blue-400 animate-pulse" strokeWidth={2.5} />
              <div className="absolute -top-1 -right-1">
                <Sparkles size={20} className="text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
            SCAM HUNTER
          </h1>
          <div className="flex items-center justify-center gap-2 text-blue-300/80 text-sm font-semibold">
            <Target size={16} />
            <span>Anti-Scam Master Game</span>
            <Target size={16} />
          </div>
        </div>

        {/* Description with better styling */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-5 rounded-2xl border border-slate-700/50 shadow-2xl">
          <p className="text-slate-300 text-base leading-relaxed">
            Đối mặt với <span className="text-blue-400 font-bold">10 cạm bẫy</span> tinh vi.<br />
            Bạn là <span className="text-red-400 font-bold">&quot;Gà mờ&quot;</span> hay <span className="text-green-400 font-bold">&quot;Chuyên gia&quot;</span>?
          </p>
        </div>

        {/* Features showcase */}
        <div className="grid grid-cols-3 gap-3 py-2">
          <div className="bg-slate-800/40 backdrop-blur-sm p-3 rounded-xl border border-slate-700/30">
            <div className="text-2xl font-black text-blue-400">10</div>
            <div className="text-xs text-slate-400">Tình huống</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm p-3 rounded-xl border border-slate-700/30">
            <div className="text-2xl font-black text-purple-400">5</div>
            <div className="text-xs text-slate-400">Chỉ số</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm p-3 rounded-xl border border-slate-700/30">
            <div className="text-2xl font-black text-pink-400">∞</div>
            <div className="text-xs text-slate-400">Độ khó</div>
          </div>
        </div>

        {/* Input with enhanced design */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl space-y-3">
          <label className="text-sm font-semibold text-slate-400 flex items-center justify-center gap-2">
            <Sparkles size={14} />
            Tên chiến binh của bạn
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="VD: Thám tử Conan"
            maxLength={20}
            className="w-full p-4 rounded-xl bg-slate-900/80 border-2 border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white text-center text-lg placeholder:text-slate-600 transition-all font-medium shadow-inner"
          />
        </div>

        {/* CTA Buttons with enhanced effects */}
        <div className="space-y-3">
          <button
            onClick={onStart}
            className="group relative w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl font-black text-xl shadow-2xl shadow-blue-900/50 transition-all duration-300 active:scale-95 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-2">
              <Shield size={24} />
              Chơi Đơn
              <TrendingUp size={24} />
            </span>
          </button>

          {onMultiplayer && (
            <button
              onClick={onMultiplayer}
              className="group relative w-full py-4 bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-red-600/80 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 active:scale-95 overflow-hidden border-2 border-purple-400/30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-2">
                <Users size={22} />
                Đấu 1v1
                <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </span>
            </button>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-slate-500 text-xs italic pt-2">
          💡 Mẹo: Hãy đọc kỹ từng tình huống trước khi quyết định!
        </p>
      </div>
    </div>
  );
};
