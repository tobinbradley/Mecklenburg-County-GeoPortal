module.exports = {
  purge: {
    mode: 'all',
    content: ['./src/**/*.svelte', './public/*.html'],
    options: {
      whitelistPatterns: [/mapboxgl/, /svelte-/, /sparkline--/]
    }
  },
  darkMode: false,
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' }
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: []
}
