
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome for icons
import { faCloud, faSun, faSnowflake, faTemperatureLow, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons'; // Import required icons
import {    faCloudShowersHeavy, faBolt } from '@fortawesome/free-solid-svg-icons';

const Forecast = ({ forecast, units }) => {
    if (!forecast || !forecast.list) {
        return <p>No forecast data available.</p>;
    }

    // Function to get the day name (e.g., Monday, Tuesday)
    const getDayName = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert to JS Date object
        return date.toLocaleDateString('en-US', { weekday: 'long' }); // Get day of the week
    };

    // Function to get appropriate weather icon based on description
    const getWeatherIcon = (description) => {
        const lowerDesc = description.toLowerCase(); // Convert description to lowercase for consistency

        if (lowerDesc.includes('cloud')) {
            return faCloud; // Cloudy
        } else if (lowerDesc.includes('sun') || lowerDesc.includes('clear')) {
            return faSun; // Sunny or Clear skies
        } else if (lowerDesc.includes('snow')) {
            return faSnowflake; // Snowy
        } else if (lowerDesc.includes('rain')) {
            return faCloudShowersHeavy; // Rainy (you can import this icon)
        } else if (lowerDesc.includes('storm') || lowerDesc.includes('thunderstorm')) {
            return faBolt; // Stormy or Thunderstorm (you can import this icon)
        } else {
            return faCloud; // Default to cloud icon if no matches
        }
    };

    // Group forecast data by unique days and calculate min/max temperatures for each day
    const groupedForecast = [];
    forecast.list.forEach((entry) => {
        const dayName = getDayName(entry.dt);

        // Check if the day already exists in groupedForecast
        const existingDay = groupedForecast.find(day => day.name === dayName);

        if (existingDay) {
            // Update min and max temperatures for the day
            existingDay.temp_min = Math.min(existingDay.temp_min, entry.main.temp_min);
            existingDay.temp_max = Math.max(existingDay.temp_max, entry.main.temp_max);
        } else {
            // Add a new entry for the day
            groupedForecast.push({
                name: dayName,
                temp_min: entry.main.temp_min,
                temp_max: entry.main.temp_max,
                description: entry.weather[0].description,
                icon: getWeatherIcon(entry.weather[0].description),
            });
        }
    });

    // Get only the next 4 unique days
    const filteredForecast = groupedForecast.slice(1, 5);

    return (
        <div className="bg-blue-500 bg-opacity-40 p-4 rounded-lg shadow-cloudy1">
            <h2 className="text-2xl font-bold text-center mb-6">Next 4-Day Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredForecast.map((day, index) => (
                    <div key={index} className="p-4 rounded-lg shadow-cloudy1 text-center">
                        {/* Display the day of the week */}
                        <h3 className="text-xl font-semibold mb-2">{day.name}</h3>

                        {/* Display weather icon */}
                        <FontAwesomeIcon
                            icon={day.icon}
                            className="text-4xl mb-2 text-white "
                        />

                        {/* Display temperature */}
                        <p className="text-lg">
                            <FontAwesomeIcon icon={faTemperatureLow} /> {Math.round(day.temp_min)}°
                            {units === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className="text-lg">
                            <FontAwesomeIcon icon={faTemperatureHigh} /> {Math.round(day.temp_max)}°
                            {units === 'metric' ? 'C' : 'F'}
                        </p>

                        {/* Display weather description */}
                        <p className="capitalize mt-2 font-bold text-sm">{day.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// PropTypes validation
Forecast.propTypes = {
    forecast: PropTypes.shape({
        list: PropTypes.arrayOf(
            PropTypes.shape({
                dt: PropTypes.number.isRequired,
                main: PropTypes.shape({
                    temp_min: PropTypes.number.isRequired,
                    temp_max: PropTypes.number.isRequired,
                }).isRequired,
                weather: PropTypes.arrayOf(
                    PropTypes.shape({
                        description: PropTypes.string.isRequired,
                    }).isRequired
                ).isRequired,
            }).isRequired
        ).isRequired,
    }).isRequired,
    units: PropTypes.string.isRequired,
};

export default Forecast;
