import React, { useMemo, useState, useEffect } from 'react';
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
import api from '../api/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CancerData {
  cancerType: string;
  year: number;
  count: number | null;
  asr: number | null;
}

const SkinCancerChart: React.FC = () => {
  const [cancerData, setCancerData] = useState<CancerData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/cancer-incidence');
        setCancerData(response.data);
      } catch (error) {
        console.error('Error fetching cancer data for SkinCancerChart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data for Melanoma
  const chartData = useMemo(() => {
    return cancerData.filter(item => 
      item.cancerType === "Melanoma of the skin"
    );
  }, [cancerData]);

  const data = {
    labels: chartData.map(item => item.year),
    datasets: [
      {
        label: 'Age-standardised rate (per 100,000)',
        data: chartData.map(item => item.asr),
        borderColor: '#4285F4', // Blue
        backgroundColor: '#4285F4',
        yAxisID: 'y',
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Total cases',
        data: chartData.map(item => item.count),
        borderColor: '#EA4335', // Red
        backgroundColor: '#EA4335',
        yAxisID: 'y1',
        borderDash: [5, 5], // Dashed line
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
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
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Skin Cancer Statistics (Melanoma)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
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
        position: 'left' as const,
        title: {
          display: true,
          text: 'Rate per 100,000',
          font: {
            family: "'Inter', sans-serif",
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Total cases',
          font: {
            family: "'Inter', sans-serif",
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ width: '100%', height: '400px', position: 'relative' }}>
      {loading ? (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #4285F4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          <Line options={options as any} data={data} />
          <div className="chart-source" style={{ 
            textAlign: 'right', 
            fontSize: '10px', 
            color: '#888', 
            marginTop: '10px',
            fontStyle: 'italic'
          }}>
            Source: AIHW Cancer Data in Australia 2023
          </div>
        </>
      )}
    </div>
  );
};

export default SkinCancerChart;
