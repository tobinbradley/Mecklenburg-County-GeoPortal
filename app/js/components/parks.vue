<template lang="html">
    <div>
        <div v-if="!$parent.sharedState.selected.pid">
            <Introduction>
                <div class='intro-slot'>
                    To view <strong>Park</strong> information, use the search above to find a location.
                </div>
            </Introduction>
        </div>
        <div v-else>
        <div class="mdl-typography--text-center">
            <Print></Print>
            <div class="report-record-highlight" v-if="results">
                <i role="presentation" class="material-icons">nature_people</i>
                <h2>Your closest park is</h2>
                <h1>{{ results[0].name }}</h1>
                <h3>
                    <a href="javascript:void(0)"v-on:click="locationClick(0)">
                        {{ results[0].address }}, {{ results[0].city}}
                    </a>
                </h3>
                <h4>
                    {{ results[0].distance | distance }}
                </h4>
            </div>
            <table class="mdl-data-table mdl-js-data-table" v-if="results">
                <caption>Parks Nearby</caption>
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Park</th>
                        <th class="mdl-data-table__cell--non-numeric">Address</th>
                        <th class="col-responsive">Distance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in results">
                        <td class="mdl-data-table__cell--non-numeric">
                            {{ item.name }}
                        </td>
                        <td class="mdl-data-table__cell--non-numeric">
                            <a href="javascript:void(0)" v-on:click="locationClick(index)">
                                {{ item.address }}, {{item.city}}
                            </a>
                        </td>
                        <td class="nowrap col-responsive">
                            {{ item.distance | distance }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="report-moreinfo mdl-typography--text-left">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://charmeck.org/mecklenburg/county/ParkandRec/Pages/default.aspx">Mecklenburg County Park and Recreation</a></li>
                <li><a href="http://www.huntersville.org/Departments/ParksRecreation.aspx" target="_blank">Huntersville Parks and Recreation</a></li>
            </ul>
        </div>
        </div>
    </div>
</template>

<script>
import jsonToURL from '../modules/jsontourl';
import format from 'format-number';
import Welcome from './introduction.vue';
import Printheader from './printheader.vue';

export default {
  name: 'parks',
  data: function() {
        return {
            results: null
        }
    },
  components: {
      Introduction: Welcome,
      Print: Printheader
  },
  filters: {
      distance: function(dist) {
          return format({'truncate': 1, 'suffix': ' miles'})(dist / 5280);
      }
  },
  watch: {
      '$parent.sharedState.selected.lnglat': 'getResults',
      '$parent.sharedState.show': 'getResults'
  },
  mounted: function() {
      this.getResults();
  },
  methods: {
      getResults: function() {
          let _this = this;
          if (_this.$parent.sharedState.selected.lnglat && _this.$parent.sharedState.show.indexOf('parks') !== -1) {
              let params = {
                  'columns': 'name, address, city, st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat',
                  'limit': '5'
              };

              fetch(`https://mcmap.org/api/nearest/v1/parks_all/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326?${jsonToURL(params)}`)
                  .then(function(response) {
                      return response.json();
                  }).then(function(data) {
                      _this.results = data;
                  }).catch(function(ex) {
                      console.log('parsing failed', ex);
                  });
            }
      },
      locationClick: function(index) {
          let poi = this.results[index];
          this.$parent.sharedState.poi = {
              'lnglat': [poi.lng, poi.lat],
              'address': poi.address,
              'label': poi.name
          };
      }
  }
}
</script>

<style lang="css">
</style>
