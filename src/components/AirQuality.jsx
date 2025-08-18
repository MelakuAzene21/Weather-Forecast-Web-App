import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const AirQuality = ({ weatherData }) => {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '86b09fb8e5de58fae5aa597730282919';

  useEffect(() => {
    if (!weatherData || !weatherData.coord) return;

    const fetchAirQuality = async () => {
      setLoading(true);
      try {
        const { lat, lon } = weatherData.coord;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        setAirQuality(response.data);
      } catch (error) {
        console.error('Error fetching air quality:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, [weatherData]);

  if (loading) {
    return (
      <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
        <h3 className="text-xl font-bold mb-4 text-center">Air Quality</h3>
        <p className="text-center">Loading air quality data...</p>
      </div>
    );
  }

  if (!airQuality) return null;

  const getAQILevel = (aqi) => {
    const levels = {
      1: { label: 'Good', color: 'text-green-600', bgColor: 'bg-green-100' },
      2: { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      3: { label: 'Moderate', color: 'text-orange-600', bgColor: 'bg-orange-100' },
      4: { label: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' },
      5: { label: 'Very Poor', color: 'text-purple-600', bgColor: 'bg-purple-100' }
    };
    return levels[aqi] || levels[1];
  };

  const aqiLevel = getAQILevel(airQuality.list[0].main.aqi);
  const components = airQuality.list[0].components;

  return (
    <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
      <h3 className="text-xl font-bold mb-4 text-center">Air Quality Index</h3>
      
      <div className={`${aqiLevel.bgColor} p-4 rounded-lg mb-4`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <FontAwesomeIcon 
            icon={airQuality.list[0].main.aqi <= 2 ? faLeaf : faExclamationTriangle} 
            className={aqiLevel.color} 
          />
          <span className={`text-xl font-bold ${aqiLevel.color}`}>
            {aqiLevel.label}
          </span>
        </div>
        <p className="text-center text-sm">
          AQI: {airQuality.list[0].main.aqi}/5
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
          <p className="text-xs font-medium mb-1">CO</p>
          <p className="text-sm font-bold">{components.co.toFixed(1)} μg/m³</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
          <p className="text-xs font-medium mb-1">NO₂</p>
          <p className="text-sm font-bold">{components.no2.toFixed(1)} μg/m³</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
          <p className="text-xs font-medium mb-1">O₃</p>
          <p className="text-sm font-bold">{components.o3.toFixed(1)} μg/m³</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
          <p className="text-xs font-medium mb-1">SO₂</p>
          <p className="text-sm font-bold">{components.so2.toFixed(1)} μg/m³</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
          <p className="text-xs font-medium mb-1">PM2.5</p>
          <p className="text-sm font-bold">{components.pm2_5.toFixed(1)} μg/m³</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
          <p className="text-xs font-medium mb-1">PM10</p>
          <p className="text-sm font-bold">{components.pm10.toFixed(1)} μg/m³</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-center">
        <p>Air quality data provided by OpenWeatherMap</p>
      </div>
    </div>
  );
};

AirQuality.propTypes = {
  weatherData: PropTypes.shape({
    coord: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
    }).isRequired,
  }),
};

export default AirQuality;