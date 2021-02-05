module.exports = {
  purge: ['./src/**/*.svelte', './public/*.html'],
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
