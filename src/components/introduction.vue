<template>
  <div class="text-center">
    <h1>
      Discover data about
      <strong>places</strong> in your community.
    </h1>
    <h2>Search for an address or place to get started!</h2>
    <div
      id="DtEIu-h2FQo"
      data-params="controls=0&ampshowinfo=0&amprel=0"
      data-background="img/youtube-bg.svg"
      class="youtube"
      @click="loadVid()"
    ></div>
    <p>
      Created by
      <a
        href="http://emaps.charmeck.org"
        target="_blank"
        rel="noopener"
      >Mecklenburg County GIS</a>
      <br>
    </p>
    <p>
      GeoPortal is
      <a
        href="https://github.com/tobinbradley/Mecklenburg-County-GeoPortal"
        target="_blank"
        rel="noopener"
      >open source software</a>.
      Use it to build something awesome!
    </p>
    <p>
      With much
      <span style="font-size: 1.3em">&#9829;</span> for the projects that make this site possible:
      <br>
      <span class="credits-links">
        <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener">OpenStreetMap</a>,
        <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a>,
        <a
          href="https://www.mapbox.com/mapbox-gl-js/api/"
          target="_blank"
          rel="noopener"
        >Mapbox GL JS</a>,
        <a href="http://vuejs.org/" target="_blank" rel="noopener">Vue</a>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "welcome",
  watch: {
    "$parent.sharedState.show": "focusSearch"
  },
  methods: {
    focusSearch: function() {
      let search = document.querySelector("#autosuggest__input");
      search.focus();
      search.classList.add("shake");
      setTimeout(function() {
        search.classList.remove("shake");
      }, 820);
    },
    loadVid: function() {
      let theElem = document.querySelector(".youtube");
      let id = theElem.getAttribute("id");

      // create iframe
      var iframe = document.createElement("iframe");
      var url =
        "//www.youtube.com/embed/" +
        id +
        "?autoplay=1&autohide=1&" +
        theElem.getAttribute("data-params");
      iframe.src = url;
      iframe.setAttribute("allowfullscreen", "allowfullscreen");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("aria-label", "GeoPortal video tutorial");
      theElem.appendChild(iframe);
    }
  }
};
</script>