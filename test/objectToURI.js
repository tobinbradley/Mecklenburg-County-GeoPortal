// tape boilerplate
require("babel/register")({
    only: './app/js/'
});
var test = require('tape'),
    tapSpec = require('tap-spec');
test.createStream().pipe(tapSpec()).pipe(process.stdout);

// file to test
var objectToURI = require('../app/js/modules/objectToURI');

// tests
var testObj = {
	'key1': 'the value 1',
	'key2': 'the value 2'
};
var testObj2 = {
	'key1': 'handle a ?'
};
test('objectToURI.js', function(t) {
	t.deepEqual(objectToURI(testObj), '?key1=the%20value%201&key2=the%20value%202', 'string returned');
	t.deepEqual(objectToURI(testObj2), '?key1=handle%20a%20%3F', 'string returned and escaped');
    t.end();
});
