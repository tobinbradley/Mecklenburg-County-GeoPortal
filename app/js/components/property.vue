<template lang="html">
    <div v-if="sharedState.selected.pid && sharedState.show.indexOf('property') !== -1">

        <div class="report-record-highlight">
            <i role="presentation" class="material-icons">business</i>
            <h2>Tax Parcel</h2>
            <h1>{{sharedState.selected.pid}}</h1>
            <h3 v-if="privateState.resultsZoning.length > 0">Zoned as {{ privateState.resultsZoning[0].zone_class}} {{privateState.resultsZoning[0].zone_des}}</h3>
        </div>

        <div v-if="privateState.resultsOwnership.length > 0">
            <table class="mdl-data-table mdl-js-data-table">
                <caption>Ownership</caption>
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Owner</th>
                        <th class="mdl-data-table__cell--non-numeric">Address</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in privateState.resultsOwnership">
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

        <div v-if="privateState.resultsAppraisal.length > 0">
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
                    <tr v-for="(item, index) in privateState.resultsAppraisal">
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

        <div v-if="privateState.resultsSales.length > 0">
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
                    <tr v-for="(item, index) in privateState.resultsSales">
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

        <div v-if="privateState.resultsLanduse.length > 0">
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
                    <tr v-for="(item, index) in privateState.resultsLanduse">
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

        <div v-if="privateState.resultsBuildings.length > 0">
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
                    <tr v-for="(item, index) in privateState.resultsBuildings">
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

        <div v-if="privateState.resultsPermits.length > 0">
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
                    <tr v-for="(item, index) in privateState.resultsPermits">
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
</template>

<script>
import axios from 'axios';
import format from 'format-number';

export default {
    name: 'property',
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
        'sharedState.selected.lnglat': 'getResults',
        'sharedState.show': 'getResults'
    },
    mounted: function() {
        this.getResults();
    },
    methods: {
        getResults: function() {
            let _this = this;
            if (_this.sharedState.selected.pid && _this.sharedState.show.indexOf('property') !== -1) {
                axios.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_pointoverlay.php',
                  {
                      params: {
                          'x': _this.sharedState.selected.lnglat[0],
                          'y': _this.sharedState.selected.lnglat[1],
                          'srid': 4326,
                          'table': 'view_zoning',
                          'fields': 'zone_des, zone_class',
                          'parameters': "zone_des <> 'sm_towns'",
                          'geometryfield': 'the_geom'
                      }
                  })
                  .then(function(response) {
                      _this.privateState.resultsZoning = response.data;
                  });

                  axios.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_ownership.php', {params: {'pid': _this.sharedState.selected.pid}, timeout: 3000})
                    .then(function(response) {
                         _this.privateState.resultsOwnership = response.data;
                    });

                    axios.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_appraisal.php', {params: {'pid': _this.sharedState.selected.pid}, timeout: 3000})
                      .then(function(response) {
                          _this.privateState.resultsAppraisal = response.data;
                      });

                    axios.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_saleshistory.php', {params: {'pid': _this.sharedState.selected.pid}, timeout: 3000})
                        .then(function(response) {
                            _this.privateState.resultsSales = response.data;
                        });

                    axios.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_landuse.php', {params: {'pid': _this.sharedState.selected.pid}, timeout: 3000})
                        .then(function(response) {
                            _this.privateState.resultsLanduse = response.data;
                        });

                    axios.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_building.php', {params: {'pid': _this.sharedState.selected.pid}, timeout: 3000})
                        .then(function(response) {
                            _this.privateState.resultsBuildings = response.data;
                        });

                    axios.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_featureoverlay.php',
                        {
                            params: {
                                'from_table': 'tax_parcels',
                                'to_table': 'building_permits',
                                'fields': 'extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost',
                                'parameters': `f.pid = '${_this.sharedState.selected.pid}' and t.job_status = 'COMPL'`,
                                'order': 't.date_completed_co_process desc',
                                'limit': 10,
                                'from_geometryfield': 'the_geom',
                                'to_geometryfield': 'the_geom'
                            },
                            timeout: 3000
                        })
                        .then(function(response) {
                            _this.privateState.resultsPermits = response.data;
                        });
              }
        }
    }
}
</script>

<style lang="css">
</style>
