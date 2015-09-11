var L = require('leaflet/dist/leaflet');
var fetchNearest = require('./nearest'),
	getURLParameter = require('./geturlparams');
require('leaflet-fullscreen');

global.marker = '';
global.overlay = '';
global.tmpMarker = '';

let defaultCenter = [35.272, -80.827];
let defaultZoom = 9;
if (getURLParameter("latlng") !== 'null') {
	defaultCenter = getURLParameter("latlng").split(',');
	defaultZoom = 16;
}


L.Icon.Default.imagePath = './img';
global.map = L.map('map', {
	attributionControl: false,
	scrollWheelZoom: false
}).setView(defaultCenter, defaultZoom);

var meckbase = L.tileLayer("http://tiles.mcmap.org/meckbase/{z}/{x}/{y}.png", {
	"minZoom": 9,
	"maxZoom": 18,
	"attribution": "<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>"
}).addTo(map);

// Aerials
var aerials = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: "<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>"
});

var baseMaps = {
	"Streets": meckbase,
	"Earth": aerials
};

L.control.layers(baseMaps).addTo(map);


// toast the fullscreen button if not supported
var mapElem = document.querySelector("#map");
if (!mapElem.requestFullscreen && !mapElem.mozRequestFullScreen && !mapElem.webkitRequestFullScreen && !mapElem.msRequestFullscreen) {
	document.querySelector('.mdl-card-map').removeChild(document.querySelector('.mdl-card__actions'));
}

map.on('fullscreenchange', function() {
	if (map.isFullscreen()) {
		document.querySelector('#map').classList.remove('map-transparent');
		map.scrollWheelZoom.enable();
	} else {
		document.querySelector('#map').classList.add('map-transparent');
		map.scrollWheelZoom.disable();
	}
});

map.on('click', function(event) {
	 if (map.getZoom() >= 16) {
		 fetchNearest(event.latlng.lat, event.latlng.lng);
	 }
});

map.on('baselayerchange', function() {
    if (overlay) { overlay.bringToFront(); }
});

map.on('locationfound', function(event) {
	fetchNearest(event.latlng.lat, event.latlng.lng);
});


global.addMarker = function(latlng, label, pid, address) {
    if (typeof marker === 'object') {
       map.removeLayer(marker);
    }
	if (typeof tmpMarker === 'object') {
       map.removeLayer(tmpMarker);
    }
    var coords = latlng.split(",");
	if (label === address) {
		address = '';
	} else {
		address = address.replace(",", "<br>");
	}
	label = label.replace(",", "<br>");
    marker = L.marker(coords).bindPopup(`<div class="mdl-typography--text-center"><b>${label}</b><br>${address}</div>`).addTo(map).openPopup();
    map.setView(coords, 16);
};

global.addtmpMarker = function(lat, lng, label, address) {
	if (typeof tmpMarker === 'object') {
       map.removeLayer(tmpMarker);
    }

	var dirLink = `https://maps.google.com/maps?saddr=${activeRecord.latlng.replace(",", "+")}&daddr=${lat}+${lng}`;
    tmpMarker = L.marker([lat, lng]).bindPopup(`<div class="mdl-typography--text-center"><b>${label}</b><br>${address}<br><a href="${dirLink}" target="_blank">Directions</a></div>`).addTo(map).openPopup();
	map.setView([lat, lng], 16);
};


global.addOverlay = function (theLayers) {
	 removeOverlay();
	 overlay = L.tileLayer.wms("http://maps.co.mecklenburg.nc.us/geoserver/wms", {
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
