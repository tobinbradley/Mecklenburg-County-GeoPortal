<template>
<div>
  <iframe id="communityIframe" scrolling="no" style="width: 100%; height: 818px; border: none;" :src="iframeSrc"></iframe>

</div>
</template>

<script>
export default {
  name: "community",
  data: function() {
    return {
      iframeBase: "https://mcmap.org/community/",
      iframeSrc: "",
      defaultMetrics: "27,47,37"
    }
  },
  computed: {
    selected () {
      return this.$store.getters.selected
    },
    show () {
      return this.$store.getters.show
    }
  },

  mounted: function() {
    // if you have a lnglat, get getResults
    if (this.selected.lnglat) {
      this.getPolys();
    }

    window.onmessage = function(e) {
      let data = e.data;
      if (data.pageHeight) {
        document.querySelector("#communityIframe").style.height = `${data.pageHeight}px`
      }
    }
  },
  watch: {
    selected: "getPolys"
  },
  methods: {
    getPolys: function() {
        fetch(`https://mcmap.org/api/intersect_point/v1/neighborhoods/${this.selected.lnglat.join(",")}/4326?geom_column=the_geom&columns=id&limit=1`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            if (data.length > 0) this.setIframe(data[0].id)
          })
          .catch(ex => {
            console.log("parsing failed", ex);
          })
    },

    setIframe: function(polyid) {
      this.iframeSrc = `${this.iframeBase}#${this.defaultMetrics}/npa.geojson.json:${polyid}`
    }
  }
};
</script>