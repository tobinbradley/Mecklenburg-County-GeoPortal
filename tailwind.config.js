module.exports = {
  purge: {
    mode: 'all',
    content: ['./src/**/*.html', './src/**/*.svelte', './src/**/*.vue', './src/**/*.jsx'],
    options: {
      whitelistPatterns: [/mapboxgl/, /svelte-/, /sparkline--/]
    }
  },
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' }
      }
    }
  },
  variants: {},
  plugins: []
}
