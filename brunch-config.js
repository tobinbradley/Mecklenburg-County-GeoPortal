module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/,
      },
    },
    stylesheets: {
      joinTo: {
        'vendor.css': /^(?!app)/,
        'app.css': /^app/,
      },
      order: {
        before: ['app/css/modules/material.css'],
      },
    },
  },
  npm: {
    styles: {
      'mapbox-gl': ['dist/mapbox-gl.css'],
    },
  },
  plugins: {
    babel: {
      presets: [
        [
          'env',
          {
            targets: {
              browsers: ['last 2 versions'],
            },
          },
        ],
      ],
    },
    postcss: {
      processors: [
        require('postcss-cssnext')({
          browsers: ['last 2 versions'],
          features: {
            customProperties: {
              variables: {
                colorIconic: '#1676D2',
                colorHighlight: 'rgb(255, 183, 77)',
                colorLink: 'rgb(211, 45, 101)',
                colorSidebar: '#263238',
                colorSidebarActive: '#28343B',
                colorSidebarText: '#b0bec5',
                colorBody: '#F5F5F5',
                colorContent: '#ffffff',
                colorText: 'rgb(79, 104, 115)',
              },
            },
          },
        }),
      ],
    },
    swPrecache: {
      options: {
        staticFileGlobs: [
          'public/**/*.{js,json,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}',
        ],
        stripPrefix: 'public/',
      },
    },
  },
};
