<template lang="html">
    <div>       
        <div class="qol">
            <Selected v-if="$parent.sharedState.selected.address">{{ $parent.sharedState.selected.address }}</Selected>
            <div class="mdl-typography--text-center">
                <div class="report-record-highlight">
                    <i class="icon icon-quality-of-life"></i>
                    <h1> Quality of Life</h1>
                </div>
            </div>

            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--8-col">
                    <div class="mdl-card qol-metric-tab-card mdl-typography--text-left">                      
                      <div class="mdl-tabs mdl-js-tabs qol-metric-tab no-print">
                        <div class="mdl-tabs__tab-bar">
                          <a href="javascript:void(0)" class="mdl-tabs__tab" v-bind:class="{tabActive: activeTab === 'economics'}" v-on:click="activeTab = 'economics'">Money</a>
                          <a href="javascript:void(0)" class="mdl-tabs__tab" v-bind:class="{tabActive: activeTab === 'demographics'}" v-on:click="activeTab = 'demographics'">People</a>                          
                          <a href="javascript:void(0)" class="mdl-tabs__tab" v-bind:class="{tabActive: activeTab === 'environment'}" v-on:click="activeTab = 'environment'">Planet</a>
                          <a href="javascript:void(0)" class="mdl-tabs__tab" v-bind:class="{tabActive: activeTab === 'health'}" v-on:click="activeTab = 'health'">Health</a>
                        </div>
                        <div class="mdl-tabs__panel" id="economics" v-show="activeTab === 'economics'">
                          <p>
                              <button type="button" class="chip" data-metric="19" v-on:click="selectMetric(19, $event)">
                                  <span class="chip__text">Commercial Construction</span>
                              </button>
                              <button type="button" class="chip" data-metric="41" v-on:click="selectMetric(41, $event)">
                                  <span class="chip__text">Commercial Space</span>
                              </button>
                              <button type="button" class="chip" data-metric="38" v-on:click="selectMetric(38, $event)">
                                  <span class="chip__text">Employment</span>
                              </button>
                              <button type="button" class="chip" data-metric="80" v-on:click="selectMetric(80, $event)">
                                  <span class="chip__text">Food and Nutrition Services</span>
                              </button>
                              <button type="button" class="chip" data-metric="76" v-on:click="selectMetric(76, $event)">
                                  <span class="chip__text">Home Sales Price</span>
                              </button>
                              <button type="button" class="chip" data-metric="37" v-on:click="selectMetric(37, $event)">
                                  <span class="chip__text">Household Income</span>
                              </button>
                              <button type="button" class="chip" data-metric="75" v-on:click="selectMetric(75, $event)">
                                  <span class="chip__text">Job Density</span>
                              </button>
                              <button type="button" class="chip" data-metric="82" v-on:click="selectMetric(82, $event)">
                                  <span class="chip__text">Housing Assistance</span>
                              </button>
                              <button type="button" class="chip" data-metric="40" v-on:click="selectMetric(40, $event)">
                                  <span class="chip__text">Rental Costs</span>
                              </button>
                              <button type="button" class="chip" data-metric="69" v-on:click="selectMetric(69, $event)">
                                  <span class="chip__text">Residential Foreclosures</span>
                              </button>
                              <button type="button" class="chip" data-metric="8" v-on:click="selectMetric(8, $event)">
                                  <span class="chip__text">Residential New Construction</span>
                              </button>
                          </p>
                        </a>
                        </div>
                        <div class="mdl-tabs__panel" id="demographics" v-show="activeTab === 'demographics'">
                            <p>
                                <button type="button" class="chip" data-metric="13" v-on:click="selectMetric(13, $event)">
                                    <span class="chip__text">Population - Older Adult</span>
                                </button>
                                <button type="button" class="chip" data-metric="12" v-on:click="selectMetric(12, $event)">
                                    <span class="chip__text">Population - Youth</span>
                                </button>
                                <button type="button" class="chip" data-metric="47" v-on:click="selectMetric(47, $event)">
                                    <span class="chip__text">Population Density</span>
                                </button>
                                <button type="button" class="chip" data-metric="17" v-on:click="selectMetric(17, $event)">
                                    <span class="chip__text">Race/Ethnicity - All Other Races</span>
                                </button>
                                <button type="button" class="chip" data-metric="16" v-on:click="selectMetric(16, $event)">
                                    <span class="chip__text">Race/Ethnicity - Asian</span>
                                </button>
                                <button type="button" class="chip" data-metric="15" v-on:click="selectMetric(15, $event)">
                                    <span class="chip__text">Race/Ethnicity - Black or African American</span>
                                </button>
                                <button type="button" class="chip" data-metric="18" v-on:click="selectMetric(18, $event)">
                                    <span class="chip__text">Race/Ethnicity - Hispanic or Latino</span>
                                </button>
                                <button type="button" class="chip" data-metric="14" v-on:click="selectMetric(14, $event)">
                                    <span class="chip__text">Race/Ethnicity - White or Caucasian</span>
                                </button>
                                <button type="button" class="chip" data-metric="11" v-on:click="selectMetric(11, $event)">
                                    <span class="chip__text">Vacant Land</span>
                                </button>
                            </p>
                        </div>
                        <div class="mdl-tabs__panel" id="environment" v-show="activeTab === 'environment'">
                            <p>
                                <button type="button" class="chip" data-metric="34" v-on:click="selectMetric(34, $event)">
                                    <span class="chip__text">Bicycle Friendliness</span>
                                </button>
                                <button type="button" class="chip" data-metric="10" v-on:click="selectMetric(10, $event)">
                                    <span class="chip__text">Commuters Driving Alone</span>
                                </button>
                                <button type="button" class="chip" data-metric="26" v-on:click="selectMetric(26, $event)">
                                    <span class="chip__text">Energy Consumption - Electricity</span>
                                </button>
                                <button type="button" class="chip" data-metric="77" v-on:click="selectMetric(77, $event)">
                                    <span class="chip__text">Energy Consumption - Natural Gas</span>
                                </button>
                                <button type="button" class="chip" data-metric="4" v-on:click="selectMetric(4, $event)">
                                    <span class="chip__text">Impervious Surface</span>
                                </button>
                                <button type="button" class="chip" data-metric="33" v-on:click="selectMetric(33, $event)">
                                    <span class="chip__text">Long Commute</span>
                                </button>
                                <button type="button" class="chip" data-metric="23" v-on:click="selectMetric(23, $event)">
                                    <span class="chip__text">Residential Recycling</span>
                                </button>
                                <button type="button" class="chip" data-metric="24" v-on:click="selectMetric(24, $event)">
                                    <span class="chip__text">Residential Solid Waste</span>
                                </button>
                                <button type="button" class="chip" data-metric="3" v-on:click="selectMetric(3, $event)">
                                    <span class="chip__text">Tree Canopy</span>
                                </button>
                                <button type="button" class="chip" data-metric="27" v-on:click="selectMetric(27, $event)">
                                    <span class="chip__text">Water Consumption</span>
                                </button>
                            </p>
                        </div>
                        <div class="mdl-tabs__panel" id="health" v-show="activeTab === 'health'">
                            <p>
                                <button type="button" class="chip" data-metric="57" v-on:click="selectMetric(57, $event)">
                                    <span class="chip__text">Age of Death</span>
                                </button>
                                <button type="button" class="chip" data-metric="54" v-on:click="selectMetric(54, $event)">
                                    <span class="chip__text">Births to Adolescents</span>
                                </button>
                                <button type="button" class="chip" data-metric="59" v-on:click="selectMetric(59, $event)">
                                    <span class="chip__text">Crime - Property</span>
                                </button>
                                <button type="button" class="chip" data-metric="58" v-on:click="selectMetric(58, $event)">
                                    <span class="chip__text">Crime - Violent</span>
                                </button>
                                <button type="button" class="chip" data-metric="60" v-on:click="selectMetric(60, $event)">
                                    <span class="chip__text">Disorder-related Calls</span>
                                </button>
                                <button type="button" class="chip" data-metric="20" v-on:click="selectMetric(20, $event)">
                                    <span class="chip__text">Education - Bachelor&#39;s Degree</span>
                                </button>
                                <button type="button" class="chip" data-metric="39" v-on:click="selectMetric(39, $event)">
                                    <span class="chip__text">Education - High School Diploma</span>
                                </button>
                                <button type="button" class="chip" data-metric="65" v-on:click="selectMetric(65, $event)">
                                    <span class="chip__text">High School Graduation Rate</span>
                                </button>
                                <button type="button" class="chip" data-metric="51" v-on:click="selectMetric(51, $event)">
                                    <span class="chip__text">Library Card Holders</span>
                                </button>
                                <button type="button" class="chip" data-metric="36" v-on:click="selectMetric(36, $event)">
                                    <span class="chip__text">Proximity to Public Transportation</span>
                                </button>
                                <button type="button" class="chip" data-metric="81" v-on:click="selectMetric(81, $event)">
                                    <span class="chip__text">Public Health Insurance</span>
                                </button>
                                <button type="button" class="chip" data-metric="44" v-on:click="selectMetric(44, $event)">
                                    <span class="chip__text">Transit Ridership</span>
                                </button>
                                <button type="button" class="chip" data-metric="62" v-on:click="selectMetric(62, $event)">
                                    <span class="chip__text">Test Proficiency - Elementary School</span>
                                </button>
                                <button type="button" class="chip" data-metric="64" v-on:click="selectMetric(64, $event)">
                                    <span class="chip__text">Test Proficiency - High School</span>
                                </button>
                                <button type="button" class="chip" data-metric="63" v-on:click="selectMetric(63, $event)">
                                    <span class="chip__text">Test Proficiency - Middle School</span>
                                </button>
                                <button type="button" class="chip" data-metric="48" v-on:click="selectMetric(48, $event)">
                                    <span class="chip__text">Voter Participation</span>
                                </button>
                            </p>
                        </div>
                      </div>
                    </div>
                    <iframe class="iframe-qol" v-bind:src="iframeURL" style="width: 100%; height: 600px; border: 1px solid #ccc"></iframe>
                </div>
                <div class="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet">                           
                    <div class="mdl-typography--text-center" style="padding: 10px 20px;">                        
                        Neighborhood vs                         
                               <div class="dropdown">
                                <button class="dropdown-button">{{ neighborhoodCompare }} &#x25BC</button>
                                <div class="dropdown-content no-print">
                                    <a href="javascript:void(0)" v-on:click="changeNeighborhoodCompare('Jurisdiction')">Jurisdiction</a>
                                    <a href="javascript:void(0)" v-on:click="changeNeighborhoodCompare('City Council')">Charlotte City Council</a>
                                    <a href="javascript:void(0)" v-on:click="changeNeighborhoodCompare('County Commission')">County Commission</a>
                                </div>
                            </div>                            

                       <table class="mdl-data-table table-condensed qol-comparison" style="width: 100%;">
                           <tbody>
                               <tr v-for="(item, index) in trends" v-bind:data-qolgroup="item[0]" v-on:click="setCompare(item[0])">
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
                   <div class="mdl-typography--text-center trendchart" v-show="showChart">
                       <h4>Trend</h4>
                       <span class="legend"><i class="icon icon-trending-up legend-county" role="presentation"></i> {{chartCompare}}</span>
                       <span class="legend"><i class="icon icon-trending-up legend-selected" role="presentation"></i> Neighborhood</span>
                       <div class="qol-chart-trend"></div>
                   </div>
                   <div class="mdl-typography--text-center no-print" style="margin-top: 20px">
                       <a class="button button-accent" v-bind:href="reportURL" target="_blank">Report</a>
                       <a class="button button-accent" v-bind:href="metaURL" target="_blank">META</a>
                   </div>
                   <div class="mdl-typography--text-center no-print" style="margin-top: 20px;">
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused" id="embed-textarea" style="margin-left: 20px;">
                            <textarea class="mdl-textfield__input" type="text" rows= "4" id="embedIframeCode" onclick="this.select()" v-on:keypress.stop.prevent autocomplete="off">{{ embedURL }}</textarea>
                            <label class="mdl-textfield__label" for="embedIframeCode">Embed this Map</label>
                        </div>
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
    </div>
