'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchWeather } from '@/redux/slices/weatherSlice';
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

const WeatherDetail: React.FC = () => {
  const { city } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather.data[city as string]);

  useEffect(() => {
    if (city) {
      dispatch(fetchWeather(city as string));
    }
  }, [dispatch, city]);

  if (!weather) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [15, 14, 16, 18, 20, 22, 21, 19], // Replace with actual data
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Humidity (%)',
        data: [60, 65, 70, 75, 70, 65, 60, 55], // Replace with actual data
        borderColor: 'rgb(54, 162, 235)',
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
        text: 'Weather History',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Weather in {city}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Temperature</h2>
              <p className="text-4xl font-bold text-gray-900">
                {weather.temperature}°C
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Humidity</h2>
              <p className="text-3xl font-bold text-gray-900">
                {weather.humidity}%
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Conditions</h2>
            <p className="text-2xl font-bold text-gray-900">
              {weather.conditions}
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

export default WeatherDetail; 