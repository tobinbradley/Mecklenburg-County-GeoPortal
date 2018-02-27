// Copy statis assets into dist folder
const shell = require('shelljs');
const fs = require('fs');
const dir = 'dist';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

shell.cp('-R', 'app/assets/*', dir);

console.log('static assets moved');
