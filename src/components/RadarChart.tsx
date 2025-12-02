import { GameStats } from '@/types/game';

interface RadarChartProps {
  stats: GameStats;
}

export const RadarChart = ({ stats }: RadarChartProps): React.JSX.Element => {
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const axis = 5;

  const getPoint = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / axis - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const points = [
    stats.knowledge,
    stats.speed,
    stats.vigilance,
    stats.analysis,
    stats.mindset,
  ].map((val, i) => getPoint(val, i));

  const pathData =
    points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ') + 'Z';

  const labels = [
    'Kiến thức',
    'Tốc độ',
    'Cảnh giác',
    'Phân tích',
    'Tư duy',
  ].map((label, i) => {
    const angle = (Math.PI * 2 * i) / axis - Math.PI / 2;
    const r = radius + 25;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      text: label,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />
        ))}

        {/* Axis lines */}
        {points.map((_, i) => {
          const end = getPoint(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#cbd5e1"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.5)"
          stroke="#2563eb"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1d4ed8" />
        ))}

        {/* Labels */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-slate-300">
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  );
};
