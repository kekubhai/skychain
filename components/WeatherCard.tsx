import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchWeather } from '@/redux/slices/weatherSlice';
import { format } from 'date-fns';

interface WeatherCardProps {
  city: string;
  temperature: number;
  humidity: number;
  conditions: string;
  timestamp: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  humidity,
  conditions,
  timestamp,
  isFavorite,
  onToggleFavorite,
}) => {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(fetchWeather(city));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-800">{city}</h2>
        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full ${
            isFavorite ? 'text-yellow-500' : 'text-gray-400'
          } hover:bg-gray-100`}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="mt-4">
        <p className="text-4xl font-bold text-gray-900">{temperature}°C</p>
        <p className="text-gray-600 mt-2">Humidity: {humidity}%</p>
        <p className="text-gray-600">Conditions: {conditions}</p>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {format(new Date(timestamp), 'PPpp')}
        </p>
      </div>
      <button
        onClick={handleRefresh}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
};

export default WeatherCard; 