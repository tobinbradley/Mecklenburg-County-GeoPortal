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
require('material-design-lite');

//import Vue from 'vue/dist/vue.js';
import Vue from 'vue';
import getURLParameter from './modules/geturlparams';
import fetchNearest from './modules/nearest';
import Search from './components/search.vue';
import Map from './components/map.vue';
import App from './components/app.vue';
import Photos from './components/photos.vue';


// the shared state between components
let appState = {
    selected: {
        'lnglat': null,
        'label': null,
        'address': null,
        'pid': null
    },
    poi: {
        lnglat: null,
        'label': null,
        'address': null
    },
    show: "welcome",
    mapOverlay: null,
    initLnglatFlag: false
};

// process URL arguments on page load
if (getURLParameter('q') !== 'null') {
    let q = getURLParameter('q');
    let elem =  document.querySelector(`.mdl-navigation__link[data-type="${q}"]`);
    if (elem) {
        elem.classList.add('active');
        appState.show = q;
    }
} else {
    let elem =  document.querySelector(`.mdl-navigation__link[data-type="${appState.show}"]`);
    elem.classList.add('active');
}
if (getURLParameter('latlng') !== 'null') {
    let latlng = getURLParameter('latlng').split(',');
    appState.initLnglatFlag = true;

    fetchNearest(latlng[0], latlng[1], appState);
}

// for debugging
window.appState = appState;

// navigation
let navlinks = document.querySelectorAll('.mdl-navigation__link');
for (let i = 0; i < navlinks.length; i++) {
    navlinks[i].addEventListener('click', function() {
        let item = navlinks[i];

        if (!item.classList.contains('active')) {

            for (let i = 0; i < navlinks.length; i++) {
                navlinks[i].classList.remove('active');
            }
            item.classList.add('active');

            let q = item.getAttribute('data-type');

            // push state and GA
            if (appState.selected.lnglat) {
                history.replaceState(null, null, `?q=${q}&latlng=${appState.selected.lnglat[1]},${appState.selected.lnglat[0]}`);
            } else {
                history.replaceState(null, null, `?q=${q}`);
            }
            if (window.ga) {
                ga('send', 'event', q, 'question');
            }


            // load overlays
            if (item.getAttribute('data-layers')) {
                appState.mapOverlay = item.getAttribute('data-layers');
            } else {
                appState.mapOverlay = null;
            }

            appState.show = q;
            scrollToElement(document.querySelector('.report-container'));
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


// pass newly created mdl elements through mdl
Vue.directive('mdl', {
    inserted: function (el) {
        componentHandler.upgradeElement(el);
    }
});

// initialize search
Search.data = function() {
    return {
        privateState: {
            query: '',
            results: [],
            gps: false
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-search',
    render: h => h(Search)
});

// initialize main app
App.data = function() {
    return {       
        sharedState: appState
    };
};
new Vue({
    el: 'sc-app',
    render: h => h(App)
});

// initialize photos
Photos.data = function() {
    return {
        privateState: {
            results: [],
            photoIndex: 0
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-photos',
    render: h => h(Photos)
});

// initialize map if webgl supported
try {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // webgl in the House
    Map.data = function() {
        return {
            privateState: {
                map: null,
                locationMarker: null,
                poiMarker: null,
                fullScreen: true,
                markerClicked: false
            },
            sharedState: appState
        };
    };
    new Vue({
        el: 'sc-map',
        render: h => h(Map)
    });
}
catch (e) {
    // drop the map
    let elMap = document.querySelector('.mdl-card-map');
    elMap.parentNode.removeChild(elMap);
    let elMapSpacer = document.querySelector('#map-spacer');
    elMapSpacer.parentNode.removeChild(elMapSpacer);
}


