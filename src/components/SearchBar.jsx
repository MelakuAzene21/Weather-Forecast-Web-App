
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ fetchWeather, fetchCitySuggestions }) => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = (cityName) => {
        fetchWeather(`q=${cityName || city}`);
        setSuggestions([]); // Clear suggestions after a selection
    };

    const handleInputChange = async (e) => {
        const inputValue = e.target.value;
        setCity(inputValue);

        if (inputValue.length > 2) {  // Fetch suggestions if input length > 2
            try {
                const citySuggestions = await fetchCitySuggestions(inputValue);
                setSuggestions(citySuggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]); // Clear suggestions if input is too short
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(suggestion);  // Set the input value to the clicked suggestion
        handleSearch(suggestion);  // Trigger weather search for the selected city
    };

    return (
        <div className="my-4 relative bg-blue-500 bg-opacity-50 p-4">
            <div className="relative">
                <input
                    type="text"
                    className="border p-3 rounded-lg w-full pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={handleInputChange}  // Update input handler
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <FontAwesomeIcon
                    icon={faSearch} // Search icon
                    onClick={() => handleSearch()} // Trigger search on click
                    className="absolute right-4 top-4 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
                />
            </div>
            {suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-48 overflow-y-auto rounded-lg shadow-lg z-10">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Adding PropTypes validation
SearchBar.propTypes = {
    fetchWeather: PropTypes.func.isRequired, // `fetchWeather` is a function and required
    fetchCitySuggestions: PropTypes.func.isRequired, // `fetchCitySuggestions` is a function and required
};

export default SearchBar;

