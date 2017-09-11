<template lang="html">
    <div>
        <div class="scatterplot mdl-typography--text-center">
            <h4>Data Distribution, {{$parent.year}}</h4>
            <div class="ct-distributionchart"></div>
        </div>
    </div>
</template>

<script>
import Chartist from 'chartist';
import naturalSort from '../modules/naturalsort';

export default {
    name: 'sc-distributionchart',
    watch: {
        '$parent.qolData': 'renderChart',
        'sharedState.selected': 'renderChart',
        'sharedState.year': 'renderChart'
    },
    methods: {
        renderChart: function() {
            let data = this.updateData();

            let chart = new Chartist.Line('.ct-distributionchart', {
              labels: data[0],
              series: [data[1]]
            }, {
                showArea: true,
                showPoint: false,
                showLine: false,
                fullWidth: true,
                height: '160px',
                axisX: {
                    showLabel: false,
                    showGrid: false
                }
            });

          chart.on('created', function(ctx) {
              var defs = ctx.svg.elem('defs');
              defs.elem('linearGradient', {
                    id: 'gradient',
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 0
                  }).elem('stop', {
                      offset: 0,
                      'stop-color': 'rgb(255, 255, 224)'
                  }).parent().elem('stop', {
                      offset: 1,
                      'stop-color': 'rgb(176, 6, 44)'
                  });
          });

        },
        updateData: function() {
          const data = this.$parent.qolData.data.map;
          const year = this.$parent.year;
          let vals = [];
          let labels = [];

          // data to array
          Object.entries(data).forEach (([key, value]) => {
            let val = value[`y_${year}`];
            if (val !== null) {
              vals.push(val);
              labels.push(key);
            }
          });

          // sort values
          vals.sort(function(a,b) {
            return a - b;
          });

          return [labels, vals];
        }
    }
};
</script>

<style>
    .ct-area {
      fill: url(#gradient) !important;
      fill-opacity: 1;
    }
</style>

