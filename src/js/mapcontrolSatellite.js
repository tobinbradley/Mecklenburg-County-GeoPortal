export default class AerialToggle {
  constructor({ placeUnder = "water_name_line" }) {
    this._placeUnder = placeUnder;
  }

  onAdd(map) {
    this._map = map;
    let _this = this;

    this._btn = document.createElement("button");
    this._btn.className = "maplibregl-ctrl-icon maplibregl-ctrl-aerial";
    this._btn.type = "button";
    this._btn.setAttribute("aria-label", "toggle satellite imagery");
    this._btn.onclick = function() {
      if (map.getLayer('satellite')) {
        map.removeLayer('satellite')
        map.removeSource('satellite')
        _this._btn.classList.remove("maplibregl-ctrl-aerial-active")
      } else {
        map.addSource("satellite", {
          type: "raster",
          tiles: [
            "https://api.nearmap.com/tiles/v3/Vert/{z}/{x}/{y}.img?apikey=YWI4OGY1YjUtZWNkZC00YzJkLWFjZWUtNmQ1YmExYTRlM2I1"
          ],
          tileSize: 256,
          maxzoom: 19
        })
        map.addLayer({
          id: "satellite",
          type: "raster",
          source: "satellite",
          maxzoom: 22
        })
        _this._btn.classList.add("maplibregl-ctrl-aerial-active")
      }

    };

    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
