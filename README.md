#Mecklenburg County GeoPortal

Mecklenburg County GeoPortal is the current production release of Mecklenburg County's version of the [Geoportal Project](https://github.com/tobinbradley/GeoPortal-Project). It leverages the great work of the following projects:
* [Leaflet](http://leaflet.cloudmade.com/)
* [OpenLayers](http://openlayers.org/)
* [HTML5 Boilerplate](http://html5boilerplate.com/)
* [jQuery](http://jquery.com/)
* [jQuery UI](http://jqueryui.com/)

## Getting Started

### Navigating config.js
config.js is a JavaScript object containing map and layer configuration information.

Most of the object properties should be self-explanatory with the explanation of web_service_base. This property is the base URL for a series of web services used for address searches, feature information, etc. These calls are using the [postgis-restful-web-service-framework](http://code.google.com/p/postgis-restful-web-service-framework/). If you just need a map, this isn't necessary.

## Things to Think About
* Be careful about manifest.appcache. Make sure your web server is setting cache time on that file to 0. If that file gets cached by the client, you will have no way to invalidate the client's cache from the server. And don't forget increment it when you make a change, lest you fling your monitor across the room.
