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

import Vue from 'vue';
import 'whatwg-fetch';
import webglCheck from './modules/webglcheck';
import Promise from 'promise-polyfill';
import getURLParameter from './modules/geturlparams';
import fetchNearest from './modules/nearest';
import toggleSidebar from './modules/sidebar-hamburger';
import Search from './components/search.vue';
import Map from './components/map.vue';
import App from './components/app.vue';
import ReportHeader from './components/report-header.vue';


// Fix for axios on IE11
if (!window.Promise) {
    window.Promise = Promise;
}

// enabe sidebar hamburger menu
toggleSidebar();

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
    initLnglatFlag: false,
    glSupport: webglCheck()
};

// process URL arguments on page load
if (getURLParameter('q') !== 'null') {
    let q = getURLParameter('q');
    let elem = document.querySelector(`.mdl-navigation__link[data-type="${q}"]`);
    if (elem) {
        elem.classList.add('active');
        appState.show = q;
    }
} else {
    let elem = document.querySelector(`.mdl-navigation__link[data-type="${appState.show}"]`);
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
    navlinks[i].addEventListener('click', function () {
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
                window.ga('send', 'event', q, 'question');
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

// initialize search
Search.data = function () {
    return {
        privateState: {
            query: '',
            results: [],
            gps: true
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-search',
    render: h => h(Search)
});

// initialize main app
App.data = function () {
    return {
        sharedState: appState,
        privateState: {
            show: "welcome"
        }
    };
};
new Vue({
    el: 'sc-app',
    render: h => h(App)
});

// initialize main app
ReportHeader.data = function () {
    return {
        sharedState: appState
    };
};
new Vue({
    el: 'sc-reportheader',
    render: h => h(ReportHeader)
});

// Kick the map
let mapVM = null;
Map.data = function () {
    return {
        privateState: {
            map: null,
            locationMarker: null,
            poiMarker: null,
            markerClicked: false
        },
        sharedState: appState
    };
};

// set toggle map button click
let toggleMap = document.querySelector(".toggle-map");
toggleMap.addEventListener("click", function () {
    if (appState.glSupport) {
        initMap();
    }
});

// remove map toggle button if gl not supported
if (!appState.glSupport) {
    toggleMap.parentNode.removeChild(toggleMap);
}

// initialize map if gl supported and not in single column mode
if (appState.glSupport && document.body.getBoundingClientRect().width > 840) {
    initMap();
} else {
    window.addEventListener("resize", resizeMapInit, false);
}

// resize window function
function resizeMapInit() {
    if (document.body.getBoundingClientRect().width > 840 && !mapVM) {        
        initMap();
    }
}

// initialize map, remove map toggle button, remove window resize event
function initMap() {
    mapVM = new Vue({
        el: 'sc-map',
        render: h => h(Map)
    });
    let toggleMap = document.querySelector(".toggle-map");
    if (toggleMap) {
        toggleMap.parentNode.removeChild(toggleMap);
    }
    window.removeEventListener("resize", resizeMapInit, false);
}