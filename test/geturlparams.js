// tape boilerplate
require("babel/register")({
    only: './app/js/'
});
var test = require('tape'),
    tapSpec = require('tap-spec');
test.createStream().pipe(tapSpec()).pipe(process.stdout);

// file to test
var getURLParameter = require('../app/js/modules/geturlparams');

// tests
test('geturlparams.js', function(t) {
    t.deepEqual(getURLParameter('m', '?n=2&m=5'), '5', 'parameter returned');
    t.equal(getURLParameter('z', '?n=2&m=5'), 'null', 'null returned');
    t.end();
});
