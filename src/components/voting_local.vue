<template>
  <div v-if="city">
    <Subheading heading="LOCAL" />
    <div v-if="officials.length > 0">
      <Representative :reps=filterLocal() />      
    </div>      
  </div>
</template>

<script>
  import jsonToURL from "../js/jsontourl"
  import Subheading from './voting_subheading.vue'
  import Representative from './voting_representative.vue'
  
  export default {
    name: "voting-local",
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
        city: null,
        district: null
      }
    },
    mounted: function() {
      if (this.coords) this.fetchCity();
    },
    watch: {
      coords: "fetchCity"
    },
    methods: {
      filterLocal() {
        let _this = this
        return this.officials.filter(rec => rec.branch.indexOf(_this.city) !== -1
          && (
            rec.district === 'At-Large' || 
            rec.district === _this.district.toString() ||
            rec.district === ""
          )
        )
      },
      fetchCity() {
        let _this = this
        const url = `https://mcmap.org/api2/v1/intersect_point/city_council/${this.coords.join(",")},4326`
        const params = {
          geom_column: "the_geom",
          columns: "citydist as district"
        }
        fetch(`${url}?${jsonToURL(params)}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.length > 0) {
              _this.district = data[0].district
              _this.city = "Charlotte"
            }
            else {
              _this.fetchMore()
            }
          })
          .catch(function(ex) {
            console.log("parsing failed", ex);
          });
      },
      fetchMore() {
        let _this = this
        const url = `https://mcmap.org/api2/v1/intersect_point/jurisdictions/${this.coords.join(",")},4326`
        const params = {
          geom_column: "the_geom",
          columns: "name as city"
        }
        fetch(`${url}?${jsonToURL(params)}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.length > 0 && data[0].city !== "Stallings" && data[0].city !== "Mecklenburg") {
              _this.district = ""
              _this.city = data[0].city
            }
            else {
              _this.district = null
              _this.city = null
            }
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