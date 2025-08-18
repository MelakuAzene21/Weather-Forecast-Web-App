import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faThermometerHalf, faTint, faWind } from '@fortawesome/free-solid-svg-icons';

const WeatherComparison = ({ units }) => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '86b09fb8e5de58fae5aa597730282919';

  const addCity = async () => {
    if (!newCity.trim() || cities.length >= 4) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=${units}&appid=${API_KEY}`
      );
      
      const cityData = {
        id: Date.now(),
        name: response.data.name,
        country: response.data.sys.country,
        temp: response.data.main.temp,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      };

      setCities(prev => [...prev, cityData]);
      setNewCity('');
    } catch (error) {
      console.error('Error fetching city weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (id) => {
    setCities(prev => prev.filter(city => city.id !== id));
  };

  useEffect(() => {
    // Update temperatures when units change
    const updateCities = async () => {
      if (cities.length === 0) return;
      
      setLoading(true);
      const updatedCities = await Promise.all(
        cities.map(async (city) => {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=${units}&appid=${API_KEY}`
            );
            return {
              ...city,
              temp: response.data.main.temp,
              humidity: response.data.main.humidity,
              windSpeed: response.data.wind.speed,
            };
          } catch (error) {
            return city;
          }
        })
      );
      setCities(updatedCities);
      setLoading(false);
    };

    updateCities();
  }, [units]);

  if (cities.length === 0) {
    return (
      <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
        <h3 className="text-xl font-bold mb-4 text-center">Weather Comparison</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Enter city name to compare..."
            className="flex-1 p-2 rounded border"
            onKeyPress={(e) => e.key === 'Enter' && addCity()}
          />
          <button
            onClick={addCity}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <p className="text-center text-gray-600">Add cities to compare weather conditions</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
      <h3 className="text-xl font-bold mb-4 text-center">Weather Comparison</h3>
      
      {cities.length < 4 && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Add another city..."
            className="flex-1 p-2 rounded border"
            onKeyPress={(e) => e.key === 'Enter' && addCity()}
          />
          <button
            onClick={addCity}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cities.map((city) => (
          <div key={city.id} className="bg-white bg-opacity-20 p-4 rounded-lg relative">
            <button
              onClick={() => removeCity(city.id)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <h4 className="font-bold text-lg mb-2">{city.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{city.country}</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faThermometerHalf} className="text-red-400" />
                <span className="text-xl font-bold">
                  {Math.round(city.temp)}°{units === 'metric' ? 'C' : 'F'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTint} className="text-blue-400" />
                <span>{city.humidity}%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faWind} className="text-gray-400" />
                <span>{Math.round(city.windSpeed)} {units === 'metric' ? 'm/s' : 'mph'}</span>
              </div>
              
              <p className="text-sm capitalize mt-2">{city.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

WeatherComparison.propTypes = {
  units: PropTypes.string.isRequired,
};

export default WeatherComparison;