// create service worker
const { generateSW } = require("workbox-build");

generateSW({
  globDirectory: "./dist/",
  globPatterns: ["**/*.{html,js,css,png,jpg,svg,json}"],
  globIgnores: ["**/service-worker.js"],
  swDest: "./dist/sw.js",
  dontCacheBustUrlsMatching: /\w{32}\./
}).then(() => {
  console.log("Service worker generated.");
});
