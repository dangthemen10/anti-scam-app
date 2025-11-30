import { useState, useEffect } from 'react';
import { Copy, Check, Crown, Users, Play, ArrowLeft, Loader, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BattleRoom, Player } from '@/types/game';

interface LobbyScreenProps {
  room: BattleRoom;
  currentPlayer: Player;
  onReady: () => void;
  onStart: () => void;
  onLeave: () => void;
}

export const LobbyScreen = ({
  room,
  currentPlayer,
  onReady,
  onStart,
  onLeave,
}: LobbyScreenProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const isHost = currentPlayer.isHost;
  const allPlayersReady = room.players.every(p => p.isReady || p.isHost);
  const canStart = room.players.length === 2 && allPlayersReady;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full space-y-6 z-10 animate-in fade-in zoom-in duration-700">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onLeave}
            className="p-3 bg-slate-800/50 hover:bg-red-600/50 rounded-xl transition-all active:scale-95">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Phòng Chờ
          </h1>
          <div className="w-12"></div>
        </div>

        {/* Room Code */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border-2 border-purple-500/30 shadow-2xl">
          <div className="text-center space-y-4">
            <div className="text-sm text-slate-400 font-semibold">Mã phòng</div>
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl font-black tracking-widest text-purple-400">
                {room.id}
              </div>
              <button
                onClick={copyRoomCode}
                className="p-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all active:scale-95">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>

            {/* QR Code Toggle Button */}
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
              <QrCode size={20} />
              {showQRCode ? 'Ẩn QR Code' : 'Hiển thị QR Code'}
            </button>

            {/* QR Code Display */}
            {showQRCode && (
              <div className="animate-in fade-in slide-in-from-top-4 space-y-3">
                <div className="bg-white p-4 rounded-xl inline-block">
                  <QRCodeSVG 
                    value={room.id} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  📱 Bạn bè có thể quét QR code này để vào phòng
                </p>
              </div>
            )}

            {!showQRCode && (
              <p className="text-xs text-slate-400">
                Chia sẻ mã này với bạn bè để mời họ tham gia
              </p>
            )}
          </div>
        </div>

        {/* Players List */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-xl flex items-center gap-2">
              <Users size={24} className="text-purple-400" />
              Người chơi ({room.players.length}/2)
            </h2>
          </div>

          <div className="space-y-3">
            {room.players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  player.isReady || player.isHost
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-800/50 border-slate-700/30'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black ${
                    player.id === currentPlayer.id
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                  }`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {player.name}
                        {player.id === currentPlayer.id && (
                          <span className="text-xs text-purple-400 ml-2">(Bạn)</span>
                        )}
                      </span>
                      {player.isHost && (
                        <Crown size={16} className="text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {player.isHost ? 'Chủ phòng' : player.isReady ? 'Sẵn sàng' : 'Đang chờ...'}
                    </div>
                  </div>
                  {(player.isReady || player.isHost) && (
                    <Check size={24} className="text-green-400" />
                  )}
                </div>
              </div>
            ))}

            {/* Empty slot */}
            {room.players.length < 2 && (
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30">
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <Loader size={24} className="text-slate-500 animate-spin" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-500">Đang chờ người chơi...</div>
                    <div className="text-xs text-slate-600">Slot trống</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isHost && !currentPlayer.isReady && (
            <button
              onClick={onReady}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
              <Check size={24} />
              Sẵn Sàng
            </button>
          )}

          {isHost && (
            <button
              onClick={onStart}
              disabled={!canStart}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                canStart
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500'
                  : 'bg-slate-700 cursor-not-allowed opacity-50'
              }`}>
              <Play size={24} />
              {canStart ? 'Bắt Đầu Battle!' : 'Chờ người chơi sẵn sàng...'}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30 text-sm text-slate-400 text-center">
          <p>
            {isHost
              ? '👑 Bạn là chủ phòng. Nhấn "Bắt Đầu" khi đủ 2 người và cả hai đều sẵn sàng.'
              : '⏳ Chờ chủ phòng bắt đầu game...'}
          </p>
        </div>
      </div>
    </div>
  );
};
