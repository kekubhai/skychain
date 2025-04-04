import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  timestamp: number;
}

interface CryptoState {
  data: Record<string, CryptoData>;
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
}

const initialState: CryptoState = {
  data: {},
  loading: false,
  error: null,
  wsConnected: false,
};

export const fetchCrypto = createAsyncThunk(
  'crypto/fetchCrypto',
  async (id: string) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}?x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}&localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
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
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload;
    },
    updateCryptoPrice: (state, action: PayloadAction<{ id: string; price: number; timestamp: number }>) => {
      const { id, price, timestamp } = action.payload;
      if (state.data[id]) {
        const oldPrice = state.data[id].price;
        const change24h = ((price - oldPrice) / oldPrice) * 100;
        state.data[id] = {
          ...state.data[id],
          price,
          change24h,
          timestamp,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrypto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCrypto.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.id] = action.payload;
      })
      .addCase(fetchCrypto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      });
  },
});

export const { setWsConnected, updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer; 