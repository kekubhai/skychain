const fetchHistoricalWeatherApi = async (city: string): Promise<HistoricalData> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 1); // Get data for past 24 hours
    
    const response = await axios.get(`https://api.weatherapi.com/v1/history.json`, {
      params: {
        key: 'YOUR_API_KEY',
        q: city,
        dt: startDate.toISOString().split('T')[0],
        end_dt: endDate.toISOString().split('T')[0],
        hour: '0,3,6,9,12,15,18,21' // Get data points every 3 hours
      }
    });
  
    // Process the API response into our HistoricalData format
    const history = response.data.forecast.forecastday[0].hour
      .filter((hour: any, index: number) => index % 3 === 0); // Sample every 3 hours
  
    return {
      dates: history.map((hour: any) => new Date(hour.time).toLocaleTimeString([], { hour: '2-digit' })),
      temperatures: history.map((hour: any) => hour.temp_c),
      humidity: history.map((hour: any) => hour.humidity),
    };
  };