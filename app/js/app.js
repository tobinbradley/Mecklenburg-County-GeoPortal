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
import {getHashQ, getHashLngLat, setHash, urlArgsToHash} from './modules/history';
import fetchNearest from './modules/nearest';
import toggleSidebar from './modules/sidebar-hamburger';
import Search from './components/search.vue';
import Map from './components/map.vue';
import App from './components/app.vue';
import ReportHeader from './components/report-header.vue';
import Offline from './components/offline.vue';


// Fix for axios on IE11
if (!window.Promise) {
    window.Promise = Promise;
}

// move legacy get args to hash
urlArgsToHash();

// enabe sidebar hamburger menu
toggleSidebar();

// register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
}

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
    show: 'welcome',
    initLnglatFlag: false,
    glSupport: webglCheck()
};

// process tab from hash
let hashQ = getHashQ();
if (hashQ) {    
    let elem = document.querySelector(`.mdl-navigation__link[data-type="${hashQ}"]`);
    if (elem) {
        document.querySelector(`.mdl-navigation__link[data-type="welcome"]`).classList.remove('active');
        elem.classList.add('active');
        appState.show = hashQ;        
    }
}

// process lnglat from hash
let hashLngLat = getHashLngLat();
if (hashLngLat) {
    appState.initLnglatFlag = true;
    fetchNearest(hashLngLat[1], hashLngLat[0], appState);
}


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
                setHash(appState.selected.lnglat, q);
            } else {
                setHash([], q);
            }
            if (window.ga) {
                window.ga('send', 'event', q, 'question');
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
            show: appState.show
        }
    };
};
new Vue({
    el: 'sc-app',
    render: h => h(App)
});


// report header
ReportHeader.data = function () {
    return {
        sharedState: appState
    };
};
new Vue({
    el: 'sc-reportheader',
    render: h => h(ReportHeader)
});

// offline message
new Vue({
    el: 'sc-offline',
    render: h => h(Offline)
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