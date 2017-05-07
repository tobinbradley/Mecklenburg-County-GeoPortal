<template lang="html">
    <div class="introduction">
        <div class='intro-slot' v-if="$parent.sharedState.show !== 'welcome'">
            To view this information, use the search above to find a location.
        </div>        
        <h4>
            Discover data about <strong>places</strong> in your community.
        </h4>
        <h5>
            Search for an address or place to get started!
        </h5>
        <div class="youtube" id="DtEIu-h2FQo" data-params="controls=0&showinfo=0&rel=0" data-background="img/youtube-bg.svg"></div>
        <p class="credit">
            Created by <a href="http://emaps.charmeck.org" target="_blank">Mecklenburg County GIS</a>
        </p>
        <p>
            GeoPortal is <a href="https://github.com/tobinbradley/Mecklenburg-County-GeoPortal" target="_blank">open source software</a>.
        </p>
        <p class="credits">
            With much <span style="font-size: 1.5em; vertical-align: bottom;">&#9829;</span> for the projects that make this site possible:<br>
            <span class="credits-links">
                <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>,
                <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>,
                <a href="https://www.mapbox.com/mapbox-gl-js/api/" target="_blank">Mapbox GL JS</a>,
                <a href="http://vuejs.org/" target="_blank">Vue.js</a>, and
                <a href="http://getmdl.io/" target="_blank">Material Design Lite</a>
            </span>
        </p>
  </div>
</template>

<script>
import youtubeLoader from '../modules/youtube';

export default {
    name: 'welcome',
    mounted: function() {
        youtubeLoader('.youtube');
    }
}
</script>

<style lang="css">
    .intro-slot {
        padding: 14px 20px;
        background: #0097A7;
        font-size: 1.2em;
        border-radius: 5px;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
        color: white;
    }
</style>
