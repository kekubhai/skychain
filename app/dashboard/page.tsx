'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchWeather } from '@/redux/slices/weatherSlice';
import { fetchCrypto } from '@/redux/slices/cryptoSlice';
import { fetchNews } from '@/redux/slices/newsSlice';
import { toggleCityFavorite, toggleCryptoFavorite } from '@/redux/slices/favoritesSlice';
import { wsManager } from '@/utils/websocket';
import WeatherCard from '@/components/WeatherCard';
import CryptoCard from '@/components/CryptoCard';
import NewsCard from '@/components/NewsCard';
import FavoritesSection from '@/components/FavoritesSection';
import NotificationToast from '@/components/NotificationToast';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather);
  const crypto = useSelector((state: RootState) => state.crypto);
  const news = useSelector((state: RootState) => state.news);
  const favorites = useSelector((state: RootState) => state.favorites);
  const alerts = useSelector((state: RootState) => state.alerts.alerts);

  useEffect(() => {
    // Initial data fetch
    const cities = ['New York', 'London', 'Tokyo'];
    const cryptos = ['bitcoin', 'ethereum', 'dogecoin'];

    const fetchData = () => {
      cities.forEach((city) => dispatch(fetchWeather(city)));
      cryptos.forEach((crypto) => dispatch(fetchCrypto(crypto)));
      dispatch(fetchNews());
    };

    fetchData(); // Initial fetch
    wsManager.connect(); // Connect to WebSocket

    // Set up polling interval
    const interval = setInterval(fetchData, 60000);

    return () => {
      clearInterval(interval);
      wsManager.disconnect();
    };
  }, [dispatch]);

  // Show latest alert as a toast
  useEffect(() => {
    if (alerts.length > 0) {
      const latestAlert = alerts[alerts.length - 1];
      const toastType = latestAlert.type === 'price' ? 'info' : 'warning';
      <NotificationToast
        message={latestAlert.message}
        type={toastType}
      />;
    }
  }, [alerts]);

  const handleToggleCityFavorite = (city: string) => {
    dispatch(toggleCityFavorite(city));
  };

  const handleToggleCryptoFavorite = (id: string) => {
    dispatch(toggleCryptoFavorite(id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <NotificationToast message="Welcome to CryptoWeather Nexus!" type="info" />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">CryptoWeather Nexus</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Weather</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(weather.data).map(([city, data]) => (
              <WeatherCard
                key={city}
                city={city}
                temperature={data.temperature}
                humidity={data.humidity}
                conditions={data.conditions}
                timestamp={data.timestamp}
                isFavorite={favorites.cities[city] || false}
                onToggleFavorite={() => handleToggleCityFavorite(city)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cryptocurrency
            {crypto.wsConnected && (
              <span className="ml-2 text-sm text-green-600">● Live</span>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(crypto.data).map(([id, data]) => (
              <CryptoCard
                key={id}
                id={id}
                name={data.name}
                symbol={data.symbol}
                price={data.price}
                change24h={data.change24h}
                marketCap={data.marketCap}
                timestamp={data.timestamp}
                isFavorite={favorites.cryptos[id] || false}
                onToggleFavorite={() => handleToggleCryptoFavorite(id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.items.slice(0, 5).map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      <FavoritesSection />
    </div>
  );
};

export default Dashboard; 