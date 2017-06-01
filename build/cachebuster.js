let whiskers = require('whiskers');
let fs     = require('fs');
let crypto = require('crypto');
let path = require('path');

let templateData = {};

// get files
let html = fs.readFileSync('./app/index.html', 'utf-8').toString();
let css = fs.readFileSync('./public/css/main.css', 'utf-8');
let js = fs.readFileSync('./public/js/app.js', 'utf-8');


// get hashes
let md5sum = crypto.createHash('md5');
let md5sum2 = crypto.createHash('md5');
md5sum.update(js);
templateData.js = md5sum.digest('hex');
md5sum2.update(css);
templateData.css = md5sum2.digest('hex');

// run template
let rendered = whiskers.render(html, templateData);

// write file
fs.writeFileSync(path.join('./public/', 'index.html'), rendered);