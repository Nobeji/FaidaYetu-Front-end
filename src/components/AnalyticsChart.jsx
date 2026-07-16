import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function AnalyticsChart({ type, data, options, height = 220 }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart to prevent canvas reuse/memory leak errors
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // Default global Chart.js configuration overrides
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Override display to false by default, can be custom set in props options
        },
        tooltip: {
          enabled: true,
          padding: 10,
          cornerRadius: 8,
          backgroundColor: '#0f172a',
          titleColor: '#fff',
          bodyColor: '#fff',
          bodyFont: { family: 'Inter, sans-serif', size: 12 },
          titleFont: { family: 'Inter, sans-serif', size: 12, weight: 'bold' },
        },
      },
      scales: {
        x: {
          grid: {
            color: '#f1f5f9',
          },
          ticks: {
            font: { family: 'Inter, sans-serif', size: 10 },
            color: '#64748b',
          }
        },
        y: {
          grid: {
            color: '#f1f5f9',
          },
          ticks: {
            font: { family: 'Inter, sans-serif', size: 10 },
            color: '#64748b',
          }
        }
      },
      ...options,
    };

    chartInstanceRef.current = new Chart(ctx, {
      type,
      data,
      options: defaultOptions,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [type, data, options]);

  return (
    <div style={{ position: 'relative', height, width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
