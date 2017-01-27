<template lang="html">
    <div v-show="sharedState.selected.lnglat && sharedState.show.indexOf('qualityoflife') !== -1">
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
                          <a href="#demographics" class="mdl-tabs__tab">Demographics</a>
                          <a href="#economics" class="mdl-tabs__tab is-active">Economics</a>
                          <a href="#environment" class="mdl-tabs__tab">Environment</a>
                          <a href="#health" class="mdl-tabs__tab">Health</a>
                        </div>
                        <div class="mdl-tabs__panel is-active" id="economics">
                          <p>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(19, $event)">
                                  <span class="mdl-chip__text">Commercial Construction</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(41, $event)">
                                  <span class="mdl-chip__text">Commercial Space</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(38, $event)">
                                  <span class="mdl-chip__text">Employment</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(80, $event)">
                                  <span class="mdl-chip__text">Food and Nutrition Services</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(76, $event)">
                                  <span class="mdl-chip__text">Home Sales Price</span>
                              </button>
                              <button type="button" class="mdl-chip qol-chip-active" v-on:click="selectMetric(37, $event)">
                                  <span class="mdl-chip__text">Household Income</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(75, $event)">
                                  <span class="mdl-chip__text">Job Density</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(82, $event)">
                                  <span class="mdl-chip__text">Housing Assistance</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(40, $event)">
                                  <span class="mdl-chip__text">Rental Costs</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(69, $event)">
                                  <span class="mdl-chip__text">Residential Foreclosures</span>
                              </button>
                              <button type="button" class="mdl-chip" v-on:click="selectMetric(8, $event)">
                                  <span class="mdl-chip__text">Residential New Construction</span>
                              </button>
                          </p>
                        </a>
                        </div>
                        <div class="mdl-tabs__panel" id="demographics">
                            <p>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(13, $event)">
                                    <span class="mdl-chip__text">Population - Older Adult</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(12, $event)">
                                    <span class="mdl-chip__text">Population - Youth</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(47, $event)">
                                    <span class="mdl-chip__text">Population Density</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(17, $event)">
                                    <span class="mdl-chip__text">Race/Ethnicity - All Other Races</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(16, $event)">
                                    <span class="mdl-chip__text">Race/Ethnicity - Asian</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(15, $event)">
                                    <span class="mdl-chip__text">Race/Ethnicity - Black or African American</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(18, $event)">
                                    <span class="mdl-chip__text">Race/Ethnicity - Hispanic or Latino</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(14, $event)">
                                    <span class="mdl-chip__text">Race/Ethnicity - White or Caucasian</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(11, $event)">
                                    <span class="mdl-chip__text">Vacant Land</span>
                                </button>
                            </p>
                        </div>
                        <div class="mdl-tabs__panel" id="environment">
                            <p>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(34, $event)">
                                    <span class="mdl-chip__text">Bicycle Friendliness</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(10, $event)">
                                    <span class="mdl-chip__text">Commuters Driving Alone</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(26, $event)">
                                    <span class="mdl-chip__text">Energy Consumption - Electricity</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(77, $event)">
                                    <span class="mdl-chip__text">Energy Consumption - Natural Gas</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(4, $event)">
                                    <span class="mdl-chip__text">Impervious Surface</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(33, $event)">
                                    <span class="mdl-chip__text">Long Commute</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(23, $event)">
                                    <span class="mdl-chip__text">Residential Recycling</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(24, $event)">
                                    <span class="mdl-chip__text">Residential Solid Waste</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(3, $event)">
                                    <span class="mdl-chip__text">Tree Canopy</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(27, $event)">
                                    <span class="mdl-chip__text">Water Consumption</span>
                                </button>
                            </p>
                        </div>
                        <div class="mdl-tabs__panel" id="health">
                            <p>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(57, $event)">
                                    <span class="mdl-chip__text">Age of Death</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(54, $event)">
                                    <span class="mdl-chip__text">Births to Adolescents</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(59, $event)">
                                    <span class="mdl-chip__text">Crime - Property</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(58, $event)">
                                    <span class="mdl-chip__text">Crime - Violent</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(60, $event)">
                                    <span class="mdl-chip__text">Disorder-related Calls</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(20, $event)">
                                    <span class="mdl-chip__text">Education - Bachelor&#39;s Degree</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(39, $event)">
                                    <span class="mdl-chip__text">Education - High School Diploma</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(65, $event)">
                                    <span class="mdl-chip__text">High School Graduation Rate</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(51, $event)">
                                    <span class="mdl-chip__text">Library Card Holders</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(36, $event)">
                                    <span class="mdl-chip__text">Proximity to Public Transportation</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(81, $event)">
                                    <span class="mdl-chip__text">Public Health Insurance</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(44, $event)">
                                    <span class="mdl-chip__text">Transit Ridership</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(62, $event)">
                                    <span class="mdl-chip__text">Test Proficiency - Elementary School</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(64, $event)">
                                    <span class="mdl-chip__text">Test Proficiency - High School</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(63, $event)">
                                    <span class="mdl-chip__text">Test Proficiency - Middle School</span>
                                </button>
                                <button type="button" class="mdl-chip" v-on:click="selectMetric(48, $event)">
                                    <span class="mdl-chip__text">Voter Participation</span>
                                </button>
                            </p>
                        </div>
                      </div>
                    </div>
                    <iframe v-if="privateState.neighborhood" class="iframe-qol" v-bind:src="privateState.embedURL" style="width: 100%; height: 500px; border: 1px solid #ccc"></iframe>
                </div>
                <div class="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet">

                           
                    <div class="mdl-typography--text-center" style="padding: 10px 20px;">
                        <div>
                        Neighborhood vs <br>
                               <button id="qol-compare" class="mdl-button mdl-js-button" v-mdl>
                                    Jurisdictions <i class="material-icons">keyboard_arrow_down</i>
                                </button>
                           <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" for="qol-compare">
                               <li class="mdl-menu__item" v-on:click="changeNeighborhoodCompare('Jurisdiction')">Jurisdiction</li>
                               <li class="mdl-menu__item" v-on:click="changeNeighborhoodCompare('City Council')">City Council</li>
                               <li class="mdl-menu__item" v-on:click="changeNeighborhoodCompare('County Commission')">County Commission</li>
                           </ul>
                        </div>

                       <table class="mdl-data-table table-condensed qol-comparison" style="width: 100%;">
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
                   <div class="mdl-typography--text-center" style="margin-top: 20px">
                       <a class="mdl-button mdl-js-button" v-bind:href="privateState.reportURL" target="_blank">Report</a>
                       <a class="mdl-button mdl-js-button" v-bind:href="privateState.metaURL" target="_blank">META</a>
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
                _this.setData(data.summary);
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
        setData: function(data) {
            let _this = this;

            _this.privateState.chartData = data;
            let compare = data.values[_this.privateState.neighborhoodCompare];
            let compareKeys = Object.keys(compare);
            let compareData = [];
            for (let i = 0; i < compareKeys.length; i++) {
                compareData.push([ compareKeys[i], compare[compareKeys[i]][compare[compareKeys[i]].length - 1] ]);
            }
            if (data.values["Neighborhood"].length > 0) {
                compareData.push([ 'Neighborhood', data.values["Neighborhood"][data.values["Neighborhood"].length - 1]]);
            }        
            compareData = compareData.sort(function(a, b) {
                return naturalSort(b[1].replace(/[^0-9-.]/g, ''), a[1].replace(/[^0-9-.]/g, ''));
            });

            _this.privateState.trends = compareData;
        },
        changeNeighborhoodCompare: function(comparetype) {
            let _this = this;
            this.privateState.neighborhoodCompare = comparetype;
            document.querySelector("#qol-compare").innerHTML = comparetype + ' <i class="material-icons">keyboard_arrow_down</i>';
            if (comparetype === 'Jurisdiction') {
                this.privateState.chartCompare = "County";
            } else {
                this.privateState.chartCompare = "District 1";
            }

            this.setData(_this.privateState.chartData);
        },
        setCompare: function(compare) {
            if (compare !== 'Neighborhood') {
                this.privateState.chartCompare = compare;
            }
        },
        setIframe: function() {
            let _this = this;
            if (!this.privateState.embedURL) {
                this.privateState.embedURL = `${this.privateState.embedBase}?m=${this.privateState.metric}&s=${this.privateState.neighborhood}&pitch=true&smaxzoom=11`;
            } else {                
                document.querySelector(".iframe-qol").contentWindow.postMessage({"selected": [_this.privateState.neighborhood.toString()]}, '*');
            }
            
            this.privateState.reportURL = `http://mcmap.org/qol-mecklenburg/report/?m=${this.privateState.metric}&s=${this.privateState.neighborhood}`;
        },
        removeIframe: function() {
            this.privateState.embedURL = '';
        },
        passMetric: function() {
            let _this = this;
            document.querySelector(".iframe-qol").contentWindow.postMessage({"metric": _this.privateState.metric}, '*');
            _this.privateState.metaURL = `http://mcmap.org/qol-mecklenburg/embed/data/meta/m${_this.privateState.metric}.html`;
            _this.privateState.reportURL = `http://mcmap.org/qol-mecklenburg/report/?m=${_this.privateState.metric}&s=${_this.privateState.neighborhood}`;
        },
        selectMetric: function(m, event) {
            this.privateState.metric = m;
            let btns = document.querySelectorAll('.mdl-tabs__panel button');
            for (let i = 0; i < btns.length; i++) {
                btns[i].classList.remove("qol-chip-active");
            }
            event.target.classList.add("qol-chip-active");
        },
        chart: function() {
            let _this = this;
            if (_this.privateState.chartData && _this.privateState.chartData.years.length > 1) {
                _this.privateState.showChart = true;

                let options = {
                    fullWidth: true,
                    chartPadding: {
                        right: 40
                    },
                    axisX: {
                        labelInterpolationFnc: function(value, index) {
                            if (_this.privateState.chartData.years.length > 6) {
                                return index % 2 === 0 ? value : null;
                            } else {
                                return value;
                            }
                        }
                    }
                };

                let data = {
                    labels:  _this.privateState.chartData.years,
                    series: [
                                                
                    ]
                };

                // set compare series
                if (_this.privateState.chartData.values[_this.privateState.neighborhoodCompare][_this.privateState.chartCompare]) {
                    data.series.push(_this.privateState.chartData.values[_this.privateState.neighborhoodCompare][_this.privateState.chartCompare].map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  }));
                } else {
                    data.series.push(_this.privateState.chartData.values['Jurisdiction']['County'].map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  }));
                }

                // set selected series
                if (_this.privateState.chartData.values.Neighborhood.length > 0) {
                    data.series.push(_this.privateState.chartData.values.Neighborhood.map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  }));
                }

                new Chartist.Line('.qol-chart-trend', data, options);
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

.qol-chip-active {
    background-color: rgb(255,183,77);
}

.mdl-tabs__panel button {
    cursor: pointer;
}
.mdl-tabs__panel button:hover {
    background-color: rgb(255,183,77);
}
.mdl-tabs__panel button span {
    pointer-events: none;
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
