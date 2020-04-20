module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{svg,png,json,html}",
    "js/**/*.js",
    "css/**/*.css"
   ],
  "globIgnores": ["service-worker.js", "workbox-*", "**/*.map", "js/*polyfill*.js"],
  "swDest": "public/service-worker.js"
};
