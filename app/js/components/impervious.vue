<template lang="html">
    <div>
        <div v-if="!$parent.sharedState.selected.pid">
            <Introduction>
                <div class='intro-slot'>
                    To view <strong>Impervious Surface</strong> information, use the search above to find a location.
                </div>
            </Introduction>
        </div>
        <div v-else>
        <div class="mdl-typography--text-center">
          <Print></Print>
          <div class="report-record-highlight">
              <i class="icon icon-impervious"></i>
              <h2>You have</h2>
              <h1 v-if="results">{{ total() | area }}</h1>
              <h3>of Impervious Surface</h3>
              <h4></h4>
          </div>
          <table v-if="results" class="mdl-data-table mdl-js-data-table" style="min-width: 300px; max-width: 100%;">
              <caption>Details</caption>
              <thead>
                  <tr>
                      <th class="mdl-data-table__cell--non-numeric">Type</th>
                      <th>Area</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in results">
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
    </div>
</template>

<script>
import jsonToURL from '../modules/jsontourl';
import format from 'format-number';
import Welcome from './introduction.vue';
import Printheader from './printheader.vue';

export default {
    name: 'impervious',
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
        area: function(num) {
            return format({'truncate': 0, 'suffix': ' Sq. Ft.'})(num);
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
            if (_this.$parent.sharedState.selected.lnglat && _this.$parent.sharedState.show.indexOf('impervious') !== -1) {
                let params = {
                    'columns': 'sum(sum_of_area) as area, subtheme',
                    'filter': `commonpid='${_this.$parent.sharedState.selected.pid}'`,
                    'sort': 'subtheme',
                    'group': 'subtheme'
                };

                fetch(`https://mcmap.org/api/query/v1/impervious_surface_area?${jsonToURL(params)}`)
                    .then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        _this.results = data;
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    });
                
              }
        },
        total: function() {
            let total = 0;
            this.results.forEach(function(item) {
                total = total + Number(item.area);
            });
            return total;
        }
    }
}
</script>

<style lang="css">
</style>
