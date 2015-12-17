
let L = require('leaflet/dist/leaflet');

var customFullscreenToggle = L.Control.extend({

    options: {
        position: 'bottomleft'
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('button', 'mdl-button mdl-js-button mdl-button--raised mdl-button--colored');

        container.innerHTML = 'Exit Full Screen';

        container.onclick = function() {
            map.toggleFullscreen();
        };

        return container;
    }

});

module.exports = customFullscreenToggle;
