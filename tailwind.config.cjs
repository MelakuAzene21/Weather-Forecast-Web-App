module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // This line specifies the files Tailwind should scan for class names.
  ],
  darkMode: 'class',
  theme: {
    // This is where you can extend or customize Tailwind's default theme.
    extend: {
      backgroundImage: {
        'cloudy': "url(https://media.istockphoto.com/id/1330118584/photo/beautiful-white-clouds-on-the-blue-sky-perfect-for-the-background.jpg?s=612x612&w=0&k=20&c=t0e73wzinK2HZpRK9ROVoUwkU3TFmew5ok7eUg_PYno=)",
      },
      boxShadow: {
        'cloudy1': '0 6px 10px rgba(50, 200, 255, 0.5)', // Example shadow with valid rgba values
      }

    },
  },
  plugins: [], // You can add plugins here if needed in the future.
};
