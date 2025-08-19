module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // This line specifies the files Tailwind should scan for class names.
  ],
  darkMode: 'class',
  theme: {
    // This is where you can extend or customize Tailwind's default theme.
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif']
      },
      backgroundImage: {
        'cloudy': "url(https://media.istockphoto.com/id/1330118584/photo/beautiful-white-clouds-on-the-blue-sky-perfect-for-the-background.jpg?s=612x612&w=0&k=20&c=t0e73wzinK2HZpRK9ROVoUwkU3TFmew5ok7eUg_PYno=)",
        'weather-clear': "url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1600&auto=format&fit=crop)",
        'weather-clouds': "url(https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1600&auto=format&fit=crop)",
        'weather-rain': "url(https://images.unsplash.com/photo-1493314894560-5c412a56c17e?q=80&w=1600&auto=format&fit=crop)",
        'weather-snow': "url(https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1600&auto=format&fit=crop)",
        'weather-thunder': "url(https://images.unsplash.com/photo-1500674425229-f692875b0ab7?q=80&w=1600&auto=format&fit=crop)",
        'weather-mist': "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop)",
        'weather-night': "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop)"
      },
      boxShadow: {
        'cloudy1': '0 6px 10px rgba(50, 200, 255, 0.5)', // Example shadow with valid rgba values
      }

    },
  },
  plugins: [], // You can add plugins here if needed in the future.
};
