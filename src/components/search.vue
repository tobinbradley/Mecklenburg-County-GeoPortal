<template>
  <div class="autosuggest__container">
    <input
      id="autosuggest__input"
      type="search"
      @input="onChange"
      v-model="search"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @focus="focus"
      @blur="blur"
      placeholder="Tell me about..."
      aria-label="search for address, parks, libraries, and parcel id's"
      autocomplete="off"
      ref='search'
    />
    <div class="border no-print"></div>    
    <ul
      id="autocomplete-results"
      v-show="isOpen"
      class="autocomplete-results"
    >
      <li
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
        :focus="i === arrowCounter"
      >
        <svg class="icon" :class="setIcon(result.type)">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="setIcon(result.type, true)"></use>
        </svg>  {{ result.value }}
      </li>
    </ul>
    <p class="muted no-print text-center">Try typing part of an address, like <em>700 N</em>. Or we can <a href="javascript:void(0)" @click="geoLocation">take a guess</a>.</p>
    <Toggle />
  </div>
</template>

<script>

  import jsonToURL from '../js/jsontourl.js'
  import { setHash } from '../js/history'
  import fetchNearest from '../js/nearest'
  import Toggle from './toggle.vue'

  export default {
    name: 'search',

    components: {
      Toggle: Toggle
    },

    data() {
      return {
        isOpen: false,
        results: [],
        search: '',
        arrowCounter: 0,
        minLength: 4,
        items: []
      };
    },

    computed: {
      selected () {
        return this.$store.getters.selected
      }
    },

    methods: {
      setIcon(value, isId = false) {        
        if (value === 'ADDRESS') value = 'icon-location'
        if (value === 'PARK') value = 'icon-park'
        if (value === 'LIBRARY') value = 'icon-library'
        if (value === 'TAX PARCEL') value = 'icon-property'
        if (isId) value = `#${value}`
        return value
      },
      onChange() {
        if (this.search.length < this.minLength) {
          this.results = []
          this.isOpen = false
          return
        }

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.fetchData(this.search)
        }, 250);
        
        // Let's warn the parent that a change was made
        this.$emit('input', this.search);
      },

      async fetchData(queryString) {
        // address
        const addressURL = 'https://mcmap.org/api2/v1/query/master_address_table'
        const addressArg = {
          columns: "full_address as value, 'ADDRESS' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid, full_address as address",
          limit: 8,
          filter: `ts @@ to_tsquery('addressing_en', '${queryString.trim().toUpperCase().replace(/ /g, '&') + ':*'}') and cde_status='A' and num_x_coord > 0`          
        }
        const p1 = fetch(`${addressURL}?${jsonToURL(addressArg)}`)
        //park
        const parkURL = 'https://mcmap.org/api2/v1/query/parks p, tax_parcels t'
        const parkArg = {
          columns: `prkname as value, 'PARK' as type, round(ST_X(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(p.the_geom, 4326))::NUMERIC,4) as lat, t.pid as pid, prkaddr as address`,
          limit: 5,
          filter: `prkname ilike '%${queryString.trim()}%' and p.the_geom && t.the_geom`          
        }
        const p2 = fetch(`${parkURL}?${jsonToURL(parkArg)}`)
        // library
        const libraryURL = 'https://mcmap.org/api2/v1/query/libraries l, tax_parcels p'
        const libraryArg = {
          columns: `name as value, 'LIBRARY' as type, round(ST_X(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(l.the_geom, 4326))::NUMERIC,4) as lat, p.pid as pid, address`,
          limit: 5,
          filter: `name ilike '%${queryString.trim()}%' and l.the_geom && p.the_geom`          
        }
        const p3 = fetch(`${libraryURL}?${jsonToURL(libraryArg)}`)
        // pid
        const pidURL = 'https://mcmap.org/api2/v1/query/master_address_table'
        const pidArg = {
          columns: `num_parent_parcel as value, 'TAX PARCEL' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid, full_address as address`,
          limit: 5,
          filter: `num_parent_parcel = '${queryString.trim()}' and num_x_coord > 0 and cde_status='A'`          
        }
        const p4 = fetch(`${pidURL}?${jsonToURL(pidArg)}`)     
        
        const [r1, r2, r3, r4] = await Promise.all([p1, p2, p3, p4])
        const [s1, s2, s3, s4] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json()])
        this.results = [...s1, ...s2, ...s3, ...s4]
        this.results.length > 0 ? this.isOpen = true : this.isOpen = false
      },

      setResult(result) {
        //this.search = result.value
        this.isOpen = false
        this.arrowCounter = -1;
        this.$store.commit("selected", {
          lnglat: [result.lng, result.lat],
          label: result.type,
          address: result.address,
          pid: result.pid
        })     
        setHash(this.$store.getters.selected.lnglat, this.$store.getters.selected.show)
      },
      onArrowDown(evt) {
        if (this.arrowCounter < this.results.length) {
          this.arrowCounter = this.arrowCounter + 1;
        }
      },
      onArrowUp() {
        if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter -1;
        }
      },
      onEnter() {
        this.setResult(this.results[this.arrowCounter])
      },
      geoLocation() {
        let _this = this;
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
            fetchNearest(
              position.coords.latitude,
              position.coords.longitude
            )
            .then(data => {
              _this.$store.commit("selected", {
                  lnglat: [data.lng, data.lat],
                  label: data.label,
                  address: data.address,
                  pid: data.pid
              })
            })
          })
        }
      },
      focus() {
        document.querySelector(".border").classList.add('active')
      },
      blur() {      
        document.querySelector(".border").classList.remove('active')
        this.arrowCounter = -1
      },
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.isOpen = false
          this.arrowCounter = -1
        }
      }
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
      this.$nextTick(() => this.$refs.search.focus())
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    },
    watch: {
      items: function (val, oldVal) {
        // actually compare them
        if (val.length !== oldVal.length) {
          this.results = val;
        }
      },
      selected: function(val, oldVal) {
        this.search = val.address
      }      
    }
  }
</script>

<style>
@import '../css/_variables.css';

.autosuggest__container {
  width: 80%;
  margin: 0 auto;
  position: relative;
  & p {
    padding-left: 5px;
    margin: 0;
  }
}

#autosuggest__input {
  border: none;
  border-bottom: 1px solid #757575;
  border-radius: 0;
  font-size: 2em;
  color: var(--colorIconic);
  background: white;
  /* caret-color: #ddd; */
  display: block;
  padding: 5px 5px 0;
  outline: none;
  position: relative;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
#autosuggest__input::selection {
  background: var(--colorIconic); 
  color: white;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  box-shadow: 1px 1px 2px #666;
  background: white;
  max-height: 80vh;
  overflow: auto;
  width: 100%;
  position: absolute;
  z-index: 10000001;
  & svg {
    position: relative;
    top: -2px;
    margin-right: 3px;
  }
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 10px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: var(--colorIconic);
  color: white;
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

/* Shake your moneymaker */
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

/* responsive and print */
@media (max-width: 700px) {
  #autosuggest__input {
    font-size: 20px;
  }
  .autosuggest__container {
    width: 100%;
    margin-top: 32px;
  }
}
@media print {
  #autosuggest__input {
    text-align: center;
    padding: none;
  }
}
</style>