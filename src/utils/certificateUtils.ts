import { GameStats } from '@/types/game';
import { GAME_CONFIG } from '@/constants/gameConfig';

export const drawCertificate = (
  canvas: HTMLCanvasElement,
  userName: string,
  stats: GameStats
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = GAME_CONFIG.CANVAS_WIDTH;
  canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, '#111827');
  grad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 800);

  // Border
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 15;
  ctx.strokeRect(50, 50, 1100, 700);

  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f3f4f6';
  ctx.font = 'bold 50px Arial';
  ctx.fillText('CHỨNG NHẬN ANTI-SCAM', 600, 200);

  // Subtitle
  ctx.font = 'italic 40px Arial';
  ctx.fillText('Trao tặng cho chiến binh:', 600, 300);

  // User name
  ctx.font = 'bold 80px "Times New Roman"';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(userName, 600, 420);

  // Score
  ctx.font = '30px Arial';
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText(
    `Điểm Tổng Kết: ${stats.totalScore10.toFixed(1)}/10`,
    600,
    520
  );

  // Stats
  ctx.font = '24px Arial';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText(
    `Kiến thức: ${stats.knowledge}% - Cảnh giác: ${stats.vigilance}% - Tư duy: ${stats.mindset}%`,
    600,
    570
  );

  // Date
  ctx.fillText(
    `Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}`,
    600,
    620
  );
};

export const downloadCertificate = (
  canvas: HTMLCanvasElement,
  userName: string
): void => {
  const link = document.createElement('a');
  link.download = `AntiScam_Certificate_${userName}.png`;
  link.href = canvas.toDataURL();
  link.click();
};
