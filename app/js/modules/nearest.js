import axios from 'axios';

export default function fetchNearest(lat, lng, appState) {
    axios
        .get(`http://maps.co.mecklenburg.nc.us/api/nearest/v1/master_address_table/${lng},${lat}/4326`,
        {
            params: {
                'geom_column': 'the_geom',
                'limit': 1,
                'columns': 'objectid, full_address, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel'
            }
        })
        .then(function(response) {
            if (appState.show.indexOf("introduction") !== -1) {
                appState.show.splice(appState.show.indexOf("introduction"), 1);
            }
            var item = response.data[0];
            appState.selected = {
                'lnglat': [item.lng, item.lat],
                'label': 'ADDRESS',
                'address': item.full_address,
                'pid': item.num_parent_parcel
            };
            appState.initLnglatFlag = false;
        });
}
