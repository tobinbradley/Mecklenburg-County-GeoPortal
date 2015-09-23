// tape boilerplate
require("babel/register")({
    only: './app/js/'
});
var test = require('tape'),
    tapSpec = require('tap-spec');
test.createStream().pipe(tapSpec()).pipe(process.stdout);


// file to test
var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    shallowRenderer = TestUtils.createRenderer(),
    ParkInfo = require('../app/js/modules/parks');

var recs = [];
var props = {lat: 35.4617, lng: -80.8798};
shallowRenderer.render(React.createElement(ParkInfo, props));
var output = shallowRenderer.getRenderOutput();

//console.log(shallowRenderer);

// As the initial load of the react components doesn't have any data
// yet (pending ajax request) and I can't figure out how to delay that
// sucker until it fetches, my react component unit testing is kinda
// boned.
