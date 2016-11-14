<template lang="html">
    <div v-if="sharedState.selected.lnglat && sharedState.show.indexOf('qualityoflife') !== -1">
        <div class="qol">
            <div class="mdl-typography--text-center">
                <div class="report-record-highlight qol-highlight">
                    <h2><i role="presentation" class="material-icons qol-icon">favorite</i> Quality of Life</h2>
                </div>
            </div>

            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--8-col">
                    <div class="mdl-card qol-metric-tab-card mdl-typography--text-left">
                      <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect qol-metric-tab" v-mdl>
                        <div class="mdl-tabs__tab-bar">
                          <a href="#demographics" class="mdl-tabs__tab is-active">Demographics</a>
                          <a href="#economics" class="mdl-tabs__tab">Economics</a>
                          <a href="#environment" class="mdl-tabs__tab">Environment</a>
                          <a href="#health" class="mdl-tabs__tab">Health</a>
                        </div>
                        <div class="mdl-tabs__panel" id="economics">
                          <p>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(19)">
                                  <span class="mdl-chip__text">Commercial Construction</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(41)">
                                  <span class="mdl-chip__text">Commercial Space</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(38)">
                                  <span class="mdl-chip__text">Employment</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(80)">
                                  <span class="mdl-chip__text">Food and Nutrition Services</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(76)">
                                  <span class="mdl-chip__text">Home Sales Price</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(37)">
                                  <span class="mdl-chip__text">Household Income</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(75)">
                                  <span class="mdl-chip__text">Job Density</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(82)">
                                  <span class="mdl-chip__text">Housing Assistance</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(40)">
                                  <span class="mdl-chip__text">Rental Costs</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(69)">
                                  <span class="mdl-chip__text">Residential Foreclosures</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(8)">
                                  <span class="mdl-chip__text">Residential New Construction</span>
                              </button>
                          </p>
                        </a>
                        </div>
                        <div class="mdl-tabs__panel is-active" id="demographics">
                            <p>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(13)">
                                    <span class="mdl-chip__text">Population - Older Adult</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(12)">
                                    <span class="mdl-chip__text">Population - Youth</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(47)">
                                    <span class="mdl-chip__text">Population Density</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(17)">
                                    <span class="mdl-chip__text">Race/Ethnicity - All Other Races</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(16)">
                                    <span class="mdl-chip__text">Race/Ethnicity - Asian</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(15)">
                                    <span class="mdl-chip__text">Race/Ethnicity - Black or African American</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(18)">
                                    <span class="mdl-chip__text">Race/Ethnicity - Hispanic or Latino</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(14)">
                                    <span class="mdl-chip__text">Race/Ethnicity - White or Caucasian</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(11)">
                                    <span class="mdl-chip__text">Vacant Land</span>
                                </button>
                            </p>
                        </div>
                        <div class="mdl-tabs__panel" id="environment">
                            <p>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(34)">
                                    <span class="mdl-chip__text">Bicycle Friendliness</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(10)">
                                    <span class="mdl-chip__text">Commuters Driving Alone</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(26)">
                                    <span class="mdl-chip__text">Energy Consumption - Electricity</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(77)">
                                    <span class="mdl-chip__text">Energy Consumption - Natural Gas</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(4)">
                                    <span class="mdl-chip__text">Impervious Surface</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(33)">
                                    <span class="mdl-chip__text">Long Commute</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(23)">
                                    <span class="mdl-chip__text">Residential Recycling</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(24)">
                                    <span class="mdl-chip__text">Residential Solid Waste</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(3)">
                                    <span class="mdl-chip__text">Tree Canopy</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(27)">
                                    <span class="mdl-chip__text">Water Consumption</span>
                                </button>
                            </p>
                        </div>
                        <div class="mdl-tabs__panel" id="health">
                            <p>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(57)">
                                    <span class="mdl-chip__text">Age of Death</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(54)">
                                    <span class="mdl-chip__text">Births to Adolescents</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(59)">
                                    <span class="mdl-chip__text">Crime - Property</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(58)">
                                    <span class="mdl-chip__text">Crime - Violent</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(60)">
                                    <span class="mdl-chip__text">Disorder-related Calls</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(20)">
                                    <span class="mdl-chip__text">Education - Bachelor&#39;s Degree</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(39)">
                                    <span class="mdl-chip__text">Education - High School Diploma</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(65)">
                                    <span class="mdl-chip__text">High School Graduation Rate</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(51)">
                                    <span class="mdl-chip__text">Library Card Holders</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(36)">
                                    <span class="mdl-chip__text">Proximity to Public Transportation</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(81)">
                                    <span class="mdl-chip__text">Public Health Insurance</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(44)">
                                    <span class="mdl-chip__text">Transit Ridership</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(62)">
                                    <span class="mdl-chip__text">Test Proficiency - Elementary School</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(64)">
                                    <span class="mdl-chip__text">Test Proficiency - High School</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(63)">
                                    <span class="mdl-chip__text">Test Proficiency - Middle School</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(48)">
                                    <span class="mdl-chip__text">Voter Participation</span>
                                </button>
                            </p>
                        </div>
                      </div>
                    </div>
                    <iframe v-if="privateState.neighborhood" class="iframe-qol" v-bind:src="privateState.embedURL" style="width: 100%; height: 500px; border: 1px solid #595959"></iframe>
                </div>
                <div class="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet">

                    <div class="mdl-typography--text-center" style="padding: 10px 20px;" v-if="privateState.trends">
                       <table class="mdl-data-table table-condensed qol-comparison" style="width: 100%;">
                           <caption>Comparing Your Neighborhood</caption>
                           <tbody>
                               <tr v-for="(item, index) in privateState.trends" v-bind:data-qolgroup="item[0]" v-on:click="setCompare(item[0])">
                                   <td class="mdl-data-table__cell--non-numeric">
                                       {{item[0]}}
                                   </td>
                                   <td>
                                       {{item[1]}}
                                   </td>
                               </tr>
                           </tbody>
                       </table>
                   </div>
                   <div class="mdl-typography--text-center trendchart" v-show="privateState.showChart">
                       <h1>Trend</h1>
                       <span class="legend"><i class="material-icons legend-county">trending_up</i> {{privateState.chartCompare}}</span>
                       <span class="legend"><i class="material-icons legend-selected">trending_up</i> Neighborhood</span>
                       <div class="qol-chart-trend"></div>
                   </div>
                </div>
            </div>

       <div class="report-moreinfo mdl-typography--text-left">
			<h5>For more information, please visit:</h5>
			<ul class="list-unstyled">
                <li><a href="http://mcmap.org/qol/" target="_blank">Quality of Life Explorer</a></li>
            </ul>
		</div>
    </div>
