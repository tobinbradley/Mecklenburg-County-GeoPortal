import jsonToURL from '../modules/jsontourl';

export default function fetchNearest(lat, lng, appState) {
    let params = {
        'geom_column': 'the_geom',
        'limit': 1,
        'columns': 'objectid, full_address, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel'
    };

    fetch(`https://mcmap.org/api/nearest/v1/master_address_table/${lng},${lat}/4326?${jsonToURL(params)}`)
        .then(function(response) {
            return response.json();
        }).then(function(data) {            
            var item = data[0];
            appState.selected = {
                'lnglat': [item.lng, item.lat],
                'label': 'ADDRESS',
                'address': item.full_address,
                'pid': item.num_parent_parcel
            };
            appState.initLnglatFlag = false;
        }).catch(function(ex) {
            console.log('parsing failed', ex);
        });
}
