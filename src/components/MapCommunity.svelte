<script>
  import { location } from '../store.js'
  import { createEventDispatcher } from 'svelte'
  import { interpolateYlGnBu as interpolate } from 'd3-scale-chromatic'

  const dispatch = createEventDispatcher()

  export let showMap = false
  export let mapTitle = ''
  export let mapData = ''

  const mapContainer = `mapID${Math.floor((Math.random() * 10000) + 1)}`
  let mapElement
  let map = null

  $: if ($location) {
    showMap = false
  }

  $: {
    if (map) render(mapData)
  }

  $: if (showMap === true) {
    import(/* webpackChunkName: "mapbox-gl" */ 'mapbox-gl').then(({ default: gl }) => {
      createMap(gl)
    })
  }

  const mapStyle = {
    "version": 8,
    "sources": {
      "npa": {
        "type": "geojson",
        "data": "./data/npa.geojson.json"
      }
    },
    "layers": [
      {
        "id": "background",
        "type": "background",
        "paint": {
          "background-color": "white"
        }
      },
      {
        "id": "npa",
        "source": "npa",
        "type": "fill-extrusion",
        "paint": {
          "fill-extrusion-opacity": 0,
          "fill-extrusion-color": ["feature-state", "color"],
          "fill-extrusion-height": ["feature-state", "height"]
        }
      }
    ]
  }

  function height(min, max, n) {
    n = n - min
    return (n / max) * 6000
  }

  function color(min, max, n, npa) {
    n = n - min
    n = ((n * 100) / max) / 100
    return interpolate(n)
  }

  function createMap(gl) {
    let mapOptions = {
      container: mapContainer,
      style: mapStyle,
      attributionControl: false,
      minZoom: 8,
      maxBounds: [[-82.641, 34.115], [-79.008, 36.762]],
      zoom: 9.3,
      center: [-80.84, 35.23], //$location.lnglat,
      pitch: 40,
      bearing: 10,
      preserveDrawingBuffer: navigator.userAgent.toLowerCase().indexOf("firefox") > -1
    }

    // create map
    map = new gl.Map(mapOptions)

    // add controls
    controls(gl)

    // location marker
    locationMarker(gl)

    // render npa's
    render()

    // create hover popups
    hoverinfo(gl)

  }

  function locationMarker(gl) {
    // create markers for geocoding
    const el = document.createElement('div');
    el.className = 'mapboxgl-user-location-dot'

    const popup = new gl.Popup({ offset: 9 }).setHTML(
      `<h3 class="font-bold text-blue-800 text-base pb-1">Your Location</h3>${$location.label}`
    )
    const marker = new gl.Marker(el)
      .setLngLat($location.lnglat)
      .setPopup(popup)
      .addTo(map)
  }

  function hoverinfo(gl) {
    let popup = new gl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'mapboxgl-popup-community'
    });

    map.on('mousemove', 'npa', function(e) {
      const coordinates = e.lngLat
      const id = e.features[0].id
      map.getCanvas().style.cursor = 'crosshair';

      popup
        .setLngLat(coordinates)
        .setHTML(mapData[id][mapData[id].length - 1] || 'N/A')
        .addTo(map)
    })

    map.on('mouseleave', 'npa', function() {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })
  }

  function paintNPAs() {
    let mapDataNumeric = JSON.parse(JSON.stringify(mapData))
    const mapIds = [...new Set(map.querySourceFeatures('npa').map(el => el.id ))]

    Object.keys(mapDataNumeric).forEach(npa => {
      if (!mapDataNumeric[npa][mapDataNumeric[npa].length - 1]) {
        delete mapDataNumeric[npa]
      } else {
        mapDataNumeric[npa] = mapDataNumeric[npa][mapDataNumeric[npa].length - 1].toString()
        mapDataNumeric[npa] = mapDataNumeric[npa].replace(/[^\d.-]/g, '')
      }
    })

    // figure out min/max
    const min = Math.min.apply(Math, Object.values(mapDataNumeric))
    const max = Math.max.apply(Math, Object.values(mapDataNumeric))

    mapIds.forEach(npa => {
      mapDataNumeric[npa] ?
        map.setFeatureState({source: 'npa', id: npa}, { color: color(min, max, mapDataNumeric[npa], npa)}) :
        map.setFeatureState({source: 'npa', id: npa}, { color: "#fff" })
    })

    mapIds.forEach(npa => {
      mapDataNumeric[npa] ?
      map.setFeatureState({source: 'npa', id: npa}, { height: height(min, max, mapDataNumeric[npa]) }) :
      map.setFeatureState({source: 'npa', id: npa}, { height: 0 })
    })

    // set layer visible for first paint
    map.setPaintProperty(
      'npa',
      'fill-extrusion-opacity',
      1
    )
  }

  function render() {
    if (map.loaded()) {
      paintNPAs()
    } else {
      map.on("load", () => {
        paintNPAs()
      })
    }
  }

  function controls(gl) {
    map.addControl(new gl.NavigationControl())
    map.addControl(new gl.FullscreenControl())
  }

  function handleShowButton() {
    showMap = !showMap
    if (!showMap) {
      dispatch('mapOff', true)
    }
  }
</script>

<style>
  @import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
  @import '../css/map.css';
</style>


{#if showMap}
<div class="mt-8 relative">
  <div class="map mb-12" id={mapContainer}></div>
  <div class="text-center absolute top-0 mt-3 w-full">
    <span class="font-bold p-1 rounded" style="background-color: rgba(255,255,255,0.8);">{ mapTitle }</span>
  </div>
</div>
{/if}

<div class="text-center mt-4 print:hidden">
  <button on:click={handleShowButton} class="btn py-1 px-2 text-sm hover:bg-gray-200 hover:shadow capitalize shadow-none text-gray-600 transition duration-200 ease-in-out">{#if !showMap}show{:else}hide{/if} map</button>
</div>