</template>

<script>
import axios from 'axios';
import Chartist from 'chartist';
import naturalSort from '../modules/naturalsort';

export default {
    name: 'quality_of_life',
    mounted: function() {
        let _this = this;
        _this.getResults();
        window.onmessage = function(e){
            let data = e.data;

            if (data.summary) {
                _this.privateState.chartData = data.summary;
                let compare = data.summary.values;
                let compareKeys = Object.keys(compare)
                let compareData = [];
                for (let i = 0; i < compareKeys.length; i++) {
                    compareData.push([ compareKeys[i], compare[compareKeys[i]][compare[compareKeys[i]].length - 1] ]);
                }
                compareData = compareData.sort(function(a, b) {
                    return naturalSort(b[1].replace(/[^0-9-.]/g, ''), a[1].replace(/[^0-9-.]/g, ''));
                });

                _this.privateState.trends = compareData;
            }
        };
    },
    watch: {
        "privateState.neighborhood": "setIframe",
        "sharedState.selected.lnglat": "getResults",
        "sharedState.show": "getResults",
        "privateState.metric": "passMetric",
        "privateState.chartData": "chart",
        "privateState.chartCompare": "chart"
    },
    methods: {
        getResults: function() {
            let el = document.querySelector('.report-container');
            if (this.sharedState.selected.lnglat && this.sharedState.show.indexOf('qualityoflife') !== -1) {
                let _this = this;
                el.classList.remove('mdl-cell--8-col');
                el.classList.add('mdl-cell--12-col');
                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/neighborhoods/${_this.sharedState.selected.lnglat.join(',')}/4326`, {
                    params: {
                        'geom_column': 'the_geom',
                        'columns': 'id',
                        'limit': 1
                    }
                }).then(function(response) {
                    _this.privateState.neighborhood = response.data[0].id;
                });
            } else {
                el.classList.remove('mdl-cell--12-col');
                el.classList.add('mdl-cell--8-col');
            }
        },
        setCompare: function(compare) {
            if (compare !== 'Neighborhood') {
                this.privateState.chartCompare = compare;
            }
        },
        setIframe: function() {
            this.privateState.embedURL = `${this.privateState.embedBase}?m=${this.privateState.metric}&s=${this.privateState.neighborhood}&pitch=true&smaxzoom=11`;
        },
        removeIframe: function() {
            this.privateState.embedURL = '';
        },
        passMetric: function() {
            let _this = this;
            document.querySelector(".iframe-qol").contentWindow.postMessage({"metric": _this.privateState.metric}, '*');
        },
        selectMetric: function(m) {
            this.privateState.metric = m;
        },
        chart: function() {
            let _this = this;
            if (_this.privateState.chartData && _this.privateState.chartData.years.length > 1) {
                _this.privateState.showChart = true;
                new Chartist.Line('.qol-chart-trend', {
                  labels:  _this.privateState.chartData.years,
                  series: [
                    _this.privateState.chartData.values[_this.privateState.chartCompare].map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  }),
                    _this.privateState.chartData.values['Neighborhood'].map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  })
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
                });
            } else if (_this.privateState.chartData){
                _this.privateState.showChart = false;
            }
        }
    }
}
</script>

<style lang="css">
.qol-chart-trend .ct-series-b .ct-line, .qol-chart-trend .ct-series-b .ct-point {
    stroke: #ba00e4;
}

.qol-icon {
    font-size: 1.2em !important;
    vertical-align: middle;
}
.qol-highlight {
    margin-bottom: 20px;
}

tr {
    cursor: pointer;
}

tr[data-qolgroup='Neighborhood'] td {
    font-weight: bold;
    font-size: 1.2em;
    color: #555;
    background-color: #CDDC38;
    cursor: default;
}

.qol-metric-tab-card {
  margin: 0 auto;
  padding: 0 20px;
}
.qol-metric-tab > .mdl-tabs__panel {
  padding-top: 20px;
}
</style>

<style lang="css" scoped>
h1 {
    font-size: 1.5em;
    margin: 0 0 0;
}
span.legend {
    font-size: 0.8em;
    display: inline !important;
}
.material-icons {
    vertical-align: middle;
    font-size: 1.5em;
}
.legend-selected {
    color: #ba00e4;
}
.legend-county {
    color: #d70206;
}
.qol-comparison {
    margin-top: 10px;
    margin-bottom: 0;
}
</style>
