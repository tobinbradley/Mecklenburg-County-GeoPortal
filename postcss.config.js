const mode = process.env.NODE_ENV || 'development'
const production = mode === 'production'
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss'),
    require('postcss-preset-env')(),
    production &&
      purgecss({
        content: ['./public/**/*.html', './src/**/*.svelte'],
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
        whitelistPatterns: [/mapboxgl/, /svelte-/]
      }),
    production && require('cssnano')()
  ]
}
