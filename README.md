HƯỚNG DẪN PHÁT TRIỂN ỨNG DỤNG "ANTI-SCAM MASTER" TRÊN LINE LIFFTài liệu này hướng dẫn chi tiết quy trình xây dựng Web App game trắc nghiệm phòng chống lừa đảo (Anti-Scam), tích hợp LINE LIFF và chạy thử nghiệm trên iOS Simulator.📋 Mục LụcYêu cầu chuẩn bịGiai đoạn 1: Khởi tạo ProjectGiai đoạn 2: Thiết lập LINE LIFFGiai đoạn 3: Lập trình (Source Code)Giai đoạn 4: Thiết lập HTTPS (Ngrok)Giai đoạn 5: Chạy trên iOS Simulator1. Yêu cầu chuẩn bịTrước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:Node.js (v18 trở lên).Code Editor (VS Code).Tài khoản LINE cá nhân.Xcode (để dùng iOS Simulator trên macOS).Ngrok (để tạo đường dẫn HTTPS).2. Giai đoạn 1: Khởi tạo ProjectMở Terminal và thực hiện lần lượt các lệnh sau:2.1. Tạo Next.js Appnpx create-next-app@latest anti-scam-liff

Khi được hỏi, hãy chọn:TypeScript: YesTailwind CSS: YesESLint: YesApp Router: Yes2.2. Cài đặt thư việnDi chuyển vào thư mục dự án và cài đặt các gói cần thiết:cd anti-scam-liff
npm install @line/liff framer-motion lucide-react clsx tailwind-merge

(Lưu ý: Tạm thời chưa cài html-to-image để tránh lỗi build môi trường dev, sẽ bổ sung sau khi deploy thật).3. Giai đoạn 2: Thiết lập LINE LIFFTruy cập LINE Developers Console.Đăng nhập bằng tài khoản LINE.Tạo mới một Provider (Ví dụ: My Dev Team).Chọn Create a new channel -> Chọn loại LINE Login.Điền thông tin cơ bản (Tên App, Mô tả, Icon...) và nhấn Create.Vào trang quản lý Channel vừa tạo, chọn tab LIFF.Nhấn Add:LIFF App Name: Anti Scam Game.Size: Full.Endpoint URL: Điền tạm https://example.com (Sẽ cập nhật ở Bước 4).Scopes: Tích chọn profile và openid.Scan QR: Bật (Optional).Nhấn Add để hoàn tất.QUAN TRỌNG: Copy mã LIFF ID (Dạng 12345678-abcdefgh) để dùng ở bước sau.4. Giai đoạn 3: Lập trình (Source Code)4.1. Cấu hình biến môi trườngTạo file .env.local tại thư mục gốc của dự án và dán LIFF ID vào:NEXT_PUBLIC_LIFF_ID=Dán_Mã_LIFF_ID_Của_Bạn_Vào_Đây

4.2. Cập nhật Code chínhMở file src/app/page.tsx (hoặc src/app/page.js), xóa toàn bộ nội dung cũ và thay thế bằng code sau:'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Download } from 'lucide-react';

// --- DATA ---
const SCENARIOS = [
  {
    id: 1,
    title: "Tuyển dụng việc nhẹ",
    image: "[https://placehold.co/600x400/ffe4e6/be123c?text=CTV+TikTok+500k](https://placehold.co/600x400/ffe4e6/be123c?text=CTV+TikTok+500k)",
    description: "Tuyển CTV like dạo, thu nhập 500k/ngày. Cần nạp cọc 200k.",
    isScam: true,
    explanation: "Không bao giờ nạp tiền trước khi làm việc. Đây là lừa đảo.",
  },
  {
    id: 2,
    title: "Sàn TMĐT Chính hãng",
    image: "[https://placehold.co/600x400/dcfce7/166534?text=Shopee+Mall](https://placehold.co/600x400/dcfce7/166534?text=Shopee+Mall)",
    description: "Mua hàng trên Shopee Mall, thanh toán qua App.",
    isScam: false,
    explanation: "Mua trên sàn chính hãng là an toàn.",
  },
  // Thêm các case khác tùy ý...
];

// --- COMPONENTS ---
const SwipeCard = ({ data, onSwipe, active }: any) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const bgOverlay = useTransform(x, [-150, 0, 150], ["rgba(239, 68, 68, 0.4)", "rgba(255,255,255,0)", "rgba(34, 197, 94, 0.4)"]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl shadow-xl border overflow-hidden cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.95, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.05, opacity: 0 }}
    >
      <motion.div style={{ backgroundColor: bgOverlay }} className="absolute inset-0 z-10" />
      <div className="h-1/2 bg-gray-100"><img src={data.image} className="w-full h-full object-cover" /></div>
      <div className="h-1/2 p-6">
        <h3 className="text-xl font-bold mb-2">{data.title}</h3>
        <p className="text-gray-600">{data.description}</p>
      </div>
    </motion.div>
  );
};

