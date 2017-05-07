<template lang="html">
    <div>
        <div class="mdl-typography--text-center" v-if="results">
            <div class="report-record-highlight">
                <i class="icon icon-library"></i>
                <h2>Your closest library is</h2>
                <h1>{{ results[0].name }}</h1>
                <h3>
                    <a href="javascript:void(0)" v-on:click="locationClick(0)">
                            {{ results[0].address }}, {{ results[0].city}}
                        </a>
                </h3>
                <h4>
                    {{ results[0].distance | distance }}
                </h4>
            </div>
            <table class="mdl-data-table mdl-js-data-table">
                <caption>Libraries Nearby</caption>
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Park</th>
                        <th class="mdl-data-table__cell--non-numeric">Address</th>
                        <th class="col-responsive">Distance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in results">
                        <td class="mdl-data-table__cell--non-numeric">
                            {{ item.name }}
                        </td>
                        <td class="mdl-data-table__cell--non-numeric">
                            <a href="javascript:void(0)" v-on:click="locationClick(index)">
                                    {{ item.address }}, {{item.city}}
                                </a>
                        </td>
                        <td class="nowrap col-responsive">
                            {{ item.distance | distance }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="report-moreinfo mdl-typography--text-left">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://www.plcmc.org/" target="_blank">Charlotte Mecklenburg Library</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import jsonToURL from '../modules/jsontourl';
    import format from 'format-number';
    export default {
        name: 'libraries',
        data: function() {
            return {
                results: null
            }
        },
        filters: {
            distance: function(dist) {
                return format({
                    'truncate': 1,
                    'suffix': ' miles'
                })(dist / 5280);
            }
        },
        watch: {
            '$parent.sharedState.selected.lnglat': 'getResults',
            '$parent.sharedState.show': 'getResults'
        },
        mounted: function() {
            this.getResults();
        },
        methods: {
            getResults: function() {
                let _this = this;
                if (_this.$parent.sharedState.selected.lnglat && _this.$parent.sharedState.show.indexOf('libraries') !== -1) {
                    let params = {
                        'geom_column': 'the_geom',
                        'columns': 'name, address, city, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat',
                        'limit': '5'
                    };
                    fetch(`https://mcmap.org/api/nearest/v1/libraries/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326?${jsonToURL(params)}`)
                        .then(function(response) {
                            return response.json();
                        }).then(function(data) {
                            _this.results = data;
                        }).catch(function(ex) {
                            console.log('parsing failed', ex);
                        });
                }
            },
            locationClick: function(index) {
                let poi = this.results[index];
                this.$parent.sharedState.poi = {
                    'lnglat': [poi.lng, poi.lat],
                    'address': poi.address,
                    'label': poi.name
                };
            }
        }
    }
</script>

