import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import uvData from '../data/uvIndexMonthly2021.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UvIndexChart: React.FC = () => {
  // Define colors for each state/territory
  const stateColors: {[key: string]: string} = {
    'Darwin (NT)': '#9c27b0', // Purple
    'Brisbane (QLD)': '#f44336', // Red
    'Perth (WA)': '#ff9800', // Orange
    'Sydney (NSW)': '#4285F4', // Blue
    'Melbourne (VIC)': '#4caf50', // Green
    'Adelaide (SA)': '#e91e63', // Pink
    'Canberra (ACT)': '#00bcd4', // Cyan
    'Hobart (TAS)': '#795548'  // Brown
  };

  // Get keys (excluding 'month')
  const keys = Object.keys(uvData[0]).filter(key => key !== 'month');

  const data = {
    labels: uvData.map(item => item.month),
    datasets: keys.map(key => ({
      label: key,
      data: uvData.map(item => (item as any)[key]),
      borderColor: stateColors[key] || '#999',
      backgroundColor: stateColors[key] || '#999',
      tension: 0.4, // Smooth curves
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly average peak UV index across major Australian cities',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        callbacks: {
            title: (items) => `Month: ${items[0].label}`,
            label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += `UV ${context.parsed.y}`;
                    // Add risk level
                    const val = context.parsed.y;
                    if (val >= 11) label += ' (Extreme)';
                    else if (val >= 8) label += ' (Very High)';
                    else if (val >= 6) label += ' (High)';
                    else if (val >= 3) label += ' (Moderate)';
                    else label += ' (Low)';
                }
                return label;
            }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        title: {
          display: true,
          text: 'Average daily peak UV index',
          font: {
            family: "'Inter', sans-serif",
            weight: 'bold'
          }
        },
        min: 0,
        suggestedMax: 15,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
  };

  return (
    <div className="chart-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ height: '400px', position: 'relative' }}>
        {/* Optional: Add background shading for risk levels if desired, but might complicate the chart. 
            For now, just the lines. */}
        <Line options={options as any} data={data} />
      </div>
      
      <div className="chart-source" style={{ 
        textAlign: 'left', 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '10px',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
      }}>
        Source: ARPANSA / data.gov.au. Darwin, Brisbane, Perth, Sydney: 2024 data. Melbourne: 2021 data. UV observations courtesy of ARPANSA.
      </div>
    </div>
  );
};

export default UvIndexChart;
