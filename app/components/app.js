import Introduction from "./introduction";
import Parks from "./parks";
import Libraries from "./libraries";
import Property from "./property";
import Impervious from "./impervious";
import Schools from "./schools";
import Trash from "./trash";
import Environment from "./environment";
import Voting from "./voting";
import QualityOfLife from "./qualityoflife";

let template = `
    <component :is="privateState.show">
    </component>
`;

export default {
  name: "app",
  template: template,
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
