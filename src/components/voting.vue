<template>
    <div>
      <Poll :coords=selected.lnglat />
      <National :officials=resultsOfficials :coords=selected.lnglat />
      <State :officials=resultsOfficials :coords=selected.lnglat />
      <County :officials=resultsOfficials :coords=selected.lnglat />
      <Local :officials=resultsOfficials :coords=selected.lnglat />
    </div>
</template>

<script>
import jsonToURL from '../js/jsontourl'
import format from 'format-number'
import National from './voting_national'
import State from './voting_state'
import County from './voting_county'
import Local from './voting_local'
import Poll from './voting_polling'

export default {
  name: "voting",
  components: {
    National: National,
    State: State,
    County: County,
    Local: Local,
    Poll: Poll
  },

  data: function() {
    return {
      resultsOfficials: []
    };
  },

  mounted: function() {
    this.getOfficials();
  },

  computed: {
    selected () {
      return this.$store.getters.selected
    },
    show () {
      return this.$store.getters.show
    }
  },
  
  methods: {
    apiFetch: function(params, url, setter) {
      let _this = this;
      return fetch(`${url}?${jsonToURL(params)}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          _this[setter] = data;
        })
        .catch(function(ex) {
          console.log("parsing failed", ex);
        });
    },
    getOfficials: function() {
      let _this = this;
      _this.apiFetch(
        {},
        "https://mcmap.org/api2/v1/query/boe_elected_officials",
        "resultsOfficials"
      );
    }
  }
};
</script>