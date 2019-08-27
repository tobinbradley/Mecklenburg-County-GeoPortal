<template>
  <div>
    <MapGL v-if="drawMap" />
    <component :is="show"></component>
  </div>
</template>

<script>

import Introduction from "./introduction.vue";
import Parks from "./parks.vue";
import Libraries from "./libraries.vue";
import Property from "./property.vue";
import Impervious from "./impervious.vue";
import Schools from "./schools.vue";
import Trash from "./trash.vue";
import Environment from "./environment.vue";
import Voting from "./voting.vue";
//import QualityOfLife from "./qualityoflife.vue";
import Community from "./community"

import MapGL from "./map.vue"
import { setTimeout } from 'timers'

export default {
  name: "app",

  components: {
    welcome: Introduction,
    parks: Parks,
    libraries: Libraries,
    property: Property,
    impervious: Impervious,
    schools: Schools,
    trash: Trash,
    environment: Environment,
    voting: Voting,
    community: Community,
    MapGL: MapGL
  },

  computed: {
    selected () {
      return this.$store.getters.selected
    },
    tab () {
      return this.$store.getters.show
    },
    show() {
      return this.selected.lnglat ? this.tab : 'welcome'
    },
    drawMap() {
      return this.$store.getters.drawMap
    }
  },

  watch: {
    selected: "gotRecord",
    show: "gotTab",
    tab: "gotTab"
  },

  methods: {
    gotRecord: function() {
      if (this.$store.getters.show === "welcome") {
        this.$store.commit('show', 'schools')
        let navlinks = document.querySelectorAll(".sidebar .nav a");
        for (let i = 0; i < navlinks.length; i++) {
          navlinks[i].classList.remove("active");
        }
        let elem = document.querySelector(`a[data-load="schools"]`);
        elem.classList.add("active");
      }
    },
    gotTab: function() {
      let _this = this
      document.querySelector('.content').classList.remove('isOpen')
      // die IE11, die. Can't do classlist on SVG element.
      try {
        document.querySelector('.ham').classList.remove('active')
      }
      catch(error) {
        console.error(error);
      }

      if (!this.selected.lnglat) {
        const search = document.querySelector('#autosuggest__input')
        search.focus()
        search.classList.add('shake')
        setTimeout(function(){ search.classList.remove('shake') }, 750);
      }
    }
  }
};
</script>
