import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloud, faSun, faSnowflake, faCloudShowersHeavy, 
  faBolt, faEye, faWind 
} from '@fortawesome/free-solid-svg-icons';

const HourlyForecast = ({ forecast, units }) => {
  if (!forecast || !forecast.list) {
    return <p>No hourly forecast data available.</p>;
  }

  const getWeatherIcon = (description) => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('cloud')) return faCloud;
    if (lowerDesc.includes('sun') || lowerDesc.includes('clear')) return faSun;
    if (lowerDesc.includes('snow')) return faSnowflake;
    if (lowerDesc.includes('rain')) return faCloudShowersHeavy;
    if (lowerDesc.includes('storm') || lowerDesc.includes('thunderstorm')) return faBolt;
    return faCloud;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  // Get next 24 hours (8 entries, each 3 hours apart)
  const hourlyData = forecast.list.slice(0, 8);

  return (
    <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
      <h3 className="text-xl font-bold mb-4 text-center">24-Hour Forecast</h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {hourlyData.map((hour, index) => (
            <div key={index} className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-lg text-center min-w-[120px]">
              <p className="text-sm font-medium mb-2">
                {index === 0 ? 'Now' : formatTime(hour.dt)}
              </p>
              
              <FontAwesomeIcon
                icon={getWeatherIcon(hour.weather[0].description)}
                className="text-2xl mb-2 text-white"
              />
              
              <p className="text-lg font-bold mb-1">
                {Math.round(hour.main.temp)}°{units === 'metric' ? 'C' : 'F'}
              </p>
              
              <p className="text-xs mb-1 capitalize">
                {hour.weather[0].description}
              </p>
              
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <FontAwesomeIcon icon={faWind} className="text-xs" />
                  <span>{Math.round(hour.wind.speed)} {units === 'metric' ? 'm/s' : 'mph'}</span>
                </div>
                
                {hour.visibility && (
                  <div className="flex items-center justify-center gap-1">
                    <FontAwesomeIcon icon={faEye} className="text-xs" />
                    <span>{Math.round(hour.visibility / 1000)}km</span>
                  </div>
                )}
                {typeof hour.pop === 'number' && (
                  <div className="flex items-center justify-center gap-1">
                    <span>Precip</span>
                    <span>{Math.round(hour.pop * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

HourlyForecast.propTypes = {
  forecast: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        dt: PropTypes.number.isRequired,
        main: PropTypes.shape({
          temp: PropTypes.number.isRequired,
        }).isRequired,
        weather: PropTypes.arrayOf(
          PropTypes.shape({
            description: PropTypes.string.isRequired,
          }).isRequired
        ).isRequired,
        wind: PropTypes.shape({
          speed: PropTypes.number.isRequired,
        }).isRequired,
        visibility: PropTypes.number,
      }).isRequired
    ).isRequired,
  }).isRequired,
  units: PropTypes.string.isRequired,
};

export default HourlyForecast;