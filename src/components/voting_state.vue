<template>
  <div>
    <Subheading heading="STATE" />
    <div v-if="officials.length > 0">
      <Representative :reps=filterGovernor() />
      <Representative :reps=filterSenate() />
      <Representative :reps=filterHouse() />
    </div>
  </div>
</template>

<script>
  import jsonToURL from "../js/jsontourl"
  import Subheading from './voting_subheading.vue'
  import Representative from './voting_representative.vue'
  
  export default {
    name: "voting-state",
    components: {
      Subheading: Subheading,
      Representative: Representative
    },
    props: {
      officials: {
        type: Array
      },
      coords: {
        type: Array
      }
    },
    data() {
      return {
        house: null,
        senate: null
      }
    },
    mounted: function() {
      if (this.coords) this.overlay();
    },
    watch: {
      coords: "overlay"
    },
    methods: {
      filterSenate() {
        let _this = this
        return this.officials.filter(rec => rec.branch.indexOf('NC State Senate') !== -1 && rec.district === _this.senate)
      },
      filterGovernor() {
        return this.officials.filter(rec => rec.branch.indexOf('Governor') !== -1 )
      },
      filterHouse() {
        let _this = this
        return this.officials.filter(rec => rec.branch.indexOf('NC House of Representatives') !== -1 && rec.district === _this.house)
      },
      overlay() {
        this.fetchHouse()
        this.fetchSenate()
      },
      fetchSenate() {
        let _this = this
        const url = `https://mcmap.org/api2/v1/intersect_point/state_senate/${this.coords.join(",")},4326`
        const params = {
          geom_column: "the_geom",
          columns: "senate as district"
        }
        fetch(`${url}?${jsonToURL(params)}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            _this.senate = data[0].district;
          })
          .catch(function(ex) {
            console.log("parsing failed", ex);
          });
      },
      fetchHouse() {
        let _this = this
        const url = `https://mcmap.org/api2/v1/intersect_point/state_house/${this.coords.join(",")},4326`
        const params = {
          geom_column: "the_geom",
          columns: "house as district"
        }
        fetch(`${url}?${jsonToURL(params)}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            _this.house = data[0].district;
          })
          .catch(function(ex) {
            console.log("parsing failed", ex);
          });
      }
    }
  }
</script>

<style scoped>

</style>