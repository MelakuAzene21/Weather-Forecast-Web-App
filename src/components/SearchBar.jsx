
// import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
// import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon

// const SearchBar = ({ fetchWeather, fetchCitySuggestions }) => {
//     const [city, setCity] = useState('');
//     const [suggestions, setSuggestions] = useState([]);

//     const handleSearch = (cityName) => {
//         fetchWeather(`q=${cityName || city}`);
//         setSuggestions([]); // Clear suggestions after a selection
//     };

//     const handleInputChange = async (e) => {
//         const inputValue = e.target.value;
//         setCity(inputValue);

//         if (inputValue.length > 2) {  // Fetch suggestions if input length > 2
//             const citySuggestions = await fetchCitySuggestions(inputValue);
//             setSuggestions(citySuggestions);
//         } else {
//             setSuggestions([]); // Clear suggestions if input is too short
//         }
//     };

//     const handleSuggestionClick = (suggestion) => {
//         setCity(suggestion);  // Set the input value to the clicked suggestion
//         handleSearch(suggestion);  // Trigger weather search for the selected city
//     };

//     return (
//         <div className="my-4 relative bg-blue-500 bg-opacity-50 p-4">
//             <div className="relative">
//                 <input
//                     type="text"
//                     className="border p-2 rounded-lg w-full pr-10"  // Add padding-right for the icon
//                     placeholder="Enter city name..."
//                     value={city}
//                     onChange={handleInputChange}  // Update input handler
//                 />
//                 <FontAwesomeIcon
//                     icon={faSearch} // Search icon
//                     onClick={() => handleSearch()} // Trigger search on click
//                     className="absolute right-2 top-2 text-gray-600 cursor-pointer" // Position the icon
//                 />
//             </div>
//             {suggestions.length > 0 && (
//                 <ul className="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto">
//                     {suggestions.map((suggestion, index) => (
//                         <li
//                             key={index}
//                             className="p-2 cursor-pointer hover:bg-gray-200"
//                             onClick={() => handleSuggestionClick(suggestion)}
//                         >
//                             {suggestion}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default SearchBar;


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
            const citySuggestions = await fetchCitySuggestions(inputValue);
            setSuggestions(citySuggestions);
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
                    className="border p-2 rounded-lg w-full pr-10"  // Add padding-right for the icon
                    placeholder="Enter city name..."
                    value={city}
                    onChange={handleInputChange}  // Update input handler
                />
                <FontAwesomeIcon
                    icon={faSearch} // Search icon
                    onClick={() => handleSearch()} // Trigger search on click
                    className="absolute right-2 top-2 text-gray-600 cursor-pointer" // Position the icon
                />
            </div>
            {suggestions.length > 0 && (
                <ul className="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-200"
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

