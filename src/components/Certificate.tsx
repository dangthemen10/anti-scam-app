/* eslint-disable @typescript-eslint/no-explicit-any */
import { toPng } from 'html-to-image';
import { useRef } from 'react';

export default function Certificate({ name, score, total }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (ref.current) {
      const dataUrl = await toPng(ref.current);
      // Tạo link download
      const link = document.createElement('a');
      link.download = 'chung-chi-anti-scam.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="text-center">
      <div
        ref={ref}
        className="bg-white p-10 border-4 border-yellow-400 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-600 uppercase">
          Chứng nhận
        </h1>
        <p className="mt-4">Xác nhận chuyên gia phòng chống lừa đảo</p>
        <h2 className="text-3xl font-bold my-4 text-red-600">{name}</h2>
        <p>
          Đã đạt điểm số: {score}/{total}
        </p>
        <p className="text-sm text-gray-500 mt-4">Cấp bởi Anti-Scam App</p>
      </div>

      <button
        onClick={downloadImage}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full font-bold">
        Tải Chứng Chỉ
      </button>
    </div>
  );
}
