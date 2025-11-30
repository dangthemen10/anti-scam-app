import { useState } from 'react';
import { Users, Plus, DoorOpen, ArrowLeft, Wifi, QrCode } from 'lucide-react';
import { QRScanner } from '@/components/QRScanner';

interface MultiplayerMenuProps {
  userName: string;
  onCreateRoom: () => void;
  onJoinRoom: (roomCode: string) => void;
  onBack: () => void;
}

export const MultiplayerMenu = ({
  userName,
  onCreateRoom,
  onJoinRoom,
  onBack,
}: MultiplayerMenuProps): React.JSX.Element => {
  const [roomCode, setRoomCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleJoin = () => {
    if (roomCode.trim().length === 6) {
      onJoinRoom(roomCode.toUpperCase());
    } else {
      alert('Mã phòng phải có 6 ký tự!');
    }
  };

  const handleQRScan = (scannedCode: string) => {
    setShowQRScanner(false);
    // Validate và join room
    if (scannedCode.length === 6) {
      onJoinRoom(scannedCode.toUpperCase());
    } else {
      alert('QR code không hợp lệ!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full text-center space-y-6 z-10 animate-in fade-in zoom-in duration-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-xl transition-all active:scale-95">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Multiplayer
          </h1>
          <div className="w-12"></div>
        </div>

        {/* Player info */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-black">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left flex-1">
              <div className="text-sm text-slate-400">Chiến binh</div>
              <div className="font-bold text-lg">{userName}</div>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <Wifi size={14} className="animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Create Room */}
        <button
          onClick={onCreateRoom}
          className="group relative w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 rounded-2xl font-black text-xl shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center gap-3">
            <Plus size={28} />
            Tạo Phòng Mới
            <Users size={28} />
          </span>
        </button>

        {/* Join Room Options */}
        <div className="space-y-3">
          {!showJoinInput ? (
            <>
              <button
                onClick={() => setShowJoinInput(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
                <DoorOpen size={24} />
                Nhập Mã Phòng
              </button>

              <button
                onClick={() => setShowQRScanner(true)}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 border-2 border-cyan-400/30">
                <QrCode size={24} />
                Quét QR Code
              </button>
            </>
          ) : (
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 space-y-3 animate-in slide-in-from-bottom-4">
              <label className="text-sm font-semibold text-slate-400 block text-center">
                Nhập mã phòng (6 ký tự)
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="w-full p-4 rounded-xl bg-slate-900/80 border-2 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-white text-center text-2xl font-black tracking-widest placeholder:text-slate-600 transition-all uppercase"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowJoinInput(false);
                    setRoomCode('');
                  }}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all active:scale-95">
                  Hủy
                </button>
                <button
                  onClick={handleJoin}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold transition-all active:scale-95">
                  Tham Gia
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30 text-sm text-slate-400">
          <p className="leading-relaxed">
            💡 <span className="font-semibold text-slate-300">Cách chơi:</span> Tạo phòng và chia sẻ QR/mã với bạn bè, hoặc quét QR code để tham gia nhanh chóng!
          </p>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};
