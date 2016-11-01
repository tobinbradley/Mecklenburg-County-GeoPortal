<template lang="html">
    <div v-if="sharedState.selected.lnglat && sharedState.show.indexOf('qualityoflife') !== -1">
        <div class="qol">
            <div class="mdl-typography--text-center">
                <div class="report-record-highlight qol-highlight">
                    <h2><i role="presentation" class="material-icons qol-icon">favorite</i> Quality of Life</h2>
                </div>
            </div>

            <div class="mdl-selectfield">
                <label>Choose a Metric</label>
                <select id="mapmetric" v-model="privateState.metric">
                    <option value="" disabled>Choose a Metric</option>
                    <optgroup label="Demographics">
                        <option value="13">Population - Older Adult</option>
                        <option value="12">Population - Youth</option>
                        <option value="47">Population Density</option>
                        <option value="17">Race/Ethnicity - All Other Races</option>
                        <option value="16">Race/Ethnicity - Asian</option>
                        <option value="15">Race/Ethnicity - Black or African American</option>
                        <option value="18">Race/Ethnicity - Hispanic or Latino</option>
                        <option value="14">Race/Ethnicity - White or Caucasian</option>
                        <option value="11">Vacant Land</option>
                    </optgroup>
                    <optgroup label="Economics">
                        <option value="19">Commercial Construction</option>
                        <option value="41">Commercial Space</option>
                        <option value="38">Employment</option>
                        <option value="80">Food and Nutrition Services</option>
                        <option value="76">Home Sales Price</option>
                        <option value="37">Household Income</option>
                        <option value="75">Job Density</option>
                        <option value="82">Housing Assistance</option>
                        <option value="40">Rental Costs</option>
                        <option value="69">Residential Foreclosures</option>
                        <option value="8">Residential New Construction</option>
                    </optgroup>
                    <optgroup label="Health">
                        <option value="57">Age of Death</option>
                        <option value="54">Births to Adolescents</option>
                        <option value="59">Crime - Property</option>
                        <option value="58">Crime - Violent</option>
                        <option value="60">Disorder-related Calls</option>
                        <option value="20">Education Level - Bachelor&#39;s Degree</option>
                        <option value="39">Education Level - High School Diploma</option>
                        <option value="65">High School Graduation Rate</option>
                        <option value="51">Library Card Holders</option>
                        <option value="36">Proximity to Public Transportation</option>
                        <option value="81">Public Health Insurance</option>
                        <option value="44">Transit Ridership</option>
                        <option value="62">Test Proficiency - Elementary School</option>
                        <option value="64">Test Proficiency - High School</option>
                        <option value="63">Test Proficiency - Middle School</option>
                        <option value="48">Voter Participation</option>
                    </optgroup>
                    <optgroup label="Environment">
                        <option value="34">Bicycle Friendliness</option>
                        <option value="10">Commuters Driving Alone</option>
                        <option value="26">Energy Consumption - Electricity</option>
                        <option value="77">Energy Consumption - Natural Gas</option>
                        <option value="4">Impervious Surface</option>
                        <option value="33">Long Commute</option>
                        <option value="23">Residential Recycling</option>
                        <option value="24">Residential Solid Waste</option>
                        <option value="3">Tree Canopy</option>
                        <option value="27">Water Consumption</option>
                    </optgroup>
                </select>
            </div>
            <iframe v-if="privateState.neighborhood" class="iframe-qol" v-bind:src="privateState.embedURL" style="width: 100%; height: 500px; border: 1px solid #595959"></iframe>
        </div>
        <div class="mdl-typography--text-center trendchart" v-show="privateState.chartData && privateState.chartData.years.length > 1">
            <h1>Trend</h1>
            <span class="legend"><i class="material-icons legend-county">trending_up</i> {{privateState.chartCompare}}</span>
            <span class="legend"><i class="material-icons legend-selected">trending_up</i> Neighborhood</span>
            <div class="qol-chart-trend"></div>
        </div>
        <div class="mdl-typography--text-center" v-if="privateState.trends">
               <table class="mdl-data-table" style="min-width: 350px; max-width: 100%;">
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
            _this.privateState.chartData = data.summary;

            if (data.summary) {
                let compare = data.summary.values;
                let compareKeys = Object.keys(compare)
                let compareData = [];
                for (let i = 0; i < compareKeys.length; i++) {
                    compareData.push([ compareKeys[i], compare[compareKeys[i]][compare[compareKeys[i]].length - 1] ]);
                }
                compareData = compareData.sort(function(a, b) {
                    return naturalSort(b[1].replace(/[^0-9-.]/g, ''), a[1].replace(/[^0-9-.]/g, ''));
                    //return parseFloat(b[1].replace(/[^0-9-.]/g, '')) - parseFloat(a[1].replace(/[^0-9-.]/g, ''));
                });

                _this.privateState.trends = compareData;
                // Remove non-numeric chars (except decimal point/minus sign):
                //priceVal = parseFloat(price.replace(/[^0-9-.]/g, '')); // 12345.99
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
            if (this.sharedState.selected.lnglat && this.sharedState.show.indexOf('qualityoflife') !== -1) {
                let _this = this;
                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/neighborhoods/${_this.sharedState.selected.lnglat.join(',')}/4326`, {
                    params: {
                        'geom_column': 'the_geom',
                        'columns': 'id',
                        'limit': 1
                    }
                }).then(function(response) {
                    _this.privateState.neighborhood = response.data[0].id;
                });
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
        passMetric: function() {
            let _this = this;
            document.querySelector(".iframe-qol").contentWindow.postMessage({"metric": _this.privateState.metric}, '*');
        },
        chart: function() {
            let _this = this;

            if (_this.privateState.chartData && _this.privateState.chartData.years.length > 1) {
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
</style>

<style lang="css" scoped>
h1 {
    font-size: 1.5em;
    margin: 25px 0 0;
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
</style>
