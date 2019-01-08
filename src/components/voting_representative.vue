<template>
  <div class="flex-container">
      <div v-for="(item, index) in reps" class="report-record-highlight flex-item">
        <h2>{{item.branch}}</h2>
        <h1>{{item.representative}}</h1>
        <h4 v-html="item.link"></h4>
        <h4>{{item.address1}}</h4>
        <h4>{{item.address2}}</h4>
        <h4>{{item.phone}}</h4>          
      </div>
  </div>
  
</template>

<script>
  export default {
    props: {
      reps: {
        type: Array,
        default: []
      }
    }    
  }
</script>

<style scoped>
.flex-item {
  flex-wrap: wrap;
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.report-record-highlight {
  margin: 20px;
  text-align: center;
}
</style>