import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchCrypto } from '@/redux/slices/cryptoSlice';
import { format } from 'date-fns';

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  timestamp: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  name,
  symbol,
  price,
  change24h,
  marketCap,
  timestamp,
  isFavorite,
  onToggleFavorite,
}) => {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(fetchCrypto(id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(marketCap);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600">{symbol}</p>
        </div>
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
        <p className="text-4xl font-bold text-gray-900">{formatPrice(price)}</p>
        <p
          className={`text-lg mt-2 ${
            change24h >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}%
        </p>
        <p className="text-gray-600 mt-2">
          Market Cap: {formatMarketCap(marketCap)}
        </p>
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

export default CryptoCard; 