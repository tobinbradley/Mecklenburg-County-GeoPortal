var critical = require('critical');

critical
  .generate({
    inline: true,
    base: 'dist/',
    src: 'index.html',
    dest: 'index.html',
    dimensions: [
      {
        height: 200,
        width: 400
      },
      {
        height: 900,
        width: 1200
      }
    ],
    minify: true,
    include: ['#map', '.mapboxgl-missing-css']
  })
  .then(function(output) {
    console.log('Critical CSS rendered.');
  });
