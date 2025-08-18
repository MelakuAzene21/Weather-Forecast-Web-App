import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

const WeatherAlerts = ({ weatherData }) => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    if (!weatherData) return;

    const newAlerts = [];
    
    // Temperature alerts
    if (weatherData.main.temp > 35 && weatherData.main.temp < 50) {
      newAlerts.push({
        id: 'high-temp',
        type: 'warning',
        title: 'High Temperature Alert',
        message: 'Temperature is extremely high. Stay hydrated and avoid prolonged sun exposure.',
        severity: 'moderate'
      });
    } else if (weatherData.main.temp > 50) {
      newAlerts.push({
        id: 'extreme-temp',
        type: 'danger',
        title: 'Extreme Heat Warning',
        message: 'Dangerous heat levels detected. Seek air conditioning and avoid outdoor activities.',
        severity: 'severe'
      });
    }

    if (weatherData.main.temp < -10) {
      newAlerts.push({
        id: 'cold-temp',
        type: 'warning',
        title: 'Extreme Cold Alert',
        message: 'Very cold temperatures. Dress warmly and limit time outdoors.',
        severity: 'moderate'
      });
    }

    // Wind alerts
    if (weatherData.wind.speed > 15) {
      newAlerts.push({
        id: 'high-wind',
        type: 'warning',
        title: 'High Wind Advisory',
        message: 'Strong winds detected. Secure loose objects and use caution when driving.',
        severity: 'moderate'
      });
    }

    // Visibility alerts
    if (weatherData.visibility && weatherData.visibility < 1000) {
      newAlerts.push({
        id: 'low-visibility',
        type: 'warning',
        title: 'Low Visibility Alert',
        message: 'Poor visibility conditions. Drive carefully and use headlights.',
        severity: 'moderate'
      });
    }

    // Weather condition alerts
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes('thunderstorm')) {
      newAlerts.push({
        id: 'thunderstorm',
        type: 'danger',
        title: 'Thunderstorm Warning',
        message: 'Thunderstorm activity detected. Seek shelter indoors and avoid open areas.',
        severity: 'severe'
      });
    }

    setAlerts(newAlerts);
  }, [weatherData]);

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border-l-4 ${
            alert.type === 'danger' 
              ? 'bg-red-100 border-red-500 text-red-800' 
              : 'bg-yellow-100 border-yellow-500 text-yellow-800'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className={`mr-3 mt-1 ${
                  alert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'
                }`} 
              />
              <div>
                <h4 className="font-bold text-sm">{alert.title}</h4>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

WeatherAlerts.propTypes = {
  weatherData: PropTypes.shape({
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
    }).isRequired,
    wind: PropTypes.shape({
      speed: PropTypes.number.isRequired,
    }).isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        main: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    visibility: PropTypes.number,
  }),
};

export default WeatherAlerts;