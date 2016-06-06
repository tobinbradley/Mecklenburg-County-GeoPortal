import React from 'react';
import mapboxgl from 'mapbox-gl';
import directions from './directions';
let fetchNearest = require('./nearest');


var markers = {
    "type": "FeatureCollection",
    "features": []
};


class GLMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let view = {
            container: this.props.container,
            style: this.props.style,
            center: this.props.center,
            zoom: this.props.zoom,
            hash: this.props.hash,
            minZoom: this.props.minZoom,
            maxBounds: this.props.maxBounds
        };

        this.map = new mapboxgl.Map(view);
        //map.addControl(new Mapmenu());
        this.popup = new mapboxgl.Popup();
        let popup = this.popup;
        let map = this.map;
        this.map.on('mousemove', function(e) {
            let features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

            if (!features.length) {
                return;
            }

            var feature = features[0];
            popup.setLngLat(feature.geometry.coordinates)
                .setHTML(feature.properties.description)
                .addTo(map);
        });
        this.map.on('click', function (e) {
            popup.remove();
            if (map.getZoom() >= 14) {
                fetchNearest(e.lngLat.lat, e.lngLat.lng);
            }
        });
        // this.map.on('click', function (e) {
        //     var features = map.queryRenderedFeatures(e.point);
        //     console.log(JSON.stringify(features, null, 2));
        // });
        this.map.on('style.load', function () {
            this.pastInitialLoad = true;
            this.map.addSource("markers", {
                "type": "geojson",
                "data": markers }
            );
            this.map.addLayer({
                "id": "markers",
                "type": "symbol",
                "source": "markers",
                "interactive": true,
                "layout": {
                    "icon-image": "{marker-symbol}"
                }
            });
            if (this.layers) {
                this.overlayLayer(this.layers, this.layerPosition);
            }
        }.bind(this));
    }

    componentWillUnmount() {
        this.map.remove();
    }

    setStyle(style) {
        this.map.setStyle(style);
    }

    setOverlayLayer(layers, layerPosition) {
        this.layers = layers;
        this.layerPosition = layerPosition;
        if (this.pastInitialLoad) {
            this.overlayLayer(layers, layerPosition);
        }
    }

    clearOverlay() {
        if (this.map.getLayer("overlay")) {
            this.map.removeLayer("overlay");
            this.map.removeSource("overlay");
        }
    }

    overlayLayer(layers, layerPosition) {
        this.layers = layers;
        this.clearOverlay();
        if (layers) {
            this.map.addSource('overlay', {
                "type": "raster",
                "tiles": [`http://maps.co.mecklenburg.nc.us/zxy2wms/${layers}/{z}/{x}/{y}.png`],
                "tileSize": 256,
                "maxzoom": 18
            });
            this.map.addLayer({
                "id": "overlay",
                "type": "raster",
                "source": "overlay",
                "minzoom": 15,
                "maxzoom": 22,
                "paint": {
                    "raster-opacity": 0.5
                }
            }, layerPosition);
        } else {
            this.layers = null;
            this.clearOverlay();
        }
    }

    geolocation() {
        if ('geolocation' in navigator) {
            /* geolocation is available */
            var geo_options = {
                enableHighAccuracy: true,
                maximumAge        : 30000,
                timeout           : 27000
            };
            navigator.geolocation.getCurrentPosition(function(position) {
                fetchNearest(position.coords.latitude, position.coords.longitude);
            }, null, geo_options);
        }
    }

    pitch() {
        this.map.getPitch() === 0 ? this.map.easeTo({pitch: 90}) : this.map.easeTo({pitch: 0});
    }

    fullScreen() {
        var elem = document.querySelector(".map-container");
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    addressMarker(lngLat, label) {
        let map = this.map;
        map.flyTo({
            center: lngLat,
            zoom: 17
        });
        let theLabel = `
        <div class="marker-title">ADDRESS</div>
        ${label.replace(',', '<br />')}
        `;
        markers.features = [];
        markers.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": lngLat
            },
            "properties": {
                "marker-symbol": "marker",
                "description": theLabel,
                "type": "address"
            }
        });
        map.getSource("markers").setData(markers);
        this.popup.setLngLat(lngLat)
            .setHTML(theLabel)
            .addTo(map);
    }

    interestMarker(lngLat, label) {
        let map = this.map;
        var cleanFeatures = markers.features.filter(function(el) {
            return el.properties['type'] === 'address';
        });
        label += `<br><a href="${directions(cleanFeatures[0].geometry.coordinates, lngLat)}" target="_blank" title="directions">Directions</a>`;
        cleanFeatures.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": lngLat
            },
            "properties": {
                "marker-symbol": "poi",
                "description": label,
                "type": "poi"
            }
        });
        markers.features = cleanFeatures;
        map.getSource("markers").setData(markers);
        let ext = [];
        for (let i = 0; i < markers.features.length; i++) {
            ext.push(markers.features[i].geometry.coordinates);
        }
        map.fitBounds(ext, {
            padding: 40
        });

        this.popup.setLngLat(lngLat)
            .setHTML(label)
            .addTo(map);
    }

    render() {
        return <div id='map'></div>;
    }
}

GLMap.defaultProps = {
    container: "map",
    style: "./style/bright/style.json",
    center: [-80.827, 35.272],
    maxBounds: [[-78.255, 37.384],[-83.285, 33.180]],
    zoom: 8,
    minZoom: 7,
    hash: false
};


export default GLMap;
