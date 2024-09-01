module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x':'gradient-x 5s ease infinite',
      },
      keyframes: {
        rollingColor: {
          '0%': { color: '#8eddff' },
          '50%': { color: '#000000' },
          '100%': { color: '#8eddff' },
        },
      }
    },
  },
}