/**
 * map.gm.js
 * This javascript file handles map initialization and events for the google maps control.
 *
 * @author		Tobin Bradley
 * @license		MIT
 */


/**
 * Map Initialization
 * Note most of the varible items - map config, layers, initial extent, etc.,
 * are in geoportal-xx-settings.js
 */

// Load google earth API
google.load('earth', '1');

function initializeMap(){

		/*  Initialize map  */
	map = new google.maps.Map(document.getElementById("map"), myOptions);

      // Try adding google earth api to map
      try { googleEarth = new GoogleEarth(map); }
      catch(err) {  }



     /*  Coordinate display  */
     google.maps.event.addListener(map, 'mousemove', function(event) {
          $("#toolbar-coords").text(event.latLng.lng().toFixed(4) + " " + event.latLng.lat().toFixed(4));
     });


    /*  Circle for radius display  */
    circle = new google.maps.Circle({radius: 500, fillColor: "#ccc"});

	/*  Layer Switcher  */
	$("#layerswitcher").append("<ul></ul>");
	$.each(overlayMaps, function(index) {
		if (jQuery.inArray(this.name, autoOverlayMaps) == -1) {
			// Add layer to layer switcher
			if (this.type == "select") {
				$("#layerswitcher ul").append('<li><input type="checkbox" id="' + index + '" class="layer" /><label for="' + index + '">' + this.name + '</label><select id="wmsDirectoryLayer"></select></li>');
			}
			else {
				$("#layerswitcher ul").append('<li><input type="checkbox" id="' + index + '" class="layer" /><label for="' + index + '">' + this.name + '</label></li>');
			}
			// Add layer to ddl
			$('#opacitydll').append('<option value="' + index + '">' + this.name + '</option>');
		}
	});
	// Sort opacity layers
	$("#opacitydll option").sort(sortAlpha).appendTo("#opacitydll");
	// Layer switcher google layers
	$("#layerswitcher ul").append('<li><input type="checkbox" id="panoramio" class="layer" /><label for="panoramio">Panoramio Images</label></li>');
    $("#layerswitcher ul").append('<li><input type="checkbox" id="traffic" class="layer" /><label for="traffic">Traffic</label></li>');
    $("#layerswitcher ul").append('<li><input type="checkbox" id="bike" class="layer" /><label for="bike">Bike Paths</label></li>');
    //$("#layerswitcher ul").append('<li><input type="checkbox" id="clouds" class="layer" /><label for="clouds">Cloud Cover</label></li>');
    $("#layerswitcher ul").append('<li><input type="checkbox" id="weather" class="layer" /><label for="weather">Weather</label></li>');



    // Load WMS Directory select
    url = wsbase + "v1/ws_getcapabilities_summary.php?url=" + urlencode("http://maps.co.mecklenburg.nc.us/geoserver/wms?service=wms&version=1.1.1&request=GetCapabilities") + "&callback=?";
	$.getJSON(url, function(data) {
		$.each(data, function(i, item){
			$("#wmsDirectoryLayer").append('<option value="' + item.name + '">' + item.title + '</option>');
		});
	});

	// change function on wmsDirectoryLayer
	$("#wmsDirectoryLayer").change(function() {
		overlayID = $('#wmsDirectoryLayer').parent().children("input").attr("id");
		overlayMaps[overlayID].getTileUrl  = function(coord, zoom) {
			var layerParams = [ "FORMAT=image/png8", "LAYERS=" + $("#wmsDirectoryLayer").val() ];
			return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 10, 19);
		};
		if ($("#" + overlayID).attr('checked')) $('.layer').trigger("change");
	});
	$("#wmsDirectoryLayer").trigger("change");


	$('.layer').change(function(){
		if (isNumber($(this).attr('id'))) {
			var layerID = parseInt($(this).attr('id'), 10);
			if ($(this).attr('checked')){
				var overlayMap = new google.maps.ImageMapType(overlayMaps[layerID]);
				map.overlayMapTypes.setAt(layerID,overlayMap);
			} else{
				if (map.overlayMapTypes.getLength()>0){
					map.overlayMapTypes.setAt(layerID,null);
				}
			}
               // set google earth layer refresh
               if (map.getMapTypeId() == "GoogleEarthAPI") googleEarth.addMeckLayers_();
		}
		else {
			if ($(this).attr('id') == "panoramio") {
					if ($(this).attr('checked')) panoramioLayer.setMap(map);
					else panoramioLayer.setMap(null);
			}
                 if ($(this).attr('id') == "traffic") {
					if ($(this).attr('checked')) trafficLayer.setMap(map);
					else trafficLayer.setMap(null);
				}
                 if ($(this).attr('id') == "bike") {
					if ($(this).attr('checked')) bikeLayer.setMap(map);
					else bikeLayer.setMap(null);
			  }
			  if ($(this).attr('id') == "cloud") {
					if ($(this).attr('checked')) cloudLayer.setMap(map);
					else cloudLayer.setMap(null);
			  }
			  if ($(this).attr('id') == "weather") {
					if ($(this).attr('checked')) weatherLayer.setMap(map);
					else weatherLayer.setMap(null);
			  }
		}
	});
	layerSwitcherZoomCheck();
	// Make layer switch disabled when zoom past layer's display range
	google.maps.event.addListener(map, 'zoom_changed', function() {
		layerSwitcherZoomCheck();
	});


    /*  Opacity Slider  */
    $("#layerOpacity").html("Layer Opacity: " + parseInt(overlayMaps[$('#opacitydll').val()].opacity * 100 ) + "%");
    $('#opacitySlider').slider({range: "min", min: 0.1, max: 1, step: 0.05, value: overlayMaps[$('#opacitydll').val()].opacity, stop: function(event, ui) {
        opacityDLLValue = $('#opacitydll').val();
          overlayMaps[opacityDLLValue].opacity = ui.value;
          if ( $("#" + opacityDLLValue).is(":checked") ) {
               map.overlayMapTypes.setAt(opacityDLLValue,null);
               var overlayMap = new google.maps.ImageMapType(overlayMaps[opacityDLLValue]);
               map.overlayMapTypes.setAt(opacityDLLValue,overlayMap);
          }

          // handle opacity on Google Earth
          if (map.getMapTypeId() == "GoogleEarthAPI") folder.setOpacity(ui.value);
	 }});
	 $('#opacitySlider').sliderLabels('MAP','DATA');
     $('#opacitydll').change(function() {
          $("#opacitySlider").slider( "option", "value", overlayMaps[$('#opacitydll').val()].opacity );
     });



     // Add holders for overlay layers to map
     for (i=0; i<overlayMaps.length; i++){
          map.overlayMapTypes.push(null);
     }


     /*  Set base maps  */
     var baseHolder = [];
     $.each(baseMaps, function(index) {
          map.mapTypes.set(this.name, new google.maps.ImageMapType(this));
          baseHolder.push(this.name);
     });
     map.setOptions({
          mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControlOptions: {
               mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.TERRAIN,
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.HYBRID,
				"GoogleEarthAPI"
               ].concat(baseHolder)
          }

     });


	// Add traffic and bicycling layers
	var trafficLayer = new google.maps.TrafficLayer();
	var bikeLayer = new google.maps.BicyclingLayer();
	var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
	var weatherLayer = new google.maps.weather.WeatherLayer({ temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT });
	//var cloudLayer = new google.maps.weather.CloudLayer();

	// Create an ElevationService.
    elevator = new google.maps.ElevationService();


	// add auto overlay layers
	$.each(overlayMaps, function(index) {
		 if (jQuery.inArray(this.name, autoOverlayMaps) != -1) {
			  var overlayMap = new google.maps.ImageMapType(overlayMaps[index]);
			  map.overlayMapTypes.setAt(index,new google.maps.ImageMapType(overlayMaps[index]));
		 }
	});

    // Set streetview options
	if (navigator.userAgent.indexOf('iPhone') == -1 && navigator.userAgent.indexOf('Android') == -1) {
		var panoramaOptions = {
			  enableCloseButton: true
		};
		var panorama = new  google.maps.StreetViewPanorama(document.getElementById("streetview"), panoramaOptions);
		map.setStreetView(panorama);
		google.maps.event.addListener(panorama, 'closeclick', function(){
			  $("#streetview").hide();
		});
		google.maps.event.addListener(panorama, 'position_changed', function(){
			  $("#streetview").show();
		});
	}

      // MapType change event - might need it someday
      google.maps.event.addListener( map, 'maptypeid_changed', function() {
            if (map.getMapTypeId() == "GoogleEarthAPI") {
                  $( "#mapcontrols" ).buttonset( "option", "disabled", true );
            }
            else {
                  $( "#mapcontrols" ).buttonset( "option", "disabled", false );
            }
      } );
}

