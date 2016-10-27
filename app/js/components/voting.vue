<template lang="html">
    <div v-if="sharedState.show.indexOf('voting') !== -1">
		<div class="mdl-typography--text-center">
            <div class="report-record-highlight" v-if="privateState.resultsPrecinct.length > 0">
                <i role="presentation" class="material-icons">check_box</i>
				<h2>Your Polling Location is</h2>
    				<h1>{{privateState.resultsPrecinct[0].label}}</h1>
				<h3><a href="javascript:void(0)" v-on:click="locationClick(privateState.resultsPrecinct[0])">
                        {{privateState.resultsPrecinct[0].address}}</a></h3>
    				<h4>Precinct {{privateState.resultsPrecinct[0].precinct}}</h4>
			</div>
		</div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsOfficials.length > 0">
                   <i role="presentation" class="material-icons">person</i>
                   <h2>Your US SENATE representatives are</h2>
                        <h1 v-for="(item, index) in getSenate(privateState.resultsOfficials, 'national_senate')">
                            {{item.representative}}
                        </h1>
                </div>
			</div>
			<div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsOfficials.length > 0 && privateState.resultsNatlcong.length > 0">
                    <i role="presentation" class="material-icons">person</i>
                    <h2>Your US CONGRESSIONAL DISTRICT representative is</h2>
                    <h1>{{privateState.resultsNatlcong[0].district | repFilter(privateState.resultsOfficials, 'national_congressional')}}</h1>
                    <h3>District {{privateState.resultsNatlcong[0].district}}</h3>
                </div>
			</div>
		</div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsOfficials.length > 0 && privateState.resultsNCSenate.length > 0">
                    <i role="presentation" class="material-icons">person</i>
                    <h2>Your NC SENATE DISTRICT representative is</h2>
                    <h1>{{privateState.resultsNCSenate[0].district | repFilter(privateState.resultsOfficials, 'state_senate')}}</h1>
                    <h3>District {{privateState.resultsNCSenate[0].district}}</h3>
                </div>
			</div>
			<div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsOfficials.length > 0 && privateState.resultsNCHouse.length > 0">
                    <i role="presentation" class="material-icons">person</i>
                    <h2>Your NC HOUSE DISTRICT representative is</h2>
                    <h1>{{privateState.resultsNCHouse[0].district | repFilter(privateState.resultsOfficials, 'state_house')}}</h1>
                    <h3>District {{privateState.resultsNCHouse[0].district}}</h3>
                </div>
			</div>
		</div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsOfficials.length > 0 && privateState.resultsPrecinct.length > 0">
                    <i role="presentation" class="material-icons">person</i>
                    <h2>Your COUNTY COMMISSION DISTRICT representative is</h2>
                    <h1>{{privateState.resultsPrecinct[0].cc | repFilter(privateState.resultsOfficials, 'county_commission')}}</h1>
                    <h3>District {{privateState.resultsPrecinct[0].cc}}</h3>
                    <h4>
                        At large: {{ getAtLarge(privateState.resultsOfficials, 'county_commission') }}
                    </h4>
                </div>
			</div>
			<div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsOfficials.length > 0 && privateState.resultsPrecinct.length > 0">
                    <i role="presentation" class="material-icons">person</i>
                    <h2>Your SCHOOL BOARD DISTRICT representative is</h2>
                    <h1>{{privateState.resultsPrecinct[0].school | repFilter(privateState.resultsOfficials, 'board_of_education')}}</h1>
                    <h3>District {{privateState.resultsPrecinct[0].school}}</h3>
                    <h4>
                        At large: {{ getAtLarge(privateState.resultsOfficials, 'board_of_education') }}
                    </h4>
                </div>
			</div>
		</div>
		<div class="mdl-typography--text-center">
            <div class="report-record-highlight" v-if="privateState.resultsOfficials.length > 0 && privateState.resultsCharlotte.length > 0">
                <i role="presentation" class="material-icons">person</i>
                <h2>Your CHARLOTTE CITY COUNCIL DISTRICT representative is</h2>
                <h1>{{privateState.resultsCharlotte[0].district | repFilter(privateState.resultsOfficials, 'charlotte_city_council')}}</h1>
                <h3>District {{privateState.resultsCharlotte[0].district}}</h3>
                <h4>
                    At large: {{ getAtLarge(privateState.resultsOfficials, 'charlotte_city_council') }}
                </h4>
            </div>
		</div>

        <div class="report-moreinfo mdl-typography--text-left">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://www.meckboe.org/" target="_blank">Mecklenburg County Board of Elections</a></li>
            </ul>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import format from 'format-number';

export default {
  name: 'voting',
  filters: {
      distance: function(dist) {
          return format({'truncate': 1, 'suffix': ' miles'})(dist / 5280);
      },
      repFilter: function(id, recs, filt) {
          let rep = recs.filter(function(r) { return r.district_type === filt && r.district == id; });
          return rep[0].representative;
      }
  },
  watch: {
      'sharedState.selected.lnglat': 'getResults',
      'sharedState.show': 'getResults'
  },
  mounted: function() {
      this.getOfficials();
      this.getResults();
  },
  methods: {
      getOfficials: function() {
          let _this = this;
          axios.get(`http://maps.co.mecklenburg.nc.us/api/query/v1/elected_officials`,
              {
                  params: {
                      'sort': 'district'
                  }
              })
              .then(function(response) {
                  _this.privateState.resultsOfficials = response.data;
              });
      },
      getResults: function() {
          let _this = this;
          if (_this.sharedState.selected.lnglat && _this.sharedState.show.indexOf('voting') !== -1) {
                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/voting_precincts/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'geom_column': 'the_geom',
                            'limit': 1,
                            'columns': `voting_precincts.cc, voting_precincts.school, polling_locations.name as label,polling_locations.address,voting_precincts.precno as precinct,st_x(st_transform(polling_locations.the_geom, 4326)) as lng, st_y(st_transform(polling_locations.the_geom, 4326)) as lat, ST_Distance(polling_locations.the_geom,ST_Transform(GeomFromText('POINT(${Number(_this.sharedState.selected.lnglat[0])} ${Number(_this.sharedState.selected.lnglat[1])})',4326), 2264)) as distance`,
                            'join': 'polling_locations;voting_precincts.precno = polling_locations.precno'
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsPrecinct = response.data;
                    });

                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/national_congressional/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'geom_column': 'the_geom',
                            'columns': `district as district`
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsNatlcong = response.data;
                    });

                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/state_senate/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'geom_column': 'the_geom',
                            'columns': `senate as district`
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsNCSenate = response.data;
                    });

                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/state_house/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'geom_column': 'the_geom',
                            'columns': `house as district`
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsNCHouse = response.data;
                    });

                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/city_council/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'geom_column': 'the_geom',
                            'columns': `citydist as district`
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsCharlotte = response.data;
                    });
            }
      },
      locationClick: function(rec) {
          this.sharedState.poi = {
              'lnglat': [rec.lng, rec.lat],
              'address': rec.address,
              'label': rec.name
          };
      },
      getSenate: function(recs, filt) {
          return recs.filter(function(r) { return r.district_type === filt; });
      },
      getAtLarge: function(recs, filt) {
          recs = recs.filter(function(r) { return r.district_type === filt && r.district === 'At-Large'; });
          return recs.map(function(item) { return item.representative; }).join(', ')
      }
  }
}
</script>

<style lang="css">
</style>
