// Clean dist folder and copy static assets
const shell = require('shelljs');
const fs = require('fs');
const dir = 'dist';

shell.rm('-rf', dir);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

shell.cp('-R', 'app/assets/*', dir);

console.log('dist folder cleaned and static assets dropped');
