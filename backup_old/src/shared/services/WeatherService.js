/**
 * WeatherService.js
 * Fetches real-time weather data or provides mock data for the BINGLE game environment.
 */

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Placeholder

export const fetchWeather = async (city = 'Seoul') => {
  try {
    // If we had a real key, we would use:
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    // const data = await response.json();
    
    // Mocking for now to ensure functionality without a key
    const mockData = {
      temp: 28, // High temperature causes melting
      condition: 'Sunny',
      city: city
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockData;
  } catch (error) {
    console.error('Weather fetch failed:', error);
    return { temp: 20, condition: 'Clear', city: 'Unknown' };
  }
};
