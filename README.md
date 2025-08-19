## Weather Pro — React Weather Web App

A modern, responsive weather web app built with React + Vite. It delivers real‑time conditions, hourly and multi‑day forecasts, air quality insights, and interactive weather maps via OpenWeather APIs. The UI features dynamic, weather‑based backgrounds, dark mode, and a fast city autocomplete experience.

### Highlights
- **Fast search with autocomplete**: Debounced geocoding with client‑side caching, keyboard navigation, and recent searches.
- **Location support**: Use current geolocation for instant local weather.
- **Tabbed views**: Current, Hourly (24h), 4‑Day, Details, Map, Air Quality, Compare, Favorites.
- **Current weather**: Temperature, description, humidity, wind, pressure, local date/time.
- **Hourly**: Temp, conditions, wind, visibility, and precipitation probability.
- **4‑Day**: Daily min/max with context‑aware icons and descriptions.
- **Details**: Feels‑like, humidity, pressure, visibility, wind direction, sunrise/sunset.
- **Map**: OpenWeather tile layers (temperature, precipitation, pressure, wind, clouds).
- **Air Quality**: AQI with pollutant breakdown and severity.
- **Compare**: Track up to four cities side‑by‑side.
- **Favorites**: Save, load, and manage favorite locations (duplicate‑proof).
- **Theme & UX**: Dark mode (persisted), dynamic backgrounds by condition/time, Inter font, smooth transitions.

### Tech Stack
- React 18, Vite 5
- Tailwind CSS 3
- Axios
- Font Awesome (React)

### OpenWeather APIs Used
- Current Weather Data
- 5 day / 3 hour Forecast
- Geocoding API (for city autocomplete)
- Air Pollution API (AQI)
- Weather Maps (Tile layers)

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- An OpenWeather API key: create one at `https://openweathermap.org/api`

### Install
```bash
npm install
```

### Configure API Key
This project currently stores the API key in a few source files. Replace the placeholder with your key in these files:

- `src/App.jsx` (search and weather fetching)
- `src/components/AirQuality.jsx` (air quality)
- `src/components/WeatherMap.jsx` (tile layers)
- `src/components/WeatherComparison.jsx` (comparisons)

Search for `API_KEY =` and paste your key. Example:
```js
const API_KEY = 'YOUR_OPENWEATHER_API_KEY_HERE';
```

Tip: If you prefer environment variables, we can refactor to use `import.meta.env.VITE_OPENWEATHER_API_KEY` and a `.env` file.

### Run in Development
```bash
npm run dev
```
Open the URL printed by Vite (typically `http://localhost:5173`).

### Build for Production
```bash
npm run build
npm run preview
```

---

## Usage Guide
- Use the search bar to look up cities; autocomplete supports arrows and Enter.
- Click “Use Current Location” to allow geolocation.
- Switch units (Celsius/Fahrenheit) from the Units selector.
- Navigate tabs for Hourly, 4‑Day, Details, Map, Air, Compare, and Favorites.
- Add favorites from the Favorites tab (duplicates are ignored).
- Toggle theme using the Dark/Light button (state is saved).

---

## Project Structure
```
src/
  App.jsx                 # Main app & routing between feature tabs
  index.css               # Tailwind, global styles (Inter, transitions)
  main.jsx                # App bootstrap
  components/
    SearchBar.jsx         # Debounced autocomplete, recent searches, keyboard nav
    CurrentWeather.jsx    # Current conditions card
    HourlyForecast.jsx    # 24h forecast (3h steps)
    Forecast.jsx          # 4‑day forecast (aggregated)
    WeatherDetails.jsx    # Feels‑like, humidity, pressure, sunrise/sunset, etc.
    WeatherMap.jsx        # OpenWeather map tiles selector
    AirQuality.jsx        # AQI + pollutants breakdown
    WeatherComparison.jsx # Compare up to 4 cities
    FavoriteLocations.jsx # Manage saved locations
    WeatherAlerts.jsx     # Contextual alerts (heat, wind, visibility, storms)
    LocationButton.jsx    # Geolocation fetch action
```

---

## Available Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — run ESLint

---

## Deployment
This is a static SPA; you can deploy to Netlify, Vercel, GitHub Pages, or any static host. Ensure:
- API key is configured (either inline as now or via env with a refactor).
- Site is served over HTTPS (geolocation and OpenWeather APIs work best over HTTPS).

---

## Notes & Limitations
- OpenWeather free tiers have request and rate limits.
- Weather backgrounds use remote images; ensure network access in restrictive environments.
- UV index and dew point are not part of the basic “Current Weather” API; those UI slots will populate if the app is extended to use One Call.

---

## License
This project is provided as-is for educational and demonstration purposes. Add a license if you plan to open-source or distribute.
