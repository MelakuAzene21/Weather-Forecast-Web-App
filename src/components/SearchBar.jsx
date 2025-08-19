
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ fetchWeather, fetchCitySuggestions, recentSearches = [], onSearched }) => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const cacheRef = useRef(new Map());
    const listRef = useRef(null);

    const handleSearch = (cityName) => {
        const queryCity = cityName || city;
        if (!queryCity) return;
        fetchWeather(`q=${queryCity}`);
        setSuggestions([]);
        if (onSearched) onSearched(queryCity);
    };

    const debouncedFetcher = useMemo(() => {
        let timeoutId;
        return (value) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                const key = value.toLowerCase();
                if (cacheRef.current.has(key)) {
                    setSuggestions(cacheRef.current.get(key));
                    setIsLoading(false);
                    setOpen(true);
                    return;
                }
                try {
                    setIsLoading(true);
                    const citySuggestions = await fetchCitySuggestions(value);
                    cacheRef.current.set(key, citySuggestions);
                    setSuggestions(citySuggestions);
                    setOpen(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                    setOpen(false);
                } finally {
                    setIsLoading(false);
                }
            }, 200);
        };
    }, [fetchCitySuggestions]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setCity(inputValue);

        if (inputValue.length > 1) {
            debouncedFetcher(inputValue);
        } else {
            setSuggestions([]);
            setOpen(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(suggestion);
        handleSearch(suggestion);
        setOpen(false);
        setActiveIndex(-1);
    };

    const onKeyDown = (e) => {
        if (!open) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((idx) => Math.min(idx + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((idx) => Math.max(idx - 1, 0));
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                e.preventDefault();
                handleSuggestionClick(suggestions[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (open && listRef.current && activeIndex >= 0) {
            const list = listRef.current;
            const item = list.children[activeIndex];
            if (item && item.scrollIntoView) {
                item.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex, open]);

    return (
        <div className="my-4 relative bg-blue-500 bg-opacity-50 p-4 rounded-lg">
            <div className="relative">
                <input
                    type="text"
                    className="border p-3 rounded-lg w-full pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={handleInputChange}
                    onKeyDown={onKeyDown}
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    onClick={() => handleSearch()}
                    className="absolute right-4 top-4 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
                />
                {isLoading && (
                    <span className="absolute right-9 top-4 h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                )}
            </div>
            {open && suggestions.length > 0 && (
                <ul ref={listRef} className="absolute bg-white border border-gray-300 w-full mt-1 max-h-56 overflow-y-auto rounded-lg shadow-lg z-10">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={`${suggestion}-${index}`}
                            className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(-1)}
                            onClick={() => handleSuggestionClick(suggestion)}
                            role="option"
                            aria-selected={index === activeIndex}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}

            {recentSearches.length > 0 && (!open || suggestions.length === 0) && (
                <div className="mt-2">
                    <p className="text-xs mb-1 text-white/80">Recent searches</p>
                    <div className="flex flex-wrap gap-2">
                        {recentSearches.map((recent, idx) => (
                            <button
                                key={`${recent}-${idx}`}
                                onClick={() => handleSearch(recent)}
                                className="px-2 py-1 text-xs rounded bg-white/70 hover:bg-white"
                            >
                                {recent}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Adding PropTypes validation
SearchBar.propTypes = {
    fetchWeather: PropTypes.func.isRequired, // `fetchWeather` is a function and required
    fetchCitySuggestions: PropTypes.func.isRequired, // `fetchCitySuggestions` is a function and required
    recentSearches: PropTypes.arrayOf(PropTypes.string),
    onSearched: PropTypes.func,
};

export default SearchBar;

