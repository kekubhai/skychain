'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchCrypto } from '@/redux/slices/cryptoSlice';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CryptoDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const crypto = useSelector((state: RootState) => state.crypto.data[id as string]);

  useEffect(() => {
    if (id) {
      dispatch(fetchCrypto([id as string]));
    }
  }, [dispatch, id]);

  if (!crypto) {
    return <div className="text-amber-400 font-mono text-xl bg-black p-8">Loading...</div>;
  }

  const chartData = {
    labels: ['1h', '24h', '7d', '30d', '1y'],
    datasets: [
      {
        label: 'Price Change',
        data: [5, 10, 15, 20, 25], // Replace with actual data
        borderColor: '#f59e0b',
        tension: 0.1,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'monospace',
          },
          color: '#f59e0b',
        }
      },
      title: {
        display: true,
        text: 'Price History',
        font: {
          family: 'monospace',
          size: 20,
        },
        color: '#f59e0b',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#f59e0b',
          font: {
            family: 'monospace',
          },
        },
        grid: {
          color: 'rgba(245, 158, 11, 0.1)',
        }
      },
      y: {
        ticks: {
          color: '#f59e0b',
          font: {
            family: 'monospace',
          },
        },
        grid: {
          color: 'rgba(245, 158, 11, 0.1)',
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 font-mono relative overflow-hidden">
      {/* Retro scan lines effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black opacity-20 pointer-events-none" 
           style={{backgroundSize: '100% 4px'}}></div>
      
      {/* CRT screen curvature effect */}
      <div className="absolute inset-0 border-4 border-amber-400 rounded-lg pointer-events-none opacity-10"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-black border-2 border-amber-400 rounded-lg shadow-lg shadow-amber-400/20 p-6 mb-8">
          {/* Retro header with underline */}
          <div className="mb-6 pb-4 border-b-2 border-amber-400">
            <h1 className="text-3xl font-bold text-amber-400 mb-1">
              {crypto?.name || 'Unknown'} ({crypto?.symbol || '?'})
            </h1>
            <div className="h-1 bg-gradient-to-r from-amber-400 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black border border-amber-400 p-4 rounded">
              <h2 className="text-xl font-semibold text-amber-300 mb-2">Current Price</h2>
              <p className="text-4xl font-bold text-amber-400">
                ${crypto?.current_price ? crypto.current_price.toLocaleString() : 'N/A'}
              </p>
            </div>
            
            <div className="bg-black border border-amber-400 p-4 rounded">
              <h2 className="text-xl font-semibold text-amber-300 mb-2">24h Change</h2>
              <p className={`text-3xl font-bold ${
                (crypto?.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(crypto?.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                {crypto?.price_change_percentage_24h !== undefined ? crypto.price_change_percentage_24h.toFixed(2) : 'N/A'}%
              </p>
            </div>
          </div>

          <div className="mb-8 bg-black border border-amber-400 p-4 rounded">
            <h2 className="text-xl font-semibold text-amber-300 mb-4">Market Cap</h2>
            <p className="text-2xl font-bold text-amber-400">
              ${crypto?.market_cap ? crypto.market_cap.toLocaleString() : 'N/A'}
            </p>
          </div>

          <div className="h-96 bg-black/50 border border-amber-400 p-4 rounded">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;