<script>
  import { location } from '../store.js'
  import AerialToggle from '../js/mapcontrolSatellite.js'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let showMap = false
  export let mapPoints = null
  export let fullMap = false
  export let toggleLayers = null

  const mapContainer = `mapID${Math.floor((Math.random() * 10000) + 1)}`
  let mapElement
  let map = null

  $: if ($location) {
    showMap = false
  }

  $: if (showMap === true) {
    import(/* webpackChunkName: "mapbox-gl" */ 'mapbox-gl').then(({ default: gl }) => {
      createMap(gl)
    })
  }

  function createMap(gl) {
    let mapOptions = {
      container: mapContainer,
      style: './gl-style/osm-geoportal.json',
      attributionControl: false,
      minZoom: 8,
      maxBounds: [[-82.641, 34.115], [-79.008, 36.762]],
      pitch: 40,
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

    // create map
    map = new gl.Map(mapOptions)

    // location marker
    locationMarker(gl)

    // points if needed
    if (mapPoints) drawPoints(gl)

    // toggle layers if needed
    if (toggleLayers) toggle(toggleLayers)

    // add controls
    controls(gl)
  }

  function drawPoints(gl) {
    mapPoints.forEach(pt => {
      const el = document.createElement('div');
      el.className = 'mapPoints-maker';
      el.innerHTML = `<span><b>${pt.label || ''}</b></span>`

      const popup = new gl.Popup({ offset: 35 }).setHTML(
        `<h3 class="font-bold text-blue-800 text-base pb-1">${pt.name}</h3>
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
    el.className = 'mapboxgl-user-location-dot'

    const popup = new gl.Popup({ offset: 9 }).setHTML(
      `<h3 class="font-bold text-blue-800 text-base pb-1">Your Location</h3>${$location.label}`
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

  function toggle(layers) {
    map.on("load", () => {
        if (toggleLayers === 'impervious') {
          map.setLayoutProperty(
            'building-3d',
            'visibility',
            'none'
          )
          map.setLayoutProperty(
            'impervious',
            'visibility',
            'visible'
          )
        }
        if (toggleLayers === 'environment') {
          map.setLayoutProperty(
            'floodplains',
            'visibility',
            'visible'
          )
        }
        if (toggleLayers === 'parks') {
          map.setLayoutProperty(
            'greenways',
            'visibility',
            'visible'
          )
          map.setLayoutProperty(
            'greenways_label',
            'visibility',
            'visible'
          )
        }
    })
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
<div class="map mt-8 mb-12" id={mapContainer}></div>
{/if}

<div class="text-center mt-2 print:hidden">
  <button on:click={handleShowButton} class="btn py-1 px-2 text-sm hover:bg-gray-200 hover:shadow capitalize shadow-none text-gray-600 transition duration-200 ease-in-out">{#if !showMap}show{:else}hide{/if} map</button>
</div>
