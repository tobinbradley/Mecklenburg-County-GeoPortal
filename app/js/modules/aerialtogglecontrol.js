export default class AerialToggle {
    
    constructor({placeUnder = 'water_name_line'}) {
        this._placeUnder = placeUnder;
    }

    onAdd(map) {
        this._map = map;
        let _this = this; 

        this._btn = document.createElement('button');
        this._btn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-aerial';
        this._btn.type = 'button';
        this._btn['aria-label'] = 'Toggle Satellite Imagery';
        this._btn.onclick = function() { 
            if (map.getLayer("satellite")) {
                map.removeLayer("satellite");
                map.removeSource("satellite");
                _this._btn.classList.remove('mapboxgl-ctrl-aerial-active');
            } else {
                map.addLayer({
                    "id": "satellite",
                    "type": "raster",
                    "source": {
                        "type": "raster",
                        "tiles": [
                            "https://a.tiles.mapbox.com/v4/digitalglobe.nal0g75k/{z}/{x}/{y}.jpg80?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpbjBkMDhwczA4bWF2cWx1bTIyY2V6aDMifQ.T9gIIn2WngTeTS6J_OU9jw",
                            "https://b.tiles.mapbox.com/v4/digitalglobe.nal0g75k/{z}/{x}/{y}.jpg80?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpbjBkMDhwczA4bWF2cWx1bTIyY2V6aDMifQ.T9gIIn2WngTeTS6J_OU9jw",
                            "https://c.tiles.mapbox.com/v4/digitalglobe.nal0g75k/{z}/{x}/{y}.jpg80?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpbjBkMDhwczA4bWF2cWx1bTIyY2V6aDMifQ.T9gIIn2WngTeTS6J_OU9jw"
                        ],
                        "tileSize": 256,
                        "maxzoom": 22
                    },
                    "minzoom": 0,
            		"maxzoom": 22
                }, _this._placeUnder);
                _this._btn.classList.add('mapboxgl-ctrl-aerial-active');
            } 
        };
        

        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

}