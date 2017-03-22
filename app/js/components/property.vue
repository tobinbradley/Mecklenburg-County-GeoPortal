<template lang="html">    
    <div>
        <div v-if="!$parent.sharedState.selected.pid">
            <Introduction>
                <div class='intro-slot'>
                    To view <strong>Property</strong> information, use the search above to find a location.
                </div>
            </Introduction>
        </div>
        <div v-else>
            <div class="report-record-highlight">
                <i role="presentation" class="material-icons">business</i>
                <h2>Tax Parcel</h2>
                <h1>{{$parent.sharedState.selected.pid}}</h1>
                <h3 v-if="resultsZoning.length > 0">Zoned as {{ resultsZoning[0].zone_class}} {{resultsZoning[0].zone_des}}</h3>
                <Photos></Photos>
            </div>

            <div v-if="resultsOwnership.length > 0">
                <table class="mdl-data-table mdl-js-data-table">
                    <caption>Ownership</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Owner</th>
                            <th class="mdl-data-table__cell--non-numeric">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultsOwnership">
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.first_name}} {{item.last_name}}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.address_1}} <br />
                                {{item.city}}, {{item.state}} {{item.zipcode}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="resultsAppraisal.length > 0">
                <table class="mdl-data-table mdl-js-data-table">
                    <caption>Tax Appraisal</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Year</th>
                            <th>Building</th>
                            <th class="col-responsive">Land</th>
                            <th class="col-responsive">Extra</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultsAppraisal">
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.tax_year}}
                            </td>
                            <td>
                                {{item.building_value | money}}
                            </td>
                            <td class="col-responsive">
                                {{item.land_value | money}}
                            </td>
                            <td class="col-responsive">
                                {{item.extra_features_value | money}}
                            </td>
                            <td>
                                {{item.total_value | money}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="resultsSales.length > 0">
                <table class="mdl-data-table mdl-js-data-table">
                    <caption>Sale History</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Date</th>
                            <th>Price</th>
                            <th class="mdl-data-table__cell--non-numeric col-responsive">Deed Book</th>
                            <th class="mdl-data-table__cell--non-numeric col-responsive">Legal Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultsSales">
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.sale_date}}
                            </td>
                            <td>
                                {{ item.sale_price | money }}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric col-responsive">
                                {{item.deed_book}}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric col-responsive">
                                {{item.legal_reference}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="resultsLanduse.length > 0">
                <table class="mdl-data-table mdl-js-data-table">
                    <caption>Land Use</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Use</th>
                            <th>Units</th>
                            <th class="mdl-data-table__cell--non-numeric col-responsive">Neighborhood</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultsLanduse">
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.land_use}}
                            </td>
                            <td>
                                {{ item.units | trunc}}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric col-responsive">
                                {{item.neighborhood}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="resultsBuildings.length > 0">
                <table class="mdl-data-table mdl-js-data-table">
                    <caption>Buildings</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Structure</th>
                            <th>Year Built</th>
                            <th class="mdl-data-table__cell--non-numeric col-responsive">Exterior</th>
                            <th class="mdl-data-table__cell--non-numeric">Area</th>
                            <th class="col-responsive">Beds</th>
                            <th class="col-responsive">Baths</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultsBuildings">
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.property_use_description}}
                            </td>
                            <td>
                                {{item.year_built}}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric col-responsive">
                                {{item.exterior_wall_description}}
                            </td>
                            <td>
                                {{ item.total_square_feet | sqft }}
                            </td>
                            <td class="col-responsive">
                                {{item.bedrooms}}
                            </td>
                            <td class="col-responsive">
                                {{Number(item.full_baths) + Number(item.three_quarter_baths) + Number(item.half_baths)}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="resultsPermits.length > 0">
                <table class="mdl-data-table mdl-js-data-table">
                    <caption>Permits</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Year</th>
                            <th class="mdl-data-table__cell--non-numeric">Project</th>
                            <th class="col-responsive">Area</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultsPermits">
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.theyear}}
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                {{item.project_name}}
                            </td>
                            <td class="col-responsive">
                                {{ item.square_footage | sqft }}
                            </td>
                            <td>
                                {{ item.construction_cost | money }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="report-moreinfo mdl-typography--text-left">
                <h5>For more information, please visit:</h5>
                <ul class="list-unstyled">
                    <li><a href="http://polaris.mecklenburgcountync.gov/" target="_blank">POLARIS</a></li>
                    <li><a href="http://charmeck.org/mecklenburg/county/AssessorsOffice/Pages/Home.aspx" target="_blank">County Assessor's Office</a></li>
                    <li><a href="http://charmeck.org/city/charlotte/planning/Pages/Home.aspx" target="_blank">Charlotte-Mecklenburg Planning</a></li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import format from 'format-number';
import Welcome from './introduction.vue';
import Photos from './photos.vue';

export default {
    name: 'property',
    data: function() {
        return {
            resultsZoning: [],
            resultsOwnership: [],
            resultsAppraisal: [],
            resultsSales: [],
            resultsLanduse: [],
            resultsBuildings: [],
            resultsPermits: []
        }
    },
    components: {
        Introduction: Welcome,
        Photos: Photos
    },
    filters: {
        money: function(num) {
            return format({'prefix': '$', 'truncate': 0})(num);
        },
        trunc: function(num) {
            return format({'truncate': 0})(num);
        },
        sqft: function(num) {
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
            if (_this.$parent.sharedState.selected.pid && _this.$parent.sharedState.show.indexOf('property') !== -1) {
                axios.get('https://mcmap.org/rest/v3/ws_geo_pointoverlay.php',
                  {
                      params: {
                          'x': _this.$parent.sharedState.selected.lnglat[0],
                          'y': _this.$parent.sharedState.selected.lnglat[1],
                          'srid': 4326,
                          'table': 'view_zoning',
                          'fields': 'zone_des, zone_class',
                          'parameters': "zone_des <> 'sm_towns'",
                          'geometryfield': 'the_geom'
                      }
                  })
                  .then(function(response) {
                      _this.resultsZoning = response.data;
                  });

                  axios.get('https://mcmap.org/rest/v3/ws_cama_ownership.php', {params: {'pid': _this.$parent.sharedState.selected.pid}, timeout: 3000})
                    .then(function(response) {
                         _this.resultsOwnership = response.data;
                    });

                    axios.get('https://mcmap.org/rest/v3/ws_cama_appraisal.php', {params: {'pid': _this.$parent.sharedState.selected.pid}, timeout: 3000})
                      .then(function(response) {
                          _this.resultsAppraisal = response.data;
                      });

                    axios.get('https://mcmap.org/rest/v3/ws_cama_saleshistory.php', {params: {'pid': _this.$parent.sharedState.selected.pid}, timeout: 3000})
                        .then(function(response) {
                            _this.resultsSales = response.data;
                        });

                    axios.get('https://mcmap.org/rest/v3/ws_cama_landuse.php', {params: {'pid': _this.$parent.sharedState.selected.pid}, timeout: 3000})
                        .then(function(response) {
                            _this.resultsLanduse = response.data;
                        });

                    axios.get('https://mcmap.org/rest/v3/ws_cama_building.php', {params: {'pid': _this.$parent.sharedState.selected.pid}, timeout: 3000})
                        .then(function(response) {
                            _this.resultsBuildings = response.data;
                        });

                    axios.get('https://mcmap.org/rest/v3/ws_geo_featureoverlay.php',
                        {
                            params: {
                                'from_table': 'tax_parcels',
                                'to_table': 'building_permits',
                                'fields': 'extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost',
                                'parameters': `f.pid = '${_this.$parent.sharedState.selected.pid}' and t.job_status = 'COMPL'`,
                                'order': 't.date_completed_co_process desc',
                                'limit': 10,
                                'from_geometryfield': 'the_geom',
                                'to_geometryfield': 'the_geom'
                            },
                            timeout: 3000
                        })
                        .then(function(response) {
                            _this.resultsPermits = response.data;
                        });
              }
        }
    }
}
</script>

<style lang="css">
</style>
