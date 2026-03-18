import React, { useMemo, useState } from 'react';
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
import melanomaData from '../data/melanomaByState.json';

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
  state: string;
  year: number;
  asr: number | null;
}

const SkinCancerChart: React.FC = () => {
  const [selectedState, setSelectedState] = useState('Australia');

  const states = [
    'Australia', 'Queensland', 'New South Wales', 'Victoria', 'Western Australia',
    'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'
  ];
  
  const stateLabels: {[key: string]: string} = {
    'Australian Capital Territory': 'ACT',
    'Northern Territory': 'NT'
  };

  // Filter data for selected state
  const chartData = useMemo(() => {
    return (melanomaData as CancerData[])
      .filter(item => item.state === selectedState)
      .sort((a, b) => a.year - b.year);
  }, [selectedState]);

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
      }
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
        text: `Melanoma Incidence Rate in ${stateLabels[selectedState] || selectedState}`,
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
        boxPadding: 4,
        callbacks: {
            title: (items) => `Year: ${items[0].label}`,
            label: (item) => `Rate: ${item.formattedValue} per 100,000 people`
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
        position: 'left' as const,
        title: {
          display: true,
          text: 'Rate per 100,000 people',
          font: {
            family: "'Inter', sans-serif",
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
  };

  return (
    <div className="chart-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="chart-header">
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>
          Select a state or territory to view its melanoma incidence trend.
        </p>
        
        <div className="state-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {states.map(state => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                background: selectedState === state ? '#fff' : '#f5f5f5',
                color: '#333',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedState === state ? '600' : '400',
                boxShadow: selectedState === state ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {stateLabels[state] || state}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '400px', position: 'relative' }}>
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
        Source: AIHW Cancer Data in Australia 2025. Melanoma of the skin, all persons.
      </div>
    </div>
  );
};

export default SkinCancerChart;