/*  Check to see if layers in the layer control should be enabled/disabled based on zoom level  */
function layerSwitcherZoomCheck() {
	 $.each(overlayMaps, function(index) {
		  if (jQuery.inArray(this.name, autoOverlayMaps) == -1) {
			   zoom = map.getZoom();
			   if (zoom > this.maxZoom || zoom < this.minZoom) $("#" + index).attr("disabled", true).next().css("color", "#D1D0CC");
			   else $("#" + index).removeAttr("disabled").next().css("color", "inherit");
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
     if (tool.attr("id") == "identify") {
          clickListener = google.maps.event.addListener(map, 'click', function(event) {
               if (map.getZoom() >= 16) {
                    url = pointOverlay(event.latLng.lng(), event.latLng.lat(), 4326, 'tax_parcels', 'pid', "", 'json', '?');
                    $.getJSON(url, function(data){
                         if (data.total_rows > 0 ) {
                                   url = wsbase + "v1/ws_mat_pidgeocode.php?format=json&callback=?";
                                   args = "&pid=" + urlencode(data.rows[0].row.pid);
                                   url = url + args;
                                   $.getJSON(url, function(data) {
                                        if (data.total_rows > 0 ) {
                                            locationFinder("Address", 'master_address_table', 'objectid', data.rows[0].row.objectid);
                                        }
                                   });
                         }
                    });
               }
          });
     }
     if (tool.attr("id") == "measure") {
          clickListener = google.maps.event.addListener(map,'click',function(evt){
               measureAdd(evt.latLng);
          });
     }

    if (tool.attr("id") == "buffer") {
        $("#buffer-dialog").dialog("open");
        clickListener = google.maps.event.addListener(map,'click',function(evt){
            // set circle xy
            circle.setCenter(evt.latLng);

            // set circle radius (convert feet to meters)
            circle.setRadius($("#radius").val() * 0.3088);

            // add circle to map
            circle.setMap(map);
        });
    }

}

/**
 * Zoom to a latlong at a particular zoom level. Projects wgs84 to 900913
 * @param {float} long
 * @param {float} lat
 * @param {integer} zoom
 */
function zoomToLonLat (lon, lat, zoom) {
     map.setCenter(new google.maps.LatLng(parseFloat(lat), parseFloat(lon)));
     map.setZoom(zoom);
}


/**
 * Add markers (vector) to the map.
 * Also removes popups and selects added feature.
 * @param {float} long
 * @param {float} lat
 * @param {featuretype} the type of feature/marker (0=address,1=facility,2=identify)
 * @param {label} the content to put in the popup
 */
function addMarker(lon, lat, featuretype, label) {
      // zoom to marker
     if (map.getBounds()) {
        if (map.getBounds().contains(new google.maps.LatLng(lat, lon)) === false || map.getZoom() < 16 ) zoomToLonLat(lon, lat, 16);
     }
     else zoomToLonLat(lon, lat, 16);

	// remove old marker
    if (markers[featuretype] != null) markers[featuretype].setMap(null);

     // add new marker
     markers[featuretype] = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
        //title:"Hello World!",
        animation: google.maps.Animation.DROP,
        icon: markerIcons[featuretype].icon,
        flat: false,
		shadow: shadow
     });

     // Create info window
     var mycontent = label;
     var infowindow = new google.maps.InfoWindow({ content: mycontent });
     google.maps.event.addListener(markers[featuretype], 'click', function() {
          infowindow.open(map,markers[featuretype]);
     });

     // active window if the map is big enough - i.e. not mobile - and not google earth view
     //if ($("#map").width() > 500 && map.getMapTypeId() != "GoogleEarthAPI") infowindow.open(map,markers[featuretype]);

     // handle adding new marker to Google Earth
     if (map.getMapTypeId() == "GoogleEarthAPI") googleEarth.refresh_();
}


/* Set some layers to draw when accordion clicked */
function autoDataVisibility (layer_name, layerList) {
      layerList = typeof(layerList) != 'undefined' ? layerList : ["Economic Development", "Community", "Environmental Layers"];

      $.each(overlayMaps, function(index) {
            if (jQuery.inArray(this.name, layerList) != -1) {

                  if (this.name == layer_name) {
                        if(!$("#" + index).is(':checked')) $("#" + index).attr('checked', true).change();
                  }
                  else {
                        if($("#" + index).is(':checked')) $("#" + index).attr('checked', false).change();
                  }

            }
     });

     // Google Earth
     if (map.getMapTypeId() == "GoogleEarthAPI") googleEarth.addMeckLayers_();

}


/**
 * Bunch of code for measuring. Big hat tip to Jason Sanford
 */
function measureAdd(ll){
	var marker = new google.maps.Marker({
		map:map,
		position:ll,
		draggable:true,
		raiseOnDrag: false,

		/* Let the user know they can drag the markers to change shape */
		title:'Drag me to change the polygon\'s shape',

		icon: markerImageDefault
	});
	var count = measure.ll.push(ll);
     measure.ll2.push(ll);
	var llIndex = count-1;


	/* when dragging stops, and there are more than 2 points in our MVCArray, recalculate length and area measurements */
	google.maps.event.addListener(marker,'dragend',function(evt){

          if (measure.ll.getLength() >= 2) { measureLine(); getElevation(); }
		if (measure.ll.getLength() >= 3) measureArea();
	});

	/* when the user 'mouseover's a marker change the image so they know something is different (it's draggable) */
	google.maps.event.addListener(marker,'mouseover',function(evt){
		marker.setIcon(markerImageHover);
	});

	google.maps.event.addListener(marker,'mouseout',function(evt){
		marker.setIcon(markerImageDefault);
	});

	/* when we drag a marker it resets its respective LatLng value in an MVCArray. Since we're changing a value in an MVCArray, any lines or polygons on the map that reference this MVCArray also change shape ... Perfect! */
	google.maps.event.addListener(marker,'drag',function(evt){
		measure.ll.setAt(llIndex,evt.latLng);
          measure.ll2.setAt(llIndex,evt.latLng);
	});
	measure.markers.push(marker);
	if (measure.ll.getLength()>1){
		/* We've got 2 points, we can draw a line now */
		if (!measure.line){
			measure.line = new google.maps.Polyline({
				map:map,
				clickable:false,
				strokeColor:'#FF0000',
				strokeOpacity:0.5,
				strokeWeight:3,
				path:measure.ll
			});
		}
		if (measure.ll.getLength()>2){
			/* We've got 3 points, we can draw a polygon now */
			if (!measure.poly){
				measure.poly = new google.maps.Polygon({
					clickable:false,
					map:map,
					fillOpacity:0.25,
					strokeOpacity:0,
					paths:measure.ll2
				});
			}
		}
	}
	if (count >= 2) { measureLine(); getElevation() }
     if (count >= 3) measureArea();
}
function measureReset(){
	/* Remove Polygon */
	if (measure.poly) {
		measure.poly.setMap(null);
		measure.poly = null;
	}
	/* Remove Line */
	if (measure.line) {
		measure.line.setMap(null);
		measure.line = null;
	}
	/* remove all LatLngs from the MVCArray */
	while (measure.ll.getLength()>0) {
            measure.ll.pop();
            measure.ll2.pop();
     }
	/* remove all markers */
	for (i=0;i<measure.markers.length;i++){
		measure.markers[i].setMap(null);
	}
	$('#toolbar-length, #toolbar-area').text('');
     $("#elevation_chart").hide();
}
function measureArea(){
	area_met = google.maps.geometry.spherical.computeArea(measure.poly.getPath());
	area_ft = area_met * 10.7639104;

     if (area_ft <= 10000) $("#toolbar-area").html("Area: " + area_ft.toFixed(1) + " sqft");
     else  $("#toolbar-area").html("Area: " + (area_ft/43560).toFixed(3) + " ac");

}
function measureLine() {
     length_met = google.maps.geometry.spherical.computeLength(measure.line.getPath());
     $("#toolbar-length").html("Length: " + (length_met * 3.2808399).toFixed(1) + " ft");
}
function getElevation() {
      var pathRequest = {
            'path': measure.line.getPath().getArray(),
            'samples': 25
      }

      elevator.getElevationAlongPath(pathRequest, function(results, status) {
            if (status == google.maps.ElevationStatus.OK) {
                  var elevals = [];
                  for (var i = 0; i < results.length; i++) {
                        elevals[i] = parseInt((results[i].elevation * 3.2808399) / 10);
                  }

                  $("#elevation_chart_image").html('<img width="400" height="110" src="https://chart.googleapis.com/chart?cht=lc&chs=400x110&chd=t:' + elevals.join(",") + '&chco=224499&chxt=y&chxl=0:|0|200|400|600|800|1000&chm=B,76A4FB,0,0,0" />');
            }

            $("#elevation_chart").show();
      });
}




/**
 * Bunch 'o code for handling WMS layers
 */
function WMSBBOXUrl(WMSurl, coord, zoom, minZoom, maxZoom) {
     if (map.getZoom() >= minZoom && map.getZoom() <= maxZoom) {
          var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
          var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);

          var projectionMap = new MercatorProjection();

          var lULg = projectionMap.fromDivPixelToSphericalMercator(lULP, zoom);
          var lLRg  = projectionMap.fromDivPixelToSphericalMercator(lLRP, zoom);

          var lUL_Latitude = lULg.y;
          var lUL_Longitude = lULg.x;
          var lLR_Latitude = lLRg.y;
          var lLR_Longitude = lLRg.x;

          return WMSurl + "&bbox=" + lUL_Longitude + "," + lUL_Latitude + "," + lLR_Longitude + "," + lLR_Latitude;
     }
     else return null;
}
var MERCATOR_RANGE = 256;
function bound(value, opt_min, opt_max) {
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}
function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}
function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}
function MercatorProjection() {
  this.pixelOrigin_ = new google.maps.Point(
      MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
  this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
  this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
};
MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
  var me = this;

  var point = opt_point || new google.maps.Point(0, 0);

  var origin = me.pixelOrigin_;
  point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
  // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
  // 89.189.  This is about a third of a tile past the edge of the world tile.
  var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
  point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
  return point;
};
MercatorProjection.prototype.fromDivPixelToLatLng = function(pixel, zoom) {
  var me = this;

  var origin = me.pixelOrigin_;
  var scale = Math.pow(2, zoom);
  var lng = (pixel.x / scale - origin.x) / me.pixelsPerLonDegree_;
  var latRadians = (pixel.y / scale - origin.y) / -me.pixelsPerLonRadian_;
  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
  return new google.maps.LatLng(lat, lng);
};
MercatorProjection.prototype.fromDivPixelToSphericalMercator = function(pixel, zoom) {
  var me = this;
  var coord = me.fromDivPixelToLatLng(pixel, zoom);

  var r= 6378137.0;
  var x = r* degreesToRadians(coord.lng());
  var latRad = degreesToRadians(coord.lat());
  var y = (r/2) * Math.log((1+Math.sin(latRad))/ (1-Math.sin(latRad)));

  return new google.maps.Point(x,y);
};
