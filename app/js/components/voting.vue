<template lang="html">
    <div>
        <div class="mdl-typography--text-center">
            <div class="report-record-highlight" v-if="resultsPrecinct.length > 0">
                <i class="icon icon-voting"></i>
                <h2>Your Polling Location is</h2>
                <h1>{{resultsPrecinct[0].label}}</h1>
                <h3><a href="javascript:void(0)" v-on:click="locationClick(resultsPrecinct[0])">
                            {{resultsPrecinct[0].address}}</a></h3>
                <h4>Precinct {{resultsPrecinct[0].precinct}}</h4>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsOfficials.length > 0">
                    <i class="icon icon-person"></i>
                    <h2>Your US SENATE representatives are</h2>
                    <h1 v-for="(item, index) in getSenate(resultsOfficials, 'national_senate')">
                        {{item.representative}}
                    </h1>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsOfficials.length > 0 && resultsNatlcong.length > 0">
                    <i class="icon icon-person"></i>
                    <h2>Your US CONGRESSIONAL DISTRICT representative is</h2>
                    <h1>{{resultsNatlcong[0].district | repFilter(resultsOfficials, 'national_congressional')}}</h1>
                    <h3>District {{resultsNatlcong[0].district}}</h3>
                </div>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsOfficials.length > 0 && resultsNCSenate.length > 0">
                    <i class="icon icon-person"></i>
                    <h2>Your NC SENATE DISTRICT representative is</h2>
                    <h1>{{resultsNCSenate[0].district | repFilter(resultsOfficials, 'state_senate')}}</h1>
                    <h3>District {{resultsNCSenate[0].district}}</h3>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsOfficials.length > 0 && resultsNCHouse.length > 0">
                    <i class="icon icon-person"></i>
                    <h2>Your NC HOUSE DISTRICT representative is</h2>
                    <h1>{{resultsNCHouse[0].district | repFilter(resultsOfficials, 'state_house')}}</h1>
                    <h3>District {{resultsNCHouse[0].district}}</h3>
                </div>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsOfficials.length > 0 && resultsPrecinct.length > 0">
                    <i class="icon icon-person"></i>
                    <h2>Your COUNTY COMMISSION DISTRICT representative is</h2>
                    <h1>{{resultsPrecinct[0].cc | repFilter(resultsOfficials, 'county_commission')}}</h1>
                    <h3>District {{resultsPrecinct[0].cc}}</h3>
                    <h4>
                        At large: {{ getAtLarge(resultsOfficials, 'county_commission') }}
                    </h4>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsOfficials.length > 0 && resultsPrecinct.length > 0">
                    <i class="icon icon-person"></i>
                    <h2>Your SCHOOL BOARD DISTRICT representative is</h2>
                    <h1>{{resultsPrecinct[0].school | repFilter(resultsOfficials, 'board_of_education')}}</h1>
                    <h3>District {{resultsPrecinct[0].school}}</h3>
                    <h4>
                        At large: {{ getAtLarge(resultsOfficials, 'board_of_education') }}
                    </h4>
                </div>
            </div>
        </div>
        <div class="mdl-typography--text-center">
            <div class="report-record-highlight" v-if="resultsOfficials.length > 0 && resultsCharlotte.length > 0">
                <i class="icon icon-person"></i>
                <h2>Your CHARLOTTE CITY COUNCIL DISTRICT representative is</h2>
                <h1>{{resultsCharlotte[0].district | repFilter(resultsOfficials, 'charlotte_city_council')}}</h1>
                <h3>District {{resultsCharlotte[0].district}}</h3>
                <h4>
                    At large: {{ getAtLarge(resultsOfficials, 'charlotte_city_council') }}
                </h4>
            </div>
        </div>
        <div class="report-moreinfo mdl-typography--text-left">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://www.meckboe.org/" target="_blank"  rel="noopener">Mecklenburg County Board of Elections</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import jsonToURL from '../modules/jsontourl';
    import format from 'format-number';
    export default {
        name: 'voting',
        data: function() {
            return {
                resultsOfficials: [],
                resultsPrecinct: [],
                resultsNatlcong: [],
                resultsNCSenate: [],
                resultsNCHouse: [],
                resultsCharlotte: []
            }
        },
        filters: {
            distance: function(dist) {
                return format({
                    'truncate': 1,
                    'suffix': ' miles'
                })(dist / 5280);
            },
            repFilter: function(id, recs, filt) {
                let rep = recs.filter(function(r) {
                    return r.district_type === filt && r.district == id;
                });
                return rep[0].representative;
            }
        },
        watch: {
            '$parent.sharedState.selected.lnglat': 'getResults',
            '$parent.sharedState.show': 'getResults'
        },
        mounted: function() {
            this.getOfficials();
            this.getResults();
        },
        methods: {
            apiFetch: function(params, url, setter) {
                let _this = this;
                return fetch(`${url}?${jsonToURL(params)}`)
                    .then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        _this[setter] = data;
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    });
            },
            getOfficials: function() {
                let _this = this;
                _this.apiFetch({
                        'sort': 'district'
                    },
                    'https://mcmap.org/api/query/v1/elected_officials',
                    'resultsOfficials'
                );
            },
            getResults: function() {
                let _this = this;
                if (_this.$parent.sharedState.selected.lnglat && _this.$parent.sharedState.show.indexOf('voting') !== -1) {
                    // voting precincts
                    _this.apiFetch({
                            'geom_column': 'the_geom',
                            'limit': 1,
                            'columns': `voting_precincts.cc, voting_precincts.school, polling_locations.name as label,polling_locations.address,voting_precincts.precno as precinct,st_x(st_transform(polling_locations.the_geom, 4326)) as lng, st_y(st_transform(polling_locations.the_geom, 4326)) as lat, ST_Distance(polling_locations.the_geom,ST_Transform(GeomFromText('POINT(${Number(_this.$parent.sharedState.selected.lnglat[0])} ${Number(_this.$parent.sharedState.selected.lnglat[1])})',4326), 2264)) as distance`,
                            'join': 'polling_locations;voting_precincts.precno = polling_locations.precno'
                        },
                        `https://mcmap.org/api/intersect_point/v1/voting_precincts/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`,
                        'resultsPrecinct'
                    );
                    // national congressional
                    _this.apiFetch({
                            'geom_column': 'the_geom',
                            'columns': `district as district`
                        },
                        `https://mcmap.org/api/intersect_point/v1/national_congressional/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`,
                        'resultsNatlcong'
                    );
                    // state senate
                    _this.apiFetch({
                            'geom_column': 'the_geom',
                            'columns': 'senate as district'
                        },
                        `https://mcmap.org/api/intersect_point/v1/state_senate/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`,
                        'resultsNCSenate'
                    );
                    // state house
                    _this.apiFetch({
                            'geom_column': 'the_geom',
                            'columns': 'house as district'
                        },
                        `https://mcmap.org/api/intersect_point/v1/state_house/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`,
                        'resultsNCHouse'
                    );
                    // charlotte city council
                    _this.apiFetch({
                            'geom_column': 'the_geom',
                            'columns': 'citydist as district'
                        },
                        `https://mcmap.org/api/intersect_point/v1/city_council/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`,
                        'resultsCharlotte'
                    );
                }
            },
            locationClick: function(rec) {
                this.$parent.sharedState.poi = {
                    'lnglat': [rec.lng, rec.lat],
                    'address': rec.address,
                    'label': rec.name
                };
            },
            getSenate: function(recs, filt) {
                return recs.filter(function(r) {
                    return r.district_type === filt;
                });
            },
            getAtLarge: function(recs, filt) {
                recs = recs.filter(function(r) {
                    return r.district_type === filt && r.district === 'At-Large';
                });
                return recs.map(function(item) {
                    return item.representative;
                }).join(', ')
            }
        }
    }
</script>

<style lang="css">

</style>
