'use client';

import { useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface TrendChartsProps {
  data: DataPoint[];
  title: string;
  yAxisLabel?: string;
  chartType?: 'line' | 'bar' | 'area';
  color?: string;
  showTrend?: boolean;
}

export default function TrendCharts({
  data,
  title,
  yAxisLabel,
  chartType = 'line',
  color = '#3b82f6',
  showTrend = true,
}: TrendChartsProps) {
  const { min, max, trend } = useMemo(() => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 1);
    
    // Calculate trend (simple linear regression)
    let trend = 0;
    if (data.length > 1 && showTrend) {
      const n = data.length;
      const sumX = data.reduce((sum, _, i) => sum + i, 0);
      const sumY = values.reduce((sum, v) => sum + v, 0);
      const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
      const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);
      
      trend = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }
    
    return { min, max, trend };
  }, [data, showTrend]);

  const getY = (value: number, height: number): number => {
    if (max === min) return height / 2;
    return height - ((value - min) / (max - min)) * height;
  };

  const getX = (index: number, width: number): number => {
    return (index / (data.length - 1 || 1)) * width;
  };

  const svgHeight = 200;
  const svgWidth = 600;
  const padding = 40;

  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {showTrend && trend !== 0 && (
          <div className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(2)} {yAxisLabel || 'units'} per period
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="w-full">
          {/* Y-axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={svgHeight - padding}
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* X-axis */}
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={svgWidth - padding}
            y2={svgHeight - padding}
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = min + (max - min) * ratio;
            const y = padding + chartHeight * (1 - ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padding - 5}
                  y1={y}
                  x2={padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* Chart */}
          {chartType === 'line' && (
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${padding + getX(i, chartWidth)},${padding + getY(d.value, chartHeight)}`
                )
                .join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
          )}

          {chartType === 'bar' &&
            data.map((d, i) => {
              const x = padding + getX(i, chartWidth);
              const barWidth = chartWidth / data.length - 2;
              const barHeight = chartHeight - getY(d.value, chartHeight);
              const y = padding + getY(d.value, chartHeight);

              return (
                <rect
                  key={i}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="2"
                />
              );
            })}

          {chartType === 'area' && (
            <>
              <polygon
                points={`${padding},${svgHeight - padding} ${data
                  .map(
                    (d, i) =>
                      `${padding + getX(i, chartWidth)},${padding + getY(d.value, chartHeight)}`
                  )
                  .join(' ')} ${svgWidth - padding},${svgHeight - padding}`}
                fill={color}
                fillOpacity="0.2"
              />
              <polyline
                points={data
                  .map(
                    (d, i) =>
                      `${padding + getX(i, chartWidth)},${padding + getY(d.value, chartHeight)}`
                  )
                  .join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            </>
          )}

          {/* Data points */}
          {data.map((d, i) => {
            const x = padding + getX(i, chartWidth);
            const y = padding + getY(d.value, chartHeight);

            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill={color} />
                {d.label && (
                  <text
                    x={x}
                    y={svgHeight - padding + 15}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                    transform={`rotate(-45 ${x} ${svgHeight - padding + 15})`}
                  >
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {yAxisLabel && (
        <div className="text-sm text-gray-600 text-center mt-2">{yAxisLabel}</div>
      )}
    </div>
  );
}

