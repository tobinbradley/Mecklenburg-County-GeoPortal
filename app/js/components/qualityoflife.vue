<template lang="html">
    <div v-if="sharedState.selected.lnglat && sharedState.show.indexOf('qualityoflife') !== -1">
        <div class="qol">
            <div class="mdl-typography--text-center">
                <div class="report-record-highlight">
                    <i role="presentation" class="material-icons">favorite</i>
                    <h2>Quality of Life</h2>
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
        <div class="mdl-typography--text-center" v-if="privateState.trends">
               <table class="mdl-data-table" style="min-width: 350px; max-width: 100%;">
                   <caption>Comparing Your Neighborhood</caption>
                   <tbody>
                       <tr v-for="(item, index) in privateState.trends" v-bind:data-qolgroup="item[0]">
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
import naturalSort from '../modules/naturalsort';

export default {
    name: 'quality_of_life',
    mounted: function() {
        let _this = this;
        _this.getResults();
        window.onmessage = function(e){
            let data = e.data;
            if (data.summary) {
                // let compareKeys: Object.keys(data.summary.values);
                // let compare: data.summary.values;
                //
                // let years = Object.keys(e.data.summary.years);

                let compare = data.summary.values;
                let compareKeys = Object.keys(compare)
                let compareData = [];
                for (let i = 0; i < compareKeys.length; i++) {
                    compareData.push([ compareKeys[i], compare[compareKeys[i]][compare[compareKeys[i]].length - 1] ]);
                }
                compareData = compareData.sort(function(a, b) {
                    // if (parseFloat(b[1].replace(/[^0-9-.]/g, '')) && parseFloat(a[1].replace(/[^0-9-.]/g, ''))) {
                    //     return parseFloat(b[1].replace(/[^0-9-.]/g, '')) - parseFloat(a[1].replace(/[^0-9-.]/g, ''));
                    // } else {
                    //     console.log('nan');
                    //     return -1;
                    // }

                    return naturalSort(b[1], a[1]);
                });

                _this.privateState.trends = compareData;

                //_this.setState({ compareKeys: Object.keys(data.summary.values), compare: data.summary.values });
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
        setIframe: function() {
            this.privateState.embedURL = `${this.privateState.embedBase}?m=${this.privateState.metric}&s=${this.privateState.neighborhood}`;
        },
        passMetric: function() {
            let _this = this;
            document.querySelector(".iframe-qol").contentWindow.postMessage({"metric": _this.privateState.metric}, '*');
        }
    }
}
</script>

<style lang="css">
</style>
