import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, faCompass, faThermometerHalf, faTint, 
  faArrowUp, faArrowDown, faGauge, faSun, faMoon 
} from '@fortawesome/free-solid-svg-icons';

const WeatherDetails = ({ weather, units }) => {
  if (!weather) return null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const uvIndex = weather?.uvi; // not in current response, placeholder if merged in future
  const dewPoint = weather?.main?.dew_point; // OpenWeather current API has dew_point in OneCall; not in basic endpoint

  const details = [
    {
      icon: faThermometerHalf,
      label: 'Feels Like',
      value: `${Math.round(weather.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`
    },
    {
      icon: faTint,
      label: 'Humidity',
      value: `${weather.main.humidity}%`
    },
    {
      icon: faGauge,
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`
    },
    {
      icon: faEye,
      label: 'Visibility',
      value: weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'
    },
    {
      icon: faCompass,
      label: 'Wind Direction',
      value: weather.wind.deg ? `${getWindDirection(weather.wind.deg)} (${weather.wind.deg}°)` : 'N/A'
    },
    {
      icon: faArrowUp,
      label: 'Max Temp',
      value: `${Math.round(weather.main.temp_max)}°${units === 'metric' ? 'C' : 'F'}`
    },
    {
      icon: faArrowDown,
      label: 'Min Temp',
      value: `${Math.round(weather.main.temp_min)}°${units === 'metric' ? 'C' : 'F'}`
    }
  ];

  if (typeof uvIndex === 'number') {
    details.push({
      icon: faSun,
      label: 'UV Index',
      value: uvIndex.toFixed(1)
    });
  }

  if (typeof dewPoint === 'number') {
    details.push({
      icon: faThermometerHalf,
      label: 'Dew Point',
      value: `${Math.round(dewPoint)}°${units === 'metric' ? 'C' : 'F'}`
    });
  }

  return (
    <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
      <h3 className="text-xl font-bold mb-4 text-center">Weather Details</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {details.map((detail, index) => (
          <div key={index} className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
            <FontAwesomeIcon icon={detail.icon} className="text-xl mb-2 text-white" />
            <p className="text-xs font-medium mb-1">{detail.label}</p>
            <p className="text-sm font-bold">{detail.value}</p>
          </div>
        ))}
      </div>

      {weather.sys && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
            <FontAwesomeIcon icon={faSun} className="text-xl mb-2 text-yellow-400" />
            <p className="text-xs font-medium mb-1">Sunrise</p>
            <p className="text-sm font-bold">{formatTime(weather.sys.sunrise)}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
            <FontAwesomeIcon icon={faMoon} className="text-xl mb-2 text-blue-200" />
            <p className="text-xs font-medium mb-1">Sunset</p>
            <p className="text-sm font-bold">{formatTime(weather.sys.sunset)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

WeatherDetails.propTypes = {
  weather: PropTypes.shape({
    main: PropTypes.shape({
      feels_like: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      pressure: PropTypes.number.isRequired,
      temp_max: PropTypes.number.isRequired,
      temp_min: PropTypes.number.isRequired,
    }).isRequired,
    wind: PropTypes.shape({
      speed: PropTypes.number.isRequired,
      deg: PropTypes.number,
    }).isRequired,
    visibility: PropTypes.number,
    sys: PropTypes.shape({
      sunrise: PropTypes.number,
      sunset: PropTypes.number,
    }),
  }),
  units: PropTypes.string.isRequired,
};

export default WeatherDetails;