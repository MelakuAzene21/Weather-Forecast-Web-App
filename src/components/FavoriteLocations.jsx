import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const FavoriteLocations = ({ fetchWeather, currentLocation }) => {
  const [favorites, setFavorites] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
  };

  const addToFavorites = () => {
    if (!newLocation.trim()) return;
    
    const newFavorite = {
      id: Date.now(),
      name: newLocation.trim(),
      query: `q=${newLocation.trim()}`
    };

    const updatedFavorites = [...favorites, newFavorite];
    saveFavorites(updatedFavorites);
    setNewLocation('');
    setShowAddForm(false);
  };

  const addCurrentLocation = () => {
    if (!currentLocation) return;

    const newFavorite = {
      id: Date.now(),
      name: currentLocation,
      query: `q=${currentLocation}`
    };

    const updatedFavorites = [...favorites, newFavorite];
    saveFavorites(updatedFavorites);
  };

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    saveFavorites(updatedFavorites);
  };

  const loadFavorite = (favorite) => {
    fetchWeather(favorite.query);
  };

  return (
    <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Favorite Locations</h3>
        <div className="flex gap-2">
          {currentLocation && (
            <button
              onClick={addCurrentLocation}
              className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 transition-colors"
              title="Add current location to favorites"
            >
              <FontAwesomeIcon icon={faStar} />
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 bg-white bg-opacity-20 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 p-2 rounded border"
              onKeyPress={(e) => e.key === 'Enter' && addToFavorites()}
            />
            <button
              onClick={addToFavorites}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">No favorite locations yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center justify-between bg-white bg-opacity-20 p-3 rounded-lg"
            >
              <button
                onClick={() => loadFavorite(favorite)}
                className="flex-1 text-left hover:text-blue-200 transition-colors"
              >
                {favorite.name}
              </button>
              <button
                onClick={() => removeFavorite(favorite.id)}
                className="text-red-400 hover:text-red-600 transition-colors ml-2"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FavoriteLocations.propTypes = {
  fetchWeather: PropTypes.func.isRequired,
  currentLocation: PropTypes.string,
};

export default FavoriteLocations;