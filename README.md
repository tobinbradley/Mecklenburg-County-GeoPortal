# GeoPortal v4

[GeoPortal](https://mcmap.org/geoportal) is a *one stop shopping for location information* government app. Highlights include:

* Perfect Lighthouse score.
* Code splitting utilized to keep page size down. Initial page load < 50KB.
* Progressive web app.
* Works great on mobile devices.

![imgur](https://i.imgur.com/m9MAQcL.gif)

![Imgur](https://i.imgur.com/3OGcvgS.png)

![Imgur](https://i.imgur.com/mL958Eo.png)

Created by Mecklenburg County GIS, with much ♥ for the projects that make this site possible: OpenStreetMap, OpenMapTiles, Mapbox GL JS, TailwindCSS, and Svelte.


## Get Started

```bash
git clone https://github.com/tobinbradley/Mecklenburg-County-GeoPortal.git geoportal
cd geoportal
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

To build the app for deployment, `npm run build` and copy the contents of the `public` folder to your web server.
