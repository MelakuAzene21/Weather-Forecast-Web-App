import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WeatherMap = ({ weatherData }) => {
  const [mapType, setMapType] = useState('temp');
  
  if (!weatherData || !weatherData.coord) {
    return null;
  }

  const { lat, lon } = weatherData.coord;
  const API_KEY = '86b09fb8e5de58fae5aa597730282919';

  const mapTypes = {
    temp: 'Temperature',
    precipitation: 'Precipitation',
    pressure: 'Pressure',
    wind: 'Wind Speed',
    clouds: 'Clouds'
  };

  return (
    <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
      <h3 className="text-xl font-bold mb-4 text-center">Weather Map</h3>
      
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(mapTypes).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMapType(key)}
            className={`px-3 py-1 rounded-lg text-sm ${
              mapType === key 
                ? 'bg-blue-600 text-white' 
                : 'bg-white bg-opacity-50 text-black hover:bg-opacity-70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        {/* OpenWeather tile API expects z/x/y in Web Mercator tiling system. Approximate tile from lat/lon */}
        {(() => {
          const z = 5;
          const x = Math.floor(((lon + 180) / 360) * Math.pow(2, z));
          const latRad = (lat * Math.PI) / 180;
          const y = Math.floor(
            (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, z)
          );
          const src = `https://tile.openweathermap.org/map/${mapType}_new/${z}/${x}/${y}.png?appid=${API_KEY}`;
          return (
            <img
              src={src}
              alt={`${mapTypes[mapType]} Map`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x200/87CEEB/000000?text=${mapTypes[mapType]}+Map+Unavailable`;
              }}
            />
          );
        })()}
      </div>
    </div>
  );
};

WeatherMap.propTypes = {
  weatherData: PropTypes.shape({
    coord: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired
    })
  })
};

export default WeatherMap;