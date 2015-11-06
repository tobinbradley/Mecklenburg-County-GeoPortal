var httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');

function fetchNearest(lat, lng) {
    var args = {
        'geom_column': 'the_geom',
        'limit': 1,
        'columns': 'objectid, full_address, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel'
    };
    httpplease = httpplease.use(jsonresponse);
    httpplease.get(`http://maps.co.mecklenburg.nc.us/api/nearest/v1/master_address_table/${lng},${lat}/4326` + objectToURI(args),
        function(err, data) {
            var item = data.body[0];
            processRecord(item.objectid, item.lat + ',' + item.lng, item.full_address, item.num_parent_parcel, item.full_address);
        }
    );
}

module.exports = fetchNearest;
