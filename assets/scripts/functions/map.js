// initialize the map
function mapInit() {
    // go straight to xy if passed to avoid "flash"
    if (getURLParameter("lng") && getURLParameter("lat")) {
        cen = [getURLParameter("lat"), getURLParameter("lng")];
        z = 17;
    }
    else {
        cen = [35.260, -80.827];
        z = 10;
    }

    // Leaflet image path
    L.Icon.Default.imagePath = './images';

    // Map options
    map = new L.Map('map', {
        center: cen,
        zoom: z,
        minZoom: 9,
        maxZoom: 18,
        attributionControl: false,
        closePopupOnClick: false
    });
    //map.attributionControl.setPrefix('<a href="http://maps.co.mecklenburg.nc.us/" target="_blank">GeoPortal</a>').setPosition("bottomleft");
    map.on('click', identify);

    //  Mecklenburg Base Layer
    var meckbase = L.tileLayer("http://mcmap.org:3000/meckbase/{z}/{x}/{y}.png",
     { "attribution": "<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>" }).addTo(map);

    // Aerials
    var aerials = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: "<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>" });

    var baseMaps = {
        "Streets": meckbase,
        "Earth": aerials
    };

    L.control.layers(baseMaps).addTo(map);
    map.on('baselayerchange', function() {
        if (overlay.layer) { overlay.layer.bringToFront(); }
    });

    // Area for selected info link
    info = L.control({position: 'bottomright'});
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'map-info text-center');
        L.DomEvent.addListener(this._div, 'click', function (e) {
            L.DomEvent.stopPropagation(e);
            latlng = $(".map-info a").data("location").split(",");
            zoomToLngLat({'lng': latlng[0], 'lat': latlng[1]});
            markers[0].openPopup();
        });
        return this._div;
    };
    info.update = function (data) {
        var write = "<a class='zoom-selected' href='javascript:void(0)' data-location='" + data.lng + "," + data.lat + "'><h5>" + data.value.substring(0, data.value.indexOf(',')) + "</h5></a>";
        this._div.innerHTML = write;
        $(".map-info").fadeIn("slow");
    };
    info.addTo(map);

    // Geolocation
    L.Control.Locate = L.Control.extend({
        options: { position: 'topleft' },
            _find: function() {
            map.locate();
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-locate'),
                link = L.DomUtil.create('div', 'leaflet-bar', container);
            link.innerHTML = '<span class="glyphicon glyphicon-screenshot"></span>';
            link.title = 'Take me to my location.';
            link.style.cssText = 'width:25px;height:25px;background:#fff;' +
                'border-radius:4px;line-height:26px;text-align:center;color: black; cursor:pointer;';
            L.DomEvent
                .on(link, 'click', L.DomEvent.stopPropagation)
                .on(link, 'mousedown', L.DomEvent.stopPropagation)
                .on(link, 'dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', L.bind(this._find, this), this);
            return container;
        }
    });
    map.on('locationfound', function (e) {
        getNearestMAT({"lat": e.latlng.lat, "lng": e.latlng.lng});
    });

}

//  Zoom to latlong
function zoomToLngLat(data) {
    map.setView([data.lat, data.lng], 17);
}

// Add marker
function addMarker(data, marker) {
    // remove old markers
    if (marker === 0) {
        _.each(markers, function (item) {
            try { map.removeLayer(item); }
            catch (err) {}
        });
    }
    else {
        try { map.removeLayer(markers[marker]); }
        catch (err) {}
    }

    // add new marker
    markers[marker] = L.marker([data.lat, data.lng]).addTo(map);

    // popup
    data.label = "<h5 class='text-center'>" + data.label;
    if (data.pid && data.pid.length > 0) {
        data.label += "<br>Parcel " + data.pid;
    }
    data.label += "</h5>";
    if (marker === 0) {
        info.update(data);
        gURL = getGoogleLink(data.lng, data.lat);
        data.label += '<ul class="text-center list-inline">';
        data.label += '<li><a href="http://maps.co.mecklenburg.nc.us/databrowser/#/' + activeRecord.gid + '" target="_blank">Data Browser</a></li>';
        data.label += '<li><a href="' + gURL + '" target="_blank">Google Maps</a></li>';
        data.label += '</ul>';
        data.label += '<div class="report"></div>';
    }
    if (marker === 1) {
        gURLD = getDirections(activeRecord.lng, activeRecord.lat, data.lng, data.lat);
        gURL = getGoogleLink(data.lng, data.lat);
        data.label += '<ul class="text-center list-inline">';
        data.label += '<li><a href="' + gURLD + '" target="_blank">Directions</a></li>';
        data.label += '<li><a href="http://maps.co.mecklenburg.nc.us/databrowser/#/' + activeRecord.gid + '" target="_blank">Data Browser</a></li>';
        data.label += '<li><a href="' + gURL + '" target="_blank">Google Maps</a></li>';
        data.label += '</ul>';
    }
    var mHeight = $("#map").height() -  150;
    var mWidth = $("#map").width() - 150;

    // if not a print map
    if (!$(".container-print")[0]) {
        markers[marker].bindPopup(data.label, {"maxHeight": mHeight, "maxWidth": mWidth}).openPopup();
    }
}

// Create google maps directions link
function getDirections(flng, flat, tlng, tlat) {
    return "https://maps.google.com/maps?saddr=" + flat + "+" + flng + "&daddr=" + tlat + "+" + tlng;
}

// Create link to Google Maps
function getGoogleLink(lng, lat) {
    return "https://www.google.com/maps/place/" + lat + "," + lng;
}

// Identify function
function identify(event) {
    if (!$(".container-print")[0] && map.getZoom() >= 16) {
        getNearestMAT({'lng': event.latlng.lng, 'lat': event.latlng.lat});
    }
}
