
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
import zoomPlugin from 'chartjs-plugin-zoom';
import api from '../api/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

interface CancerData {
  cancerType: string;
  year: number;
  count: number | null;
  asr: number | null;
}

const CancerIncidenceChart: React.FC = () => {
  // State for filters
  const [selectedCancer, setSelectedCancer] = useState<string>("Melanoma of the skin");
  const [yearRange, setYearRange] = useState<[number, number]>([1982, 2019]);
  const [metric, setMetric] = useState<'both' | 'count' | 'asr'>('both');
  const [loading, setLoading] = useState(false);
  const [cancerData, setCancerData] = useState<CancerData[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/cancer-incidence');
        setCancerData(response.data);
      } catch (error) {
        console.error('Error fetching cancer incidence data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique cancer types
  const cancerTypes = useMemo(() => {
    const types = new Set(cancerData.map(item => item.cancerType));
    return Array.from(types).sort();
  }, [cancerData]);

  // Get min/max years
  const { minYear, maxYear } = useMemo(() => {
    if (cancerData.length === 0) return { minYear: 1982, maxYear: 2019 };
    const years = cancerData.map(item => item.year);
    return { minYear: Math.min(...years), maxYear: Math.max(...years) };
  }, [cancerData]);

  // Initialize year range once data is loaded
  useEffect(() => {
    if (cancerData.length > 0 && (yearRange[0] === 1982 && yearRange[1] === 2019)) {
       // Only update if it's the default/initial state
       setYearRange([minYear, maxYear]);
    }
  }, [minYear, maxYear, cancerData.length]);

  // Filter data based on selection
  const filteredData = useMemo(() => {
    return cancerData.filter(item => 
      item.cancerType === selectedCancer &&
      item.year >= yearRange[0] &&
      item.year <= yearRange[1]
    );
  }, [selectedCancer, yearRange, cancerData]);

  const data = {
    labels: filteredData.map(item => item.year),
    datasets: [
      {
        label: 'Age-standardised rate (per 100,000)',
        data: filteredData.map(item => item.asr ?? null),
        borderColor: '#4285F4',
        backgroundColor: '#4285F4',
        yAxisID: 'y',
        tension: 0.1,
        hidden: metric === 'count',
        pointRadius: 4,
        pointHoverRadius: 7,
      },
      {
        label: 'Total cases',
        data: filteredData.map(item => item.count ?? null),
        borderColor: '#EA4335',
        backgroundColor: '#EA4335',
        yAxisID: 'y1',
        borderDash: [5, 5],
        tension: 0.1,
        hidden: metric === 'asr',
        pointRadius: 4,
        pointHoverRadius: 7,
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
        position: 'top',
        labels: {
          usePointStyle: true,
        },
        onClick: (_e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          if (ci.isDatasetVisible(index!)) {
            ci.hide(index!);
            legendItem.hidden = true;
          } else {
            ci.show(index!);
            legendItem.hidden = false;
          }
        }
      },
      title: {
        display: true,
        text: `Cancer Incidence: ${selectedCancer}`,
        font: { size: 16 }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed && context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: 'Year' }
      },
      y: {
        type: 'linear',
        display: metric !== 'count',
        position: 'left',
        title: { display: true, text: 'Rate per 100,000' },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y1: {
        type: 'linear',
        display: metric !== 'asr',
        position: 'right',
        title: { display: true, text: 'Total cases' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="cancer-incidence-container" style={{ 
      background: 'rgba(255,255,255,0.6)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      {/* Controls */}
      <div className="chart-controls" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        marginBottom: '20px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#555' }}>
            Cancer Type
          </label>
          <select 
            value={selectedCancer} 
            onChange={(e) => setSelectedCancer(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              borderRadius: '8px', 
              border: '1px solid #ccc',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          >
            {cancerTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#555' }}>
            Year Range: {yearRange[0]} - {yearRange[1]}
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="range" 
              min={minYear} 
              max={maxYear} 
              value={yearRange[0]} 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val < yearRange[1]) setYearRange([val, yearRange[1]]);
              }}
              style={{ width: '100%' }}
            />
            <input 
              type="range" 
              min={minYear} 
              max={maxYear} 
              value={yearRange[1]} 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > yearRange[0]) setYearRange([yearRange[0], val]);
              }}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ flex: '0 0 auto' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#555' }}>
            Metric
          </label>
          <div className="btn-group" style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
            <button 
              onClick={() => setMetric('both')}
              style={{ 
                padding: '8px 12px', 
                background: metric === 'both' ? '#007bff' : '#f8f9fa', 
                color: metric === 'both' ? 'white' : '#333',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Both
            </button>
            <button 
              onClick={() => setMetric('asr')}
              style={{ 
                padding: '8px 12px', 
                background: metric === 'asr' ? '#007bff' : '#f8f9fa', 
                color: metric === 'asr' ? 'white' : '#333',
                border: 'none',
                borderLeft: '1px solid #ddd',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Rate
            </button>
            <button 
              onClick={() => setMetric('count')}
              style={{ 
                padding: '8px 12px', 
                background: metric === 'count' ? '#007bff' : '#f8f9fa', 
                color: metric === 'count' ? 'white' : '#333',
                border: 'none',
                borderLeft: '1px solid #ddd',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Count
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="chart-wrapper" style={{ height: '400px', position: 'relative' }}>
        {loading && (
          <div style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(255,255,255,0.7)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 10 
          }}>
            <div className="spinner" style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #3498db', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }} />
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}
        <Line options={options as any} data={data} />
      </div>

      <div className="chart-footer" style={{ 
        marginTop: '15px', 
        paddingTop: '10px', 
        borderTop: '1px solid rgba(0,0,0,0.05)', 
        fontSize: '12px', 
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>* Drag to pan, scroll to zoom</span>
        <span>Source: AIHW Cancer Data in Australia 2023</span>
      </div>
    </div>
  );
};

export default CancerIncidenceChart;
