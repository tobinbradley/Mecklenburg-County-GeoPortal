var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');


var LibraryInfo = React.createClass({
    propTypes: {
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.getLibraries(this.props.lat, this.props.lng);
    },
    componentWillReceiveProps: function(nextProps) {
        this.getLibraries(nextProps.lat, nextProps.lng);
    },
    getLibraries: function(lat, lng) {
        var args = {
            'x': lng,
            'y': lat,
            'srid': 4326,
            'table': 'libraries',
            'geometryfield': 'the_geom',
            'fields': 'name, address, city, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat',
            'limit': '6'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_nearest.php' + objectToURI(args),
            function(err, res) {
                this.setState({ theLibraries: res.body });
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

        if (typeof this.state.theLibraries === 'object') {
            var otherLibraries = this.state.theLibraries.slice(0);
            otherLibraries.shift();

            var libraries = (
                <div className="mdl-typography--text-center">
                    <div className="report-record-highlight">
                        <i className="icon icon-library" role="presentation"></i>
                        <h2>Your closest library is</h2>
                        <h1>{this.state.theLibraries[0].name}</h1>
                        <h3><a href="javascript:void(0)"
                            data-lat={this.state.theLibraries[0].lat}
                            data-lng={this.state.theLibraries[0].lng}
                            data-label={this.state.theLibraries[0].name}
                            data-address={this.state.theLibraries[0].address + ', ' + this.state.theLibraries[0].city}
                            onClick={this.handleLocationClick}>{this.state.theLibraries[0].address + ', ' + this.state.theLibraries[0].city}</a></h3>
                        <h4>{this.convertDistance(this.state.theLibraries[0].distance)}</h4>
                    </div>
                    <table className="mdl-data-table mdl-js-data-table">
                        <caption>Other Libraries Nearby</caption>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Library</th>
                                <th className="mdl-data-table__cell--non-numeric">Address</th>
                                <th>Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                otherLibraries.map(function(object, i){
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
                        <li><a href="http://www.plcmc.org/" target="_blank">Charlotte Mecklenburg Library</a></li>
                    </ul>
				</div>
			);
        }

        return (
            <div>
                {libraries}
				{moreInfo}
            </div>
        );

    }

});

module.exports = LibraryInfo;
