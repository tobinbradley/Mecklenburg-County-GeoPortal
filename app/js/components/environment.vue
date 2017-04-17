<template lang="html">
    <div>
        <div v-if="!$parent.sharedState.selected.pid">
            <Introduction>
                <div class='intro-slot'>
                    To view <strong>Environmental</strong> information, use the search above to find a location.
                </div>
            </Introduction>
        </div>
        <div v-else>
        <div class="mdl-grid">
           <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
              <div v-if="resultsFloodplain">
                  <div class="report-record-highlight">
                        <i role="presentation" class="material-icons">flash_on</i>
                        <h2 v-if="resultsFloodplain.length > 0">This property is in a</h2>
                        <h2 v-else>This property is not in a regulated floodplain.</h2>
                        <h1 v-if="resultsFloodplain.length > 0">REGULATED FLOODPLAIN</h1>
                        <h4 v-if="resultsFloodplain.length > 0"><a target="_blank" href={fz}>Special restrictions may apply</a>. For more information, please call 704.336.3728.</h4>
                    </div>
              </div>
           </div>

           <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
               <div v-if="resultsWaterquality">
                   <div class="report-record-highlight">
                         <i role="presentation" class="material-icons">invert_colors</i>
                         <template v-if="resultsWaterquality.length > 0">
                             <h2>This property is in a</h2>
                             <h1>WATER QUALITY BUFFER</h1>
                             <h4>The buffer(s) are: <strong>{{ resultsWaterquality | waterquality }}</strong>. <a href="http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx" target="_blank">Special restrictions may apply</a>. For more information,
                             please call 980.721.4191 for existing single-family lots and those projects not needing a grading permit or call 704.432.5570 for
                             other projects.</h4>
                         </template>
                         <template v-else>
                             <h2>This property is not in a Water Quality Buffer.</h2>
                         </template>
                   </div>
                </div>
           </div>

           <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
               <div v-if="resultsPostconstruction">
                   <div class="report-record-highlight">
                        <i role="presentation" class="material-icons">build</i>
                        <template v-if="resultsPostconstruction.length > 0">
                            <h2>This property is in a</h2>
                            <h1>{{ resultsPostconstruction | postconstruction }}</h1>
                            <h4><a href="http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx" target="_blank">PCCO mitigation options apply</a>. For more information, please call 704.432.5571.</h4>
                        </template>
                        <template v-else>
                            <h2>This property is not in a Distressed Business District or Transit Station Area.</h2>
                        </template>
                    </div>
               </div>
           </div>

           <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
               <div class="report-record-highlight" v-if="resultsWatershed">
                    <i role="presentation" class="material-icons">terrain</i>
                    <h2>This property is in the</h2>
                    <h1>{{resultsWatershed[0].name.toUpperCase()}} WATERSHED</h1>
                    <h4>A watershed, or drainage basin, is an area of land where all surface water converges to a single point at a lower elevation,
                    usually the exit of the basin such as a river, lake, or wetland.</h4>
                </div>
           </div>

       </div>
       <div class="mdl-typography--text-center">
           <div v-if="resultsSoil">
               <table class="mdl-data-table mdl-js-data-table">
                    <caption>Soil Types</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Type</th>
                            <th class="mdl-data-table__cell--non-numeric">Group</th>
                            <th class="mdl-data-table__cell--non-numeric">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultsSoil">
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.name}}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.hydrologic_group}}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.description}}
                            </td>
                        </tr>
                    </tbody>
                </table>
           </div>
       </div>
       <div class="report-moreinfo mdl-typography--text-left">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://charmeck.org/stormwater/Pages/default.aspx" target="_blank">Storm Water Services</a></li>
                <li><a href="http://charmeck.org/mecklenburg/county/LUESA/WaterandLandResources/Pages/default.aspx" target="_blank">Water &amp; Land Resources</a></li>
                <li><a href="http://charmeck.org/mecklenburg/county/HealthDepartment/EnvironmentalHealth/GWS/Pages/default.aspx" target="_blank">Groundwater &amp; Wastewater Services</a></li>
                <li><a href="https://mecklenburgcounty.exavault.com/p/waterquality%252FWQ%2520Buffers/WaterQualityBufferImplementationGuidelines.pdf" target="_blank">Water Quality Buffer Implementation Guidelines</a></li>
            </ul>
        </div>
        </div>
   </div>
