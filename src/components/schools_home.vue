<template>
  <div class="report-record-highlight flex-item" v-if="recs">
    <svg class="icon icon-school"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-school"></use></svg>
    <h2>Your home schools for {{heading}} SCHOOL YEAR are</h2>

    <table style="margin-top: 20px">
      <thead>
        <tr>
          <th>School</th>
          <th>Grades</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in recs">
          <td>{{item.name.toUpperCase()}}</td>
          <td>{{item.grades.join(', ')}}</td>
          <td><a href="javascript:void(0)" v-on:click="locationClick(recs[index])">
              {{item.address}}</a>
              <br><small>{{ item.distance | distance }}</small>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  import format from "format-number";

  export default {
    name: 'schools_home',

    props: {
      recs: {
        type: Array
      },
      future: {
        type: Array
      },
      heading: {
        type: String
      }
    },

    filters: {
      distance: function(dist) {
        return format({
          truncate: 1,
          suffix: " miles"
        })(dist / 5280);
      }
    },

    methods: {
      locationClick(rec) {
        this.$store.commit("poi", {
          lnglat: [rec.lng, rec.lat],
          address: rec.address,
          label: rec.name ? rec.name : rec.schlname
        })
      }
    }
  }
</script>

<style scoped>
@import '../css/_variables.css';

.flex-item {
  flex-wrap: wrap;
}
.report-record-highlight {
  margin: 20px;
  text-align: center;
}
.schoolOverlap {
  font-style: regular;
  font-size: 0.9em;
  max-width: 300px;
}
.futureSchools {
  max-width: 300px;
  color: var(--colorIconic);
}
</style>