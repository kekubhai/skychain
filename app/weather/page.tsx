'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const WeatherPage: React.FC = () => {
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (city) {
      router.push(`/weather/${city}`);
    }
  };

  // Retro color themes for different weather conditions
  const weatherThemes = {
    default: {
      bg: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500',
      button: 'bg-amber-600 hover:bg-amber-700',
      card: 'bg-amber-50',
      text: 'text-amber-900',
    },
    sunny: {
      bg: 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500',
      button: 'bg-orange-600 hover:bg-orange-700',
      card: 'bg-yellow-50',
      text: 'text-yellow-900',
    },
    rainy: {
      bg: 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      card: 'bg-blue-50',
      text: 'text-blue-900',
    },
    cloudy: {
      bg: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
      button: 'bg-gray-600 hover:bg-gray-700',
      card: 'bg-gray-100',
      text: 'text-gray-900',
    },
    snowy: {
      bg: 'bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200',
      button: 'bg-cyan-600 hover:bg-cyan-700',
      card: 'bg-cyan-50',
      text: 'text-cyan-900',
    },
  };

  // Using default theme for the main page
  const theme = weatherThemes.default;

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-8 ${theme.bg} font-retro`}>
      {/* Retro CRT screen effect */}
      <div className="crt-effect fixed inset-0 pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Retro header with scan lines */}
        <div className="relative mb-12 p-4 bg-black bg-opacity-30 rounded-lg border-2 border-white border-opacity-50 overflow-hidden">
          <div className="scanlines absolute inset-0"></div>
          <h1 className={`text-6xl font-extrabold text-center ${theme.text} mb-2 font-vintage tracking-wider`}>
            WEATHER EXPLORER 3000
          </h1>
          <p className="text-center text-white text-opacity-80 font-mono">ENTER CITY NAME FOR CURRENT CONDITIONS</p>
        </div>

        {/* Search box with retro styling */}
        <div className={`relative p-8 rounded-lg ${theme.card} shadow-retro border-4 border-black mb-12`}>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="ENTER CITY NAME"
              className={`flex-1 p-4 rounded-lg text-lg ${theme.text} border-4 border-black focus:outline-none focus:ring-4 focus:ring-amber-400 font-mono uppercase placeholder-gray-500`}
              style={{ boxShadow: '4px 4px 0px #000' }}
            />
            <button
              onClick={handleSearch}
              className={`${theme.button} text-white font-bold py-4 px-8 rounded-lg border-4 border-black hover:translate-y-1 transition-transform font-vintage tracking-wider`}
              style={{ boxShadow: '4px 4px 0px #000' }}
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* Popular cities with retro cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['New York', 'London', 'Tokyo'].map((city) => (
            <div
              key={city}
              className={`${theme.card} p-6 rounded-lg border-4 border-black cursor-pointer transform hover:-translate-y-2 transition-all duration-200`}
              style={{ boxShadow: '8px 8px 0px #000' }}
              onClick={() => router.push(`/weather/${city.toLowerCase()}`)}
            >
              <h2 className={`text-2xl font-bold ${theme.text} mb-2 font-vintage`}>{city}</h2>
              <p className={`${theme.text} opacity-80 font-mono`}>CLICK FOR WEATHER DATA</p>
              <div className="mt-4 h-1 bg-black"></div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${theme.text} font-mono`}>STATUS: READY</span>
                <span className={`text-xs ${theme.text} font-mono`}>V.1.0.0</span>
              </div>
            </div>
          ))}
        </div>

        {/* Retro footer */}
        <div className="mt-12 text-center text-white text-opacity-70 font-mono text-sm">
          <p>© 1984 WEATHER SYSTEMS INTERNATIONAL</p>
          <p className="mt-1">ALL RIGHTS RESERVED</p>
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
          letter-spacing: 2px;
        }
        
        .shadow-retro {
          box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.2);
        }
        
        .crt-effect {
          background: 
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
            linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          background-size: 100% 4px;
          animation: scanline 8s linear infinite;
        }
        
        @keyframes scanline {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
      `}</style>
    </main>
  );
};

export default WeatherPage;