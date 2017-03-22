<template lang="html">
    <div v-if="results.length > 0" class="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop photos">
        <div class="mdl-card__title photo-big">
            <a v-bind:href="results[photoIndex].photo_url.trim()" target="_blank">
                <img v-bind:src="results[photoIndex].photo_url.trim()" />
            </a>

        </div>
        <div class="mdl-card__supporting-text mdl-typography--text-center ">
            {{ results[photoIndex].attribution}} &#8226; {{results[photoIndex].source}}
        </div>
        <div class="mdl-card__actions mdl-card--border photo-thumb">
            <img v-for="(item, index) in results" class="mdl-shadow--2dp"
                v-bind:src="item.photo_url.trim()" v-on:click="handleThumbClick(index)" v-on:error="handleError(index)" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'photos',
    data: function() {
        return {
            results: [],
            photoIndex: 0
        }
    },
    mounted: function() {
        this.getResults();
    },
    watch: {
        "$parent.$parent.sharedState.selected.pid": "getResults"
    },
    methods: {
        getResults: function() {
            let _this = this;
            if (_this.$parent.$parent.sharedState.selected && _this.$parent.$parent.sharedState.selected.pid) {
                _this.photoIndex = 0;
                axios.get('https://mcmap.org/rest/v2/ws_misc_house_photos.php',
                {
                    params: {
                        'pid': _this.$parent.$parent.sharedState.selected.pid,
                        'photo_source': 'mvideo,ilookabout'
                    },
                    timeout: 3000
                })
                .then(function(response) {
                    _this.results = response.data;
                });
            }
        },
        handleThumbClick: function(index) {
            this.photoIndex = index;
        },
        handleError: function() {
            this.results.splice(index, 1);
        }
    }

}
</script>

<style lang="css">
.photos {
    margin-top: 15px;
}
</style>
