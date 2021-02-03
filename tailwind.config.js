module.exports = {
  // purge: {
  //   mode: 'all',
  //   content: ['./src/**/*.svelte', './public/*.html'],
  //   options: {
  //     whitelistPatterns: [/mapboxgl/, /svelte-/, /sparkline--/]
  //   }
  // },
  purge: ['./src/**/*.svelte', './public/*.html'],
  darkMode: false,
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' },
        'screen': { 'raw': 'screen' }
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: []
}
