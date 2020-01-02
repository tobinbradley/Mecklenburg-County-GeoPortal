module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{svg,png,json,html}",
    "js/*.js",
    "css/bundle.css"
   ],
  "globIgnores": ["service-worker.js", "**/*.map"],
  "swDest": "public/service-worker.js"
};
