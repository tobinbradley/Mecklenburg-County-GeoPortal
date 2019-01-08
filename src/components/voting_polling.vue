<template>
  <div class="text-center">
      <div class="report-record-highlight" v-if="poll">
          <svg class="icon icon-voting"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-voting"></use></svg>
          <h2>Your Polling Location is</h2>
          <h1>{{poll.name}}</h1>
          <h3><a href="javascript:void(0)" v-on:click="locationClick(poll)">
                      {{poll.address}}</a></h3>
          <h4>Precinct {{poll.precno}}</h4>
          <h4>{{poll.distance | distance}}</h4>
      </div>
  </div>
</template>

<script>
  import jsonToURL from "../js/jsontourl"
  import format from "format-number";

  export default {
    name: "voting-polling",
    mounted: function() {
      if (this.coords) this.fetch();
    },
    data() {
      return {
        poll: null
      }
    },
    watch: {
      coords: 'fetch'
    },
    props: {
      coords: {
        type: Array,
        default: null
      }
    },
    filters: {
      distance(dist) {
        return format({
          truncate: 1,
          suffix: " miles"
        })(dist / 5280);
      }
    },
    methods: {
      locationClick(rec) {
        this.$parent.$parent.sharedState.poi = {
        lnglat: [rec.lng, rec.lat],
        address: rec.address,
        label: rec.name
      };
     },
      fetch() {
        let _this = this
        const url = `https://mcmap.org/api2/v1/intersect_point/voting_precincts%2C%20polling_locations%20pl/${this.coords.join(",")},4326`
        const params = {
          geom_column: "voting_precincts.the_geom",
          columns: `pl.name, 
            pl.address, 
            voting_precincts.precno,
            st_x(st_transform(pl.the_geom, 4326)) as lng,
            st_y(st_transform(pl.the_geom, 4326)) as lat,
            ST_Distance(pl.the_geom,ST_Transform(GeomFromText('POINT(${Number(
                _this.coords[0]
            )} ${Number(
              _this.coords[1]
            )})',4326), 2264)) as distance
            `,
          filter: 'voting_precincts.precno = pl.precno'
        }
        fetch(`${url}?${jsonToURL(params)}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            _this.poll = data[0]
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