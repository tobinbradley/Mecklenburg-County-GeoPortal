<template>
<component :is="privateState.show">
    </component>
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
import QualityOfLife from "./qualityoflife.vue";

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
    qualityoflife: QualityOfLife
  },
  watch: {
    "sharedState.selected.lnglat": "gotRecord",
    "sharedState.show": "gotTab"
  },
  mounted: function() {
    this.gotTab();
  },
  methods: {
    gotRecord: function() {
      if (this.sharedState.show === "welcome") {
        this.sharedState.show = "schools";
        let navlinks = document.querySelectorAll(".sidebar .nav a");
        for (let i = 0; i < navlinks.length; i++) {
          navlinks[i].classList.remove("active");
        }
        let elem = document.querySelector(`a[data-load="schools"]`);
        elem.classList.add("active");
      } else {
        this.privateState.show = this.sharedState.show;
      }
    },
    gotTab: function() {
      if (
        this.sharedState.selected.lnglat ||
        this.sharedState.show === "qualityoflife"
      ) {
        this.privateState.show = this.sharedState.show;
      } else {
        this.privateState.show = "welcome";
      }
    }
  }
};
</script>
