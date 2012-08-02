/*
    This file handles map initialization and events.
    @author  Tobin Bradley
    @license     MIT
*/

var map;
var googleEarth;
var folder; //container for mecklenburg layers in google earth
var markers = [];
var twitterMarkers = [];
var circle;
var selectedAddress = null;
var clickListener;
var gpsWatch;
var directionsDisplay = new google.maps.DirectionsRenderer( { draggable: true });
var directionsService = new google.maps.DirectionsService();

/* Measure Variables */
var markerImageDefault = new google.maps.MarkerImage('img/measure-vertex.png', null, null, new google.maps.Point(5, 5));
var markerImageHover = new google.maps.MarkerImage('img/measure-vertex-hover.png', null, null, new google.maps.Point(8, 8));
var measure = {
    ll: new google.maps.MVCArray(),
    ll2: new google.maps.MVCArray(),
    markers: [],
    line: null,
    poly: null
};
var elevator;


/*  Load google earth API  */
google.load('earth', '1');

// Load the Visualization API and the columnchart package.
google.load("visualization", "1", {packages: ["columnchart"]});


/*  Map Initialization  */

function initializeMap() {

    /*  Initialize map  */
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: config.default_map_zoom,
        center: new google.maps.LatLng(parseFloat(config.default_map_center[0]), parseFloat(config.default_map_center[1])),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        overviewMapControl: true,
        OverviewMapControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        maxZoom: config.default_map_max_zoom,
        minZoom: config.default_map_min_zoom
    });

    // style the base map
    var style = [];
    var styledMapType = new google.maps.StyledMapType(style, {
        map: map,
        name: 'Map'
    });

    // Try adding google earth api to map
    try {
        googleEarth = new GoogleEarth(map);
    } catch (err) {}

    // For routing
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));

    /*  Locate user position via GeoLocation API  */
    if (Modernizr.geolocation) {
        $("#gpsarea").show();
        $("#gps").click(function() {
            navigator.geolocation.getCurrentPosition(

            function(position) {
                var radius = position.coords.accuracy / 2;
                $.publish("/layers/addmarker", [{
                    "lon": position.coords.longitude,
                    "lat": position.coords.latitude,
                    "featuretype": 1,
                    "label": "<h5>GeoLocation</h5>You are within " + radius + " meters of this point.",
                    "zoom": 16
                }]);
            }, function() { /* error handler */
            }, {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            });
        });
    }

    /*  Coordinate display  */
    google.maps.event.addListener(map, 'mousemove', function(event) {
        $("#toolbar-coords").text(event.latLng.lng().toFixed(4) + " " + event.latLng.lat().toFixed(4));
    });

    // Add holders for overlay layers to map
    for (i = 0; i < overlayMaps.length; i++) {
        map.overlayMapTypes.push(null);
    }

    /*  Circle for radius display  */
    circle = new google.maps.Circle({
        radius: 500,
        fillColor: "#ccc"
    });

    // Create an ElevationService.
    elevator = new google.maps.ElevationService();

    /*  Set base maps  */
    var baseHolder = [];
    $.each(baseMaps, function() {
        map.mapTypes.set(this.name, new google.maps.ImageMapType(this));
        baseHolder.push(this.name);
    });
    map.mapTypes.set('Map', styledMapType);
    map.setOptions({
        mapTypeId: 'Map',
        mapTypeControlOptions: {
            mapTypeIds: [
            'Map', google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, "GoogleEarthAPI"].concat(baseHolder)
        }
    });

    //map.mapTypes.set('Map', styledMapType);
    //map.setMapTypeId('Map');

    // Layer control change event
    $("#layerswitcher").on("change", ".layer", function() {
        if (isNumber($(this).prop('id'))) {
            var layerID = parseInt($(this).prop('id'), 10);
            if ($(this).prop('checked')) {
                var overlayMap = new google.maps.ImageMapType(overlayMaps[layerID]);
                map.overlayMapTypes.setAt(layerID, overlayMap);
            } else {
                if (map.overlayMapTypes.getLength() > 0) {
                    map.overlayMapTypes.setAt(layerID, null);
                }
            }
            // set google earth layer refresh
            if (map.getMapTypeId() == "GoogleEarthAPI") googleEarth.addMeckLayers_();
        } else {
            if ($(this).prop('id') == "panoramio") {
                $(this).prop('checked') ? panoramioLayer.setMap(map) : panoramioLayer.setMap(null);
            }
            if ($(this).prop('id') == "traffic") {
                $(this).prop('checked') ? trafficLayer.setMap(map) : trafficLayer.setMap(null);
            }
            if ($(this).prop('id') == "bike") {
                $(this).prop('checked') ? bikeLayer.setMap(map) : bikeLayer.setMap(null);
            }
            if ($(this).prop('id') == "cloud") {
                $(this).prop('checked') ? cloudLayer.setMap(map) : cloudLayer.setMap(null);
            }
            if ($(this).prop('id') == "weather") {
                $(this).prop('checked') ? weatherLayer.setMap(map) : weatherLayer.setMap(null);
            }
            if ($(this).prop('id') == "transit") {
                $(this).prop('checked') ? transitLayer.setMap(map) : transitLayer.setMap(null);
            }
        }
    });

    /*  Layer Switcher  */
    $("#layerswitcher").append("<ul></ul>");
    $.each(overlayMaps, function(index) {
        // Add layer to layer switcher
        if (this.type == "select") {
            $("#layerswitcher ul").append('<li><input type="checkbox" id="' + index + '" class="layer" /><label for="' + index + '">' + this.name + '</label><select id="wmsDirectoryLayer"></select></li>');
        } else {
            $("#layerswitcher ul").append('<li><input type="checkbox" id="' + index + '" class="layer" /><label for="' + index + '">' + this.name + '</label></li>');
            if (this.isVisible && this.isVisible === true) {
                $("#" + index).prop("checked", true);
                $("#" + index).trigger("change");
            }
        }
        // Add layer to ddl
        $('#opacitydll').append('<option value="' + index + '">' + this.name + '</option>');
    });
    // Layer switcher google layers
    $("#layerswitcher ul").append('<li><input type="checkbox" id="panoramio" class="layer" /><label for="panoramio">Panoramio Images</label></li>');
    $("#layerswitcher ul").append('<li><input type="checkbox" id="traffic" class="layer" /><label for="traffic">Traffic</label></li>');
    $("#layerswitcher ul").append('<li><input type="checkbox" id="bike" class="layer" /><label for="bike">Bike Paths</label></li>');
    $("#layerswitcher ul").append('<li><input type="checkbox" id="weather" class="layer" /><label for="weather">Weather</label></li>');

    /*  Zoom check to enable/disable layer in layer control  */
    layerSwitcherZoomCheck();
    google.maps.event.addListener(map, 'zoom_changed', function() {
        layerSwitcherZoomCheck();
    });


    // Load WMS Directory select
    url = config.web_service_base + "v1/ws_getcapabilities_summary.php?url=" + urlencode("http://maps.co.mecklenburg.nc.us/geoserver/wms?service=wms&version=1.1.1&request=GetCapabilities") + "&callback=?";
    $.getJSON(url, function(data) {
        $.each(data, function(i, item) {
            $("#wmsDirectoryLayer").append('<option value="' + item.name + '">' + item.title + '</option>');
        });
    });
    $("#wmsDirectoryLayer").change(function() {
        overlayID = $('#wmsDirectoryLayer').parent().children("input").prop("id");
        overlayMaps[overlayID].getTileUrl = function(coord, zoom) {
            var layerParams = ["FORMAT=image/png8", "LAYERS=" + $("#wmsDirectoryLayer").val()];
            return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 10, 19);
        };
        if ($("#" + overlayID).prop('checked')) $('.layer').trigger("change");
    });
    $("#wmsDirectoryLayer").trigger("change");


    /*  Add traffic and bicycling layers  */
    var trafficLayer = new google.maps.TrafficLayer();
    var bikeLayer = new google.maps.BicyclingLayer();
    var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
    var weatherLayer = new google.maps.weather.WeatherLayer({
        temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
    });



    /*  Opacity Slider  */
    $('#opacitySlider').slider({
        range: "min",
        min: 0.1,
        max: 1,
        step: 0.05,
        value: overlayMaps[$('#opacitydll').val()].opacity,
        stop: function(event, ui) {
            opacityDLLValue = $('#opacitydll').val();
            overlayMaps[opacityDLLValue].opacity = ui.value;
            if ($("#" + opacityDLLValue).is(":checked")) {
                map.overlayMapTypes.setAt(opacityDLLValue, null);
                var overlayMap = new google.maps.ImageMapType(overlayMaps[opacityDLLValue]);
                map.overlayMapTypes.setAt(opacityDLLValue, overlayMap);
            }

            // handle opacity on Google Earth
            if (map.getMapTypeId() == "GoogleEarthAPI") folder.setOpacity(ui.value);
        }
    });
    $('#opacitySlider').sliderLabels('MAP', 'DATA');
    $('#opacitydll').change(function() {
        $("#opacitySlider").slider("option", "value", overlayMaps[$('#opacitydll').val()].opacity);
    });

    // Set streetview options
    if (navigator.userAgent.indexOf('iPhone') == -1 && navigator.userAgent.indexOf('Android') == -1) {
        var panoramaOptions = {
            enableCloseButton: true
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById("streetview"), panoramaOptions);
        map.setStreetView(panorama);
        google.maps.event.addListener(panorama, 'closeclick', function() {
            $("#streetview").hide();
        });
        google.maps.event.addListener(panorama, 'position_changed', function() {
            $("#streetview").show();
        });
    }

    // MapType change event
    google.maps.event.addListener(map, 'maptypeid_changed', function() {
        if (map.getMapTypeId() == "GoogleEarthAPI") {
            $("#mapcontrols").buttonset("option", "disabled", true);
        } else {
            $("#mapcontrols").buttonset("option", "disabled", false);
        }
    });


}


