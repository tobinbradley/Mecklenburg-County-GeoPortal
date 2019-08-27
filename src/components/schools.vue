<template>
    <div>
      <div class="flex-container">
        <HomeSchool :recs=current.elementary heading="ELEMENTARY" />
        <HomeSchool :recs=current.middle :future=future.middle heading="MIDDLE" />
        <HomeSchool :recs=current.high heading="HIGH" />
        <div class="report-record-highlight flex-item text-center" v-if="zone">
          <svg class="icon icon-bus"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bus"></use></svg>
          <h2>Your Transportation Zone is</h2>
          <h1>{{zone}}</h1>
        </div>
      </div>

      <div v-if="magnet">
        <table>
            <caption>Magnet Schools</caption>
            <thead>
                <tr>
                    <th>School</th>
                    <th>Address</th>
                    <th>Grades</th>
                    <th class="col-responsive text-right">Distance</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in magnet">
                    <td>
                        {{item.name}}{{ item.num | getAsterik }}
                        <span class="magnet-focus">{{item.mag_focus}}</span>
                    </td>
                    <td>
                        <a href="javascript:void(0)" v-on:click="locationClick(magnet[index])">
                                {{item.address}}, {{item.city}}</a>
                    </td>
                    <td>
                      {{item.grade_level}}
                    </td>
                    <td class="nowrap col-responsive text-right">
                        {{ item.distance | distance }}
                    </td>
                </tr>
            </tbody>
        </table>
      </div>

      <div class="report-moreinfo">
        <p>
            Transportation eligibility is determined by the transportation zone in which you live. The county is divided into three transportation zones: violet, blue and green. Magnet schools are assigned a zone to serve with transportation. If the distance
            is to the magnet greater than 5 miles, you may be assigned to a shuttle stop location. Some programs (*) provide county-wide transportation, meaning that regardless of your zone, you would receive transportation. For more information please
            contact Charlotte-Mecklenburg School Transportation Services at (980) 343-6715.
        </p>
        <h5>For more information, please visit:</h5>
        <ul class="list-unstyled">
            <li><a href="http://www.cms.k12.nc.us/" target="_blank"  rel="noopener">Charlotte-Mecklenburg Schools</a></li>
        </ul>
      </div>
  </div>
</template>

<script>
import jsonToURL from "../js/jsontourl";
import format from "format-number";
import HomeSchool from './schools_home.vue'

// Address to test multiple schools: 1001 BERKELEY AV CHARLOTTE NC 28203

