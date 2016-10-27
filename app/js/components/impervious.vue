<template lang="html">
    <div v-if="privateState.results && sharedState.show.indexOf('impervious') !== -1">
        <div class="mdl-typography--text-center">
          <div class="report-record-highlight">
              <i role="presentation" class="material-icons">invert_colors_off</i>
              <h2>You have</h2>
              <h1>{{ total() | area }}</h1>
              <h3>of Impervious Surface</h3>
              <h4></h4>
          </div>
          <table v-if="privateState.results.length > 0" class="mdl-data-table mdl-js-data-table" style="min-width: 300px; max-width: 100%;">
              <caption>Details</caption>
              <thead>
                  <tr>
                      <th class="mdl-data-table__cell--non-numeric">Type</th>
                      <th>Area</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in privateState.results">
                      <td class="mdl-data-table__cell--non-numeric">
                          {{item.subtheme}}
                      </td>
                      <td class="nowrap">
                          {{ item.area | area }}
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div class="report-moreinfo mdl-typography--text-left">
        	<p>Impervious surfaces are mainly artificial structures, such as pavements (roads, sidewalks, driveways and parking lots) and rooftops that are covered by impenetrable materials such as asphalt, concrete, brick, wood and stone.</p>
            <h5>For more information, please visit:</h5>
        	<ul class="list-unstyled">
                <li><a href="http://charmeck.org/stormwater/FeesandBilling/Pages/Default.aspx" target="_blank">Charlotte-Mecklenburg Storm Water Services</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import format from 'format-number';

export default {
    name: 'impervious',
    filters: {
        area: function(num) {
            return format({'truncate': 0, 'suffix': ' Sq. Ft.'})(num);
        }
    },
    watch: {
        'sharedState.selected.lnglat': 'getResults',
        'sharedState.show': 'getResults'
    },
    mounted: function() {
        this.getResults();
    },
    methods: {
        getResults: function() {
            let _this = this;
            if (_this.sharedState.selected.lnglat && _this.sharedState.show.indexOf('impervious') !== -1) {
                axios
                  .get('http://maps.co.mecklenburg.nc.us/api/query/v1/impervious_surface_area',
                  {
                      params: {
                          'columns': 'sum(sum_of_area) as area, subtheme',
                          'filter': `commonpid='${_this.sharedState.selected.pid}'`,
                          'sort': 'subtheme',
                          'group': 'subtheme'
                      }
                  })
                  .then(function(response) {
                      _this.privateState.results = response.data;
                  });
              }
        },
        total: function() {
            let total = 0;
            this.privateState.results.forEach(function(item) {
                total = total + Number(item.area);
            });
            return total;
        }
    }
}
</script>

<style lang="css">
</style>
