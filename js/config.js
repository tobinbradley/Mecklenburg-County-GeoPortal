var config = {
	"web_service_base" : "http://maps.co.mecklenburg.nc.us/rest/",
	"default_map_center" :  [35.270, -80.837],
	"default_map_zoom" : 10,
	"default_map_min_zoom" : 10,
	"default_map_max_zoom" : 18
};
var meckWMSBase = "http://maps.co.mecklenburg.nc.us/geoserver/wms?";
var meckWMSParams = [
     "REQUEST=GetMap",
     "SERVICE=WMS",
     "VERSION=1.1.1",
     "BGCOLOR=0xFFFFFF",
     "TRANSPARENT=TRUE",
     "SRS=EPSG:900913", // 3395?
     "WIDTH=256",
     "HEIGHT=256"
];


/**
 * Base maps
 */
var baseMaps = [
     {
          name: "Meck Base",
          alt: "Mecklenburg Base Map",
          getTileUrl: function(ll, z) {
               var X = ll.x % (1 << z);  // wrap
               return 'http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/gmaps?layers=meckbase&zoom=' + z + '&x=' + X + '&y=' + ll.y + '&format=image/png';
           },
           tileSize: new google.maps.Size(256, 256),
           isPng: true,
           maxZoom: 18
     },{
          name: "OSM",
          alt: "Open Streetmap tiles",
          getTileUrl: function(ll, z) {
               var X = ll.x % (1 << z);  // wrap
               return "http://tile.openstreetmap.org/" + z + "/" + X + "/" + ll.y + ".png";
          },
          tileSize: new google.maps.Size(256, 256),
          isPng: true,
          maxZoom: 19
     }
];



/**
 * Overlay Maps
 */