export default {
  name: "schools",

  components: {
    HomeSchool
  },

  data: function() {
    return {
      magnet: [],
      cms_parcel: null,
      current: {
        elementary: null,
        middle: null,
        high: null,
      },
      future: {
        elementary: null,
        middle: null,
        high: null,
      },
      zone: null
    };
  },

  computed: {
    selected () {
      return this.$store.getters.selected
    },
    show () {
      return this.$store.getters.show
    }
  },

  watch: {
    selected: "getResults",
    show: "getResults"
  },

  filters: {
    distance: function(dist) {
      return format({
        truncate: 1,
        suffix: " miles"
      })(dist / 5280);
    },
    getAsterik: function(id) {
      if (
        [4429, 8364, 5532, 8482, 7405, 7496, 5520].indexOf(Number(id)) !== -1
      ) {
        return "*";
      } else {
        return "";
      }
    }
  },

  mounted: function() {
    this.getResults();
  },

  methods: {
    getResults: function() {
      let _this = this;
      if (
        _this.selected.lnglat &&
        _this.show.indexOf("schools") !== -1
      ) {

        // magnet schools
        _this.fetchMagnet()

        // current school assignments
        _this.fetchParcel('cms_parcels')
          .then( response => response.json())
          .then( response => {
            // set transportation zone
            _this.zone = response[0].high_zone

            // set record to get grade levels
            delete response[0].distance
            delete response[0].high_zone
            _this.cms_parcel = response[0]

            // set school numbers to grab
            let schlnums = [...new Set(Object.values(response[0]))] // unique values array

            return _this.fetchSchool('cms_schools', schlnums)
          })
          .then( response => response.json())
          .then( schools => {

            const grades = _this.cms_parcel
            const gradeKeys = Object.keys(grades)

            schools.forEach(school => {
              school.grades = []
              gradeKeys.forEach(grade => {
                if (grades[grade] === school.schlnum) {
                  school.grades.push(grade.replace("grade", "").replace("k", "0k"))
                }
              })
              school.grades.sort((a, b) => a.localeCompare(b, "en-US", {numeric: true, ignorePunctuation: true}))
              school.grades = school.grades.map(el => el === "0k" ? "K" : el)

            })

            _this.current.elementary = schools.filter(item => item.type.indexOf('ELEMENTARY') !== -1).sort((a,b) => {if (a.grades[0] < b.grades[0]) {return 1} else {return -1}})
            _this.current.middle = schools.filter(item => item.type.indexOf('MIDDLE') !== -1).sort((a,b) => {if (a.grades[0] > b.grades[0]) {return 1} else {return -1}})
            _this.current.high = schools.filter(item => item.type.indexOf('HIGH') !== -1).sort((a,b) => {if (a.grades[0] < b.grades[0]) {return 1} else {return -1}})
          })
          .catch(function(ex) {
            console.log("parsing failed", ex);
          });

        // future school assignments
        // _this.fetchParcel('cms_parcels_futyr')
        //   .then( response => response.json())
        //   .then( response => {

        //     // get schools
        //     let schlnums = [response[0].elem_num, response[0].midd_num, response[0].high_num];
        //     if (response[0].schl_other) {
        //       schlnums = schlnums.concat(response[0].schl_other.split(',').map(Number));
        //     }

        //     return _this.fetchSchool('cms_schools_futyr', schlnums)
        //   })
        //   .then( response => response.json())
        //   .then( schools => {
        //     _this.future.elementary = schools.filter(item => item.type.indexOf('ELEMENTARY') !== -1).sort((a,b) => {if (a.grade_level < b.grade_level) {return 1} else {return -1}})
        //     _this.future.middle = schools.filter(item => item.type.indexOf('MIDDLE') !== -1).sort((a,b) => {if (a.grade_level < b.grade_level) {return 1} else {return -1}})
        //     _this.future.high = schools.filter(item => item.type.indexOf('HIGH') !== -1).sort((a,b) => {if (a.grade_level < b.grade_level) {return 1} else {return -1}})
        //   })
        //   .catch(function(ex) {
        //     console.log("parsing failed", ex);
        //   });

      }
    },
    fetchParcel(table) {
      return fetch(`https://mcmap.org/api/nearest/v1/${table}/${this.selected.lnglat[0]},${this.selected.lnglat[1]}/4326?columns=high_zone,gradek,grade1,grade2,grade3,grade4,grade5,grade6,grade7,grade8,grade9,grade10,grade11,grade12&limit=1`)
    },
    fetchSchool(table = 'cms_schools', nums) {
      let _this = this

      return fetch(`https://mcmap.org/api/query/v1/${table}?columns=city,zipcode::int,num as schlnum,address,name,type,ST_Distance(geom,ST_Transform(GeomFromText('POINT( ${Number(_this.selected.lnglat[0])} ${Number(
        _this.selected.lnglat[1]
        )} )',4326), 2264)) as distance,st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat&filter=num in(${nums.join()})`)
    },
    fetchMagnet() {
      let _this = this

      fetch(`https://mcmap.org/api/query/v1/cms_schools?${jsonToURL({
        filter: "magnet in ('Full', 'Partial')",
        columns: `num,city,zipcode::int,address,name,type,grade_level,mag_focus,st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat,magnet,ST_Distance(geom,ST_Transform(GeomFromText('POINT( ${Number(_this.selected.lnglat[0]         )} ${Number(
            _this.selected.lnglat[1]
          )} )',4326), 2264)) as distance`,
          sort: 'distance'
          })}`)
        .then( response => response.json())
        .then( response => {
          _this.magnet = response;
        })
        .catch(function(ex) {
          console.log("parsing failed", ex);
        });
    },
    locationClick: function(rec) {
      this.$store.commit("poi", {
        lnglat: [rec.lng, rec.lat],
        address: rec.address,
        label: rec.name ? rec.name : rec.schlname
      })
    }
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.flex-item {
  flex-wrap: wrap;
}
.report-record-highlight {
  margin: 20px;
  text-align: center;
}
.magnet-focus {
  display: block;
  font-size: 0.85em;
  color: #6b6b6b;
}
</style>