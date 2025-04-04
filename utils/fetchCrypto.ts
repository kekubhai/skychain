import axios from 'axios';

interface CryptoResponse {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  timestamp: number;
}

export const fetchCryptoData = async (id: string): Promise<CryptoResponse> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    return {
      id: response.data.id,
      name: response.data.name,
      symbol: response.data.symbol.toUpperCase(),
      price: response.data.market_data.current_price.usd,
      change24h: response.data.market_data.price_change_percentage_24h,
      marketCap: response.data.market_data.market_cap.usd,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw new Error('Failed to fetch crypto data');
  }
}; 