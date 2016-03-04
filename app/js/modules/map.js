let L = require('leaflet/dist/leaflet'),
    fetchNearest = require('./nearest'),
    customFullscreenToggle = require('./fullscreen-control'),
    getURLParameter = require('./geturlparams');

/* dump leaflet fullscreen */
require('leaflet-fullscreen');

// globals for markers and overlay layers
global.marker = '';
global.overlay = '';
global.tmpMarker = '';

// set map default center and zoom
// use latlng from url if available
let defaultCenter = [35.272, -80.827];
let defaultZoom = 9;
if (getURLParameter('latlng') !== 'null') {
    defaultCenter = getURLParameter('latlng').split(',');
    defaultZoom = 16;
}

// set up the map
L.Icon.Default.imagePath = './img';
global.map = L.map('map', {
    attributionControl: false,
    scrollWheelZoom: false
}).setView(defaultCenter, defaultZoom);

// add and manage map layers
var meckbase = L.tileLayer('http://tiles.mcmap.org/meckbase/{z}/{x}/{y}.png', {
    'minZoom': 9,
    'maxZoom': 18,
    'attribution': `<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>`
}).addTo(map);
var aerials = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: `<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>`
});
var baseMaps = {
    'Streets': meckbase,
    'Earth': aerials
};

L.control.layers(baseMaps).addTo(map);
global.addOverlay = function (theLayers) {
    removeOverlay();
    overlay = L.tileLayer.wms('http://maps.co.mecklenburg.nc.us/geoserver/wms', {
        layers: theLayers,
        format: 'image/png',
        transparent: true,
        opacity: 0.7,
        minZoom: 15
    }).addTo(map).bringToFront();
};
global.removeOverlay = function() {
    if (typeof overlay === 'object') {
        map.removeLayer(overlay);
    }
    overlay = '';
};


// toast the fullscreen button if not supported
var mapElem = document.querySelector('#map');
if (!mapElem.requestFullscreen && !mapElem.mozRequestFullScreen && !mapElem.webkitRequestFullScreen && !mapElem.msRequestFullscreen) {
    document.querySelector('.mdl-card-map').removeChild(document.querySelector('.mdl-card__actions'));
}


// change map transparency and enable/disable scrollwheel on fullscreen change
var customFullscreen = new customFullscreenToggle();
map.on('fullscreenchange', function() {
    if (map.isFullscreen()) {
        document.querySelector('#map').classList.remove('map-transparent');
        map.addControl(customFullscreen);
        map.scrollWheelZoom.enable();
    } else {
        document.querySelector('#map').classList.add('map-transparent');
        map.removeControl(customFullscreen);
        map.scrollWheelZoom.disable();
    }
});

// map click to identify
map.on('click', function(event) {
    if (map.getZoom() >= 16) {
        fetchNearest(event.latlng.lat, event.latlng.lng);
    }
});

// move overlay layer to front on baselayer change
map.on('baselayerchange', function() {
    if (overlay) { overlay.bringToFront(); }
});

// get nearest address point to geolocation
map.on('locationfound', function(event) {
	fetchNearest(event.latlng.lat, event.latlng.lng);
});

// add main location marker
global.addMarker = function(latlng, label, pid, address) {
    if (typeof marker === 'object') {
       map.removeLayer(marker);
    }
    if (typeof tmpMarker === 'object') {
        map.removeLayer(tmpMarker);
    }
    var coords = latlng.split(',');
    var gMaps=`https://www.google.com/maps/place/${address}/`;
    if (label === address) {
        address = '';
    } else {
        address = address.replace(',', '<br>');
    }
    label = label.replace(',', '<br>');
    if (map.getZoom() < 16) {
        map.setView(coords, 16);
    } else {
        map.setView(coords);
    }
    marker = L.marker(coords).bindPopup(`<div class="mdl-typography--text-center"><b>${label}</b><br>${address}</div>`).addTo(map).openPopup();
};

// add point of interest (something like nearby park) marker
global.addtmpMarker = function(lat, lng, label, address) {
    //document.querySelector('#map').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof tmpMarker === 'object') {
       map.removeLayer(tmpMarker);
    }
    var dirLink = `https://maps.google.com/maps?saddr=${activeRecord.latlng.replace(',', '+')}&daddr=${lat}+${lng}`;
    map.setView([lat, lng], 16);
    tmpMarker = L.marker([lat, lng]).bindPopup(`<div class="mdl-typography--text-center"><b>${label}</b><br>${address}<br><a href="${dirLink}" target="_blank">Directions</a></div>`).addTo(map).openPopup();
};
