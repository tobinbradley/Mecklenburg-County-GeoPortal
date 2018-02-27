import jsonToURL from "../../js/jsontourl";

let template = `
    <div v-if="results.length > 0" class="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop photos">
        <div class="mdl-card__title photo-big">
            <a v-bind:href="results[photoIndex].photo_url.trim()" target="_blank"  rel="noopener">
                <img v-on:error="handleError(photoIndex);" v-bind:src="results[photoIndex].photo_url.trim()" class="mdl-shadow--2dp" />
            </a>
        </div>
        <div class="mdl-card__supporting-text mdl-typography--text-center ">
            {{ results[photoIndex].attribution}} &#8226; {{results[photoIndex].source}}
        </div>
        <div v-if="results.length > 1" class="mdl-card__actions mdl-card--border photo-thumb">
            <img v-for="(item, index) in results" class="mdl-shadow--2dp" v-on:error="handleError(index);" v-bind:src="item.photo_url.trim()" v-on:click="handleThumbClick(index)" />
        </div>
    </div>
`;

export default {
  name: "photos",
  template: template,
  data: function() {
    return {
      results: [],
      photoIndex: 0
    };
  },
  mounted: function() {
    this.getResults();
  },
  watch: {
    "$parent.$parent.sharedState.selected.pid": "getResults"
  },
  methods: {
    getResults: function() {
      let _this = this;
      if (
        _this.$parent.$parent.sharedState.selected &&
        _this.$parent.$parent.sharedState.selected.pid
      ) {
        _this.photoIndex = 0;
        let params = {
          pid: _this.$parent.$parent.sharedState.selected.pid,
          photo_source: "mvideo,ilookabout"
        };
        fetch(
          `https://mcmap.org/rest/v2/ws_misc_house_photos.php?${jsonToURL(
            params
          )}`
        )
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            _this.results = data;
          })
          .catch(function(ex) {
            console.log("parsing failed", ex);
          });
      }
    },
    handleThumbClick: function(index) {
      this.photoIndex = index;
    },
    handleError: function(index) {
      this.results.splice(index, 1);
    }
  }
};
