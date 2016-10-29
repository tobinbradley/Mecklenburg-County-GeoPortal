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
import Introduction from './components/introduction.vue';
import Map from './components/map.vue';
import Parks from './components/parks.vue';
import Libraries from './components/libraries.vue';
import Property from './components/property.vue';
import Impervious from './components/impervious.vue';
import Photos from './components/photos.vue';
import Schools from './components/schools.vue';
import Trash from './components/trash.vue';
import Environment from './components/environment.vue';
import Voting from './components/voting.vue';
import QualityOfLife from './components/qualityoflife.vue';


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
    show: ["introduction", "property"],
    mapOverlay: null
};

// process URL arguments on page load
if (getURLParameter('q') !== 'null') {
    let q = getURLParameter('q');
    let navs = document.querySelectorAll(".mdl-navigation__link");
    let elem =  document.querySelector(`.mdl-navigation__link[data-type="${q}"]`);

    if (elem) {
        for (let i = 0; i < navs.length; i++) {
            navs[i].classList.remove('active');
        }
        elem.classList.add('active');
        appState.show = ["introduction", q];
    }
}
if (getURLParameter('latlng') !== 'null') {
    let latlng = getURLParameter('latlng').split(',');
    let index = appState.show.indexOf("introduction");

    if (index !== -1) {
        appState.show.splice(index, 1);
    }
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

            // push state
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

            if (appState.selected.lnglat) {
                appState.show = [q];
                scrollToElement(document.querySelector('.report-container'));
            } else {
                scrollToElement(document.querySelector('.search-container'));
                appState.show = ["introduction", q];
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


// show map if webgl supported
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



// set component data
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

Introduction.data = function() {
    return {
        sharedState: appState
    };
};
new Vue({
    el: 'sc-introduction',
    render: h => h(Introduction)
});



Parks.data = function() {
    return {
        privateState: {
            results: null
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-parks',
    render: h => h(Parks)
});

Libraries.data = function() {
    return {
        privateState: {
            results: null
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-libraries',
    render: h => h(Libraries)
});

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

Trash.data = function() {
    return {
        privateState: {
            results: []
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-trash',
    render: h => h(Trash)
});

Schools.data = function() {
    return {
        privateState: {
            resultsMagnet: [],
            resultsElementary: [],
            resultsMiddle: [],
            resultsHigh: []
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-schools',
    render: h => h(Schools)
});

Voting.data = function() {
    return {
        privateState: {
            resultsOfficials: [],
            resultsPrecinct: [],
            resultsNatlcong: [],
            resultsNCSenate: [],
            resultsNCHouse: [],
            resultsCharlotte: []
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-voting',
    render: h => h(Voting)
});

Impervious.data = function() {
    return {
        privateState: {
            results: null
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-impervious',
    render: h => h(Impervious)
});

QualityOfLife.data = function() {
    return {
        privateState: {
            trends: null,
            neighborhood: null,
            metric: '37',
            embedURL: null,
            embedBase: 'http://mcmap.org/qol-embed/embed.html'
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-qualityoflife',
    render: h => h(QualityOfLife)
});

Property.data = function() {
    return {
        privateState: {
            resultsZoning: [],
            resultsOwnership: [],
            resultsAppraisal: [],
            resultsSales: [],
            resultsLanduse: [],
            resultsBuildings: [],
            resultsPermits: []
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-property',
    render: h => h(Property)
});

Environment.data = function() {
    return {
        privateState: {
            resultsFloodplain: null,
            resultsSoil: null,
            resultsWaterquality: null,
            resultsPostconstruction: null,
            resultsWatershed: null
        },
        sharedState: appState
    };
};
new Vue({
    el: 'sc-environment',
    render: h => h(Environment)
});
