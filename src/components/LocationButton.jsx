import PropTypes from 'prop-types';

const LocationButton = ({ fetchWeather }) => {
    const handleLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(`lat=${latitude}&lon=${longitude}`);
            },
            () => alert('Location access denied.')
        );
    };

    return (
        <button className="bg-blue-500 bg-opacity-50 text-white p-2 rounded-lg" onClick={handleLocation}>
            Use Current Location
        </button>
    );
};

// Adding PropTypes validation
LocationButton.propTypes = {
    fetchWeather: PropTypes.func.isRequired,  // `fetchWeather` is a function and required
};

export default LocationButton;
