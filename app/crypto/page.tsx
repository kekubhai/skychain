// app/crypto/page.tsx
'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchCrypto } from '@/redux/slices/cryptoSlice';
import Link from 'next/link';

const CryptocurrencyDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.crypto);
  const topCryptos = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple'];

  useEffect(() => {
    dispatch(fetchCrypto(topCryptos));
  }, [dispatch]);

  // Retro color scheme
  const retroColors = {
    bg: 'bg-gradient-to-br from-amber-900 to-gray-900',
    card: 'bg-amber-100 border-4 border-amber-800',
    text: 'text-amber-900',
    accent: 'bg-amber-600',
    highlight: 'text-amber-400',
    positive: 'text-green-600',
    negative: 'text-red-600'
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-8 ${retroColors.bg} font-mono text-white`}>
        <div className="text-center text-2xl">LOADING CRYPTO DATA...</div>
        <div className="text-center mt-4 animate-pulse">■ ■ ■ ■ ■</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-8 ${retroColors.bg} font-mono`}>
        <div className={`${retroColors.card} p-6 rounded-lg max-w-2xl mx-auto`}>
          <h1 className={`text-2xl font-bold ${retroColors.text} mb-4`}>ERROR</h1>
          <p className={retroColors.text}>{error}</p>
          <button
            onClick={() => dispatch(fetchCrypto(topCryptos))}
            className={`mt-4 px-4 py-2 ${retroColors.accent} text-white`}
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${retroColors.bg} font-mono`}>
      {/* CRT Screen Effect */}
      <div className="crt-effect fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${retroColors.card} p-6 mb-8 rounded-lg shadow-retro`}>
          <h1 className={`text-4xl font-bold ${retroColors.text} mb-2`}>
            <span className={retroColors.highlight}>■</span> CRYPTO TERMINAL <span className={retroColors.highlight}>■</span>
          </h1>
          <div className="flex justify-between items-center">
            <p className={`text-sm ${retroColors.text}`}>LIVE MARKET DATA</p>
            <p className={`text-sm ${retroColors.text}`}>v1.0.0</p>
          </div>
        </div>

        {/* Crypto Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(data).map((crypto) => (
            <div key={crypto.id} className={`${retroColors.card} p-6 rounded-lg border-2 border-black`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name}
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <h2 className={`text-xl font-bold ${retroColors.text}`}>{crypto.name.toUpperCase()}</h2>
                    <p className={`text-sm ${retroColors.text}`}>{crypto.symbol.toUpperCase()}</p>
                    <Link
              href={`/crypto/${crypto.id}`}
              className={`mt-4 w-full block text-center px-4 py-2 ${retroColors.accent} text-white hover:bg-amber-700 transition-colors`}
            >
              VIEW DETAILS
            </Link>
                  </div>
                </div>
                <span className={`px-2 py-1 ${retroColors.accent} text-white text-xs`}>
                  #{crypto.market_cap_rank}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className={`text-xs ${retroColors.text}`}>PRICE</p>
                  <p className={`text-2xl font-bold ${retroColors.text}`}>
                    ${crypto.current_price.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-xs ${retroColors.text}`}>24H CHANGE</p>
                    <p className={`text-lg font-bold ${
                      crypto.price_change_percentage_24h >= 0 
                        ? retroColors.positive 
                        : retroColors.negative
                    }`}>
                      {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${retroColors.text}`}>24H VOLUME</p>
                    <p className={`text-sm ${retroColors.text}`}>
                      ${crypto.total_volume.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className={`text-xs ${retroColors.text}`}>MARKET CAP</p>
                  <p className={`text-lg ${retroColors.text}`}>
                    ${crypto.market_cap.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className={`${retroColors.card} p-3 mt-8 text-center text-xs ${retroColors.text}`}>
          LAST UPDATED: {new Date().toLocaleString()} | SOURCE: COINGECKO API
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
      `}</style>
    </div>
  );
};

export default CryptocurrencyDashboard;