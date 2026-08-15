import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart as ChartIcon, LayoutList, Droplets } from 'lucide-react';
import { getWeatherMeta } from '../lib/weatherCodes';
import { BentoCard } from './inspira/BentoGrid';
import type { HourlyData, TempUnit } from '../types/weather';

interface HourlyChartProps {
  hourly: HourlyData;
  timezone: string;
  unit: TempUnit;
}

export default function HourlyChart({ hourly, unit }: HourlyChartProps) {
  const [activeTab, setActiveTab] = useState<'cards' | 'chart'>('cards');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const now = new Date();
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const idx = startIdx === -1 ? 0 : startIdx;
  const sliceIndices = Array.from({ length: 24 }, (_, i) => idx + i).filter(
    (i) => i < hourly.time.length
  );

  const temps = sliceIndices.map((i) => hourly.temperature_2m[i]);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const svgWidth = 800;
  const svgHeight = 200;
  const paddingX = 24;
  const paddingY = 36;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Generate SVG points
  const points = sliceIndices.map((i, ptIdx) => {
    const x = paddingX + (ptIdx / (sliceIndices.length - 1)) * graphWidth;
    const normY = (hourly.temperature_2m[i] - minTemp) / tempRange;
    const y = svgHeight - paddingY - normY * graphHeight;
    return { x, y, index: i, ptIdx };
  });

  // Smooth Bezier path
  let pathD = '';
  let areaD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    areaD = `M ${points[0].x} ${svgHeight - paddingY + 16} L ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    areaD += ` L ${points[points.length - 1].x} ${svgHeight - paddingY + 16} Z`;
  }

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normX = (mouseX / rect.width) * svgWidth;
    
    let closestPt = 0;
    let minDistance = Infinity;
    points.forEach((pt) => {
      const dist = Math.abs(pt.x - normX);
      if (dist < minDistance) {
        minDistance = dist;
        closestPt = pt.index;
      }
    });
    setHoverIdx(closestPt);
  };

  const selectedIdx = hoverIdx ?? sliceIndices[0];
  const selectedTime = new Date(hourly.time[selectedIdx]);
  const selectedIsDay = selectedTime.getHours() >= 6 && selectedTime.getHours() < 20;
  const { label: selectedLabel, icon: SelectedIcon } = getWeatherMeta(
    hourly.weather_code[selectedIdx],
    selectedIsDay
  );

  return (
    <BentoCard className="w-full">
      {/* Minimal header with view toggle */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
          24-Hour Forecast
        </h3>

        <div className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5">
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-mono transition-all duration-200 ${
              activeTab === 'cards'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <LayoutList size={12} />
            <span>Strip</span>
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-mono transition-all duration-200 ${
              activeTab === 'chart'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <ChartIcon size={12} />
            <span>Curve</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Strip View */}
        {activeTab === 'cards' ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="hide-scrollbar mt-4 flex gap-2.5 overflow-x-auto pb-1"
          >
            {sliceIndices.map((i) => {
              const time = new Date(hourly.time[i]);
              const hourLabel = time.toLocaleTimeString([], { hour: 'numeric' });
              const isDayHour = time.getHours() >= 6 && time.getHours() < 20;
              const { icon: Icon } = getWeatherMeta(hourly.weather_code[i], isDayHour);
              const isNow = i === idx;
              const precip = hourly.precipitation_probability[i];

              return (
                <div
                  key={hourly.time[i]}
                  className={`flex w-16 shrink-0 flex-col items-center gap-2 rounded-2xl py-3 text-center transition-all duration-200 ${
                    isNow
                      ? 'border border-white/20 bg-white/[0.08] text-white shadow-xs'
                      : 'hover:bg-white/[0.04] text-white/70'
                  }`}
                >
                  <span className="font-mono text-xs text-white/40">
                    {isNow ? 'Now' : hourLabel}
                  </span>
                  <Icon size={18} strokeWidth={1.5} className="text-[var(--sky)] my-0.5" />
                  <span className="text-sm font-medium tabular-nums text-white">
                    {Math.round(hourly.temperature_2m[i])}°
                  </span>

                  {precip > 15 ? (
                    <div className="flex items-center gap-0.5 font-mono text-[10px] text-[var(--gold)]">
                      <Droplets size={9} />
                      <span>{precip}%</span>
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] text-white/20">•</span>
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-4 flex flex-col gap-3"
          >
            {/* Interactive Scrub Preview */}
            <div className="flex items-center justify-between px-1 text-xs font-mono text-white/60">
              <div className="flex items-center gap-2">
                <SelectedIcon size={15} className="text-[var(--sky)]" />
                <span className="text-white">
                  {selectedTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
                <span className="text-white/50">{selectedLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-white">
                  {Math.round(hourly.temperature_2m[selectedIdx])}°{unit === 'celsius' ? 'C' : 'F'}
                </span>
                {hourly.precipitation_probability[selectedIdx] > 0 && (
                  <span className="text-[var(--gold)]">
                    {hourly.precipitation_probability[selectedIdx]}% rain
                  </span>
                )}
              </div>
            </div>

            <div className="relative w-full overflow-hidden">
              <svg
                ref={chartRef}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-40 cursor-crosshair overflow-visible"
                onMouseMove={handleSvgMouseMove}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <defs>
                  <linearGradient id="hourlyTempGradMinimal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--sky)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--sky)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Smooth area fill */}
                <path d={areaD} fill="url(#hourlyTempGradMinimal)" />

                {/* Minimalist curve line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--sky)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_2px_8px_rgba(220,232,255,0.25)]"
                />

                {/* Points and markers */}
                {points.map((pt, index) => {
                  const isSelected = pt.index === selectedIdx;
                  const showLabel = index % 4 === 0 || isSelected;
                  const time = new Date(hourly.time[pt.index]);
                  const timeStr = time.toLocaleTimeString([], { hour: 'numeric' });

                  return (
                    <g key={`pt-${pt.index}`}>
                      {showLabel && (
                        <text
                          x={pt.x}
                          y={svgHeight - 6}
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.4)"
                          fontSize="10"
                          fontFamily="IBM Plex Mono, monospace"
                        >
                          {index === 0 ? 'Now' : timeStr}
                        </text>
                      )}

                      {showLabel && (
                        <text
                          x={pt.x}
                          y={pt.y - 9}
                          textAnchor="middle"
                          fill={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                          fontSize="10"
                          fontFamily="IBM Plex Mono, monospace"
                        >
                          {Math.round(hourly.temperature_2m[pt.index])}°
                        </text>
                      )}

                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 4 : 2}
                        fill={isSelected ? '#FFFFFF' : 'var(--sky)'}
                        className="transition-all duration-150"
                      />

                      {isSelected && (
                        <line
                          x1={pt.x}
                          y1={paddingY - 10}
                          x2={pt.x}
                          y2={svgHeight - paddingY + 12}
                          stroke="rgba(255,255,255,0.2)"
                          strokeDasharray="2 2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BentoCard>
  );
}