/*  Function to handle toolbar events  */
function toolbar(tool) {
    // Clear listeners
    if (clickListener) google.maps.event.removeListener(clickListener);

    // clear measure
    measureReset();

    // clear circle
    if (circle !== null) circle.setMap(null);
    $("#buffer-dialog").dialog("close");

    // set tool
    if (tool.prop("id") == "identify") {
        clickListener = google.maps.event.addListener(map, 'click', function(event) {
            if (map.getZoom() >= 16) {
                url = pointOverlay(event.latLng.lng(), event.latLng.lat(), 4326, 'tax_parcels', 'pid', "", 'json', '?');
                $.getJSON(url, function(data) { // Get the parcel ID
                    if (data.total_rows > 0) {
                        var pid = data.rows[0].row.pid;
                        url = config.web_service_base + "v1/ws_mat_pidgeocode.php?format=json&callback=?";
                        args = "&pid=" + urlencode(pid);
                        url = url + args;
                        $.getJSON(url, function(data) { // Try to find a match in the MAT
                            if (data.total_rows > 0) {
                                message = "<h5>Identfy</h5>" + data.rows[0].row.address + "<br />PID: " + data.rows[0].row.parcel_id;
                                message += "<br /><br /><strong><a href='javascript:void(0)' class='identify_select' data-matid='" + data.rows[0].row.objectid + "' onclick='locationFinder(" + data.rows[0].row.objectid + ", \"ADDRESS\", \"\");'>Select this Location</a></strong>";
                                $.publish("/layers/addmarker", [{
                                    "lon": data.rows[0].row.longitude,
                                    "lat": data.rows[0].row.latitude,
                                    "featuretype": "1",
                                    "label": message
                                }]);
                            }
                            else { // If no MAT match try a parcel to MAT spatial intersection
                                url = featureOverlay("tax_parcels", "master_address_table", "t.objectid, t.full_address as address,t.num_parent_parcel as parcel_id, x(transform(SETSRID(makepoint(num_x_coord ,  num_y_coord), 2264), 4326)) as longitude, y(transform(SETSRID(makepoint(num_x_coord ,  num_y_coord), 2264), 4326)) as latitude", "f.pid = '" + pid + "' limit 1", "json", "?");
                                $.getJSON(url, function(data) {
                                     if (data.total_rows > 0) {
                                        message = "<h5>Identfy</h5>" + data.rows[0].row.address + "<br />PID: " + data.rows[0].row.parcel_id;
                                        message += "<br /><br /><strong><a href='javascript:void(0)' class='identify_select' data-matid='" + data.rows[0].row.objectid + "' onclick='locationFinder(" + data.rows[0].row.objectid + ", \"ADDRESS\", \"\");'>Select this Location</a></strong>";
                                        $.publish("/layers/addmarker", [{
                                            "lon": data.rows[0].row.longitude,
                                            "lat": data.rows[0].row.latitude,
                                            "featuretype": "1",
                                            "label": message
                                        }]);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    if (tool.prop("id") == "measure") {
        clickListener = google.maps.event.addListener(map, 'click', function(evt) {
            measureAdd(evt.latLng);
        });
    }

    if (tool.prop("id") == "buffer") {
        $("#buffer-dialog").dialog("open");
        clickListener = google.maps.event.addListener(map, 'click', function(evt) {
            // set circle xy
            circle.setCenter(evt.latLng);

            // set circle radius (convert feet to meters)
            circle.setRadius($("#radius").val() * 0.3088);

            // add circle to map
            circle.setMap(map);
        });
    }

}


/*  Check to see if layers in the layer control should be enabled/disabled based on zoom level  */
function layerSwitcherZoomCheck() {
    $.each(overlayMaps, function(index) {
        zoom = map.getZoom();
        if (zoom > this.maxZoom || zoom < this.minZoom) $("#" + index).prop("disabled", true).next().css("color", "#D1D0CC");
        else $("#" + index).prop("disabled", false).next().css("color", "inherit");
    });
}

// Toggle Layers
function toggleLayer(layerName) {
    $.each(overlayMaps, function(index) {
        if (this.name == layerName) {
            if ( $("#" + index).prop("checked") ) {
                $("#" + index).prop("checked", false).trigger("change");
            }
            else {
                $("#" + index).prop("checked", true).trigger("change");
            }
        }
    });
}


/*  Zoom to a latlong at a particular zoom level. Projects wgs84 to 900913  */
function zoomToLonLat(data) {
    if (data.zoom) {
        map.setCenter(new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lon)));
        map.setZoom(parseInt(data.zoom, 10));
    }
}


/*  Add markers (vector) to the map.  */
function addMarker(data) {

    // remove old markers
    if (markers[data.featuretype] != null) markers[data.featuretype].setMap(null);
    if (data.featuretype === 0 && markers[1] != null) markers[1].setMap(null);

    var markerIcons = [{
        icon: 'img/marker.png'
    }, {
        icon: 'img/marker2.png'
    }]; // selected address, other stuff
    var shadow = new google.maps.MarkerImage('img/marker-shadow.png', new google.maps.Size(41, 41), new google.maps.Point(0, 0), new google.maps.Point(13, 40));

    // add new marker
    markers[data.featuretype] = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lon),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: markerIcons[data.featuretype].icon,
        flat: false,
        shadow: shadow
    });


    // Add routing to infowindow if there's a selected record and it isn't an address itself.
    if (data.featuretype !== 0 && selectedAddress.objectid) {
        data.label += '<br /><strong><a href="javascript:void(0)" onclick="$(\'#routeTo\').val(\'' + data.lat + ',' + data.lon + '\'); $(\'#accordion-data\').accordion(\'activate\', \'#ROUTING\'); calcRoute();" >Route to This Location </a></strong>';
    }

    // Create info window
    var infowindow = new google.maps.InfoWindow({
        content: "<div class='infowin-content'>" + data.label + "</div>"
    });
    google.maps.event.addListener(markers[data.featuretype], 'click', function() {
        infowindow.open(map, markers[data.featuretype]);
    });
    infowindow.open(map, markers[data.featuretype]);

    // handle adding new marker to Google Earth
    if (map.getMapTypeId() == "GoogleEarthAPI") googleEarth.refresh_();
}


// Routing
function calcRoute() {
    var start = $("#routeFrom").val();
    var end = $("#routeTo").val();
    if (start.length > 0 && end.length > 0 ) {
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode[$("#routeMode").val()]
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                $("#directionsPanel").empty();
                directionsDisplay.setDirections(response);
            }
            else {
                $("#directionsPanel").html("<h5>Route Not Found</h5>Google was unable to find one of the locations provided.");
                directionsDisplay.setMap(map);
            }
        });
    }
}


/*
    Bunch of code for measuring. Big hat tip to Jason Sanford
*/
function measureAdd(ll) {
    var marker = new google.maps.Marker({
        map: map,
        position: ll,
        draggable: true,
        raiseOnDrag: false,

        /* Let the user know they can drag the markers to change shape */
        title: 'Drag me to change the polygon\'s shape',

        icon: markerImageDefault
    });
    var count = measure.ll.push(ll);
    measure.ll2.push(ll);
    var llIndex = count - 1;


    /* when dragging stops, and there are more than 2 points in our MVCArray, recalculate length and area measurements */
    google.maps.event.addListener(marker, 'dragend', function(evt) {

        if (measure.ll.getLength() >= 2) {
            measureLine();
            getElevation();
        }
        if (measure.ll.getLength() >= 3) measureArea();
    });

    /* when the user 'mouseover's a marker change the image so they know something is different (it's draggable) */
    google.maps.event.addListener(marker, 'mouseover', function(evt) {
        marker.setIcon(markerImageHover);
    });

    google.maps.event.addListener(marker, 'mouseout', function(evt) {
        marker.setIcon(markerImageDefault);
    });

    /* when we drag a marker it resets its respective LatLng value in an MVCArray. Since we're changing a value in an MVCArray, any lines or polygons on the map that reference this MVCArray also change shape ... Perfect! */
    google.maps.event.addListener(marker, 'drag', function(evt) {
        measure.ll.setAt(llIndex, evt.latLng);
        measure.ll2.setAt(llIndex, evt.latLng);
    });
    measure.markers.push(marker);
    if (measure.ll.getLength() > 1) { /* We've got 2 points, we can draw a line now */
        if (!measure.line) {
            measure.line = new google.maps.Polyline({
                map: map,
                clickable: false,
                strokeColor: '#FF0000',
                strokeOpacity: 0.5,
                strokeWeight: 3,
                path: measure.ll
            });
        }
        if (measure.ll.getLength() > 2) { /* We've got 3 points, we can draw a polygon now */
            if (!measure.poly) {
                measure.poly = new google.maps.Polygon({
                    clickable: false,
                    map: map,
                    fillOpacity: 0.25,
                    strokeOpacity: 0,
                    paths: measure.ll2
                });
            }
        }
    }
    if (count >= 2) {
        measureLine();
        getElevation();
    }
    if (count >= 3) measureArea();
}

function measureReset() { /* Remove Polygon */
    if (measure.poly) {
        measure.poly.setMap(null);
        measure.poly = null;
    } /* Remove Line */
    if (measure.line) {
        measure.line.setMap(null);
        measure.line = null;
    } /* remove all LatLngs from the MVCArray */
    while (measure.ll.getLength() > 0) {
        measure.ll.pop();
        measure.ll2.pop();
    } /* remove all markers */
    for (i = 0; i < measure.markers.length; i++) {
        measure.markers[i].setMap(null);
    }
    $('#toolbar-length, #toolbar-area').text('');
    $("#elevation_chart").hide();
}

function measureArea() {
    area_met = google.maps.geometry.spherical.computeArea(measure.poly.getPath());
    area_ft = area_met * 10.7639104;

    if (area_ft <= 10000) $("#toolbar-area").html("Area: " + area_ft.toFixed(1) + " sqft");
    else $("#toolbar-area").html("Area: " + (area_ft / 43560).toFixed(3) + " ac");

}

function measureLine() {
    length_met = google.maps.geometry.spherical.computeLength(measure.line.getPath());
    $("#toolbar-length").html("Length: " + (length_met * 3.2808399).toFixed(1) + " ft");
}

function getElevation() {
    var pathRequest = {
        'path': measure.line.getPath().getArray(),
        'samples': 25
    };

    elevator.getElevationAlongPath(pathRequest, function(results, status) {
        if (status == google.maps.ElevationStatus.OK) {

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Sample');
            data.addColumn('number', 'Elevation');
            for (var i = 0; i < results.length; i++) {
              data.addRow(['', parseInt((results[i].elevation * 3.2808399), 10)]);
            }

            // Draw the chart
            var chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart_image'));
            document.getElementById('elevation_chart_image').style.display = 'block';
            chart.draw(data, {
                width: 300,
                height: 110,
                legend: 'none',
                fontSize: 12
            });
        }

        $("#elevation_chart").show();
    });
}
