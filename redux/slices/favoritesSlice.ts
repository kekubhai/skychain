import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: Record<string, boolean>;
  cryptos: Record<string, boolean>;
}

const initialState: FavoritesState = {
  cities: {},
  cryptos: {},
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleCityFavorite: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      state.cities[city] = !state.cities[city];
    },
    toggleCryptoFavorite: (state, action: PayloadAction<string>) => {
      const crypto = action.payload;
      state.cryptos[crypto] = !state.cryptos[crypto];
    },
    setCityFavorite: (state, action: PayloadAction<{ city: string; isFavorite: boolean }>) => {
      const { city, isFavorite } = action.payload;
      state.cities[city] = isFavorite;
    },
    setCryptoFavorite: (state, action: PayloadAction<{ crypto: string; isFavorite: boolean }>) => {
      const { crypto, isFavorite } = action.payload;
      state.cryptos[crypto] = isFavorite;
    },
  },
});

export const {
  toggleCityFavorite,
  toggleCryptoFavorite,
  setCityFavorite,
  setCryptoFavorite,
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 