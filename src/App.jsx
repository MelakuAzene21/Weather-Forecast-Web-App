import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import HourlyForecast from './components/HourlyForecast';
import WeatherDetails from './components/WeatherDetails';
import WeatherMap from './components/WeatherMap';
import WeatherAlerts from './components/WeatherAlerts';
import FavoriteLocations from './components/FavoriteLocations';
import WeatherComparison from './components/WeatherComparison';
import AirQuality from './components/AirQuality';
import LocationButton from './components/LocationButton';
import './index.css';

const API_KEY = '86b09fb8e5de58fae5aa597730282919'; // Replace with OpenWeatherMap API key

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null); // Store forecast data separately
  const [units, setUnits] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('current');

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
    <div className="bg-cloudy bg-cover bg-center bg-fixed min-h-screen bg-white p-2 md:p-4">
      <div className="max-w-4xl mx-auto p-4 bg-transparent rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Weather Pro
          </h1>
          <p className="text-white drop-shadow-md">Your comprehensive weather companion</p>
        </div>

        <SearchBar fetchWeather={fetchWeather} fetchCitySuggestions={fetchCitySuggestions} />
        <LocationButton fetchWeather={fetchWeather} />

        <div className="bg-blue-500 bg-opacity-10 p-4 rounded-lg">
          <label htmlFor="units" className="text-black">Units: </label>
          <select id="units" value={units} onChange={handleUnitChange} className="rounded-lg">
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
        </div>

        {/* Navigation Tabs */}
        {weatherData && (
          <div className="bg-blue-500 bg-opacity-30 p-2 rounded-lg mt-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: 'current', label: 'Current' },
                { id: 'hourly', label: 'Hourly' },
                { id: 'forecast', label: '4-Day' },
                { id: 'details', label: 'Details' },
                { id: 'map', label: 'Map' },
                { id: 'air', label: 'Air Quality' },
                { id: 'compare', label: 'Compare' },
                { id: 'favorites', label: 'Favorites' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white bg-opacity-50 text-black hover:bg-opacity-70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2 text-white">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <WeatherAlerts weatherData={weatherData} />
            
            {weatherData && activeTab === 'current' && (
              <CurrentWeather weather={weatherData} units={units} />
            )}
            
            {forecastData && activeTab === 'hourly' && (
              <HourlyForecast forecast={forecastData} units={units} />
            )}
            
            {forecastData && activeTab === 'forecast' && (
              <Forecast forecast={forecastData} units={units} />
            )}
            
            {weatherData && activeTab === 'details' && (
              <WeatherDetails weather={weatherData} units={units} />
            )}
            
            {weatherData && activeTab === 'map' && (
              <WeatherMap weatherData={weatherData} />
            )}
            
            {weatherData && activeTab === 'air' && (
              <AirQuality weatherData={weatherData} />
            )}
            
            {activeTab === 'compare' && (
              <WeatherComparison units={units} />
            )}
            
            {activeTab === 'favorites' && (
              <FavoriteLocations 
                fetchWeather={fetchWeather} 
                currentLocation={weatherData?.name}
              />
            )}
            
            {!weatherData && !loading && (
              <div className="text-center py-8 text-white">
                <p className="text-lg mb-2">Welcome to Weather Pro!</p>
                <p>Search for a city or use your current location to get started.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
