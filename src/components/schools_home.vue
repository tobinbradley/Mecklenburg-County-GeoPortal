<template>
  <div class="report-record-highlight flex-item" v-if="recs.length > 0">
    <svg class="icon icon-school"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-school"></use></svg>
    <h2>Your {{heading}} school<span v-if="recs.length > 1">s</span> {{ recs.length > 1 ? 'are' : 'is' }}</h2>
    <template v-for="(item, index) in recs">
    <h1>{{item.name.toUpperCase()}}</h1>
    <h3>
      Grades {{item.grade_level}}<span v-if="detectOverlap(recs)">*</span>
    </h3>
    <h3><a href="javascript:void(0)" v-on:click="locationClick(recs[index])">
            {{item.address}}</a></h3>
    <h4>{{ item.distance | distance }}</h4>                
    </template>
    <h4 v-if="detectOverlap(recs)" class="schoolOverlap">      
      *If the grade your child is entering 
      is available at more than one of the {{heading}} schools above, 
      please contact Charlotte-Mecklenburg Schools at (980) 343-5335 for your 
      home school placement.
    </h4>
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
      detectOverlap(arr) {
        if (arr.length < 2) return false

        let fixedArr = []

        for (var value of arr) {
          fixedArr.push(value.grade_level.replace(/k/ig, '0').split('-').map(Number))
        }

        let totalRange = Math.max(...fixedArr.map(x => x[1])) - Math.min(...fixedArr.map(x => x[0]))
        let sumOfRanges = fixedArr.map(x => x[1] - x[0]).reduce((a, b) => a + b, 0)

        return (sumOfRanges >= totalRange)      
      },
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
</style>