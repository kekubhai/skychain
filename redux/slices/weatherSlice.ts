import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addAlert } from './alertSlice';

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  conditions: string;
  timestamp: number;
}

interface WeatherState {
  data: Record<string, WeatherData>;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: {},
  loading: false,
  error: null,
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string, { dispatch, getState }) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );

    const newData = {
      city,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      conditions: response.data.weather[0].main,
      timestamp: Date.now(),
    };

    // Check for extreme weather conditions
    if (newData.temperature > 35) {
      dispatch(
        addAlert({
          type: 'weather',
          message: `High temperature alert in ${city}: ${newData.temperature}°C`,
        })
      );
    } else if (newData.temperature < 0) {
      dispatch(
        addAlert({
          type: 'weather',
          message: `Low temperature alert in ${city}: ${newData.temperature}°C`,
        })
      );
    }

    if (newData.humidity > 80) {
      dispatch(
        addAlert({
          type: 'weather',
          message: `High humidity alert in ${city}: ${newData.humidity}%`,
        })
      );
    }

    // Compare with previous data
    const state = getState() as any;
    const prevData = state.weather.data[city];
    if (prevData) {
      const tempChange = Math.abs(newData.temperature - prevData.temperature);
      if (tempChange >= 5) {
        dispatch(
          addAlert({
            type: 'weather',
            message: `Significant temperature change in ${city}: ${tempChange.toFixed(1)}°C`,
          })
        );
      }
    }

    return newData;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.city] = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export default weatherSlice.reducer; 