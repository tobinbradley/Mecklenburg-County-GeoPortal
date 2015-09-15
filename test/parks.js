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

// tests


//shallowRenderer.getParks(35, -79);


//const component = shallowRenderer.getRenderOutput();


//console.log(shallowRenderer._instance._instance.props.lng);
//console.log(component);

//const shallowRenderer = TestUtils.createRenderer();
var props = {lat: 35.4617, lng: -80.8798};
shallowRenderer.render(React.createElement(ParkInfo, props));
var output = shallowRenderer.getRenderOutput();

//console.log(shallowRenderer);

// test('parks.js', function(t) {
//
    setTimeout(function(){
        //console.log(shallowRenderer);
        console.log('hi', shallowRenderer._instance);
    }, 2000);
// });

//console.log(component);

// describe('PostList component', function() {
//   const postData = [
//     { id: 1, title: 'Title 1', content: '<p>Content 1</p>' },
//     { id: 2, title: 'Title 2', content: '<p>Content 2</p>' },
//     { id: 3, title: 'Title 3', content: '<p>Content 3</p>' }
//   ];
//
//   it('should render a list of post components', function() {
//     const tree = sd.shallowRender(React.createElement(PostList, {posts: postData}));
//     const vdom = tree.getRenderOutput();
//     const items = vdom.props.children.filter(postListItem => TestUtils.isElementOfType(postListItem.props.children, Post));
//
//     expect(items.length).to.equal(postData.length);
//   });
// });
