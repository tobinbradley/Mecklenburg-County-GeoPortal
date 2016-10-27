<template lang="html">
    <div class="introduction" v-show="sharedState.show.indexOf('introduction') !== -1">
        <!-- <h3>Welcome to GeoPortal</h3> -->
        <h4>
            Discover data about <strong>places</strong> in your community.
        </h4>
        <h5>
            Search for an address or place to get started!
        </h5>
        <div class="youtube" id="DtEIu-h2FQo" data-params="controls=0&showinfo=0&rel=0" data-background="img/youtube-bg.png"></div>
        <p class="credit">
            Created by <a href="http://emaps.charmeck.org" target="_blank">Mecklenburg County GIS</a>
        </p>
        <p>
            It's open source! <a href="https://github.com/tobinbradley/Mecklenburg-County-GeoPortal">Fork it on GitHub</a>
        </p>
        <p class="credits">
            With much <i role="presentation" class="material-icons">favorite</i> for the projects that make this site possible:<br>
            <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>,
            <a href="http://osm2vectortiles.org/" target="_blank">OSM2VectorTiles</a>,
            <a href="https://www.mapbox.com/mapbox-gl-js/api/" target="_blank">Mapbox GL JS</a>,
            <a href="http://vuejs.org/" target="_blank">Vue.js</a>, and
            <a href="http://getmdl.io/" target="_blank">Material Design Lite</a>
        </p>
  </div>
</template>

<script>
import youtubeLoader from '../modules/youtube';

export default {
    name: 'introduction',
    mounted: function() {
        youtubeLoader('.youtube');
    }
}
</script>

<style lang="css">
</style>
