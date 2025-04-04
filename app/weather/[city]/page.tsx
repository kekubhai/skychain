// src/redux/slices/weatherSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { addDays, format } from 'date-fns';


const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

// Types for API responses
interface CurrentWeatherResponse {
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

interface HourlyForecastResponse {
  time: string;
  temp_c: number;
  humidity: number;
  condition: {
    text: string;
  };
}

interface ForecastDayResponse {
  date: string;
  hour: HourlyForecastResponse[];
}

interface WeatherApiResponse {
  current: CurrentWeatherResponse;
  forecast?: {
    forecastday: ForecastDayResponse[];
  };
}

// Normalized types for our store
interface CurrentWeather {
  temperature: number;
  humidity: number;
  conditions: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
  lastUpdated: string;
}

interface DailyHistoricalData {
  date: string;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  avgHumidity: number;
  condition: string;
  hourlyData: {
    time: string;
    temperature: number;
    humidity: number;
    condition: string;
  }[];
}

interface WeatherState {
  current: {
    [city: string]: CurrentWeather;
  };
  historical: {
    [city: string]: {
      lastUpdated: string;
      days: DailyHistoricalData[];
    };
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

// Helper to process hourly data into daily summaries
const processDailyData = (forecastDay: ForecastDayResponse): DailyHistoricalData => {
  const temperatures = forecastDay.hour.map(h => h.temp_c);
  const humidities = forecastDay.hour.map(h => h.humidity);
  
  return {
    date: forecastDay.date,
    avgTemperature: parseFloat((temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)),
    maxTemperature: Math.max(...temperatures),
    minTemperature: Math.min(...temperatures),
    avgHumidity: parseFloat((humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1)),
    condition: forecastDay.hour[12]?.condition.text || forecastDay.hour[0]?.condition.text || 'Unknown',
    hourlyData: forecastDay.hour.map(hour => ({
      time: hour.time.split(' ')[1].substring(0, 5),
      temperature: hour.temp_c,
      humidity: hour.humidity,
      condition: hour.condition.text
    }))
  };
};

// Fetch current weather
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

// Fetch 7-day historical weather
export const fetchHistoricalWeather = createAsyncThunk(
  'weather/fetchHistorical',
  async (city: string, { rejectWithValue }) => {
    try {
      // Calculate date range (last 7 days)
      const endDate = new Date();
      const startDate = addDays(endDate, -7);
      
      // Note: WeatherAPI.com only allows single-day historical requests
      // In production, you might need to make multiple requests or use a different provider
      // that supports date ranges
      const response = await axios.get<WeatherApiResponse>(
        `${BASE_URL}/forecast.json`,
        {
          params: {
            key: WEATHER_API_KEY,
            q: city,
            days: 7,
          },
        }
      );

      if (!response.data.forecast?.forecastday) {
        throw new Error('No forecast data available');
      }

      return {
        city,
        data: {
          lastUpdated: new Date().toISOString(),
          days: response.data.forecast.forecastday.map(processDailyData),
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
            data: CurrentWeather;
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
            data: {
              lastUpdated: string;
              days: DailyHistoricalData[];
            };
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