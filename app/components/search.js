import jsonToURL from "../js/jsontourl";
import debounce from "lodash.debounce";
import fetchNearest from "../js/nearest";
import { setHash } from "../js/history";

let template = `
    <div>
        <div>
            <div class="search-container">
                <div class="search-input-container">
                    <input type="text" aria-label="search" name="search-input" class="search-input" autocomplete="off" placeholder="Tell me about..." v-on:focus="search()" v-model="privateState.query" @blur="lostFocus()" />
                    <div class="border"></div>
                    <p class="muted">Try typing part of an address, like <em>700 N</em>. <span v-if="privateState.gps">Or we can <a href="javascript:void(0)" @click="geoLocation">take a guess</a>.</span></p>                    
                </div>
            </div>
        </div>
        <div>
            <div id="search-results">
                <ul v-for="(item, index) in privateState.results">
                    <li v-on:click="select(index)">
                        <span class='search-result-type'>{{ item.type }}</span>
                        <span class='search-result-label'>{{ item.label }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
`;

export default {
  name: "search",
  template: template,
  watch: {
    "privateState.query": "search"
  },
  mounted: function() {
    if (navigator.geolocation && location.protocol === "https:") {
      this.privateState.gps = true;
    }
  },
  methods: {
    lostFocus: function() {
      let _this = this;
      let slowUnfocus = debounce(function() {
        _this.privateState.results = [];
      }, 250);
      slowUnfocus();
    },
    search: function() {
      let _this = this;
      let query = _this.privateState.query.trim();
      let debounceSearch = debounce(function() {
        _this.getResults(query);
      }, 250);
      if (query.length >= 4) {
        debounceSearch();
      }
    },
    geoLocation: function() {
      let _this = this;
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          fetchNearest(
            position.coords.latitude,
            position.coords.longitude,
            _this.sharedState
          );
        });
      }
    },
    getResults: function(query) {
      let _this = this;
      let params = {
        tables: "address,park,library,school,pid,business"
      };
      fetch(
        `https://mcmap.org/api/search/v1/${query.toLowerCase()}?${jsonToURL(
          params
        )}`
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          _this.privateState.results = data;
        })
        .catch(function(ex) {
          console.log("parsing failed", ex);
        });
    },
    select: function(index) {
      let _this = this;
      let rec = _this.privateState.results[index];
      _this.sharedState.selected = {
        lnglat: [rec.lng, rec.lat],
        label: rec.type,
        address: rec.address,
        pid: rec.pid
      };
      _this.privateState.results = [];
      // push state
      setHash(_this.sharedState.selected.lnglat, _this.sharedState.show);
    }
  }
};
