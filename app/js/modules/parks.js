var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');


var ParkInfo = React.createClass({
    getInitialState: function() {
        return {
            theParks: ''
        }
    },
    getParks: function(lat, lng) {
        var args = {
                    'x': lng,
                    'y': lat,
                    'srid': 4326,
                    'table': 'parks_all',
                    'geometryfield': 'geom',
                    'fields': 'name, address, city, st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat',
                    'limit': '6'
                    };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_nearest.php' + objectToURI(args),
            function(err, res) {
                this.setState({ theParks: res.body });
            }.bind(this)
        );
    },
    convertDistance: function(dist) {
        return (dist / 5280).toFixed(1) + ' miles';
    },
    handleLocationClick: function(event) {
        if (typeof addtmpMarker === 'function') {
            var theItem = event.target;
            addtmpMarker(theItem.getAttribute('data-lat'), theItem.getAttribute('data-lng'), theItem.getAttribute('data-label'), theItem.getAttribute('data-address'));
        }
    },
    render: function() {

        if (typeof this.state.theParks === 'object') {
            var otherParks = this.state.theParks.slice(0);
            otherParks.shift();

            var parks = (
                <div className="mdl-typography--text-center">
                    <div className="report-record-highlight">
                        <i className="icon icon-tree-2" role="presentation"></i>
                        <h2>Your closest park is</h2>
                        <h1>{this.state.theParks[0].name}</h1>
                        <h3><a href="javascript:void(0)"
                            data-lat={this.state.theParks[0].lat}
                            data-lng={this.state.theParks[0].lng}
                            data-label={this.state.theParks[0].name}
                            data-address={this.state.theParks[0].address + ', ' + this.state.theParks[0].city}
                            onClick={this.handleLocationClick}>{this.state.theParks[0].address + ', ' + this.state.theParks[0].city}</a></h3>
                        <h4>{this.convertDistance(this.state.theParks[0].distance)}</h4>
                    </div>
                    <table className="mdl-data-table mdl-js-data-table">
                        <caption>Other Parks Nearby</caption>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Park</th>
                                <th className="mdl-data-table__cell--non-numeric">Address</th>
                                <th>Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                otherParks.map(function(object, i){
                                    return (
                                        <tr key={i}>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                {object.name}
                                            </td>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                <a href="javascript:void(0)"
                                                    data-lat={object.lat}
                                                    data-lng={object.lng}
                                                    data-label={object.name}
                                                    data-address={object.address + ', ' + object.city}
                                                    onClick={this.handleLocationClick}>{object.address + ', ' + object.city}</a>
                                            </td>
                                            <td className="nowrap">
                                                {this.convertDistance(object.distance)}
                                            </td>
                                        </tr>
                                    );
                                }, this)
                            }
                        </tbody>
                    </table>
                </div>
            );

            var moreInfo = (
    			<div className="report-moreinfo mdl-typography--text-left">
    				<h5>For more information, please visit:</h5>
                    <ul className="list-unstyled">
                        <li><a href="http://charmeck.org/mecklenburg/county/ParkandRec/Pages/default.aspx">Mecklenburg County Park and Recreation</a></li>
                        <li><a href="http://www.huntersville.org/Departments/ParksRecreation.aspx" target="_blank">Huntersville Parks and Recreation</a></li>
                    </ul>
    			</div>
    		);
        }

        return (
            <div>
                {parks}
                {moreInfo}
            </div>
        );

    }

});

module.exports = ParkInfo;
