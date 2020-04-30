module.exports = {
  purge: {
    mode: 'all',
    content: ['./src/**/*.html', './src/**/*.svelte', './src/**/*.vue', './src/**/*.jsx'],
    options: {
      whitelistPatterns: [/mapboxgl/, /svelte-/]
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
