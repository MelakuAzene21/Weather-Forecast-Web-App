import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import LocationButton from './components/LocationButton';
import './index.css';

const API_KEY = '86b09fb8e5de58fae5aa597730282919'; // Replace with OpenWeatherMap API key

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null); // Store forecast data separately
  const [units, setUnits] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(
    async (location) => {
      setLoading(true);
      setError('');

      const fetchForecast = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?${location}&units=${units}&appid=${API_KEY}`
          );
          setForecastData(response.data);
        } catch (err) {
          console.log(err);
          setError('Failed to fetch forecast data.');
        }
      };

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?${location}&units=${units}&appid=${API_KEY}`
        );
        setWeatherData(response.data);
        await fetchForecast(); // Fetch forecast data after current weather
      } catch (err) {
        console.log(err);
        setError('Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    },
    [units] // Dependency array
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`lat=${latitude}&lon=${longitude}`);
        },
        () => setError('Location access denied.')
      );
    }
  }, [fetchWeather]); // Now, `fetchWeather` is included in the dependency array

  const handleUnitChange = (e) => {
    setUnits(e.target.value);
  };

  const fetchCitySuggestions = async (inputValue) => {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=${API_KEY}`
    );
    const data = await response.json();
    return data.map((city) => `${city.name}, ${city.country}`);
  };

  return (
    <div className="bg-cloudy bg-cover bg-center bg-fixed min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto p-4 bg-transparent rounded-lg shadow-lg">
        <SearchBar fetchWeather={fetchWeather} fetchCitySuggestions={fetchCitySuggestions} />
        <LocationButton fetchWeather={fetchWeather} />

        <div className="bg-blue-500 bg-opacity-10 p-4 rounded-lg">
          <label htmlFor="units" className="text-black">Units: </label>
          <select id="units" value={units} onChange={handleUnitChange} className="rounded-lg">
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {weatherData && <CurrentWeather weather={weatherData} units={units} />}
            {forecastData && <Forecast forecast={forecastData} units={units} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
