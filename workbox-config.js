module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{svg,png,json,html}",
    "js/*.js",
    "css/bundle.css"
   ],
  "globIgnores": ["service-worker.js", "**/*.map", "js/*polyfill*.js"],
  "swDest": "public/service-worker.js"
};
