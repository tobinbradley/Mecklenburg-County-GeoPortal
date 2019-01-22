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

import './main.css'
import Vue from 'vue'
import { store } from './store'
import {getHashQ, getHashLngLat, setHash, urlArgsToHash} from './js/history'
import fetchNearest from './js/nearest'
import Search from './components/search.vue'
import Map from './components/map.vue'
import App from './components/app.vue'
import Offline from './components/offline.vue'
import './registerServiceWorker'

Vue.config.productionTip = false;

// move legacy get args to hash
urlArgsToHash();

// process tab from hash
let hashQ = getHashQ();
if (hashQ) {
  let elem = document.querySelector(`a[data-load="${hashQ}"]`);
  if (elem) {
    document.querySelector(`a[data-load="welcome"]`).classList.remove('active')
    elem.classList.add('active')
    store.commit("show", hashQ)
  }
}

// process lnglat from hash
let hashLngLat = getHashLngLat();
if (hashLngLat) {
  fetchNearest(
    hashLngLat[1], hashLngLat[0]
  )
  .then(data => {
    store.commit("selected", {
      lnglat: [data.lng, data.lat],
      label: data.label,
      address: data.address,
      pid: data.pid
    })
    store.commit("initLnglatFlag", false)
  })
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
    if (store.getters.selected.lnglat) {
      setHash(store.getters.selected.lnglat, q);
    } else {
      setHash([], q);
    }
    if (window.ga) {
      window.ga('send', 'event', q, 'question');
    }

    store.commit("show", q)
    
    window.scrollTo(0, 0);
  });
});

// sidebar open and close
document.querySelector('.ham').addEventListener('click', function() {
  document.querySelector('.content').classList.toggle('isOpen')
})

// search
new Vue({
  store,
  el: 'sc-search',
  render: h => h(Search)
})

// initialize main app
new Vue({
  store,
  el: 'sc-app',
  render: h => h(App)
});

// offline message
new Vue({
  el: 'sc-offline',
  render: h => h(Offline)
});

// Kick the map
let mapVM = null;

// set toggle map button click
let toggleMap = document.querySelector('.toggle-map')
toggleMap.addEventListener('click', function() {
  initMap()
})


// initialize map if gl supported and not in single column mode
if (document.body.getBoundingClientRect().width > 840) {
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
    store,
    el: 'sc-map',
    render: h => h(Map)
  });
  let toggleMap = document.querySelector('.toggle-map');
  if (toggleMap) {
    toggleMap.parentNode.removeChild(toggleMap);
  }
  window.removeEventListener('resize', resizeMapInit, false);
}
