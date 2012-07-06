GeoPortal-Project
=================

GeoPortal mapping template created by Mecklenburg County GIS. It leverages the great work of the following projects:
* [Leaflet](http://leaflet.cloudmade.com/)
* [OpenLayers](http://openlayers.org/)
* [HTML5 Boilerplate](http://html5boilerplate.com/)
* [jQuery](http://jquery.com/)
* [jQuery UI](http://jqueryui.com/)

## Getting Started
This application contains no server-side code and should run as-is on any http server without modification. It *will not* work from a file system (file://), as your browser will throw a XSS error when trying to load config.json.

### Choosing a Mapping Library
The GeoPortal Project is designed to use either the [Leaflet](http://leaflet.cloudmade.com/) or [OpenLayers](http://openlayers.org/) mapping libraries. Leaflet is selected by default. Both libraries are fantastic and capable mapping libraries and you can't go wrong with either one. Leaflet is much smaller and is arguably easier to use. OpenLayers is a much more powerful and robust library but is significatly larger and is arguably more difficult to use.

To switch the mapping library to OpenLayers, comment out or remove the <!-- Leaflet CSS --> section in the header and comment out or remove the <!-- Mapping Library - Leaflet --> section at the bottom of the page. Then uncomment the <!-- Mapping Library - OpenLayers --> section at the bottom of the page.

You will then need to make a change to the manifest.appcache file to invalidate the cache. On the second line, simply increment or change the version number.

Refresh the page in your browser.


### Navigating config.json
config.json is a JavaScript object containing map and layer configuration information.

Most of the object properties should be self-explanatory with the explanation of web_service_base. This property is the base URL for a series of web services used for address searches, feature information, etc. These calls are using the [postgis-restful-web-service-framework](http://code.google.com/p/postgis-restful-web-service-framework/). If you just need a map, this isn't necessary.

## Things to Think About
* Leaflet can be a bit squirely on IE < 8. In particular the layer control is busted.
* Be careful about manifest.appcache. Make sure your web server is setting cache time on that file to 0. If that file gets cached by the client, you will have no way to invalidate the client's cache from the server. And don't forget increment it when you make a change, lest you fling your monitor across the room.
