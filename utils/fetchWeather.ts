import axios from 'axios';

interface WeatherResponse {
  temperature: number;
  humidity: number;
  conditions: string;
  timestamp: number;
}

export const fetchWeatherData = async (city: string): Promise<WeatherResponse> => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      conditions: response.data.weather[0].main,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}; 