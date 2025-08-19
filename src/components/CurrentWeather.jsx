import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faSun, faDroplet, faWind, faGauge } from "@fortawesome/free-solid-svg-icons";

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
        <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg text-black dark:text-white">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">
                    <FontAwesomeIcon icon={faLocation} className="text-red-500 mr-2" /> {weather.name}
                </h1>
                <p className="capitalize text-sm md:text-base">{weather.weather[0].description}</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faSun} className="text-amber-400 text-4xl" />
                    <h2 className="text-5xl font-bold">{Math.round(weather.main.temp)}°{units === 'metric' ? 'C' : 'F'}</h2>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 md:mt-0">
                    <div className="bg-white/20 p-3 rounded text-center">
                        <FontAwesomeIcon icon={faDroplet} className="mb-1" />
                        <p className="text-xs">Humidity</p>
                        <p className="font-bold">{weather.main.humidity}%</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded text-center">
                        <FontAwesomeIcon icon={faWind} className="mb-1" />
                        <p className="text-xs">Wind</p>
                        <p className="font-bold">{weather.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded text-center">
                        <FontAwesomeIcon icon={faGauge} className="mb-1" />
                        <p className="text-xs">Pressure</p>
                        <p className="font-bold">{weather.main.pressure} hPa</p>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-sm">{getFormattedDate()}</p>
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
