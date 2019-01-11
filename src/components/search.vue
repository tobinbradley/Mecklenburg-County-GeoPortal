<template>
  <div>
    <div class="search-input-container">
      <el-autocomplete
            class="inline-input"
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="Tell me about..."
            :trigger-on-focus="false"
            @select="handleSelect"
            clearable
            @focus="focus"
            @blur="blur"
            @clear="focus"
            autofocus
          >
          <template slot-scope="{ item }">
            <!-- <span class="link">{{ item.type }}</span> -->
            <div class="value">
              <svg class="icon icon-location">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-location"></use>
              </svg> 
              {{ item.value }}
            </div>            
          </template>
         </el-autocomplete>
      <div class="border no-print"></div>
      <p class="muted no-print">Try typing part of an address, like <em>700 N</em>. Or we can <a href="javascript:void(0)" @click="geoLocation">take a guess</a>.</p>                    
    </div>
  </div>
</template>

<script>
  import jsonToURL from '../js/jsontourl.js'
  import { setHash } from '../js/history'
  import fetchNearest from '../js/nearest'

  export default {
    data() {
      return {
        links: [],
        state: ''
      };
    },
    watch: {
      "sharedState.selected": "updateState"
    },
    mounted: function() {
      // fix up some ally stuff
      document.querySelector('.el-input__inner').setAttribute('aria-label', 'search')
      document.querySelector('.el-input__inner').removeAttribute('aria-autocomplete')
      document.querySelector('.el-input__inner').removeAttribute('aria-controls')
      document.querySelector('.el-input__inner').removeAttribute('aria-activedescendant')
    },
    methods: {
      updateState() {
        if (this.state !== this.sharedState.selected.address) {
          this.state = this.sharedState.selected.address
        }
      },
      async querySearch(queryString, cb) {
        if (queryString.trim().length < 4) {
          cb([])
          return
        }
        // arrays - fetch (p), results (r), suggestions (s)
        // address
        const addressURL = 'https://mcmap.org/api2/v1/query/master_address_table'
        const addressArg = {
          columns: "objectid as id, full_address as value, 'ADDRESS' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid, full_address as address",
          limit: 8,
          filter: `ts @@ to_tsquery('addressing_en', '${queryString.trim().toUpperCase().replace(/ /g, '&') + ':*'}') and cde_status='A' and num_x_coord > 0`          
        }
        const p1 = fetch(`${addressURL}?${jsonToURL(addressArg)}`)

        //park
        const parkURL = 'https://mcmap.org/api2/v1/query/parks p, tax_parcels t'
        const parkArg = {
          columns: `p.gid as id, prkname as value, 'PARK' as type, round(ST_X(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lat, t.pid as pid, prkaddr as address`,
          limit: 5,
          filter: `prkname ilike '%${queryString.trim()}%' and p.the_geom && t.the_geom`          
        }
        const p2 = fetch(`${parkURL}?${jsonToURL(parkArg)}`)

        // library
        const libraryURL = 'https://mcmap.org/api2/v1/query/libraries l, tax_parcels p'
        const libraryArg = {
          columns: `l.gid as id, name as value, 'LIBRARY' as type, round(ST_X(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lat, p.pid as pid, address`,
          limit: 5,
          filter: `name ilike '%${queryString.trim()}%' and l.the_geom && p.the_geom`          
        }
        const p3 = fetch(`${libraryURL}?${jsonToURL(libraryArg)}`)

        // pid
        const pidURL = 'https://mcmap.org/api2/v1/query/master_address_table'
        const pidArg = {
          columns: `objectid as id, num_parent_parcel as value, 'TAX PARCEL' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid, full_address as address`,
          limit: 5,
          filter: `num_parent_parcel = '${queryString.trim()}' and num_x_coord > 0 and cde_status='A'`          
        }
        const p4 = fetch(`${pidURL}?${jsonToURL(pidArg)}`)
        
        // business
        // school        
        
        const [r1, r2, r3, r4] = await Promise.all([p1, p2, p3, p4])
        const [s1, s2, s3, s4] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json()])

        cb([...s1, ...s2, ...s3, ...s4])
      },      
      handleSelect(item) {
        // write all the data
        this.sharedState.selected = {
          lnglat: [item.lng, item.lat],
          label: item.type,
          address: item.address,
          pid: item.pid
        }      
        setHash(this.sharedState.selected.lnglat, this.sharedState.show)
      },
      geoLocation() {
        let _this = this;
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
            fetchNearest(
              position.coords.latitude,
              position.coords.longitude,
              _this.sharedState
            );
          });
        }
      },      
      focus() {
        document.querySelector(".border").classList.add('active')
        document.querySelector(".el-input__inner").focus();
      },
      blur() {
        document.querySelector(".border").classList.remove('active')
      }
    }
  }
</script>

<style>
.search-input-container {
  width: 80%;
  margin: 0 auto;
}
.search-input-container p {
    padding-left: 5px;
    margin: 0;
}

.el-autocomplete {
  display: block;
}
.el-input__inner {
  border: none;
  border-bottom: 1px solid #757575;
  border-radius: 0;
  font-size: 2em;
  color: var(--colorIconic);
  display: block;
  padding: 5px 5px 0;
}

.el-autocomplete-suggestion__list {
 margin-bottom: 10px;
 /* column-count: 2;
 column-gap: 10px; */
}
.el-autocomplete-suggestion__list li {
  font-size: 1.1em;
  /* margin: 0 0 5px; */
  padding: 4px 20px;
  line-height: inherit;  
}

.el-autocomplete-suggestion__list li .value {
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.el-autocomplete-suggestion__list li svg {
  color: var(--colorIconic);
  margin-right: 8px;
}
.el-autocomplete-suggestion__list li .link {
  font-size: 0.7em;
  color: #b4b4b4;
}

.border {
  position: relative;
  top: -2px;
  width: 0;
  height: 3px;
  background-color: var(--colorIconic);
  transition: width .5s ease-in-out;
}
.border.active {
  width: 100%;    
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@media (max-width: 900px) {
  .el-autocomplete-suggestion__list {
    column-count: 1;
  }
}
@media (max-width: 700px) {
  .el-input__inner {
    font-size: 20px;
  }
  .search-input-container {
    width: 100%;
    margin-top: 20px;
  }
}
@media print {
  .el-input__inner {
    text-align: center;
    padding: none;
  }
}
</style>