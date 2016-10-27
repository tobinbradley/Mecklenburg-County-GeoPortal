<template lang="html">
    <div v-if="privateState.results.length > 0" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop mdl-color-text--blue-grey-50 photos">
        <div class="mdl-card__title mdl-color--teal-300 photo-big">
            <a v-bind:href="privateState.results[privateState.photoIndex].photo_url.trim()" target="_blank">
                <img v-bind:src="privateState.results[privateState.photoIndex].photo_url.trim()" />
            </a>

        </div>
        <div class="mdl-card__supporting-text mdl-typography--text-center ">
            {{ privateState.results[privateState.photoIndex].attribution}} &#8226; {{privateState.results[privateState.photoIndex].source}}
        </div>
        <div class="mdl-card__actions mdl-card--border photo-thumb">
            <img v-for="(item, index) in privateState.results" class="mdl-shadow--2dp"
                v-bind:src="item.photo_url.trim()" v-on:click="handleThumbClick(index)" v-on:error="handleError(index)" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'photos',
    mounted: function() {
        this.getResults();
    },
    watch: {
        "sharedState.selected.pid": "getResults"
    },
    methods: {
        getResults: function() {
            let _this = this;
            if (_this.sharedState.selected.pid) {
                _this.privateState.photoIndex = 0;
                axios.get('http://maps.co.mecklenburg.nc.us/rest/v2/ws_misc_house_photos.php',
                {
                    params: {
                        'pid': _this.sharedState.selected.pid,
                        'photo_source': 'mvideo,ilookabout'
                    },
                    timeout: 3000
                })
                .then(function(response) {
                    _this.privateState.results = response.data;
                });
            }
        },
        handleThumbClick: function(index) {
            this.privateState.photoIndex = index;
        },
        handleError: function() {
            this.privateState.results.splice(index, 1);
        }
    }

}
</script>

<style lang="css">
</style>