var overlayMaps = [
    {
          name: "2011 Aerial Photography (Pictometry)",
          getTileUrl: function(coord, zoom) {
              var layerParams = [
                  "FORMAT=image/jpeg",
                  "LAYERS=ecw2011",
                  "STYLES="
              ];
              return WMSBBOXUrl("http://maps.co.mecklenburg.nc.us/mrsid/getmap.php?" + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);

          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 1,
          isPng: false,
          minZoom: 15,
          maxZoom: 19
     },{
          name: "2010 Aerial Photography",
          getTileUrl: function(coord, zoom) {
              var layerParams = [
                  "FORMAT=image/jpeg",
                  "LAYERS=mrsid10",
                  "STYLES="
              ];
              return WMSBBOXUrl("http://maps.co.mecklenburg.nc.us/mrsid/getmap.php?" + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);

          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 1,
          isPng: false,
          minZoom: 15,
          maxZoom: 19
     },{
          name: "2009 Aerial Photography",
          getTileUrl: function(coord, zoom) {
              var layerParams = [
                  "FORMAT=image/jpeg",
                  "LAYERS=mrsid09east,mrsid09west",
                  "STYLES="
              ];
              return WMSBBOXUrl("http://maps.co.mecklenburg.nc.us/mrsid/getmap.php?" + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 1,
          isPng: false,
          minZoom: 15,
          maxZoom: 19
     },{
          name: "2005 Aerial Photography",
          getTileUrl: function(coord, zoom) {
              var layerParams = [
                  "FORMAT=image/jpeg",
                  "LAYERS=mrsid05",
                  "STYLES="
              ];
              return WMSBBOXUrl("http://maps.co.mecklenburg.nc.us/mrsid/getmap.php?" + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 1,
          isPng: false,
          minZoom: 15,
          maxZoom: 19
     },{
          name: "1999 Aerial Photography",
          getTileUrl: function(coord, zoom) {
              var layerParams = [
                  "FORMAT=image/jpeg",
                  "LAYERS=mrsid99",
                  "STYLES="
              ];
              return WMSBBOXUrl("http://maps.co.mecklenburg.nc.us/mrsid/getmap.php?" + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 1,
          isPng: false,
          minZoom: 15,
          maxZoom: 19
     },{
          name: "1978 Aerial Photography",
          getTileUrl: function(coord, zoom) {
              return WMSBBOXUrl("http://meckmap.mecklenburgcountync.gov/ArcGIS/services/1978_orthos_web_mercator/MapServer/WMSServer?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&STYLES=&SRS=EPSG:102113&WIDTH=256&HEIGHT=256&FORMAT=image/jpeg&LAYERS=0", coord, zoom, 15, 19);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 1,
          isPng: false,
          minZoom: 15,
          maxZoom: 19
     },{
          name: "2008 Land Classification",
          getTileUrl: function(coord, zoom) {
              var layerParams = [
                  "FORMAT=image/jpeg",
                  "LAYERS=classification2008",
                  "STYLES="
              ];
              return WMSBBOXUrl("http://maps.co.mecklenburg.nc.us/mrsid/getmap.php?" + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 0.7,
          isPng: false,
          minZoom: 15,
          maxZoom: 19
    },{
        name: "Environmental Layers",
        getTileUrl: function(coord, zoom) {
            var layerParams = [
                "FORMAT=image/png",
                "LAYERS=postgis:view_regulated_floodplains,postgis:landfills,postgis:mpl_sites,postgis:water_quality_buffers,postgis:proposed_thoroughfares,postgis:air_pollution_facilities",
                "STYLES="
            ];
            return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.6,
        isPng: true,
        minZoom: 15,
        maxZoom: 19,
        kmlnetworkpath: 'http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/kml/geoportal_environment.png.kml'
    },{
        name: "Soil Types",
        getTileUrl: function(coord, zoom) {
            var layerParams = [
                "FORMAT=image/png",
                "LAYERS=postgis:soil",
                "STYLES="
            ];
            return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.6,
        isPng: true,
        minZoom: 15,
        maxZoom: 19,
        kmlnetworkpath: 'http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/kml/postgis:soil.png.kml'
    },{
          name: "Impervious Surface",
          getTileUrl: function(coord, zoom) {
              return WMSBBOXUrl("http://meckmap.mecklenburgcountync.gov/ArcGIS/services/impervious_surface_sm/MapServer/WMSServer?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&STYLES=&SRS=EPSG:102113&WIDTH=256&HEIGHT=256&FORMAT=image/png&LAYERS=0,1", coord, zoom, 17, 19);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 0.6,
          isPng: true,
          minZoom: 17,
          maxZoom: 19
    },{
        name: "Economic Development",
        getTileUrl: function(coord, zoom) {
            var layerParams = [
                "FORMAT=image/png",
                "LAYERS=postgis:economic_development_corridors,postgis:view_zoning,postgis:building_permits,postgis:economic_development_loans,postgis:economic_development_business_investment_program",
                "STYLES="
            ];
            return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.6,
        isPng: true,
        minZoom: 15,
        maxZoom: 19,
        kmlnetworkpath: 'http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/kml/geoportal_economic.png.kml'
    },{
          name: "Nexrad Weather Radar",
          getTileUrl: function(coord, zoom) {
                return WMSBBOXUrl("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:900913&WIDTH=256&HEIGHT=256&FORMAT=image/png&LAYERS=nexrad-n0r", coord, zoom, 9, 18);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 0.6,
          isPng: true,
          minZoom: 9,
          maxZoom: 18
    },{
          name: "Cloud Cover",
          getTileUrl: function(coord, zoom) {
                return WMSBBOXUrl("http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs?service=wms&version=1.1.1&request=GetMap&format=png&SRS=EPSG:900913&width=256&height=256&Layers=RAS_RIDGE_NEXRAD&transparent=true", coord, zoom, 9, 18);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 0.6,
          isPng: true,
          minZoom: 9,
          maxZoom: 18
    },{
        name: "Tax Parcels",
        getTileUrl: function(coord, zoom) {
            var layerParams = [
                "FORMAT=image/png",
                "LAYERS=postgis:tax_parcels",
                "STYLES="
            ];
            return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 15, 19);
        },
        tileSize: new google.maps.Size(256,256),
        isPng: true,
        isVisible: true,
        minZoom: 16,
        maxZoom: 19,
        kmlnetworkpath: 'http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/kml/postgis:tax_parcels.png.kml'
    },{
        name: "Engineering Grid",
        getTileUrl: function(coord, zoom) {
                var layerParams = [
                       "FORMAT=image/png8",
                       "LAYERS=postgis:engineering_grid",
                       "STYLES="
                ];
                return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 10, 19);
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 1,
        isPng: true,
        minZoom: 10,
        maxZoom: 19,
        kmlnetworkpath: 'http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/kml/postgis:engineering_grid.png.kml'
  },{
        name: "Custom Map Layer",
        type: "select",
        getTileUrl: function(coord, zoom) {
                var layerParams = [
                       "FORMAT=image/png8",
                       "LAYERS=postgis:engineering_grid"
                ];
                return WMSBBOXUrl(meckWMSBase + meckWMSParams.concat(layerParams).join("&"), coord, zoom, 10, 19);
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.8,
        isPng: true,
        minZoom: 10,
        maxZoom: 19,
        kmlnetworkpath: 'http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/kml/postgis:engineering_grid.png.kml'
  }
];
