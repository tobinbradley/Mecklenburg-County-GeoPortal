<template lang="html">
    <div v-if="!$parent.sharedState.selected.lnglat">
        <Introduction>
            <div class='intro-slot'>
                To view <strong>School</strong> information, use the search above to find a location.
            </div>
        </Introduction>
    </div>
    <div v-else>
        <div class="mdl-typography--text-center">
            <Print></Print>
            <div class="report-record-highlight" v-if="resultsElementary.length > 0">
                <i class="icon icon-school"></i>
                <h2>Your ELEMENTARY school is</h2>
                <h1>{{resultsElementary[0].name.toUpperCase()}}</h1>
                <h3><a href="javascript:void(0)" v-on:click="locationClick(resultsElementary[0])">
                    {{resultsElementary[0].address}}</a></h3>
                <h4>{{ resultsElementary[0].dist | distance }}</h4>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsMiddle.length > 0">
                    <i class="icon icon-school"></i>
                    <h2>Your MIDDLE school is</h2>
                    <h1>{{resultsMiddle[0].name.toUpperCase()}}</h1>
                    <h3><a href="javascript:void(0)" v-on:click="locationClick(resultsMiddle[0])">
                        {{resultsMiddle[0].address}}</a></h3>
                    <h4>{{ resultsMiddle[0].dist | distance }}</h4>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="resultsHigh.length > 0">
                    <i class="icon icon-school"></i>
                    <h2>Your HIGH school is</h2>
                    <h1>{{resultsHigh[0].name.toUpperCase()}}</h1>
                    <h3><a href="javascript:void(0)" v-on:click="locationClick(resultsHigh[0])">
                        {{resultsHigh[0].address}}</a></h3>
                    <h4>{{ resultsHigh[0].dist | distance }}</h4>
                </div>
            </div>
        </div>
        <div class="mdl-typography--text-center">
            <div class="report-record-highlight" v-if="resultsHigh.length > 0">
               <i class="icon icon-bus"></i>
               <h2>Your Transportation Zone is</h2>
               <h1>{{resultsHigh[0].zone.toUpperCase()}}</h1>
               <p v-if="tmpTransportationZone && resultsHigh[0].zone.toUpperCase() !== tmpTransportationZone[0].choicezn.toUpperCase()">
                   For the 2017-2018 school year, your <strong>Transportation Zone</strong> will
                   change to <strong>{{ tmpTransportationZone[0].choicezn.toUpperCase() }}</strong>.
               </p>
           </div>
        </div>

        <div v-if="resultsMagnet">
            <table class="mdl-data-table mdl-js-data-table">
                <caption>Magnet Schools</caption>
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">School</th>
                        <th class="mdl-data-table__cell--non-numeric">Address</th>
                        <th class="col-responsive">Distance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in resultsMagnet">
                        <td class="mdl-data-table__cell--non-numeric">
                            {{item.schlname}}{{ item.schl | getAsterik }}
                        </td>
                        <td class="mdl-data-table__cell--non-numeric">
                            <a href="javascript:void(0)" v-on:click="locationClick(index)">
                                {{item.address}}, {{item.city}}</a>
                        </td>
                        <td class="nowrap col-responsive">
                            {{ item.distance | distance }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="report-moreinfo mdl-typography--text-left">
            <p>
            Transportation eligibility is determined by the transportation zone in which you live. The county is divided into four transportation zones:  violet, grey, blue, and green. Magnet schools are assigned a zone to serve with transportation. If the distance is to the magnet greater than 5 miles, you may be assigned to a shuttle stop location. Some programs (*) provide county-wide transportation, meaning that regardless of your zone, you would receive transportation. For more information please contact Charlotte-Mecklenburg School Transportation Services at (980) 343-6715.
            </p>
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://www.cms.k12.nc.us/" target="_blank">Charlotte-Mecklenburg Schools</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import jsonToURL from '../modules/jsontourl';
import format from 'format-number';
import Welcome from './introduction.vue';
import Printheader from './printheader.vue';

export default {
  name: 'schools',
  components: {
      Introduction: Welcome,
      Print: Printheader
  },
  data: function() {
      return {
          resultsMagnet: [],
          resultsElementary: [],
          resultsMiddle: [],
          resultsHigh: [],
          tmpTransportationZone: null
      }
  },
  filters: {
      distance: function(dist) {
          return format({'truncate': 1, 'suffix': ' miles'})(dist / 5280);
      },
      getAsterik: function(id) {
          if ([4429, 8364, 5532, 8482, 7405, 7496, 5520].indexOf(Number(id)) !== -1) {
            return '*';
          } else {
            return '';
          }
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
      getResults: function() {
          let _this = this;
          if (_this.$parent.sharedState.selected.lnglat && _this.$parent.sharedState.show.indexOf('schools') !== -1) {

                // magnet schools
                _this.apiFetch({
                        'columns': `schl, schlname, address, city, ST_Distance(the_geom,ST_Transform(GeomFromText('POINT( ${Number(_this.$parent.sharedState.selected.lnglat[0])} ${Number(_this.$parent.sharedState.selected.lnglat[1])} )',4326), 2264)) as distance, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat`,
                        'sort': 'distance'
                    }, 
                    'https://mcmap.org/api/query/v1/view_schools_magnet', 
                    'resultsMagnet'
                );

                // elementary school
                _this.apiFetch({
                        'columns': `name, address, ST_X(ST_Transform(schools.the_geom, 4326)) as lng, ST_Y(ST_Transform(schools.the_geom, 4326)) as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${Number(_this.$parent.sharedState.selected.lnglat[0])} ${Number(_this.$parent.sharedState.selected.lnglat[1])})',4326), 2264), schools.the_geom) as dist`,
                        'limit': 1,
                        'join': `schools;cms_elementary_districts.num = schools.schl`
                    }, 
                    `https://mcmap.org/api/intersect_point/v1/cms_elementary_districts/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`, 
                    'resultsElementary'
                );

                // middle school
                _this.apiFetch({
                        'columns': `name, address, ST_X(ST_Transform(schools.the_geom, 4326)) as lng, ST_Y(ST_Transform(schools.the_geom, 4326)) as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${Number(_this.$parent.sharedState.selected.lnglat[0])} ${Number(_this.$parent.sharedState.selected.lnglat[1])} )',4326), 2264), schools.the_geom) as dist`,
                        'limit': 1,
                        'join': `schools;cms_middle_districts.num = schools.schl`
                    }, 
                    `https://mcmap.org/api/intersect_point/v1/cms_middle_districts/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`, 
                    'resultsMiddle'
                );     

                // high school
                _this.apiFetch({
                        'columns': `zone, name, address, ST_X(ST_Transform(schools.the_geom, 4326)) as lng, ST_Y(ST_Transform(schools.the_geom, 4326)) as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${Number(_this.$parent.sharedState.selected.lnglat[0])} ${Number(_this.$parent.sharedState.selected.lnglat[1])} )',4326), 2264), schools.the_geom) as dist`,
                        'limit': 1,
                        'join': `schools;cms_high_districts.num = schools.schl`
                    }, 
                    `https://mcmap.org/api/intersect_point/v1/cms_high_districts/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`, 
                    'resultsHigh'
                );         

                // temporary for transportation zone
                _this.apiFetch({
                        'columns': 'choicezn',
                        'limit': 1
                    }, 
                    `https://mcmap.org/api/intersect_point/v1/tmp_cms_transportation_2017/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326`, 
                    'tmpTransportationZone'
                );                     

            }
      },
      locationClick: function(rec) {
          this.$parent.sharedState.poi = {
              'lnglat': [rec.lng, rec.lat],
              'address': rec.address,
              'label': rec.name
          };
      }
  }
}
</script>

<style lang="css">
</style>
