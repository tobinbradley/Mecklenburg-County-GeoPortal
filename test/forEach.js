// tape boilerplate
require("babel/register")({
    only: './app/js/'
});
var test = require('tape'),
    tapSpec = require('tap-spec');
test.createStream().pipe(tapSpec()).pipe(process.stdout);

// file to test
var forEach = require('../app/js/modules/forEach');

// tests
var testArray = ['value 1', 'value 2', { 'key': 'value' }];
test('forEach.js', function(t) {
	forEach(testArray, function(index, value) {
		switch(index) {
		    case 0:
		        t.deepEqual(value, 'value 1', 'string returned');
		        break;
		    case 1:
		        t.deepEqual(value, 'value 2', 'string returned');
		        break;
			case 2:
		        t.deepEqual(value, { 'key': 'value' }, 'object returned');
				t.deepEqual(value.key, 'value', 'object queried');
		        break;
		}
	});
    t.end();
});
