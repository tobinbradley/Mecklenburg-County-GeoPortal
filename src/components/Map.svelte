<script>
  import { location } from '../store.js'
  import AerialToggle from '../js/mapcontrolSatellite.js'
  import { createEventDispatcher } from 'svelte'

  const apiKey = "AAPK47243148443e45dbbafdc12899934519XllUJyQWQ7aZCKvAnVoh_KLNXdG8F5gj2PPlGaHdLk_HmMrkzZDbuykgCFlHVELl"
  export let basemapEnum = "arcgis/topographic"
  export let showMap = false
  export let mapPoints = null
  export let fullMap = false
  export let toggleLayers = null

  const dispatch = createEventDispatcher()

  const mapContainer = `mapID${Math.floor((Math.random() * 10000) + 1)}`
  let map = null

  $: if ($location) {
    showMap = false
  }

  $: if (showMap === true) {
    (async () => {
      await import("maplibre-gl/dist/maplibre-gl.css")
      const { default: gl } = await import("maplibre-gl")
      createMap(gl)
    })();
  }

  function createMap(gl) {
    map = new gl.Map(mapOptions(gl))

    map.on('load', () => {
      // add terrain
      map.addSource('terrain', {
        "type": "raster-dem",
        "encoding": "terrarium",
        "tiles": [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
        ],
        "tileSize": 256,
        "minzoom": 0,
        "maxzoom": 13
      })
      map.setTerrain({ source: 'terrain', "exaggeration":  1.4 })

      // location marker
      locationMarker(gl)
      // points if needed
      if (mapPoints) drawPoints(gl)
      // toggle layers if needed
      if (toggleLayers) toggle(toggleLayers)
      // add controls
      controls(gl)

    })
  }

  function mapOptions(gl) {
    let mapOptions = {
      container: mapContainer,
      style: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/${basemapEnum}?token=${apiKey}`,
      attributionControl: false,
      minZoom: 8,
      maxBounds: [[-82.641, 34.115], [-79.008, 36.762]],
      preserveDrawingBuffer: navigator.userAgent.toLowerCase().indexOf("firefox") > -1
    }

    // set beginning map extent
    if (mapPoints) {
      const bounds = new gl.LngLatBounds()

      // get points and address bounds
      bounds.extend($location.lnglat)
      mapPoints.forEach(feature => {
        bounds.extend(feature.lngLat)
      })

      mapOptions.bounds = bounds
      mapOptions.fitBoundsOptions = {padding: {top: 70, right: 70, bottom: 70, left: 70}}
    }
    else if (fullMap) {
      mapOptions.bounds = [-81.0580999999999960,35.0016000000000034,-80.5503999999999962,35.5152000000000001]
    }
    else {
      mapOptions.center = $location.lnglat
      mapOptions.zoom = 17
    }

    return mapOptions
  }

  function drawPoints(gl) {
    mapPoints.forEach(pt => {
      const el = document.createElement('div');
      el.className = 'mapPoints-maker';
      el.innerHTML = `<span><b>${pt.label || ''}</b></span>`

      const popup = new gl.Popup({ offset: 35 }).setHTML(
        `<h3 class="font-bold text-sky-800 text-base pb-1">${pt.name}</h3>
        ${pt.address}
        <br><a target="_blank" href="${directions($location.lnglat, pt.lngLat)}">Directions</a>`
      )
      new gl.Marker(el)
        .setLngLat(pt.lngLat)
        .setPopup(popup)
        .addTo(map)
    })
  }

  function locationMarker(gl) {
    // create markers for geocoding
    const el = document.createElement('div');
    el.className = 'maplibregl-user-location-dot'
    el.style.backgroundImage = '';

    const popup = new gl.Popup({ offset: 9 }).setHTML(
      `<h3 class="text-sky-800 font-bold text-base pb-1">Your Location</h3>${$location.label}`
    )
    const marker = new gl.Marker(el)
      .setLngLat($location.lnglat)
      .setPopup(popup)
      .addTo(map)
  }

  function directions(flnglat, tlnglat) {
    return `https://maps.google.com/maps?saddr=${flnglat[1]}+${flnglat[0]}&daddr=${tlnglat[1]}+${tlnglat[0]}`;
  }

  function controls(gl) {
    map.addControl(new gl.NavigationControl())
    map.addControl(new AerialToggle({}))
    map.addControl(new gl.FullscreenControl())
  }

  function toggle() {
        if (toggleLayers === 'impervious') {
          map.addSource('impervious', {
            "type": "vector",
            "tiles": [
              "https://maps.mecknc.gov/tiles/impervious_surface/{z}/{x}/{y}"
            ],
            "minzoom": 16,
            "maxzoom": 16
          })
          map.addLayer({
            "id": "impervious",
            "type": "fill",
            "source": "impervious",
            "source-layer": "impervious_surface",
            "minzoom": 16,
            "paint": {
              "fill-color": [
                "match",
                ["get", "type"],
                "Commercial", "hsla(322, 28%, 62%, 1)",
                "Residential", "hsla(72, 46%, 58%, 1)",
                "hsla(0, 0%, 80%, 0)"
              ]
            }
          })
        }
        if (toggleLayers === 'environment') {
          map.addSource('floodplains', {
            "type": "vector",
            "tiles": [
              "https://maps.mecknc.gov/tiles/view_regulated_floodplains/{z}/{x}/{y}"
            ],
            "minzoom": 14,
            "maxzoom": 14
          })
          map.addSource('stormwater_conservation_easements', {
            "type": "vector",
            "tiles": [
              "https://maps.mecknc.gov/tiles/stormwater_conservation_easements/{z}/{x}/{y}"
            ],
            "minzoom": 14,
            "maxzoom": 14
          })
          map.addLayer({
            "id": "floodplains",
            "type": "fill",
            "source": "floodplains",
            "source-layer": "view_regulated_floodplains",
            "minzoom": 14,
            "paint": {
              "fill-color": "hsla(202, 81%, 86%, 1)"
            }
          }, 'Parcel/line')
          map.addLayer({
            "id": "stormwater_conservation_easements",
            "type": "fill",
            "source": "stormwater_conservation_easements",
            "source-layer": "stormwater_conservation_easements",
            "minzoom": 14,
            "paint": {
              "fill-color": "hsla(304, 81%, 86%, 1)"
            }
          }, 'Parcel/line')
        }

  }

  function handleShowButton() {
    showMap = !showMap
    if (!showMap) {
      dispatch('mapOff', true)
    }
  }
</script>


{#if showMap}
<div class="map mt-8 mb-12" id={mapContainer}></div>
{/if}

<div class="text-center mt-2 print:hidden">
  <button on:click={handleShowButton} class="btn py-1 px-2 text-sm hover:bg-gray-200 hover:shadow capitalize shadow-none text-gray-600 dark:text-gray-300 hover:text-gray-800 transition duration-200 ease-in-out">{#if !showMap}show{:else}hide{/if} map</button>
</div>
