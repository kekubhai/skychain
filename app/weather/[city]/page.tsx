'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchWeather,  } from '@/redux/slices/weatherSlice';

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
  const historicalData = useSelector((state: RootState) => state.weather.historicalData[city as string]);

  // Determine weather type for theme
  const getWeatherType = () => {
    if (!weather) return 'default';
    const conditions = weather.conditions.toLowerCase();
    if (conditions.includes('rain')) return 'rainy';
    if (conditions.includes('sun') || conditions.includes('clear')) return 'sunny';
    if (conditions.includes('cloud')) return 'cloudy';
    if (conditions.includes('snow')) return 'snowy';
    return 'default';
  };

  const weatherType = getWeatherType();

  // Retro color themes for different weather conditions
  const weatherThemes = {
    default: {
      bg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      card: 'bg-amber-100 border-amber-800',
      text: 'text-amber-900',
      accent: 'bg-amber-600',
      chartBg: 'rgba(245, 158, 11, 0.2)',
    },
    sunny: {
      bg: 'bg-gradient-to-br from-yellow-300 to-yellow-600',
      card: 'bg-yellow-100 border-yellow-800',
      text: 'text-yellow-900',
      accent: 'bg-yellow-600',
      chartBg: 'rgba(234, 179, 8, 0.2)',
    },
    rainy: {
      bg: 'bg-gradient-to-br from-blue-400 to-indigo-700',
      card: 'bg-blue-100 border-blue-800',
      text: 'text-blue-900',
      accent: 'bg-blue-600',
      chartBg: 'rgba(59, 130, 246, 0.2)',
    },
    cloudy: {
      bg: 'bg-gradient-to-br from-gray-300 to-gray-600',
      card: 'bg-gray-100 border-gray-800',
      text: 'text-gray-900',
      accent: 'bg-gray-600',
      chartBg: 'rgba(156, 163, 175, 0.2)',
    },
    snowy: {
      bg: 'bg-gradient-to-br from-cyan-200 to-blue-400',
      card: 'bg-cyan-100 border-cyan-800',
      text: 'text-cyan-900',
      accent: 'bg-cyan-600',
      chartBg: 'rgba(6, 182, 212, 0.2)',
    },
  };

  const theme = weatherThemes[weatherType];

  useEffect(() => {
    if (city) {
      dispatch(fetchWeather(city as string));
      dispatch(fetchHistoricalWeather(city as string));
    }
  }, [dispatch, city]);

  if (!weather || !historicalData) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center font-retro`}>
        <div className={`${theme.card} p-8 rounded-lg border-4 border-black shadow-retro`}>
          <h1 className={`text-3xl font-bold ${theme.text} mb-4 font-vintage`}>LOADING DATA...</h1>
          <div className="animate-pulse flex space-x-4">
            <div className={`flex-1 py-2 rounded ${theme.accent}`}></div>
          </div>
        </div>
      </div>
    );
  }

  // Process historical data for chart
  const chartData = {
    labels: historicalData.dates || ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.temperatures || [15, 14, 16, 18, 20, 22, 21, 19],
        borderColor: theme.text,
        backgroundColor: theme.chartBg,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: theme.text,
      },
      {
        label: 'Humidity (%)',
        data: historicalData.humidity || [60, 65, 70, 75, 70, 65, 60, 55],
        borderColor: theme.accent,
        backgroundColor: theme.chartBg,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: theme.accent,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: '"VT323", monospace',
            size: 16,
          },
          color: theme.text,
        },
      },
      title: {
        display: true,
        text: 'WEATHER HISTORY DATA',
        font: {
          family: '"Press Start 2P", cursive',
          size: 14,
        },
        color: theme.text,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.text,
          font: {
            family: '"VT323", monospace',
            size: 14,
          },
        },
        grid: {
          color: `${theme.text}50`,
        },
      },
      y: {
        ticks: {
          color: theme.text,
          font: {
            family: '"VT323", monospace',
            size: 14,
          },
        },
        grid: {
          color: `${theme.text}50`,
        },
      },
    },
  };

  return (
    <div className={`min-h-screen ${theme.bg} p-4 md:p-8 font-retro`}>
      {/* CRT screen effect */}
      <div className="crt-effect fixed inset-0 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Main weather card */}
        <div className={`${theme.card} rounded-lg border-4 border-black shadow-retro p-6 mb-8`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className={`text-4xl font-bold ${theme.text} mb-4 md:mb-0 font-vintage tracking-wider`}>
              {city.toString().toUpperCase()} WEATHER
            </h1>
            <div className={`${theme.accent} text-white px-4 py-2 rounded border-2 border-black font-vintage`}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
            </div>
          </div>
          
          {/* Current weather stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${theme.card} p-4 rounded border-2 border-black`}>
              <h2 className={`text-xl font-semibold ${theme.text} mb-2 font-vintage`}>TEMPERATURE</h2>
              <p className={`text-5xl font-bold ${theme.text}`}>
                {weather.temperature}°C
              </p>
              <div className="h-1 w-full bg-black my-2"></div>
              <p className={`text-sm ${theme.text}`}>FEELS LIKE {weather.feelsLike}°C</p>
            </div>
            
            <div className={`${theme.card} p-4 rounded border-2 border-black`}>
              <h2 className={`text-xl font-semibold ${theme.text} mb-2 font-vintage`}>HUMIDITY</h2>
              <p className={`text-5xl font-bold ${theme.text}`}>
                {weather.humidity}%
              </p>
              <div className="h-1 w-full bg-black my-2"></div>
              <p className={`text-sm ${theme.text}`}>DEW POINT {weather.dewPoint}°C</p>
            </div>
            
            <div className={`${theme.card} p-4 rounded border-2 border-black`}>
              <h2 className={`text-xl font-semibold ${theme.text} mb-2 font-vintage`}>CONDITIONS</h2>
              <p className={`text-3xl font-bold ${theme.text}`}>
                {weather.conditions.toUpperCase()}
              </p>
              <div className="h-1 w-full bg-black my-2"></div>
              <p className={`text-sm ${theme.text}`}>WIND: {weather.windSpeed} KM/H</p>
            </div>
          </div>

          {/* Historical data chart */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold ${theme.text} mb-4 font-vintage`}>HISTORICAL DATA</h2>
            <div className="h-96 p-4 bg-black bg-opacity-10 rounded border-2 border-black">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Additional weather data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${theme.card} p-4 rounded border-2 border-black`}>
              <h2 className={`text-xl font-semibold ${theme.text} mb-2 font-vintage`}>24H FORECAST</h2>
              <div className="grid grid-cols-3 gap-2">
                {['MORNING', 'AFTERNOON', 'EVENING'].map((time) => (
                  <div key={time} className="text-center">
                    <p className={`font-bold ${theme.text}`}>{time}</p>
                    <p className={`text-sm ${theme.text}`}>25°C</p> {/* Replace with actual forecast */}
                    <p className={`text-xs ${theme.text}`}>SUNNY</p> {/* Replace with actual forecast */}
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`${theme.card} p-4 rounded border-2 border-black`}>
              <h2 className={`text-xl font-semibold ${theme.text} mb-2 font-vintage`}>AIR QUALITY</h2>
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full ${theme.accent} flex items-center justify-center mr-4`}>
                  <span className="text-white font-bold">85</span>
                </div>
                <div>
                  <p className={`font-bold ${theme.text}`}>MODERATE</p>
                  <p className={`text-sm ${theme.text}`}>PM2.5: 12.3 μg/m³</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Retro footer */}
        <div className={`text-center ${theme.text} opacity-70 font-mono text-sm`}>
          <p>© 2023 WEATHER TERMINAL v1.2.5</p>
          <p className="mt-1">DATA REFRESHED: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Global styles for retro effects */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
        .font-retro {
          font-family: 'VT323', monospace;
        }
        
        .font-vintage {
          font-family: 'Press Start 2P', cursive;
          letter-spacing: 1px;
        }
        
        .shadow-retro {
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
        }
        
        .crt-effect {
          background: 
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
            linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default WeatherDetail;