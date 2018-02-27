// create service worker
const workboxBuild = require('workbox-build');

workboxBuild.generateSW({
    globDirectory: './dist/',
    globPatterns: ['**\/*.{html,js,css,png,jpg,svg,json}'],
    swDest: './dist/sw.js',
    dontCacheBustUrlsMatching: /\w{32}\./
  })
  .then(() => {
    console.log('Service worker generated.');
  });