module.exports = {
  use: ['postcss-import', 'postcss-cssnext', 'cssnano'],
  'postcss-import': {
    onImport: function(sources) {
      global.watchCSS(sources, this.from);
    }
  },
  'postcss-cssnext': {warnForDuplicates: false}
};
