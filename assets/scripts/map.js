/********************************************
    Map Stuff
********************************************/

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

    // Map options
    map = new L.Map('map', {
        center: cen,
        zoom: z,
        minZoom: 9,
        maxZoom: 18,
        closePopupOnClick: false
    });
    map.attributionControl.setPrefix(false).setPosition("bottomleft");
    map.on('click', identify);
    L.Icon.Default.imagePath = "images/";

    //  Mecklenburg Base Layer
    L.tileLayer("http://maps.co.mecklenburg.nc.us/tiles/meckbase/{y}/{x}/{z}.png",
     { "attribution": "<a href='http://emaps.charmeck.org' target='_blank'>Mecklenburg County GIS</a>" }).addTo(map);

    // Area for selected info location
    info = L.control({position: 'bottomright'});
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'map-info hide text-center');
        L.DomEvent.addListener(this._div, 'click', function (e) {
            L.DomEvent.stopPropagation(e);
            latlng = $(".map-info a").data("location").split(",");
            zoomToLngLat({'lng': latlng[0], 'lat': latlng[1]});
            markers[0].openPopup();
        });
        return this._div;
    };
    info.update = function (data) {
        var write = "<a class='zoom-selected' href='javascript:void(0)' data-location='" + data.lng + "," + data.lat + "'>" + data.label + "</a>";
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
            link.innerHTML = '<i class="icon-screenshot"></i>';
            link.title = 'Take me to my location.';
            link.style.cssText = 'width:26px;height:26px;display:block;background:#fff;' +
                'border-radius:4px;line-height:26px;text-decoration:none;text-align:center;color:#151; cursor:pointer;';
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
    if (Modernizr.geolocation) { new L.Control.Locate().addTo(map); }

}

//  Zoom to latlong
function zoomToLngLat(data) {
    map.setView([data.lat, data.lng], 17);
}

// Add marker
function addMarker(data, marker) {
    // remove old markers
    if (marker === 0) {
        $.each(markers, function (i, item) {
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
    data.label = "<h5>" + data.label + "</h5>";
    if (marker === 0) {
        info.update(data);
        gURL = getGoogleLink(data.lng, data.lat);
        data.label += '<ul class="text-center inline">';
        data.label += '<li><a href="http://maps.co.mecklenburg.nc.us/databrowser/#/' + activeRecord.gid + '" target="_blank">Data Browser</a></li>';
        data.label += '<li><a href="' + gURL + '" target="_blank">Google Maps</a></li>';
        data.label += '</ul>';
        if ($(".embed-container ")[0]) {
            data.label += '<div class="details"></div>';
        }
    }
    if (marker === 1) {
        gURLD = getDirections(activeRecord.lng, activeRecord.lat, data.lng, data.lat);
        gURL = getGoogleLink(data.lng, data.lat);
        data.label += '<ul class="text-center inline">';
        data.label += '<li><a href="' + gURLD + '" target="_blank">Directions</a></li>';
        data.label += '<li><a href="http://maps.co.mecklenburg.nc.us/databrowser/#/' + activeRecord.gid + '" target="_blank">Data Browser</a></li>';
        data.label += '<li><a href="' + gURL + '" target="_blank">Google Maps</a></li>';
        data.label += '</ul>';
    }

    var mHeight = $("#map").height() -  200;
    var mWidth = $("#map").width() - 200;
    markers[marker].bindPopup(data.label, {"maxHeight": mHeight, "maxWidth": mWidth}).openPopup();

}

// Create google maps directions link
function getDirections(flng, flat, tlng, tlat) {
    return "https://maps.google.com/maps?saddr=" + flat + "+" + flng + "&daddr=" + tlat + "+" + tlng;
}

// Create link to Google Maps
function getGoogleLink(lng, lat) {
    return "http://maps.google.com/maps?z=12&q=loc:" + lat + "+" + lng;
}

/**
 * Handle map click to identify
 * @param  {event} event  Map Click event
 * @return {null}
 */
function identify(event) {
    if (map.getZoom() >= 16) {
        getNearestMAT({'lng': event.latlng.lng, 'lat': event.latlng.lat});
    }
}
