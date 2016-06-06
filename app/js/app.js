// __________________________________
// / GeoPortal v3, by Tobin Bradley and \
// \ Mecklenburg County GIS.            /
// ----------------------------------
//        \   ^__^
//         \  (oo)\_______
//            (__)\       )\/\
//                ||----w |
//                ||     ||
//

// Fix for axios on IE11
require('es6-promise').polyfill();

let componentHandler = require('./modules/material'),
    getURLParameter = require('./modules/geturlparams'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    SearchTemplate = require('./modules/search'),
    HousePhotos = require('./modules/photos'),
    fetchNearest = require('./modules/nearest'),
    youtubeLoader = require('./modules/youtube');

import GLMap from './modules/map.js';

// murder fullscreen button if not available
var elem = document.querySelector('.map-container');
if (!elem.requestFullscreen && !elem.mozRequestFullScreen && !elem.webkitRequestFullScreen && !elem.msRequestFullscreen) {
    document.querySelector('.map-fullscreen').setAttribute("disabled", true);
    document.querySelector('.map-fullscreen').removeAttribute("onclick");
}

// load map if able to
try {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // map in the House
    if (getURLParameter('latlng') !== 'null') {
        let lnglat = getURLParameter('latlng').split(',').reverse();
        global.map = ReactDOM.render(<GLMap center={lnglat} zoom={17} /> ,
            document.querySelector('.map-catcher')
        );
    } else {
        global.map = ReactDOM.render( <GLMap /> ,
            document.querySelector('.map-catcher')
        );
    }
}
catch (e) {
    //hide map and show message
    let el = document.querySelector('body');
    let elChild = document.createElement('div');
    elChild.classList.add('oldie');
    elChild.innerHTML = 'You are using an outdated browser. <a href="http://whatbrowser.org/">Upgrade your browser today</a> to better experience this site.';
    el.insertBefore(elChild, el.firstChild);
    let elMap = document.querySelector('.mdl-card-map');
    elMap.parentNode.removeChild(elMap);
}

// the selected location
global.activeRecord = '';

// initial react components for search results
let searchComponent = ReactDOM.render( < SearchTemplate / > ,
    document.getElementById('search-results')
);

// load youtube vid holder
youtubeLoader('.youtube');

// search box input and click events
let theSearch = document.querySelector(".search-input");
theSearch.addEventListener("input", function(e) {
    searchComponent.getRecords(e.target.value);
});
theSearch.addEventListener("click", function(e) {
    e.target.focus();
    e.target.select();
});

// Data type/sidebar switching links
let navlinks = document.querySelectorAll('.mdl-navigation__link');
for (let i = 0; i < navlinks.length; i++) {
    navlinks[i].addEventListener('click', function() {
        let item = navlinks[i];
        if (!item.classList.contains('active')) {
            let container = document.querySelector('.report-container');
            let drawer = document.querySelector('.mdl-layout__drawer');
            if (drawer) {
                drawer.classList.remove('is-visible');
                document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
            }
            questionChange(item, navlinks, container, 'click');
            if (typeof activeRecord === 'object') {
                let q = item.getAttribute('data-type');
                scrollToElement(document.querySelector('.report-container'));
                questionRun(q, activeRecord.latlng, activeRecord.label, activeRecord.pid, activeRecord.address, activeRecord.id);
            } else {
                scrollToElement(document.querySelector('.search-container'));
                document.querySelector('.search-input').focus();
            }
        }
    });
}

// scroll to element if top is past viewport available, otherwise it jumps
function scrollToElement(elem) {
    if (elem.getBoundingClientRect().top < 0) {
        elem.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    }
}

function questionChange(elem, navs, container, changeType) {
    var q = elem.getAttribute('data-type');

    // add active class
    for (let i = 0; i < navs.length; i++) {
        navs[i].classList.remove('active');
    }
    elem.classList.add('active');

    // activate layers
    if (global.map) {
        if (elem.getAttribute("data-layers")) {
            global.map.setOverlayLayer(elem.getAttribute("data-layers"), elem.getAttribute("data-layers-position"));
        } else {
            global.map.setOverlayLayer();
        }
    }

    // clean up existing react content
    ReactDOM.unmountComponentAtNode(container);

    // history
    if (changeType !== 'page') {
        var matArg = '';
        if (getURLParameter('latlng') !== 'null') {
            matArg = '&latlng=' + getURLParameter('latlng');
        }
        history.replaceState(null, null, `?q=${q}${matArg}`);
    }

    // analytics
    if (window.ga) {
        ga('send', 'event', q, changeType);
    }
}

// mount react data components
function questionRun(q, latlng, label, pid, gid) {
    var lat = Number(latlng.split(',')[0]);
    var lng = Number(latlng.split(',')[1]);
    switch (q) {
        case 'property':
            let PropertyClass = require('./modules/property');
            let propertyComponent = ReactDOM.render( < PropertyClass lat={lat} lng={lng} pid={pid} gid={Number(gid)} />,
                document.querySelector('.report-container')
            );
            break;
        case 'trash':
            let TrashInfo = require('./modules/trash');
            let trashInfo = ReactDOM.render( < TrashInfo lat={lat} lng={lng} />,
                document.querySelector('.report-container')
            );
            break;
        case 'parks':
            let ParkInfo = require('./modules/parks');
            let parkInfo = ReactDOM.render( < ParkInfo lat={lat} lng={lng} />,
                document.querySelector('.report-container')
            );
            break;
        case 'libraries':
            let LibraryInfo = require('./modules/library');
            let libraryInfo = ReactDOM.render( < LibraryInfo lat={lat} lng={lng} />,
                document.querySelector('.report-container')
            );
            break;
        case 'impervious':
            let ImperviousInfo = require('./modules/impervious');
            let imperviousInfo = ReactDOM.render( < ImperviousInfo pid={pid} />,
                document.querySelector('.report-container')
            );
            break;
        case 'schools':
            let SchoolsInfo = require('./modules/schools');
            let schoolsInfo = ReactDOM.render( < SchoolsInfo lat={lat} lng={lng} />,
                document.querySelector('.report-container')
            );
            break;
        case 'voting':
            let VotingComponent = require('./modules/voting');
            let votingInfo = ReactDOM.render( < VotingComponent lat = {lat} lng = {lng} />,
                document.querySelector('.report-container')
            );
            break;
        case 'environment':
            let EnvironmentComponent = require('./modules/environment');
            let environmentInfo = ReactDOM.render( < EnvironmentComponent lat={lat} lng={lng} pid={pid} gid={Number(gid)} />,
                document.querySelector('.report-container')
            );
            break;
    }
}


// process a newly selected location
global.processRecord = function(gid, latlng, label, pid, address) {
    let q = document.querySelector('.mdl-navigation__link.active').getAttribute('data-type');
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
    if (global.map) {
        global.map.addressMarker(latlng.split(',').reverse(), label);
    }
    // push state
    history.replaceState(null, null, `?q=${q}&latlng=${latlng}`);
    // reports
    questionRun(q, latlng, label, pid, gid);
    // photos
    let photos = ReactDOM.render( < HousePhotos pid = {pid} />,
        document.querySelector('.photos')
    );
};

// process URL arguments on page load
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

// set focus to search input after waiting a second
// window.onload = function() {
//     setTimeout(function() {
//         document.querySelector(".search-input").focus();
//     }, 1000);
// };
