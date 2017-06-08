let Version = require("node-version-assets");

let versionInstance = new Version({
    assets: ['public/css/main.css', 'public/js/app.js'],
    grepFiles: ['public/index.html']
});

versionInstance.run();