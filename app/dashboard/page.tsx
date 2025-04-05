'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchWeather } from '@/redux/slices/weatherSlice';
import { fetchCrypto } from '@/redux/slices/cryptoSlice';
import { fetchNews } from '@/redux/slices/newsSlice';
import { toggleCityFavorite, toggleCryptoFavorite } from '@/redux/slices/favoritesSlice';
import { wsManager } from '@/utils/websocket';

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

    fetchData();
    wsManager.connect();

    const interval = setInterval(fetchData, 60000);
    return () => {
      clearInterval(interval);
      wsManager.disconnect();
    };
  }, [dispatch]);

  // Retro color themes
  const retroColors = {
    bg: 'bg-gradient-to-br from-amber-900 to-gray-900',
    card: 'bg-amber-100 border-4 border-amber-800',
    text: 'text-amber-900',
    accent: 'bg-amber-600',
    highlight: 'text-amber-400'
  };

  return (
    <div className={`min-h-screen p-4 ${retroColors.bg} font-mono`}>
      {/* CRT Screen Effect */}
      <div className="crt-effect fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${retroColors.card} p-6 mb-8 rounded-lg shadow-retro`}>
          <h1 className={`text-4xl font-bold ${retroColors.text} mb-2`}>
            <span className={retroColors.highlight}>■</span> NEXUS TERMINAL <span className={retroColors.highlight}>■</span>
          </h1>
          <div className="flex justify-between items-center">
            <p className={`text-sm ${retroColors.text}`}>SYSTEM STATUS: ONLINE</p>
            <p className={`text-sm ${retroColors.text}`}>v1.0.0</p>
          </div>
        </div>

        {/* Weather Section */}
        <div className={`${retroColors.card} p-6 mb-8 rounded-lg`}>
          <h2 className={`text-2xl font-bold ${retroColors.text} mb-4 border-b-2 border-amber-800 pb-2`}>
            WEATHER SYSTEMS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(weather.data).map(([city, data]) => {
  const weatherData = data as{ temperature: number; humidity: number; conditions: string; timestamp: string };
  return (
                <div key={city} className={`${retroColors.card} p-4 rounded border-2 border-black`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-xl font-bold ${retroColors.text}`}>{city.toUpperCase()}</h3>
                    <button 
                      onClick={() => dispatch(toggleCityFavorite(city))}
                      className={`px-2 py-1 ${retroColors.accent} text-white text-xs`}
                    >
                      {favorites.cities[city] ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs">TEMP</p>
                      <p className={`text-2xl font-bold ${retroColors.text}`}>{weatherData.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-xs">HUMIDITY</p>
                      <p className={`text-xl ${retroColors.text}`}>{weatherData.humidity}%</p>
                    </div>
                    <div>
                      <p className="text-xs">CONDITION</p>
                      <p className={`text-sm ${retroColors.text}`}>{weatherData.conditions}</p>
                    </div>
                    <div>
                      <p className="text-xs">UPDATED</p>
                      <p className={`text-xs ${retroColors.text}`}>
                        {new Date(Number(weatherData.timestamp)).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crypto Section */}
        <div className={`${retroColors.card} p-6 mb-8 rounded-lg`}>
          <h2 className={`text-2xl font-bold ${retroColors.text} mb-4 border-b-2 border-amber-800 pb-2`}>
            CRYPTO MARKETS {crypto.wsConnected && <span className="text-green-600 text-sm">● LIVE</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(crypto.data).map(([id, data]) => (
              <div key={id} className={`${retroColors.card} p-4 rounded border-2 border-black`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`text-xl font-bold ${retroColors.text}`}>{data.name}</h3>
                    <p className={`text-sm ${retroColors.text}`}>{data.symbol}</p>
                  </div>
                  <button 
                    onClick={() => dispatch(toggleCryptoFavorite(id))}
                    className={`px-2 py-1 ${retroColors.accent} text-white text-xs`}
                  >
                    {favorites.cryptos[id] ? '★' : '☆'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs">PRICE</p>
                    <p className={`text-xl font-bold ${retroColors.text}`}>${data.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs">24H CHANGE</p>
                    <p className={`text-lg ${data.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.change24h >= 0 ? '+' : ''}{data.change24h}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">MARKET CAP</p>
                    <p className={`text-sm ${retroColors.text}`}>${(data.marketCap / 1000000000).toFixed(2)}B</p>
                  </div>
                  <div>
                    <p className="text-xs">UPDATED</p>
                    <p className={`text-xs ${retroColors.text}`}>
                      {new Date(data.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div className={`${retroColors.card} p-6 mb-8 rounded-lg`}>
          <h2 className={`text-2xl font-bold ${retroColors.text} mb-4 border-b-2 border-amber-800 pb-2`}>
            NEWS WIRE
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {news.items.slice(0, 3).map((item) => (
              <div key={item.id} className={`${retroColors.card} p-4 rounded border-2 border-black`}>
                <h3 className={`text-lg font-bold ${retroColors.text} mb-2`}>{item.title}</h3>
                <p className={`text-sm ${retroColors.text} mb-3`}>{item.description}</p>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-xs ${retroColors.accent} text-white px-3 py-1 inline-block`}
                >
                  READ MORE
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className={`${retroColors.card} p-3 text-center text-xs ${retroColors.text}`}>
          SYSTEM TIME: {new Date().toLocaleString()} | DATA SOURCE: API CONNECTED
        </div>
      </div>

      {/* Global styles for retro effects */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        body {
          font-family: 'VT323', monospace;
          letter-spacing: 1px;
        }
        
        .crt-effect {
          background: 
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
            linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .shadow-retro {
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
        }
        
        .font-mono {
          font-family: 'VT323', monospace;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;