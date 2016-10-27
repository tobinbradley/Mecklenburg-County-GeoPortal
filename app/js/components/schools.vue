<template lang="html">
    <div v-if="sharedState.show.indexOf('schools') !== -1">
        <div class="mdl-typography--text-center">
            <div class="report-record-highlight" v-if="privateState.resultsElementary.length > 0">
                <i role="presentation" class="material-icons">school</i>
                <h2>Your ELEMENTARY school is</h2>
                <h1>{{privateState.resultsElementary[0].name.toUpperCase()}}</h1>
                <h3><a href="javascript:void(0)" v-on:click="locationClick(privateState.resultsElementary[0])">
                    {{privateState.resultsElementary[0].address}}</a></h3>
                <h4>{{ privateState.resultsElementary[0].dist | distance }}</h4>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsMiddle.length > 0">
                    <i role="presentation" class="material-icons">school</i>
                    <h2>Your MIDDLE school is</h2>
                    <h1>{{privateState.resultsMiddle[0].name.toUpperCase()}}</h1>
                    <h3><a href="javascript:void(0)" v-on:click="locationClick(privateState.resultsMiddle[0])">
                        {{privateState.resultsMiddle[0].address}}</a></h3>
                    <h4>{{ privateState.resultsMiddle[0].dist | distance }}</h4>
                </div>
            </div>
            <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                <div class="report-record-highlight" v-if="privateState.resultsHigh.length > 0">
                    <i role="presentation" class="material-icons">school</i>
                    <h2>Your HIGH school is</h2>
                    <h1>{{privateState.resultsHigh[0].name.toUpperCase()}}</h1>
                    <h3><a href="javascript:void(0)" v-on:click="locationClick(privateState.resultsHigh[0])">
                        {{privateState.resultsHigh[0].address}}</a></h3>
                    <h4>{{ privateState.resultsHigh[0].dist | distance }}</h4>
                </div>
            </div>
        </div>
        <div class="mdl-typography--text-center">
            <div class="report-record-highlight" v-if="privateState.resultsHigh.length > 0">
               <i role="presentation" class="material-icons">directions_bus</i>
               <h2>Your Transportation Zone is</h2>
               <h1>{{privateState.resultsHigh[0].zone.toUpperCase()}}</h1>
           </div>
        </div>

        <div v-if="privateState.resultsMagnet">
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
                    <tr v-for="(item, index) in privateState.resultsMagnet">
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
import axios from 'axios';
import format from 'format-number';

export default {
  name: 'schools',
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
      'sharedState.selected.lnglat': 'getResults',
      'sharedState.show': 'getResults'
  },
  mounted: function() {
      this.getResults();
  },
  methods: {
      getResults: function() {
          let _this = this;
          if (_this.sharedState.selected.lnglat && _this.sharedState.show.indexOf('schools') !== -1) {

              axios.get(`http://maps.co.mecklenburg.nc.us/api/query/v1/view_schools_magnet`,
                    {
                        params: {
                            'columns': `schl, schlname, address, city, ST_Distance(the_geom,ST_Transform(GeomFromText('POINT( ${Number(_this.sharedState.selected.lnglat[0])} ${Number(_this.sharedState.selected.lnglat[1])} )',4326), 2264)) as distance, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat`,
                            'sort': 'distance'
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsMagnet = response.data;
                    });

                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/cms_elementary_districts/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'columns': `name, address, ST_X(ST_Transform(schools.the_geom, 4326)) as lng, ST_Y(ST_Transform(schools.the_geom, 4326)) as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${Number(_this.sharedState.selected.lnglat[0])} ${Number(_this.sharedState.selected.lnglat[1])})',4326), 2264), schools.the_geom) as dist`,
                            'limit': 1,
                            'join': `schools;cms_elementary_districts.num = schools.schl`
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsElementary = response.data;
                    });

                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/cms_middle_districts/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'columns': `name, address, ST_X(ST_Transform(schools.the_geom, 4326)) as lng, ST_Y(ST_Transform(schools.the_geom, 4326)) as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${Number(_this.sharedState.selected.lnglat[0])} ${Number(_this.sharedState.selected.lnglat[1])} )',4326), 2264), schools.the_geom) as dist`,
                            'limit': 1,
                            'join': `schools;cms_middle_districts.num = schools.schl`
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsMiddle = response.data;
                    });

                axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/cms_high_districts/${_this.sharedState.selected.lnglat.join(',')}/4326`,
                    {
                        params: {
                            'columns': `zone, name, address, ST_X(ST_Transform(schools.the_geom, 4326)) as lng, ST_Y(ST_Transform(schools.the_geom, 4326)) as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${Number(_this.sharedState.selected.lnglat[0])} ${Number(_this.sharedState.selected.lnglat[1])} )',4326), 2264), schools.the_geom) as dist`,
                            'limit': 1,
                            'join': `schools;cms_high_districts.num = schools.schl`
                        }
                    })
                    .then(function(response) {
                        _this.privateState.resultsHigh = response.data;
                    });
            }
      },
      locationClick: function(rec) {
          this.sharedState.poi = {
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
