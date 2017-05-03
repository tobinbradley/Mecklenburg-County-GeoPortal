<template lang="html">
    <div style="width: 100%;">
        <div class="mdl-cell mdl-cell--12-col">
            <div class="search-container mdl-typography--text-center">
                <div class="search-input-container">
                    <input type="text" aria-label="search" name="search-input" class="search-input" autocomplete="off" placeholder="Tell me about..." v-on:focus="search()" v-model="privateState.query" />
                    <span class="bar"></span>
                    <p class="mdl-typography--text-left muted">Try typing part of an address, like <em>700 N</em>. <span v-if="privateState.gps">Or we can <a href="javascript:void(0)" @click="geoLocation">take a guess</a>.</span></p>
                    <p class="mdl-typography--text-center muted print-only">GeoPortal &bull; Mecklenburg County GIS</p>
                </div>
            </div>
        </div>
        <div class="mdl-cell mdl-cell--12-col">
            <div id="search-results">
                <ul v-for="(item, index) in privateState.results">
                    <li v-on:click="select(index)">
                        <span class='search-result-type'>{{ item.type }}</span>
                        <span class='search-result-label'>{{ item.label }}</span>
                        <i role="presentation" class="material-icons">keyboard_arrow_right</i>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import jsonToURL from '../modules/jsontourl';
import debounce from 'lodash.debounce';
import fetchNearest from '../modules/nearest';

export default {
    name: 'search',
    watch: {
         'privateState.query': 'search'
    },
    mounted: function() {
        if (navigator.geolocation && location.protocol === 'https:') {
            this.privateState.gps = true;
        }
    },
    methods: {
        search: function() {
            let _this = this;
            let query = _this.privateState.query.trim();

            let debounceSearch = debounce(function() {
                _this.getResults(query);
            }, 250);
            if(query.length >= 4) { debounceSearch(); }
        },
        geoLocation: function() {
            let _this = this;
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    fetchNearest(position.coords.latitude, position.coords.longitude, _this.sharedState);
                });
            }
        },
        getResults: function(query) {
            let _this = this;
            let params = {
                'tables': 'address,park,library,school,pid,business'
            };

            fetch(`https://mcmap.org/api/search/v1/${query.toLowerCase()}?${jsonToURL(params)}`)
                .then(function(response) {
                    return response.json();
                }).then(function(data) {
                    _this.privateState.results = data;
                }).catch(function(ex) {
                    console.log('parsing failed', ex);
                });
            
        },
        select: function(index) {
            let _this = this;
            let rec = _this.privateState.results[index];
            _this.sharedState.selected = {
                'lnglat': [rec.lng, rec.lat],
                'label': rec.type,
                'address': rec.address,
                'pid': rec.pid
            };
            _this.privateState.results = [];
            let intro = _this.sharedState.show.indexOf('introduction');
            if (intro !== -1) {
                _this.sharedState.show.splice(intro, 1);
            }
            // push state
            history.replaceState(null, null, `?q=${_this.sharedState.show}&latlng=${_this.sharedState.selected.lnglat[1]},${_this.sharedState.selected.lnglat[0]}`);
        }
    }
}
</script>


<style lang="css">
/*Search input formatting*/
.search-input {
    width: 100%;
    /*border: 1px solid rgba(0, 0, 0, 0.05);*/
    border: none;
    border-bottom: 2px solid #757575;
    padding: 5px;
    border-radius: 3px;
    box-sizing: border-box;
    color: rgb(0,145,234);
    font-size: 32px;
}
.search-input:focus {
    outline: none;
}
.search-container {
    margin: 20px 0 10px;
}
.search-input-container {
    width: 80%;
    margin: 0 auto;
}
.search-input-container p {
    padding-left: 5px;
    margin-bottom: 0;
}
@media (max-width: 1000px) {
    .search-input, .search-header { font-size: 26px; }
}
@media (max-width: 700px) {
    .search-input, .search-header { font-size: 20px; }
    .search-input-container { width: 100%; }
}


/* The bar under the search box ala MDL */
.bar {
    position: relative;
    display: block;
    width: 100%;
}
.bar:before, .bar:after {
    content: '';
    height: 3px;
    width: 0;
    bottom: 1px;
    position: absolute;
    background: rgb(0,145,234);
    transition: 0.4s ease all;
}
.bar:before {
    left: 50%;
}
.bar:after {
    right: 50%;
}
.search-input:focus ~ .bar:before, .search-input:focus ~ .bar:after {
    width: 50%;
}

/*Search results formatting*/
#search-results {
    column-count: 2;
    column-gap: 35px;
}
#search-results ul {
    padding: 0;
    margin: 0;
}
#search-results li {
    list-style-type:none;
    padding: 7px;
    border: 1px solid rgb(0,145,234);
    border-radius: 3px;
    margin: 5px 0 5px 0;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    transition: 0.2s ease all;
    color: rgb(0,145,234);
}
#search-results li:hover {
    background: rgb(0,145,234);
    color: white;
}
#search-results .search-result-label {
    text-decoration: none;
    padding-left: 6px;
}
#search-results i, #search-results span {
    pointer-events: none;
}

#search-results .material-icons {
    display: inline-block;
    float: right;
}
.search-result-type {
    background-color: rgb(0,145,234);
    color: white;
    padding: 3px;
    font-weight: bold;
    border-radius: 3px;
}

@media (max-width: 900px) {
    #search-results {
        column-count: 1;
    }
}

</style>
