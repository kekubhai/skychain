import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchWeather } from '@/redux/slices/weatherSlice';
import { format, isValid } from 'date-fns';
import { AppDispatch } from '@/redux/store';

interface WeatherCardProps {
  city: string;
  temperature?: number | null;
  humidity?: number | null;
  conditions?: string;
  timestamp?: string | number | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city = 'Unknown Location',
  temperature = null,
  humidity = null,
  conditions = 'No data',
  timestamp = null,
  isFavorite = false,
  onToggleFavorite = () => {},
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRefresh = () => {
    if (city && city !== 'Unknown Location') {
      dispatch(fetchWeather(city));
    }
  };

  // Format the timestamp safely
  const formatTimestamp = () => {
    if (!timestamp) return 'Unknown';
    
    try {
      const date = new Date(timestamp);
      return isValid(date) && !isNaN(date.getTime()) ? format(date, 'PPpp') : 'Unknown';
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-800">{city || 'Unknown Location'}</h2>
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
        <p className="text-4xl font-bold text-gray-900">
          {temperature !== null && temperature !== undefined ? `${temperature}°C` : 'N/A'}
        </p>
        <p className="text-gray-600 mt-2">
          Humidity: {humidity !== null && humidity !== undefined ? `${humidity}%` : 'N/A'}
        </p>
        <p className="text-gray-600">Conditions: {conditions || 'Unknown'}</p>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {formatTimestamp()}
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