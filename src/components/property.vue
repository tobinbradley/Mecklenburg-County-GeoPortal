<template>
    <div>
        <div class="report-record-highlight text-center">
            <svg class="icon icon-property"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-property"></use></svg>
            <h2>Tax Parcel</h2>
            <h1>{{selected.pid}}</h1>
            <h3 v-if="resultsZoning.length > 0">Zoned as {{ resultsZoning[0].zone_class}} {{resultsZoning[0].zone_des}}</h3>
            <Photos :pid="selected.pid"></Photos>
        </div>
        <div v-if="resultsOwnership.length > 0">
            <table>
                <caption>Ownership</caption>
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in resultsOwnership">
                        <td>
                            {{item.first_name}} {{item.last_name}}
                        </td>
                        <td>
                            {{item.address_1}} <br /> {{item.city}}, {{item.state}} {{item.zipcode}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="resultsAppraisal.length > 0">
            <table>
                <caption>Tax Appraisal</caption>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th class="text-right">Building</th>
                        <th class="col-responsive text-right">Land</th>
                        <th class="col-responsive text-right">Extra</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in resultsAppraisal">
                        <td>
                            {{item.tax_year}}
                        </td>
                        <td class="text-right">
                            {{item.building_value | money}}
                        </td>
                        <td class="col-responsive text-right">
                            {{item.land_value | money}}
                        </td>
                        <td class="col-responsive text-right">
                            {{item.extra_features_value | money}}
                        </td>
                        <td class="text-right">
                            {{item.total_value | money}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="resultsSales.length > 0">
            <table>
                <caption>Sale History</caption>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th class="text-right">Price</th>
                        <th class="col-responsive">Deed Book</th>
                        <th class="col-responsive">Legal Reference</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in resultsSales">
                        <td>
                            {{item.sale_date}}
                        </td>
                        <td class="text-right">
                            {{ item.sale_price | money }}
                        </td>
                        <td class="col-responsive">
                            {{item.deed_book}}
                        </td>
                        <td class="col-responsive">
                            {{item.legal_reference}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="resultsLanduse.length > 0">
            <table>
                <caption>Land Use</caption>
                <thead>
                    <tr>
                        <th>Use</th>
                        <th class="text-right">Units</th>
                        <th class="col-responsive">Neighborhood</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in resultsLanduse">
                        <td>
                            {{item.land_use}}
                        </td>
                        <td class="text-right">
                            {{ item.units | trunc}}
                        </td>
                        <td class="col-responsive">
                            {{item.neighborhood}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="resultsBuildings.length > 0">
            <table>
                <caption>Buildings</caption>
                <thead>
                    <tr>
                        <th>Structure</th>
                        <th>Year Built</th>
                        <th class="col-responsive">Exterior</th>
                        <th class="text-right">Area</th>
                        <th class="col-responsive text-right">Beds</th>
                        <th class="col-responsive text-right">Baths</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in resultsBuildings">
                        <td>
                            {{item.property_use_description}}
                        </td>
                        <td>
                            {{item.year_built}}
                        </td>
                        <td class="col-responsive">
                            {{item.exterior_wall_description}}
                        </td>
                        <td class="text-right">
                            {{ item.total_square_feet | sqft }}
                        </td>
                        <td class="col-responsive text-right">
                            {{item.bedrooms}}
                        </td>
                        <td class="col-responsive text-right">
                            {{Number(item.full_baths) + Number(item.three_quarter_baths) + Number(item.half_baths)}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="resultsPermits.length > 0">
            <table>
                <caption>Building Permits</caption>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Project</th>
                        <th class="col-responsive text-right">Area</th>
                        <th class="text-right">Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in reversePermits">
                        <td>
                            {{item.theyear}}
                        </td>
                        <td>
                            {{item.project_name}}
                        </td>
                        <td class="col-responsive text-right">
                            {{ item.square_footage | sqft }}
                        </td>
                        <td class="text-right">
                            {{ item.construction_cost | money }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="report-moreinfo">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://polaris.mecklenburgcountync.gov/" target="_blank"  rel="noopener">POLARIS</a></li>
                <li><a href="http://charmeck.org/mecklenburg/county/AssessorsOffice/Pages/Home.aspx" target="_blank"  rel="noopener">County Assessor's Office</a></li>
                <li><a href="http://charmeck.org/city/charlotte/planning/Pages/Home.aspx" target="_blank"  rel="noopener">Charlotte-Mecklenburg Planning</a></li>
                <li><a href="http://webpermit.mecklenburgcountync.gov/Default.aspx?PosseMenuName=ViewPermits" target="_blank"  rel="noopener">Customer Permit Lookup</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import jsonToURL from "../js/jsontourl";
import format from "format-number";
import Photos from "./photos.vue";

export default {
  name: "property",

  components: {
    Photos: Photos
  },

  data: function() {
    return {
      resultsZoning: [],
      resultsOwnership: [],
      resultsAppraisal: [],
      resultsSales: [],
      resultsLanduse: [],
      resultsBuildings: [],
      resultsPermits: []
    };
  },

  computed: {
    reversePermits() {
      return this.resultsPermits.slice().reverse();
    },
    selected () {
      return this.$store.getters.selected
    },
    show () {
      return this.$store.getters.show
    }
  },

  watch: {
    selected: "getResults",
    show: "getResults"
  },

  filters: {
    money: function(num) {
      return format({
        prefix: "$",
        truncate: 0
      })(num);
    },
    trunc: function(num) {
      return format({
        truncate: 0
      })(num);
    },
    sqft: function(num) {
      return format({
        truncate: 0,
        suffix: " Sq. Ft."
      })(num);
    },
    reverse: function(value) {
      return value.slice().reverse();
    }
  },

  mounted: function() {
    this.getResults();
  },

  methods: {
    apiFetch: function(params, url, setter) {
      let _this = this;
      return fetch(`${url}?${jsonToURL(params)}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          _this[setter] = data;
        })
        .catch(function(ex) {
          console.log("parsing failed", ex);
        });
    },
    getResults: function() {
      let _this = this;
      if (
        _this.selected.pid &&
        _this.show.indexOf("property") !== -1
      ) {
        // zoning
        _this.apiFetch(
          {
            columns: "zone_des, zone_class",
            filter: "zone_des <> 'sm_towns'",
            geom_column: "the_geom"
          },
          `https://mcmap.org/api/intersect_point/v1/view_zoning/${_this.selected.lnglat.join(
            ","
          )}/4326`,
          "resultsZoning"
        );
        // ownership
        _this.apiFetch(
          {
            pid: _this.selected.pid
          },
          "https://mcmap.org/rest/v3/ws_cama_ownership.php",
          "resultsOwnership"
        );
        // appraisal
        _this.apiFetch(
          {
            pid: _this.selected.pid
          },
          "https://mcmap.org/rest/v3/ws_cama_appraisal.php",
          "resultsAppraisal"
        );
        // sales history
        _this.apiFetch(
          {
            pid: _this.selected.pid
          },
          "https://mcmap.org/rest/v3/ws_cama_saleshistory.php",
          "resultsSales"
        );
        // land use
        _this.apiFetch(
          {
            pid: _this.selected.pid
          },
          "https://mcmap.org/rest/v3/ws_cama_landuse.php",
          "resultsLanduse"
        );
        // building information
        _this.apiFetch(
          {
            pid: _this.selected.pid
          },
          "https://mcmap.org/rest/v3/ws_cama_building.php",
          "resultsBuildings"
        );
        // building permits
        _this.apiFetch(
          {
            columns:
              "extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost",
            filter: `f.pid = '${
              _this.selected.pid
            }' and t.job_status = 'COMPL'`,
            sort: "t.date_completed_co_process",
            limit: 100,
            geom_column_from: "the_geom",
            geom_column_to: "the_geom"
          },
          "https://mcmap.org/api/intersect_feature/v1/tax_parcels/building_permits",
          "resultsPermits"
        );
      }
    }
  }
};
</script>