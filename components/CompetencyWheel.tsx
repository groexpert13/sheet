'use client';

import { useMemo, useImperativeHandle, forwardRef, useRef } from 'react';
import { CompetencyData } from '@/types/diagnostic';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';

export interface CompetencyWheelHandle {
  exportPng: (fileName?: string) => void;
}

interface CompetencyWheelProps {
  competencyData: CompetencyData;
  height?: number; // optional explicit height for parent layout control
  compact?: boolean; // mini view: simpler chrome
}

const competencyLabels = [
  { key: 'traffic', label: 'Трафик', color: '#3B82F6' },
  { key: 'expertise', label: 'Экспертность', color: '#8B5CF6' },
  { key: 'sales', label: 'Продажи', color: '#10B981' },
  { key: 'content', label: 'Контент', color: '#F59E0B' },
  { key: 'product', label: 'Продукт', color: '#EF4444' },
  { key: 'satisfaction', label: 'Удовлетворение', color: '#06B6D4' },
] as const;

const CompetencyWheel = forwardRef<CompetencyWheelHandle, CompetencyWheelProps>(
  ({ competencyData, height = 260, compact = false }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const data = useMemo(
    () =>
      competencyLabels.map((c) => ({
        subject: c.label,
        value: competencyData[c.key as keyof CompetencyData],
        fill: c.color,
      })),
    [competencyData]
  );

  const averageScore =
    Object.values(competencyData).reduce((sum, val) => sum + val, 0) / competencyLabels.length;

  useImperativeHandle(ref, () => ({
    exportPng: (fileName = 'competency-wheel.png') => {
      if (!containerRef.current) return;
      const svg = containerRef.current.querySelector('svg');
      if (!svg) return;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(img.naturalWidth);
        canvas.height = Math.ceil(img.naturalHeight);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            a.click();
          });
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }), []);

  return (
    <div className={`w-full ${compact ? '' : 'space-y-4'}`}>
      {!compact && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Колесо компетенций</h3>
          <Badge className="bg-gray-900 text-white">
            Средний балл: {Math.round(averageScore * 10) / 10}/5
          </Badge>
        </div>
      )}

      <div className="w-full">
        <div ref={containerRef} style={{ width: '100%', height }} className="overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              margin={{ top: 24, right: 40, bottom: 24, left: 40 }}
              startAngle={90}
              endAngle={-270}
              outerRadius="80%"
            >
              {/* Notion-like subtle grid */}
              <PolarGrid gridType="circle" stroke="#E5E7EB" radialLines={true} />
              {/* Axis labels */}
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#374151', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              {/* Radius ticks 0..5, ensure 0 drawn correctly */}
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tickCount={6}
                allowDecimals={false}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
              />

              {/* Minimal tooltip */}
              <Tooltip
                formatter={(v: number) => [`${v}/5`, 'Уровень']}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: '#E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              />

              {/* Optional legend is removed for a cleaner look */}

              {/* Gradient fill */}
              <defs>
                <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.12} />
                </linearGradient>
              </defs>

              <Radar
                name="Уровень"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#radarFill)"
                fillOpacity={1}
                dot={{ r: 3, stroke: '#fff', strokeWidth: 1, fill: '#2563EB' }}
                isAnimationActive
                animationDuration={700}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!compact && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Колесо показывает ваш текущий уровень в каждой компетенции</p>
        </div>
      )}
    </div>
  );
});
export default CompetencyWheel;