// Note in order to use MDL, this needs to be dropped onto the end of material.js:
// if (typeof module === 'object') {
//   module.exports = componentHandler;
// }


// global npm req's: gulp, tape

// currently built with material design lite 1.0.4 with just the components needed

//var componentHandler = require('../../bower_components/material-design-lite/material');
var componentHandler = require('./modules/material');

//var _ = require('underscore/underscore')._;

var forEach = require('./modules/foreach'),
    getURLParameter = require('./modules/geturlparams'),
    React = require('react'),
    SearchTemplate = require('./modules/search'),
    HousePhotos = require('./modules/photos'),
    questionChange = require('./modules/question-change'),
    questionRun = require('./modules/question-run'),
    fetchNearest = require('./modules/nearest');

// require dumps because stupid brains
require('./modules/map');

global.activeRecord = '';

var searchComponent = React.render( < SearchTemplate /> ,
    document.getElementById('search-results')
);

var photos = React.render( < HousePhotos /> ,
    document.querySelector('.photos')
);


var theSearch = document.querySelector(".search-input");
theSearch.addEventListener("input", function(e) {
    searchComponent.getRecords(e.target.value);
});
theSearch.addEventListener("click", function(e) {
    e.target.focus();
    e.target.select();
});

// Data type switching links
var navlinks = document.querySelectorAll(".mdl-navigation__link");
forEach(navlinks, function(index, value) {
    navlinks[index].addEventListener("click", function(e) {
        var item = navlinks[index];
        if (!item.classList.contains('active')) {
            var container = document.querySelector('.report-container');
            var drawer = document.querySelector('.mdl-layout__drawer');
            if (drawer) {
                drawer.classList.remove('is-visible');
            }
            questionChange(item, navlinks, container, 'click');
            if (typeof activeRecord === 'object') {
                var q = item.getAttribute("data-type");
                questionRun(q, activeRecord.latlng, activeRecord.label, activeRecord.pid, activeRecord.address, activeRecord.id);
            } else {
                document.querySelector(".search-input").focus();
            }
        }
    });
});



global.processRecord = function(gid, latlng, label, pid, address) {
    var q = document.querySelector(".mdl-navigation__link.active").getAttribute("data-type");
    activeRecord = {
        "id": gid,
        "latlng": latlng,
        "label": label,
        "pid": pid,
        "address": address
    };
    // populate search box
    document.querySelector('.search-input').value = label;
    // clear search results
    searchComponent.setState({
        searchData: null
    });
    // add map marker, popup, and zoom
    addMarker(latlng, label, pid, address);
    // photos
    photos.getPhotos(pid);
    // push state
    history.replaceState(null, null, `?q=${q}&latlng=${latlng}`);
    // reports
    questionRun(q, latlng, label, pid, gid);
};

// handle url args
if (getURLParameter('q') !== 'null') {
    var navs = document.querySelectorAll(".mdl-navigation__link"),
        q = getURLParameter('q'),
        elem = document.querySelector(`.mdl-navigation__link[data-type="${q}"]`),
        container = document.querySelector('.report-container');

    if (elem) {
        questionChange(elem, navs, container, 'page');
    }
}
if (getURLParameter('latlng') !== 'null') {
    let latlng = getURLParameter('latlng').split(',');
    fetchNearest(latlng[0], latlng[1]);
}

// set focus to search input
window.onload = function() {
    setTimeout(function() {
        document.querySelector(".search-input").focus();
    }, 1000);
};
