import PropTypes from 'prop-types';
import { faLocation, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CurrentWeather = ({ weather, units }) => {
    // Check if weather data is available and properly structured
    if (!weather || !weather.main || !weather.weather) {
        return <p>Weather data is not available</p>;
    }

    // Function to get the current date and time in the desired format
    const getFormattedDate = () => {
        const now = new Date();
        const options = { hour: 'numeric', minute: 'numeric', hour12: true, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleString('en-US', options); // e.g., "4:04 PM Sunday, October 6, 2024"
    };

    return (
        <div className="text-center bg-blue-500 bg-opacity-30 p-4 text-black" style={{ boxShadow: '0 6px 12px rgba(17, 216, 255, 0)' }}>
            <h1 className="text-4xl font-bold">
                <FontAwesomeIcon icon={faLocation} className="text-2xl text-red-500" /> {weather.name}
            </h1>
            <p className="text-lg">{weather.weather[0].description}</p>
            <div className="flex justify-center items-center">
                <h2 className="text-5xl font-bold">
                    <FontAwesomeIcon icon={faSun} className="text-4xl text-amber-400" /> {Math.round(weather.main.temp)}°{units === 'metric' ? 'C' : 'F'}
                </h2>
            </div>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</p>

            {/* Display the formatted date */}
            <p className="mt-4 text-lg font-medium">{getFormattedDate()}</p>
        </div>
    );
};

// Define prop types for the component
CurrentWeather.propTypes = {
    weather: PropTypes.shape({
        name: PropTypes.string.isRequired,
        main: PropTypes.shape({
            temp: PropTypes.number.isRequired,
            humidity: PropTypes.number.isRequired
        }).isRequired,
        weather: PropTypes.arrayOf(PropTypes.shape({
            description: PropTypes.string.isRequired
        })).isRequired,
        wind: PropTypes.shape({
            speed: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    units: PropTypes.oneOf(['metric', 'imperial']).isRequired,
};

export default CurrentWeather;
