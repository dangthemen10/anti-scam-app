import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const QRScanner = ({ onScan, onClose }: QRScannerProps): React.JSX.Element => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        setError(null);

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            scanner.stop();
            onScan(decodedText);
          },
          (errorMessage) => {
            console.debug('QR scan error:', errorMessage);
          }
        );
      } catch (err) {
        console.error('Failed to start scanner:', err);
        setError('Không thể truy cập camera. Vui lòng cho phép quyền camera.');
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, [onScan]);

  const handleClose = () => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.stop().catch(console.error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Camera size={24} className="text-cyan-400" />
          Quét QR Code
        </h2>
        <button
          onClick={handleClose}
          className="p-2 bg-red-600 hover:bg-red-700 rounded-xl transition-all active:scale-95">
          <X size={24} className="text-white" />
        </button>
      </div>

      {/* Scanner Container */}
      <div className="w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden border-4 border-cyan-500/50 shadow-2xl">
        <div id="qr-reader" className="w-full"></div>
      </div>

      {/* Status */}
      <div className="w-full max-w-md mt-4 space-y-3">
        {isScanning && (
          <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-semibold">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              Đang quét... Di chuyển camera đến QR code
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
            <div className="flex items-start gap-2 text-red-400">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 text-sm text-slate-400 text-center">
          <p>
            💡 Đưa camera vào khung QR code để tự động quét.
          </p>
        </div>
      </div>
    </div>
  );
};
