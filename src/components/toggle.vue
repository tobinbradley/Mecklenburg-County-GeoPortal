<template>
  <div class="text-center no-print">
    <a href="javascript:void(0)" @click="toggleMap">{{ toggleMapText }}</a>
    |
    <a href="javascript:void(0)" @click="togglePrint">Print</a>
  </div>
</template>

<script>
  export default {
    computed: {
      toggleMapText() {
        return this.$store.getters.drawMap ? 'Hide Map' : 'Show Map' 
      }
    },

    methods: {
      toggleMap() {
        this.$store.getters.drawMap ? this.$store.commit("drawMap", false) : this.$store.commit("drawMap", true)
      },
      togglePrint() {
        window.print()
      }
    }

  }
</script>

