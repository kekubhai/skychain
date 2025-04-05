'use client';

import { useState, useEffect } from 'react';

// Use environment variables properly
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const COINGECKO_API = process.env.
NEXT_PUBLIC_COINGECKO_API_KEY;
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

// Types with optional properties for safety
type WeatherData = {
  name?: string;
  main?: { temp?: number };
  weather?: { main?: string }[];
};

type CryptoData = {
  id?: string;
  name?: string;
  current_price?: number;
  price_change_percentage_24h?: number;
}[];

type NewsData = {
  title?: string;
  description?: string;
  url?: string;
}[];

export default function RetroDashboard() {
  const [activeTab, setActiveTab] = useState<'weather' | 'crypto' | 'news'>('weather');
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [crypto, setCrypto] = useState<CryptoData>([]);
  const [news, setNews] = useState<NewsData>([]);
  const [loading, setLoading] = useState({
    weather: true,
    crypto: true,
    news: true
  });
  const [errors, setErrors] = useState<{
    weather: string | null,
    crypto: string | null,
    news: string | null
  }>({
    weather: null,
    crypto: null,
    news: null
  });

  // Fetch Weather Data
  useEffect(() => {
    if (activeTab !== 'weather') return;
    
    // Reset state
    setLoading(prev => ({ ...prev, weather: true }));
    setErrors(prev => ({ ...prev, weather: null }));
    
    // Check if API key exists
    if (!WEATHER_API_KEY) {
      setErrors(prev => ({ ...prev, weather: "Weather API key not configured" }));
      setLoading(prev => ({ ...prev, weather: false }));
      return;
    }
    
    const cities = ['New York', 'London', 'Tokyo'];
    Promise.all(
      cities.map(city =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${WEATHER_API_KEY}`)
          .then(res => {
            if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
            return res.json();
          })
          .catch(error => {
            console.error(`Error fetching weather for ${city}:`, error);
            return { name: city, error: true };
          })
      )
    )
    .then(data => {
      setWeather(data.filter(item => !item.error));
      setLoading(prev => ({ ...prev, weather: false }));
    })
    .catch(error => {
      console.error("Weather fetch error:", error);
      setErrors(prev => ({ ...prev, weather: error.message }));
      setLoading(prev => ({ ...prev, weather: false }));
    });
  }, [activeTab]);

  // Fetch Crypto Data
  useEffect(() => {
    if (activeTab !== 'crypto') return;
    
    setLoading(prev => ({ ...prev, crypto: true }));
    setErrors(prev => ({ ...prev, crypto: null }));

    fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,dogecoin`)
      .then(res => {
        if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCrypto(data);
        setLoading(prev => ({ ...prev, crypto: false }));
      })
      .catch(error => {
        console.error("Crypto fetch error:", error);
        setErrors(prev => ({ ...prev, crypto: error.message }));
        setLoading(prev => ({ ...prev, crypto: false }));
      });
  }, [activeTab]);

  // Fetch News Data
  useEffect(() => {
    if (activeTab !== 'news') return;
    
    setLoading(prev => ({ ...prev, news: true }));
    setErrors(prev => ({ ...prev, news: null }));
    
    // Check if API key exists
    if (!NEWS_API_KEY) {
      setErrors(prev => ({ ...prev, news: "News API key not configured" }));
      setLoading(prev => ({ ...prev, news: false }));
      return;
    }

    fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error(`News API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setNews(data.articles?.slice(0, 3) || []);
        setLoading(prev => ({ ...prev, news: false }));
      })
      .catch(error => {
        console.error("News fetch error:", error);
        setErrors(prev => ({ ...prev, news: error.message }));
        setLoading(prev => ({ ...prev, news: false }));
      });
  }, [activeTab]);

  // Tab Components with error handling
  const WeatherTab = () => (
    <div className="bg-yellow-50 p-6 border-2 border-black">
      <h3 className="text-2xl font-bold mb-4">🌤️ WEATHER WIRE</h3>
      {loading.weather ? (
        <p className="text-center">📡 TUNING THE WEATHER SATELLITE...</p>
      ) : errors.weather ? (
        <p className="text-center text-red-600">⚠️ SATELLITE ERROR: {errors.weather}</p>
      ) : weather.length === 0 ? (
        <p className="text-center">NO WEATHER DATA AVAILABLE</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {weather.map((city, i) => (
            <div key={i} className="bg-white p-3 border-2 border-black">
              <h4 className="font-bold">{city.name || 'Unknown'}</h4>
              <p>{city.weather?.[0]?.main || 'No data'}</p>
              <p>🌡️ {city.main?.temp !== undefined ? Math.round(city.main.temp) : 'N/A'}°F</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CryptoTab = () => (
    <div className="bg-yellow-50 p-6 border-2 border-black">
      <h3 className="text-2xl font-bold mb-4">💲 CRYPTO CHRONICLES</h3>
      {loading.crypto ? (
        <p className="text-center">⏳ MINING BLOCKCHAIN DATA...</p>
      ) : errors.crypto ? (
        <p className="text-center text-red-600">⚠️ BLOCKCHAIN ERROR: {errors.crypto}</p>
      ) : crypto.length === 0 ? (
        <p className="text-center">NO CRYPTO DATA AVAILABLE</p>
      ) : (
        <div className="space-y-3">
          {crypto.map((coin, idx) => (
            <div key={idx} className="flex justify-between border-b-2 border-dashed border-black pb-2">
              <span className="font-bold">{coin.name?.toUpperCase() || 'Unknown'}</span>
              <span>${coin.current_price?.toLocaleString() || 'N/A'}</span>
              <span className={(coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-700' : 'text-red-700'}>
                {(coin.price_change_percentage_24h || 0) >= 0 ? '↑' : '↓'} {Math.abs(coin.price_change_percentage_24h || 0).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const NewsTab = () => (
    <div className="bg-yellow-50 p-6 border-2 border-black">
      <h3 className="text-2xl font-bold mb-4">📰 THE DAILY BUGLE</h3>
      {loading.news ? (
        <p className="text-center">🖨️ PRINTING HEADLINES...</p>
      ) : errors.news ? (
        <p className="text-center text-red-600">⚠️ PRINTING ERROR: {errors.news}</p>
      ) : news.length === 0 ? (
        <p className="text-center">NO NEWS ARTICLES AVAILABLE</p>
      ) : (
        <div className="space-y-4">
          {news.map((article, i) => (
            <div key={i} className="border-b-2 border-dashed border-black pb-2">
              <p className="font-bold">BREAKING:</p>
              <p>{article.title || 'No headline available'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rest of the component remains the same
  return (
    <div className="min-h-screen bg-amber-50 font-serif">
      {/* Scan lines overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '100% 4px',
      }}></div>

      {/* Header */}
      <header className="bg-red-700 text-white p-4 border-b-4 border-black">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            CRYPTOWEATHER <span className="text-yellow-300">NEXUS</span>
          </h1>
          <p className="text-center mt-2">YOUR DAILY DOSE OF DIGITAL & ATMOSPHERIC CHAOS</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex border-b-2 border-black">
          {[
            { id: 'weather', label: '🌤️ WEATHER' },
            { id: 'crypto', label: '💲 CRYPTO' },
            { id: 'news', label: '📰 NEWS' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-bold ${activeTab === tab.id ? 'bg-yellow-300 border-t-2 border-l-2 border-r-2 border-black' : 'bg-yellow-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'weather' && <WeatherTab />}
        {activeTab === 'crypto' && <CryptoTab />}
        {activeTab === 'news' && <NewsTab />}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-4 text-center border-t-4 border-red-700 mt-8">
        <p>© 1987 CRYPTOWEATHER NEXUS | THE FUTURE IS NOW</p>
        <p className="text-xs mt-2">Printed with 🖨️ in New York, NY</p>
      </footer>
    </div>
  );
}