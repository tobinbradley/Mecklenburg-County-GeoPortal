Mecklenburg County GeoPortal
==================================

This is the complete source code for [Mecklenburg County, NC's GeoPortal](http://maps.co.mecklenburg.nc.us/). It's MIT licensed, so do with it what you will. Patches are always welcome.

This project stands on the shoulders of Smart People:
+ [Leaflet.js](http://leafletjs.com/) for mapping.
+ [Bootstrap](http://twitter.github.io/bootstrap/) for teh pretty and responsive.
+ [jQuery](http://jquery.com/) and [Underscore.js](http://underscorejs.org/) for DOM manipulation, templating, and general awesome.

### Stuff it Does I Think is Neat
+ It's not ugly. That puts it into the top 5% of online government GIS apps from the get-go.
+ It's easy to use. See above.
+ It's extremely fast and light-weight. All the JavaScript gzip'd except jQuery (which it loads via Google's CDN) is ~4Okb. That's Leaflet and everything.
+ Embed map. It has a wizard to walk you through creating an iframe for the site, so you can shove just the features you want in your CMS, other sites, whatever. The embedded map looks something like this:


    <iframe frameborder="0" width="600" height="640" src="http://maps.co.mecklenburg.nc.us/geoportal/embed.html?s=true&matid=150772&lng=-80.801&lat=35.2878&qs=parks,libraries,schools-magnet&dq=parks"></iframe>


<iframe frameborder="0" width="600" height="640" src="http://maps.co.mecklenburg.nc.us/geoportal/embed.html?s=true&matid=150772&lng=-80.801&lat=35.2878&qs=parks,libraries,schools-magnet&dq=parks"></iframe>

### Future Features
+ Print a report, aka taking what's on your screen and burning it into pressed trees. Apparently that's still a thing.
+ Some responsive improvements. Some elements like the popup size scale themselves in-situ; they aren't resizing on window size change.

### Good Stuff to Know
I used PubSub for almost all of the main "events" - adding a marker, selecting a location, making reports, etc. You can find the publications near the top of `assets/scripts/page.js`.

The "report" type information is rendered via Underscore.js templates. Templates are stored in individual html files in `public/templates`. When they are loaded they are put into a global variable so they don't have to be loaded again. They are also put in localstorage if it's available, so most users only have to fetch them once. A version number is put in localstorage so it is wiped after you publish site updates.

[Grunt](http://gruntjs.com/) is used for watch and build. To get Grunt running:
+ Install [Node.js](http://nodejs.org/) for whatever platform you're on.
+ Bust out a terminal/DOS/whatever and install Grunt via `npm install -g grunt-cli`.
+ Bust out a terminal/DOS/whatever and move to the main folder (where `Gruntfile.js` is). Type `npm install` and it will install everything you need. To see what it installed, check out `package.json`.

The watch process is the default; just type `grunt` and you're going. For final compilation (minimzation/uglify etc.) type `grunt build`.

It might be useful to look through `Gruntfile.js` so you understand what it's doing. If you want to add a JavaScript library, that's where you'd do it. One of the things it does is a find/replace to change some version numbers for cache invalidation. If you're planning on making serious changes, you'll want to customize Gruntfile.js to fit your needs.

## Project Layout
### assets
This contains stuff that needs preprocessing before we use it or source files for images.
+ __images__: Source files for images.
+ __less__: LESS source files. `main.less` imports the others and is what you should edit.
+ __scripts__: JavaScript files. The root folder contains project stuff.
    + `functions.js` contains some general functions and prototypes.
    + `question.js` contains the service calls for all of the reports as well as turns on or off overlay layers.
    + `map.js` contains map specific code.
    + `page.js` contains general code for page interactions.

### public
This folder is what you want to share on the web. The JavaScript and LESS files are precompiled and rendered here.
+ The root folder contains index.html, embed.html, report.html, and favicon and touch icons, and related stuff.
+ __css__: The processed LESS goes into main.css.
+ __images__: Really?
+ __js__: All of the JavaScript is processed into main.js.
+ __php__: This is just a little code to email feedback.
+ __templates__: Underscore templates. There are lots of these.

