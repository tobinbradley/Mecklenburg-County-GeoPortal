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

import './main.css';
import Vue from 'vue';
import webglCheck from './js/webglcheck';
import {getHashQ, getHashLngLat, setHash, urlArgsToHash} from './js/history';
import fetchNearest from './js/nearest';
import Search from './components/search.vue';
import Map from './components/map.vue';
import App from './components/app.vue';
import ReportHeader from './components/report-header.vue';
import Offline from './components/offline.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

// move legacy get args to hash
urlArgsToHash();

// the shared state between components
let appState = {
  selected: {
    lnglat: null,
    label: null,
    address: null,
    pid: null
  },
  poi: {
    lnglat: null,
    label: null,
    address: null
  },
  show: 'welcome',
  initLnglatFlag: false,
  glSupport: webglCheck()
};

// process tab from hash
let hashQ = getHashQ();
if (hashQ) {
  let elem = document.querySelector(`a[data-load="${hashQ}"]`);
  if (elem) {
    document.querySelector(`a[data-load="welcome"]`).classList.remove('active');
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

// sidebar event
let sideNavLinks = document.querySelectorAll('.sidebar .nav a');
Array.from(sideNavLinks).forEach((element, index) => {
  element.addEventListener('click', function() {
    Array.from(sideNavLinks).forEach((element, index) => {
      element.classList.remove('active');
    });
    this.classList.add('active');

    let q = this.getAttribute('data-load');

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

    window.scrollTo(0, 0);
  });
});

// sidebar open and close
document.querySelector('.btnSidebar').addEventListener('click', sidebarToggle);
const hasTouch = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};

function sidebarToggle() {
  document.querySelector('.content').classList.toggle('isOpen');
  document.querySelector('.btnSidebar').classList.toggle('active');
}

// initialize search
Search.data = function() {
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
App.data = function() {
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
ReportHeader.data = function() {
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
Map.data = function() {
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
let toggleMap = document.querySelector('.toggle-map');
toggleMap.addEventListener('click', function() {
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
  window.addEventListener('resize', resizeMapInit, false);
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
  let toggleMap = document.querySelector('.toggle-map');
  if (toggleMap) {
    toggleMap.parentNode.removeChild(toggleMap);
  }
  window.removeEventListener('resize', resizeMapInit, false);
}