</template>

<script>
import jsonToURL from '../modules/jsontourl';
import Chartist from 'chartist';
import naturalSort from '../modules/naturalsort';
import getURLParameter from '../modules/geturlparams';
import Selected from './selected.vue';

export default {
    name: 'quality_of_life',
    components: {
        Selected: Selected
    },
    data: function() {
        return {
            trends: null,
            chartData: null,            
            neighborhood: null,
            metric: getURLParameter('qolm') !== 'null' ? getURLParameter('qolm') : '37',
            showChart: false,
            activeTab: 'economics',
            metaURL: '',
            reportURL: '',
            embedURL: '',
            iframeURL: null,
            neighborhoodCompare: 'Jurisdiction',            
            chartCompare: 'County',
            year: '',
            qolData: null
        }
    },
    mounted: function() {
        let _this = this;

        // set app area
        let el = document.querySelector('.report-container');
        el.classList.remove('mdl-cell--8-col');
        el.classList.add('mdl-cell--12-col');
        document.querySelector('.mdl-card-map').style.visibility = 'hidden';

        // highlight selected metrics
        let chip = document.querySelector(`.chip[data-metric="${_this.metric}"]`);
        if (chip) {
            chip.classList.add('chip-active');
        }

        // if you have a lnglat, get getResults
        if (_this.$parent.sharedState.selected.lnglat) {
            _this.getResults();
        }

        // if you have lnglat or the init flag is set, 
        if (!_this.$parent.sharedState.selected.lnglat && !_this.$parent.sharedState.initLnglatFlag) {
            _this.setIframe();
        }
        
        window.onmessage = function(e){
            let data = e.data;
            if (data.summary) {
                _this.qolData = data.summary;
            }            
        };        
    },
    beforeDestroy: function() {
        let el = document.querySelector('.report-container');
        el.classList.remove('mdl-cell--12-col');
        el.classList.add('mdl-cell--8-col');
        document.querySelector('.mdl-card-map').style.visibility = 'visible';
    },
    watch: {
        "qolData": "dataReceived",
        "neighborhood": "setIframe",
        "$parent.sharedState.selected.lnglat": "getResults",
        "$parent.sharedState.show": "getResults",
        "metric": "passMetric",
        "chartData": "chart",
        "chartCompare": "chart"
    },
    methods: {
        dataReceived: function() {
            let _this = this;

            // set variables
            _this.year = _this.qolData.year;

            // set links
            _this.reportURL = `https://mcmap.org/qol-mecklenburg/report/?m=${this.metric}&s=${this.qolData.selected.join(",")}&y=${this.year}`;            
            _this.embedURL = `<iframe src="https://mcmap.org/qol-mecklenburg/embed/?m=${this.metric}&y=${this.year}&s=${this.qolData.selected.join(",")}" style="width: 500px; height: 500px; border: 1px solid #595959"></iframe>`;
            _this.metaURL = `https://mcmap.org/qol-mecklenburg/embed/data/meta/m${_this.metric}.html`;

            // set chart data
            _this.chartData = _this.qolData;

            // set trend data
            _this.trends = _this.setTrendData(_this.qolData);

        },
        setTrendData: function(data) {
            let _this = this;

            let compare = data.values[_this.neighborhoodCompare];
            let compareKeys = Object.keys(compare);
            let compareData = [];
            for (let i = 0; i < compareKeys.length; i++) {
                compareData.push([ compareKeys[i], compare[compareKeys[i]][data.years.indexOf(data.year)] ]);
            }
            if (data.values["Neighborhood"].length > 0) {
                compareData.push([ 'Neighborhood', data.values["Neighborhood"][data.years.indexOf(data.year)]]);
            }        
            compareData = compareData.sort(function(a, b) {
                return naturalSort(b[1].replace(/[^0-9-.]/g, ''), a[1].replace(/[^0-9-.]/g, ''));
            });

            return compareData;

        },
        getResults: function() {
            if (this.$parent.sharedState.selected.lnglat && this.$parent.sharedState.show.indexOf('qualityoflife') !== -1) {
                let _this = this;

                let params = {
                    'geom_column': 'the_geom',
                    'columns': 'id',
                    'limit': 1
                };

                fetch(`https://mcmap.org/api/intersect_point/v1/neighborhoods/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326?${jsonToURL(params)}`)
                    .then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        _this.neighborhood = data[0].id;
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    });
                
            } 
        },
        
        changeNeighborhoodCompare: function(comparetype) {
            let _this = this;
            this.neighborhoodCompare = comparetype;
            if (comparetype === 'Jurisdiction') {
                this.chartCompare = "County";
            } else {
                this.chartCompare = "District 1";
            }

            this.dataReceived();
        },
        setCompare: function(compare) {
            if (compare !== 'Neighborhood') {
                this.chartCompare = compare;
            }
        },
        setIframe: function() {
            let _this = this;                            
            if (!this.iframeURL) {
                this.iframeURL = `https://mcmap.org/qol-mecklenburg/embed/?m=${this.metric}&s=${this.neighborhood}`;
            } else {                
                document.querySelector(".iframe-qol").contentWindow.postMessage({"selected": [_this.neighborhood.toString()]}, '*');
            }            
        },
        createIframe: function() {
            return `https://mcmap.org/qol-mecklenburg/embed/?m=${this.metric}&s=${this.neighborhood}&y=${this.year}`;
        },
        passMetric: function() {
            let _this = this;
            document.querySelector(".iframe-qol").contentWindow.postMessage({"metric": _this.metric}, '*');            
        },
        selectMetric: function(m, event) {
            this.metric = m;
            let btns = document.querySelectorAll('.mdl-tabs__panel button');
            for (let i = 0; i < btns.length; i++) {
                btns[i].classList.remove("chip-active");
            }
            event.target.classList.add("chip-active");
        },
        chart: function() {
            let _this = this;
            if (_this.chartData && _this.chartData.years.length > 1) {
                _this.showChart = true;

                let options = {
                    fullWidth: true,
                    chartPadding: {
                        right: 40
                    },
                    axisX: {
                        labelInterpolationFnc: function(value, index) {
                            if (_this.chartData.years.length > 6) {
                                return index % 2 === 0 ? value : null;
                            } else {
                                return value;
                            }
                        }
                    }
                };

                let data = {
                    labels:  _this.chartData.years,
                    series: [
                                                
                    ]
                };

                // set compare series
                if (_this.chartData.values[_this.neighborhoodCompare][_this.chartCompare]) {
                    data.series.push(_this.chartData.values[_this.neighborhoodCompare][_this.chartCompare].map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  }));
                } else {
                    data.series.push(_this.chartData.values['Jurisdiction']['County'].map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  }));
                }

                // set selected series
                if (_this.chartData.values.Neighborhood.length > 0) {
                    data.series.push(_this.chartData.values.Neighborhood.map(function(num) { return parseFloat(num.replace(/[^0-9-.]/g, ''));  }));
                }

                new Chartist.Line('.qol-chart-trend', data, options);
            } else if (_this.chartData){
                _this.showChart = false;
            }
        }
    }
}
</script>

<style lang="css">
.qol-chart-trend .ct-series-b .ct-line, .qol-chart-trend .ct-series-b .ct-point {
    stroke: #ba00e4;
}


.qol-highlight {
    margin-bottom: 20px;
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
.trendchart h4 {
    margin: 8px 0 0;
}
</style>

<style lang="css" scoped>
span.legend {
    font-size: 0.8em;
    display: inline !important;
}
.report-record-highlight {
    margin: 0 auto 20px;
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
textarea {
    font-size: 0.8em;
}
#embed-textarea .mdl-textfield__label {
  top: 4px;
  color: #3f51b5;
  font-size: 12px;
}
</style>
