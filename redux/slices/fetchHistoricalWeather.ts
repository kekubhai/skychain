// src/redux/slices/weatherSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// API configuration
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

// Type definitions
interface CurrentWeather {
  temp_c: number;
  humidity: number;
  condition: {
    text: string;
    icon: string;
  };
  feelslike_c: number;
  wind_kph: number;
  last_updated: string;
}

interface HourlyForecast {
  time: string;
  temp_c: number;
  humidity: number;
  condition: {
    text: string;
  };
}

interface ForecastDay {
  date: string;
  hour: HourlyForecast[];
}

interface WeatherApiResponse {
  current: CurrentWeather;
  forecast?: {
    forecastday: ForecastDay[];
  };
}

interface NormalizedCurrentWeather {
  temperature: number;
  humidity: number;
  conditions: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
  lastUpdated: string;
}

interface NormalizedHistoricalData {
  date: string;
  hourlyData: {
    time: string;
    temperature: number;
    humidity: number;
    condition: string;
  }[];
}

interface WeatherState {
  current: {
    [city: string]: NormalizedCurrentWeather;
  };
  historical: {
    [city: string]: NormalizedHistoricalData;
  };
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  current: {},
  historical: {},
  loading: false,
  error: null,
};

// Thunk for fetching current weather
export const fetchWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<WeatherApiResponse>(
        `${BASE_URL}/current.json`,
        {
          params: {
            key: WEATHER_API_KEY,
            q: city,
            aqi: 'no',
          },
        }
      );

      return {
        city,
        data: {
          temperature: response.data.current.temp_c,
          humidity: response.data.current.humidity,
          conditions: response.data.current.condition.text,
          icon: response.data.current.condition.icon,
          feelsLike: response.data.current.feelslike_c,
          windSpeed: response.data.current.wind_kph,
          lastUpdated: response.data.current.last_updated,
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message || 'Failed to fetch current weather'
        );
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

// Thunk for fetching historical weather
export const fetchHistoricalWeather = createAsyncThunk(
  'weather/fetchHistorical',
  async (city: string, { rejectWithValue }) => {
    try {
      // Get yesterday's date in YYYY-MM-DD format
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateString = yesterday.toISOString().split('T')[0];

      const response = await axios.get<WeatherApiResponse>(
        `${BASE_URL}/history.json`,
        {
          params: {
            key: WEATHER_API_KEY,
            q: city,
            dt: dateString,
            hour: '0,3,6,9,12,15,18,21', 
          },
        }
      );

      const forecastDay = response.data.forecast?.forecastday[0];
      if (!forecastDay) {
        throw new Error('No historical data available');
      }

      return {
        city,
        data: {
          date: forecastDay.date,
          hourlyData: forecastDay.hour.map((hour) => ({
            time: hour.time.split(' ')[1], // Extract just the time part
            temperature: hour.temp_c,
            humidity: hour.humidity,
            condition: hour.condition.text,
          })),
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message || 'Failed to fetch historical weather'
        );
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Current weather reducers
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWeather.fulfilled,
        (
          state,
          action: PayloadAction<{
            city: string;
            data: NormalizedCurrentWeather;
          }>
        ) => {
          state.loading = false;
          state.current[action.payload.city] = action.payload.data;
        }
      )
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Historical weather reducers
      .addCase(fetchHistoricalWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHistoricalWeather.fulfilled,
        (
          state,
          action: PayloadAction<{
            city: string;
            data: NormalizedHistoricalData;
          }>
        ) => {
          state.loading = false;
          state.historical[action.payload.city] = action.payload.data;
        }
      )
      .addCase(fetchHistoricalWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = weatherSlice.actions;
export default weatherSlice.reducer;