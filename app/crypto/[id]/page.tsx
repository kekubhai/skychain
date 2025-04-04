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
      dispatch(fetchCrypto(id as string));
    }
  }, [dispatch, id]);

  if (!crypto) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: ['1h', '24h', '7d', '30d', '1y'],
    datasets: [
      {
        label: 'Price Change',
        data: [5, 10, 15, 20, 25], // Replace with actual data
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Price History',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {crypto.name} ({crypto.symbol})
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Price</h2>
              <p className="text-4xl font-bold text-gray-900">
                ${crypto.price.toLocaleString()}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">24h Change</h2>
              <p className={`text-3xl font-bold ${
                crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Cap</h2>
            <p className="text-2xl font-bold text-gray-900">
              ${crypto.marketCap.toLocaleString()}
            </p>
          </div>

          <div className="h-96">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail; 