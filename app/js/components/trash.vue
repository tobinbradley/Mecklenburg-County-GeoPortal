<template lang="html">
    <div v-if="!$parent.sharedState.selected.lnglat">
            <Introduction>
                <div class='intro-slot'>
                    To view <strong>Trash and Recycling Pickup</strong> information, use the search above to find a location.
                </div>
            </Introduction>
    </div>
    <div v-else>
        <Selected>{{ $parent.sharedState.selected.address }}</Selected>
        <div v-if="results.length > 0">
            <div class="mdl-grid" v-if="results[0].jurisdiction === 'huntersville'">
                <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                     <Print></Print>
                    <div class="report-record-highlight">
                        <i class="icon icon-trash"></i>
                        <h2>Your TRASH day is</h2>
                        <h1>{{ results[0].day }}</h1>
                    </div>
                </div>
                <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                    <div class="report-record-highlight">
                        <i class="icon icon-recycle"></i>
                        <h2>Your RECYCLING day is</h2>
                        <h1>
                        {{ results[0].day }}
                        {{ recyclingWeek(results[0].week) }}
                    </h1>
                        <h4>Recycling pickup is every other week.</h4>
                    </div>
                </div>
            </div>

            <div class="mdl-typography--text-center" v-if="results[0].jurisdiction === 'cornelius'">
                <div class="report-record-highlight">
                    <i class="icon icon-trash"></i>
                    <h2>Your collection day is</h2>
                    <h1>{{results[0].day.toUpperCase()}}</h1>
                    <h3>for {{results[0].type}}</h3>
                    <h4></h4>
                </div>
            </div>

            <div v-if="results[0].jurisdiction === 'charlotte'">
                <div class="mdl-grid">
                    <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <div class="report-record-highlight">
                            <i class="icon icon-trash"></i>
                            <h2>Your TRASH day is</h2>
                            <h1>{{ results | typeFilter('GARBAGE') | itemFilter('day') }}</h1>
                        </div>
                    </div>
                    <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <div class="report-record-highlight">
                            <i class="icon icon-recycle"></i>
                            <h2>Your RECYCLING day is</h2>
                            <h1>{{ results | typeFilter('RECYCLING') | itemFilter('day') }} {{ recyclingWeek(results) }}</h1>
                            <h4>Recycling pickup is every other week ({{ results | typeFilter('RECYCLING') | itemFilter('week')}})</h4>
                        </div>
                    </div>
                </div>
                <table class="mdl-data-table" style={tableStyle}>
                    <caption>Other Collection Services</caption>
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Collection Service</th>
                            <th class="mdl-data-table__cell--non-numeric">Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="mdl-data-table__cell--non-numeric">
                                Yard Waste
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                {{ results | typeFilter('YARD WASTE') | itemFilter('day') }}
                            </td>
                        </tr>
                        <tr>
                            <td class="mdl-data-table__cell--non-numeric">
                                Bulky Items
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                {{ results | typeFilter('BULKY') | itemFilter('day') }} <br /> Call 311 to schedule.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <div v-else>
            <div class="mdl-typography--text-center">
                <div class="report-record-highlight">
                    <i class="icon icon-trash" role="presentation"></i>
                    <h2>Unfortunately we only know collection information for Huntersville, Cornelius, and Charlotte. For collection information for you location, please visit you local government web site.</h2>
                </div>
            </div>
        </div>

        <div class="report-moreinfo mdl-typography--text-left">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://charmeck.org/city/charlotte/SWS" target="_blank">Charlotte Solid Waste Services</a></li>
                <li><a href="http://www.cornelius.org/index.aspx?nid=208" target="_blank">Cornelius Solid Waste Services</a></li>
                <li><a href="http://www.huntersville.org/Departments/EngineeringPublicWorks/SolidWasteRecycling.aspx" target="_blank">Huntersville Solid Waste and Recycling Collection</a></li>
            </ul>
        </div>

    </div>
</template>

<script>
// Test information
// 3810 Warrington is orange (odd)
// 5501 Ruth is green (even)

import jsonToURL from '../modules/jsontourl';
import Welcome from './introduction.vue';
import Selected from './selected.vue';

export default {
    name: 'trash',
    data: function() {
        return {
            results: []
        }
    },
    components: {
        Introduction: Welcome,
        Selected: Selected
    },
    watch: {
        '$parent.sharedState.selected.lnglat': 'getResults',
        '$parent.sharedState.show': 'getResults'
    },
    filters: {
        typeFilter: function(items, val) {
            items = items.filter(function(rec) { return rec.type === val; });
            return items[0];
        },
        itemFilter: function(item, col) {
            return item[col];
        }
    },
    mounted: function() {
        this.getResults();
    },
    methods: {
        getResults: function() {
            let _this = this;
            if (_this.$parent.sharedState.selected.lnglat && _this.$parent.sharedState.show.indexOf('trash') !== -1) {
                let params = {
                    'geom_column': 'the_geom',
                    'columns': 'jurisdiction, day, week, type'
                };

                fetch(`https://mcmap.org/api/intersect_point/v1/solid_waste/${_this.$parent.sharedState.selected.lnglat.join(',')}/4326?${jsonToURL(params)}`)
                    .then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        _this.results = data;
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    });
            }
        },
        recyclingWeek: function(w) {
            var theDate = new Date();
            if (typeof w === 'object') {
                let items = w.filter(function(rec) { return rec.type === 'RECYCLING'; })
                w = items[0].week;
            }
            theDate.setHours(0, 0, 0, 0);
            var currentWeek = this.checkOddEven(this.weekNumber(theDate.getTime()));
            var propertyWeek = this.weekEvenOdd(w);

            if (currentWeek === propertyWeek) {
                return 'this week';
            } else {
                return 'next week';
            }
        },
        weekEvenOdd: function(w) {
            if (w === 'A' || w === 'GREEN') {
                return 'even';
            } else {
                return 'odd';
            }
        },
        weekNumber: function(d) {
            // the length of a week
            var one_week = 1000 * 60 * 60 * 24 * 7;
            // the start of a Green or A week
            var a = new Date('2015-08-30').getTime();

            var weekN = Math.floor((d - a) / one_week);
            return weekN;
        },
        checkOddEven: function(num) {
            if(num % 2 === 0) {
                return 'even';
            } else {
                return 'odd';
            }
        }
    }
}
</script>

<style lang="css">
</style>
