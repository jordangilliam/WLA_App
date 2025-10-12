/**
 * Data Visualization Component
 * 
 * Beautiful charts and graphs for conservation data:
 * - Catch statistics
 * - Species distribution
 * - Water quality trends
 * - Achievement progress
 * - Activity heatmaps
 */

'use client';

import { useState, useEffect } from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface HeatmapData {
  day: number;
  hour: number;
  value: number;
}

/**
 * Bar Chart Component
 */
export function BarChart({ data, title, height = 300 }: { 
  data: ChartData[]; 
  title: string;
  height?: number;
}) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: 700, 
        color: '#023047', 
        marginBottom: '1rem' 
      }}>
        {title}
      </h3>
      
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
        {data.map((item, index) => (
          <div 
            key={index}
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <div style={{ 
              width: '100%',
              height: `${(item.value / maxValue) * (height - 60)}px`,
              background: item.color,
              borderRadius: '8px 8px 0 0',
              position: 'relative',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scaleY(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scaleY(1)';
            }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#023047'
              }}>
                {item.value}
              </div>
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600,
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: '100%',
              wordWrap: 'break-word'
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Pie Chart Component
 */
export function PieChart({ data, title }: { data: ChartData[]; title: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: 700, 
        color: '#023047', 
        marginBottom: '1rem' 
      }}>
        {title}
      </h3>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* SVG Pie Chart */}
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const startX = 100 + 90 * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = 100 + 90 * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = 100 + 90 * Math.cos((currentAngle - 90) * Math.PI / 180);
            const endY = 100 + 90 * Math.sin((currentAngle - 90) * Math.PI / 180);
            const largeArc = angle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M 100 100 L ${startX} ${startY} A 90 90 0 ${largeArc} 1 ${endX} ${endY} Z`}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: item.color
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#023047' }}>{item.label}</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Line Chart Component
 */
export function LineChart({ data, title, color = '#0077B6' }: { 
  data: TimeSeriesData[]; 
  title: string;
  color?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: 700, 
        color: '#023047', 
        marginBottom: '1rem' 
      }}>
        {title}
      </h3>
      
      <svg width="100%" height="250" viewBox="0 0 800 250" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(percent => (
          <line
            key={percent}
            x1="0"
            y1={250 - (percent * 2)}
            x2="800"
            y2={250 - (percent * 2)}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Line */}
        <polyline
          points={data.map((d, i) => {
            const x = (i / (data.length - 1)) * 800;
            const y = 250 - ((d.value - minValue) / range) * 200;
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Area fill */}
        <polygon
          points={[
            ...data.map((d, i) => {
              const x = (i / (data.length - 1)) * 800;
              const y = 250 - ((d.value - minValue) / range) * 200;
              return `${x},${y}`;
            }),
            '800,250',
            '0,250'
          ].join(' ')}
          fill={color}
          opacity="0.1"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 800;
          const y = 250 - ((d.value - minValue) / range) * 200;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill={color}
              stroke="white"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: '#6B7280'
      }}>
        {data.map((d, i) => i % Math.ceil(data.length / 6) === 0 && (
          <span key={i}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Progress Ring Component
 */
export function ProgressRing({ 
  value, 
  max, 
  size = 120, 
  color = '#0077B6',
  label
}: { 
  value: number; 
  max: number; 
  size?: number;
  color?: string;
  label: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.5s' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#023047' }}>
            {Math.round(percentage)}%
          </div>
          <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>
            {value}/{max}
          </div>
        </div>
      </div>
      <div style={{ fontWeight: 600, color: '#023047', textAlign: 'center' }}>
        {label}
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
export function StatCard({ 
  value, 
  label, 
  icon, 
  color = '#0077B6',
  trend,
  trendValue
}: { 
  value: string | number; 
  label: string; 
  icon: string;
  color?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}) {
  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#023047' }}>
          {value}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 600 }}>
          {label}
        </div>
        {trend && trendValue && (
          <div style={{ 
            fontSize: '0.85rem', 
            color: trend === 'up' ? '#059669' : '#EF4444',
            fontWeight: 600,
            marginTop: '0.25rem'
          }}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Activity Heatmap Component
 */
export function ActivityHeatmap({ data, title }: { 
  data: HeatmapData[]; 
  title: string;
}) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const maxValue = Math.max(...data.map(d => d.value));

  const getColor = (value: number) => {
    if (value === 0) return '#F3F4F6';
    const intensity = value / maxValue;
    if (intensity < 0.25) return '#DBEAFE';
    if (intensity < 0.5) return '#93C5FD';
    if (intensity < 0.75) return '#3B82F6';
    return '#1E40AF';
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'auto'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: 700, 
        color: '#023047', 
        marginBottom: '1rem' 
      }}>
        {title}
      </h3>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {/* Y-axis labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '20px' }}>
          {days.map(day => (
            <div key={day} style={{ 
              height: '20px', 
              fontSize: '0.75rem', 
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center'
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div style={{ flex: 1 }}>
          {/* X-axis labels */}
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
            {hours.map((hour, i) => i % 6 === 0 && (
              <div key={hour} style={{ 
                width: '20px',
                fontSize: '0.7rem',
                color: '#6B7280',
                textAlign: 'center'
              }}>
                {hour}
              </div>
            ))}
          </div>

          {/* Grid */}
          {days.map((day, dayIndex) => (
            <div key={day} style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
              {hours.map(hour => {
                const cell = data.find(d => d.day === dayIndex && d.hour === hour);
                const value = cell?.value || 0;
                return (
                  <div
                    key={`${day}-${hour}`}
                    title={`${day} ${hour}:00 - ${value} activities`}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      background: getColor(value),
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: '#6B7280'
      }}>
        <span>Less</span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {['#F3F4F6', '#DBEAFE', '#93C5FD', '#3B82F6', '#1E40AF'].map(color => (
            <div
              key={color}
              style={{
                width: '15px',
                height: '15px',
                borderRadius: '3px',
                background: color
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

// Export all components
export default {
  BarChart,
  PieChart,
  LineChart,
  ProgressRing,
  StatCard,
  ActivityHeatmap
};

