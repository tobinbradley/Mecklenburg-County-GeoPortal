<template>
  <div>
    <Subheading heading="NATIONAL" />
    <div v-if="officials.length > 0">
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
    name: "voting-national",
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
        house: null
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
        return this.officials.filter(rec => rec.branch.indexOf('US Senate') !== -1)
      },
      filterHouse() {
        let _this = this
        return this.officials.filter(rec => rec.branch.indexOf('US House of Representatives') !== -1 && rec.district === _this.house)
      },
      overlay() {
        let _this = this
        const url = `https://mcmap.org/api2/v1/intersect_point/national_congressional/${this.coords.join(",")},4326`
        const params = {
          geom_column: "the_geom",
          columns: "district"
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