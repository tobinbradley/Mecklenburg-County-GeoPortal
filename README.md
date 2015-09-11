# GeoPortal v3

Created by Mecklenburg County GIS. Online [over here](http://mcmap.org/geoportal/).

Built using:

* Material Design Lite
* Leaflet
* React

## Building the Project

GeoPortal is strictly HTML/CSS/JS and can run locally via `gulp`.

First, install the global dependencies. You'll need Node and npm (if separate with your distro) installed before you begin.

``` bash
npm install -g gulp tape
```

Next install the required modules.

``` bash
npm install
```

Then build the public folder.

``` bash
gulp build
```

Now you can launch a development environment at any time by typing `gulp`. To build the app for deployment (minifying CSS and uglifying JS), add a type of production to your build.

``` bash
gulp build --type production
```
