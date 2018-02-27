let template = `
    <div class="introduction">
        <div class='' v-show="$parent.sharedState.show !== 'welcome'">
            <a class="button button-accent" href="javascript:void(0)" @click="focusSearch()">To view this information, use the search above to find a location.</a>
        </div>
        <h4>
            Discover data about <strong>places</strong> in your community.
        </h4>
        <h5>
            Search for an address or place to get started!
        </h5>
        <div id="DtEIu-h2FQo" data-params="controls=0&amp;showinfo=0&amp;rel=0" data-background="img/youtube-bg.svg"
							    class="youtube" @click="loadVid()"></div>
        <p class="credit">
            Created by <a href="http://emaps.charmeck.org" target="_blank"  rel="noopener">Mecklenburg County GIS</a>
        </p>
        <p>
            GeoPortal is <a href="https://github.com/tobinbradley/Mecklenburg-County-GeoPortal" target="_blank"  rel="noopener">open source software</a>.
        </p>
        <p class="credits">
            With much <span style="font-size: 1.5em; vertical-align: bottom;">&#9829;</span> for the projects that make this site possible:<br>
            <span class="credits-links">
                    <a href="https://www.openstreetmap.org/" target="_blank"  rel="noopener">OpenStreetMap</a>,
                    <a href="https://openmaptiles.org/" target="_blank"  rel="noopener">OpenMapTiles</a>,
                    <a href="https://www.mapbox.com/mapbox-gl-js/api/" target="_blank"  rel="noopener">Mapbox GL JS</a>,
                    <a href="http://vuejs.org/" target="_blank"  rel="noopener">Vue.js</a>, and
                    <a href="http://getmdl.io/" target="_blank"  rel="noopener">Material Design Lite</a>
                </span>
        </p>
    </div>
`;

export default {
  name: "welcome",
  template: template,
  methods: {
    focusSearch: function() {
      document.querySelector(".search-input").focus();
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
