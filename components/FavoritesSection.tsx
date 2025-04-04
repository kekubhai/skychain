import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import WeatherCard from './WeatherCard';
import CryptoCard from './CryptoCard';

const FavoritesSection: React.FC = () => {
  const favorites = useSelector((state: RootState) => state.favorites);
  const weather = useSelector((state: RootState) => state.weather.data);
  const crypto = useSelector((state: RootState) => state.crypto.data);

  const favoriteCities = Object.keys(favorites.cities).filter(
    (city) => favorites.cities[city]
  );
  const favoriteCryptos = Object.keys(favorites.cryptos).filter(
    (crypto) => favorites.cryptos[crypto]
  );

  if (favoriteCities.length === 0 && favoriteCryptos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Favorites</h2>
        <p className="text-gray-600">No favorites added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Favorites</h2>
      
      {favoriteCities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Favorite Cities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCities.map((city) => (
              <WeatherCard
                key={city}
                city={city}
                temperature={weather[city]?.temperature || 0}
                humidity={weather[city]?.humidity || 0}
                conditions={weather[city]?.conditions || ''}
                timestamp={weather[city]?.timestamp || 0}
                isFavorite={true}
                onToggleFavorite={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {favoriteCryptos.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Favorite Cryptos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCryptos.map((cryptoId) => {
              const cryptoData = crypto[cryptoId];
              if (!cryptoData) return null;
              
              return (
                <CryptoCard
                  key={cryptoId}
                  id={cryptoId}
                  name={cryptoData.name}
                  symbol={cryptoData.symbol}
                  price={cryptoData.price}
                  change24h={cryptoData.change24h}
                  marketCap={cryptoData.marketCap}
                  timestamp={cryptoData.timestamp}
                  isFavorite={true}
                  onToggleFavorite={() => {}}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection; 