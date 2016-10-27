let handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path');


var source = fs.readFileSync('./app/index.html', 'utf-8').toString();
var data = {
    cachebuster: Math.floor((Math.random() * 100000) + 1)
};

var template = handlebars.compile(source);
var html = template(data);
fs.writeFileSync(path.join('./public/', 'index.html'), html);
