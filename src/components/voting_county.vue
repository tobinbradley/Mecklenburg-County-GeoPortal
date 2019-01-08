<template>
  <div>
    <Subheading heading="COUNTY" />
    <div v-if="officials.length > 0">
      <Representative :reps=filterCommission() />      
      <Representative :reps=filterEducation() /> 
    </div>      
  </div>
</template>

<script>
  import jsonToURL from "../js/jsontourl"
  import Subheading from './voting_subheading.vue'
  import Representative from './voting_representative.vue'
  
  export default {
    name: "voting-county",
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
        commission: null,
        education: null
      }
    },
    mounted: function() {
      if (this.coords) this.overlay();
    },
    watch: {
      coords: "overlay"
    },
    methods: {
      filterCommission() {
        let _this = this
        return this.officials.filter(rec => rec.branch.indexOf('Board of Commissioners') !== -1
          && (
            rec.district === 'At-Large' || rec.district === _this.commission
          )
        ).reverse()
      },
      filterEducation() {
        let _this = this
        return this.officials.filter(rec => rec.branch.indexOf('Board of Education') !== -1 
          && ( rec.district === _this.education || rec.district === 'At-Large' )
        ).reverse()
      },
      overlay() {
        let _this = this
        const url = `https://mcmap.org/api2/v1/intersect_point/voting_precincts/${this.coords.join(",")},4326`
        const params = {
          geom_column: "the_geom",
          columns: "cc, school"
        }
        fetch(`${url}?${jsonToURL(params)}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            _this.commission = data[0].cc
            _this.education = data[0].school
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