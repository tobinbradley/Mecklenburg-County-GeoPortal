export default class AerialToggle {
  constructor({ placeUnder = "water_name_line" }) {
    this._placeUnder = placeUnder;
  }

  onAdd(map) {
    this._map = map;
    let _this = this;

    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-aerial";
    this._btn.type = "button";
    this._btn.setAttribute("aria-label", "toggle satellite imagery");
    this._btn.onclick = function() {
      if (map.getLayer('satellite').visibility === 'none') {
        map.setLayoutProperty('satellite', 'visibility', 'visible')
        _this._btn.classList.add('mapboxgl-ctrl-aerial-active')
      } else {
        map.setLayoutProperty('satellite', 'visibility', 'none')
        _this._btn.classList.remove('mapboxgl-ctrl-aerial-active')
      }
    };

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