export default function AntiScamApp() {
  const [gameState, setGameState] = useState('intro');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState({ displayName: "Khách", userId: "" });
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // --- LIFF INTEGRATION ---
    import('@line/liff').then((liffModule) => {
      const liff = liffModule.default;
      liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' })
        .then(() => {
          if (liff.isLoggedIn()) {
            liff.getProfile().then((profile: any) => setUser(profile));
          } else {
            // Trên Simulator có thể nó sẽ redirect login
            liff.login();
          }
        })
        .catch(console.error);
    });
  }, []);

  const handleSwipe = (dir: string) => {
    const scenario = SCENARIOS[index];
    const correct = (scenario.isScam && dir === 'left') || (!scenario.isScam && dir === 'right');
    if (correct) setScore(s => s + 1);
    setIsCorrect(correct);
    setGameState('feedback');
  };

  const nextLevel = () => {
    if (index < SCENARIOS.length - 1) {
      setIndex(i => i + 1);
      setGameState('playing');
    } else {
      setGameState('result');
    }
  };

  // --- RENDER ---
  if (gameState === 'intro') return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-blue-50 text-center">
      <Shield size={64} className="text-blue-600 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Anti-Scam Master</h1>
      <p className="mb-8">Xin chào, {user.displayName}</p>
      <button onClick={() => setGameState('playing')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Bắt đầu</button>
    </div>
  );

  if (gameState === 'result') return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-4 text-yellow-600">CHỨNG NHẬN</h2>
      <div className="bg-white p-8 rounded shadow-lg border-4 border-yellow-400 mb-6">
        <p>Xác nhận chuyên gia:</p>
        <h1 className="text-2xl font-black my-2">{user.displayName}</h1>
        <p>Điểm số: {score}/{SCENARIOS.length}</p>
      </div>
      <button onClick={() => alert('Tính năng tải ảnh sẽ có sau khi deploy!')} className="bg-green-600 text-white px-6 py-2 rounded-lg flex gap-2"><Download/> Tải chứng chỉ</button>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <div className="p-4 bg-white shadow z-20 flex justify-between font-bold">
        <span>Level {index + 1}</span>
        <span>Điểm: {score}</span>
      </div>
      <div className="flex-1 relative flex items-center justify-center p-4">
        <AnimatePresence>
          {gameState === 'playing' && <SwipeCard key={SCENARIOS[index].id} data={SCENARIOS[index]} onSwipe={handleSwipe} active={true} />}
        </AnimatePresence>
        
        {gameState === 'feedback' && (
          <div className="absolute inset-0 z-30 bg-white/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            {isCorrect ? <CheckCircle size={60} className="text-green-500 mb-4"/> : <XCircle size={60} className="text-red-500 mb-4"/>}
            <h2 className="text-2xl font-bold mb-2">{isCorrect ? 'Chính xác!' : 'Sai rồi!'}</h2>
            <p className="mb-6">{SCENARIOS[index].explanation}</p>
            <button onClick={nextLevel} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Tiếp tục</button>
          </div>
        )}
      </div>
    </div>
  );
}

5. Giai đoạn 4: Thiết lập HTTPS (Ngrok)LINE yêu cầu Endpoint phải là HTTPS, nên ta dùng Ngrok để public localhost.Chạy Web App ở Terminal 1:npm run dev

Mở Terminal 2, khởi chạy Ngrok:ngrok http 3000

Copy đường dẫn HTTPS (Ví dụ: https://abcd-1234.ngrok-free.app).Quay lại LINE Developers Console -> Tab LIFF.Dán link Ngrok vào mục Endpoint URL.Nhấn Save.6. Giai đoạn 5: Chạy trên iOS SimulatorMở ứng dụng Simulator trên máy Mac.Trong Simulator, mở trình duyệt Safari.Nhập địa chỉ link Ngrok (hoặc link https://liff.line.me/YOUR_LIFF_ID).App sẽ yêu cầu đăng nhập LINE -> Thực hiện đăng nhập.Sau khi đăng nhập, Game sẽ hiển thị. Hãy test thử các chức năng:$$ $$ Tên hiển thị đúng tên LINE của bạn.$$ $$ Vuốt trái/phải hoạt động mượt.$$ $$ Kết thúc game hiển thị bảng điểm.Chúc bạn phát triển thành công! 🚀