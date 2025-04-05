// src/redux/slices/weatherSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { addDays } from 'date-fns';

// API Configuration
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

// Response Types
interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface CurrentWeatherResponse {
  temp_c: number;
  humidity: number;
  condition: WeatherCondition;
  feelslike_c: number;
  wind_kph: number;
  last_updated: string;
  is_day: number;
}

interface HourlyForecastResponse {
  time: string;
  temp_c: number;
  humidity: number;
  condition: WeatherCondition;
  chance_of_rain: number;
  chance_of_snow: number;
}

interface ForecastDayResponse {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    avghumidity: number;
    condition: WeatherCondition;
  };
  hour: HourlyForecastResponse[];
}

interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: CurrentWeatherResponse;
  forecast?: {
    forecastday: ForecastDayResponse[];
  };
}

// Normalized Types
interface CurrentWeather {
  temperature: number;
  humidity: number;
  conditions: string;
 
}

interface HourlyData {
  time: string;
  temperature: number;
  humidity: number;
  condition: string;
  precipitationChance: number;
}

interface DailyForecast {
  date: string;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  avgHumidity: number;
  condition: string;
  hourlyData: HourlyData[];
}

interface WeatherState {
  data: {
    [city: string]: CurrentWeather;
  };
  current: {
    [city: string]: CurrentWeather;
  };
  forecast: {
    [city: string]: {
      lastUpdated: string;
      days: DailyForecast[];
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: {},
  current: {},
  forecast: {},
  loading: false,
  error: null,
};

// Helper Functions
const processHourlyData = (hour: HourlyForecastResponse): HourlyData => ({
  time: hour.time.split(' ')[1].substring(0, 5),
  temperature: hour.temp_c,
  humidity: hour.humidity,
  condition: hour.condition.text,
  precipitationChance: hour.chance_of_rain || hour.chance_of_snow || 0,
});

const processDailyForecast = (forecastDay: ForecastDayResponse): DailyForecast => ({
  date: forecastDay.date,
  avgTemperature: parseFloat(forecastDay.day.avgtemp_c.toFixed(1)),
  maxTemperature: forecastDay.day.maxtemp_c,
  minTemperature: forecastDay.day.mintemp_c,
  avgHumidity: parseFloat(forecastDay.day.avghumidity.toFixed(1)),
  condition: forecastDay.day.condition.text,
  hourlyData: forecastDay.hour.map(processHourlyData),
});

// Thunks
export const fetchWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city: string, { rejectWithValue }) => {
    try {
      if (!WEATHER_API_KEY) throw new Error('Weather API key not configured');

      const response = await axios.get<WeatherApiResponse>(`${BASE_URL}/current.json`, {
        params: { key: WEATHER_API_KEY, q: city, aqi: 'no' },
        timeout: 10000,
      });

      if (!response?.data?.current) {
        throw new Error('Invalid weather data received');
      }

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
          isDay: response.data.current.is_day === 1,
          location: `${response.data.location.name}, ${response.data.location.country}`,
        },
      };
    } catch (error: any) {
      console.error('Fetch weather error:', error);
      return rejectWithValue(error.message || 'Failed to fetch current weather');
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city: string, { rejectWithValue }) => {
    try {
      if (!WEATHER_API_KEY) throw new Error('Weather API key not configured');

      const response = await axios.get<WeatherApiResponse>(`${BASE_URL}/forecast.json`, {
        params: { key: WEATHER_API_KEY, q: city, days: 7, aqi: 'no', alerts: 'no' },
        timeout: 10000,
      });

      if (!response?.data?.forecast?.forecastday) {
        throw new Error('No forecast data available');
      }

      return {
        city,
        data: {
          lastUpdated: new Date().toISOString(),
          days: response.data.forecast.forecastday.map(day => {
            try {
              return processDailyForecast(day);
            } catch (error) {
              console.error('Error processing day:', day.date, error);
              return {
                date: day.date,
                avgTemperature: 0,
                maxTemperature: 0,
                minTemperature: 0,
                avgHumidity: 0,
                condition: 'Error',
                hourlyData: []
              };
            }
          }),
        },
      };
    } catch (error: any) {
      console.error('Fetch forecast error:', error);
      return rejectWithValue(error.message || 'Failed to fetch forecast');
    }
  }
);

// Slice
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<{
        city: string;
        data: CurrentWeather;
      }>) => {
        state.loading = false;
        if (action.payload) {
          state.current[action.payload.city] = action.payload.data;
        }
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Unknown error occurred';
      })
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchForecast.fulfilled, (state, action: PayloadAction<{
        city: string;
        data: {
          lastUpdated: string;
          days: DailyForecast[];
        };
      }>) => {
        state.loading = false;
        if (action.payload) {
          state.forecast[action.payload.city] = action.payload.data;
        }
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Unknown forecast error occurred';
      });
  },
});

export const { clearWeatherError } = weatherSlice.actions;
export default weatherSlice.reducer;