</template>

<script>
import axios from 'axios';
import Welcome from './introduction.vue';

export default {
    name: 'environment',
    data: function() {
        return {
            resultsFloodplain: null,
            resultsSoil: null,
            resultsWaterquality: null,
            resultsPostconstruction: null,
            resultsWatershed: null
        }
    },
    components: {
        Introduction: Welcome
    },
    watch: {
        '$parent.sharedState.selected.lnglat': 'getResults',
        '$parent.sharedState.show': 'getResults'
    },
    filters: {
        postconstruction: function(items) {
            items = items.filter(function(item) { return item.type === 'TRANSIT CORRIDOR' || item.type === 'BUSINESS CORRIDOR'; });
            items = items.map(function(item) { return item.type; });
            items = items.join(' and ');
            items = items.replace('BUSINESS CORRIDOR', 'Distressed Business District'.toUpperCase()).replace('TRANSIT CORRIDOR', 'Transit Station Area'.toUpperCase());
            return items;
        },
        waterquality: function(items) {
            let typesArr = [];
            for (let i = 0; i < items.length; i++) {
                typesArr.push(`${items[i].label} ${items[i].type}`);
            }
            return typesArr.join(', ');
        }
    },
    mounted: function() {
        this.getResults();
    },
    methods: {
        getResults: function() {
            let _this = this;
            if (_this.$parent.sharedState.selected.lnglat && _this.$parent.sharedState.show.indexOf('environment') !== -1) {
                axios.get(`https://mcmap.org/api/intersect_feature/v1/tax_parcels/view_regulated_floodplains`,
                    {
                        params: {
                            'columns': 't.gid',
                            'filter': `f.pid = '${_this.$parent.sharedState.selected.pid}'`,
                            'geom_column_from': 'the_geom',
                            'geom_column_to': 'the_geom'
                        }
                    })
                    .then(function(response) {
                        _this.resultsFloodplain = response.data;
                    });

                axios.get(`https://mcmap.org/api/intersect_feature/v1/tax_parcels/post_construction_layers`,
                    {
                        params: {
                            'columns': 'type, name',
                            'filter': `f.pid = '${_this.$parent.sharedState.selected.pid}' and t.type in ('TRANSIT CORRIDOR', 'BUSINESS CORRIDOR') `,
                            'geom_column_from': 'the_geom',
                            'geom_column_to': 'the_geom'
                        }
                    })
                    .then(function(response) {
                        _this.resultsPostconstruction = response.data;
                    });

                axios.get(`https://mcmap.org/api/intersect_feature/v1/tax_parcels/soil`,
                    {
                        params: {
                            'columns': 'distinct name,description,hydrologic_group',
                            'filter': `f.pid = '${_this.$parent.sharedState.selected.pid}'`,
                            'geom_column_from': 'the_geom',
                            'geom_column_to': 'the_geom'
                        }
                    })
                    .then(function(response) {
                        _this.resultsSoil = response.data;
                    });

                axios.get(`https://mcmap.org/api/intersect_feature/v1/tax_parcels/water_quality_buffers`,
                    {
                        params: {
                            'columns': 'distinct type,label',
                            'filter': `f.pid = '${_this.$parent.sharedState.selected.pid}'`,
                            'geom_column_from': 'the_geom',
                            'geom_column_to': 'the_geom'
                        }
                    })
                    .then(function(response) {
                        _this.resultsWaterquality = response.data;
                    });

                axios.get(`https://mcmap.org/api/intersect_point/v1/watersheds/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'columns': 'name',
                            'geom_column': 'the_geom'
                        }
                    })
                    .then(function(response) {
                        _this.resultsWatershed = response.data;
                    });
            }
        }
    }
}
</script>

<style lang="css">
</style>
