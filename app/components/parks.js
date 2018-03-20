import jsonToURL from "../js/jsontourl";
import format from "format-number";

let template = `
    <div>
        <div class="text-center">
            <div class="report-record-highlight" v-if="results">
                <svg class="icon icon-park"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-park"></use></svg>
                <h2>Your closest park is</h2>
                <h1>{{ results[0].name }}</h1>
                <h3>
                    <a href="javascript:void(0)" v-on:click="locationClick(0)">
                            {{ results[0].address }}, {{ results[0].city}}
                        </a>
                </h3>
                <h4>
                    {{ results[0].distance | distance }}
                </h4>
            </div>
            <table v-if="results">
                <caption>Parks Nearby</caption>
                <thead>
                    <tr>
                        <th>Park</th>
                        <th>Address</th>
                        <th class="col-responsive text-right">Distance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in results">
                        <td>
                            {{ item.name }}
                        </td>
                        <td>
                            <a href="javascript:void(0)" v-on:click="locationClick(index)">
                                    {{ item.address }}, {{item.city}}
                                </a>
                        </td>
                        <td class="nowrap col-responsive text-right">
                            {{ item.distance | distance }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="report-moreinfo">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://charmeck.org/mecklenburg/county/ParkandRec/Pages/default.aspx" target="_blank" rel="noopener">Mecklenburg County Park and Recreation</a></li>
                <li><a href="http://www.huntersville.org/Departments/ParksRecreation.aspx" target="_blank" rel="noopener">Huntersville Parks and Recreation</a></li>
            </ul>
        </div>
    </div>
`;

export default {
  name: "parks",
  template: template,
  data: function() {
    return {
      results: null
    };
  },
  filters: {
    distance: function(dist) {
      return format({
        truncate: 1,
        suffix: " miles"
      })(dist / 5280);
    }
  },
  watch: {
    "$parent.sharedState.selected.lnglat": "getResults",
    "$parent.sharedState.show": "getResults"
  },
  mounted: function() {
    this.getResults();
  },
  methods: {
    getResults: function() {
      let _this = this;
      if (
        _this.$parent.sharedState.selected.lnglat &&
        _this.$parent.sharedState.show.indexOf("parks") !== -1
      ) {
        let params = {
          columns:
            "name, address, city, st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat",
          limit: "5"
        };
        fetch(
          `https://mcmap.org/api/nearest/v1/parks_all/${_this.$parent.sharedState.selected.lnglat.join(
            ","
          )}/4326?${jsonToURL(params)}`
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
    locationClick: function(index) {
      let poi = this.results[index];
      this.$parent.sharedState.poi = {
        lnglat: [poi.lng, poi.lat],
        address: poi.address,
        label: poi.name
      };
    }
  }
};
