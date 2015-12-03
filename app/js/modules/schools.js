var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');


var SchoolDisplay = React.createClass({
    getDefaultProps: function() {
        return {
            recs: '',
            type: ''
        };
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
        var school;

        if (typeof this.props.recs === 'object') {
            if (this.props.recs.length === 1) {
                school = (
                    <div className="report-record-highlight">
                        <i className="icon icon-school" role="presentation"></i>
                        <h2>Your {this.props.recs[0].type} school is</h2>
                        <h1>{this.props.recs[0].schlname}</h1>
                        <h3><a href="javascript:void(0)"
                            data-lat={this.props.recs[0].lat}
                            data-lng={this.props.recs[0].lng}
                            data-label={this.props.recs[0].schlname}
                            data-address={this.props.recs[0].address}
                            onClick={this.handleLocationClick}>{this.props.recs[0].address}</a></h3>
                        <h4>{this.convertDistance(this.props.recs[0].dist)}</h4>
                    </div>
                );
            } else {
                school = (
                    <div className="mdl-typography--text-center">
                        <div className="report-record-highlight">
                            <i className="icon icon-school" role="presentation"></i>
                            <h2>This address is too close to a school district boundary to give an accurate {this.props.type} school assignment.</h2>
                            <h4>To locate your student's home school, email your address to planning@cms.k12.nc.us or call 980-343-6246.</h4>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div>
            {school}
            </div>
        );
    }
});

var MagnetDisplay = React.createClass({
    getDefaultProps: function() {
        return {
            recs: ''
        };
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
    getAsterik: function(id) {
        if ([4429, 8364, 5532, 8482, 7405, 7496, 5520].indexOf(Number(id)) !== -1) {
            return '*';
        } else {
            return '';
        }
    },
    render: function() {
        var magnet;
        if (typeof this.props.recs === 'object') {
            magnet = (
                    <table className="mdl-data-table mdl-js-data-table">
                        <caption>Magnet Schools</caption>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">School</th>
                                <th className="mdl-data-table__cell--non-numeric">Address</th>
                                <th className="col-responsive">Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.recs.map(function(object, i){
                                    return (
                                        <tr key={i}>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                {object.schlname}{this.getAsterik(object.schl)}
                                            </td>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                <a href="javascript:void(0)"
                                                    data-lat={object.lat}
                                                    data-lng={object.lng}
                                                    data-label={object.schlname}
                                                    data-address={object.address + ', ' + object.city}
                                                    onClick={this.handleLocationClick}>{object.address + ', ' + object.city}</a>
                                            </td>
                                            <td className="nowrap col-responsive">
                                                {this.convertDistance(object.distance)}
                                            </td>
                                        </tr>
                                    );
                                }, this)
                            }
                        </tbody>
                    </table>
                );
        }

        return (
            <div>
            {magnet}
            </div>
        );
    }
});


var ZoneDisplay = React.createClass({
    getDefaultProps: function() {
        return {
            recs: ''
        };
    },
    getAsterik: function(id) {
        if ([4429, 8364, 5532, 8482, 7405, 7496, 5520].indexOf(Number(id)) !== -1) {
            return '*';
        } else {
            return '';
        }
    },
    render: function() {
        var zone;
        if (typeof this.props.recs === 'object') {
            zone = (
                    <div className="report-record-highlight">
                        <i className="icon icon-bus" role="presentation"></i>
                        <h2>Your Transportation Zone is</h2>
                        <h1>{this.props.recs[0].choice_zone.toUpperCase()}</h1>
                    </div>
            );
        }

        return (
            <div>
            {zone}
            </div>
        );
    }
});



var SchoolInfo = React.createClass({
    propTypes: {
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.getData(this.props.lat, this.props.lng);
    },
    componentWillReceiveProps: function(nextProps) {
        this.getData(nextProps.lat, nextProps.lng);
    },
    getData: function(lat, lng) {
        this.getHomeData(lat, lng);
        this.getMagnetData(lat, lng);
    },
    getHomeData: function(lat, lng) {
        var args = {
            'geom_column': 'the_geom',
            'distance': 150,
            'columns': `type, schlname, choice_zone, address, city, x as lng, y as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${lng} ${lat})',4326), 2264), ST_transform(ST_GeomFromText('POINT(' || x || ' ' || y || ')',4326), 2264)) as dist`
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/school_districts/${lng},${lat}/4326` + objectToURI(args),
            function(err, res) {
                this.setState({ homeData: res.body });
            }.bind(this)
        );
    },
    getMagnetData: function(lat, lng) {
        var args = {
            'columns': `schl, schlname, address, city, ST_Distance(the_geom,ST_Transform(GeomFromText('POINT( ${lng} ${lat} )',4326), 2264)) as distance, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat`,
            'sort': 'distance'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get(`http://maps.co.mecklenburg.nc.us/api/query/v1/view_schools_magnet` + objectToURI(args),
            function(err, res) {
                this.setState({ magnetData: res.body });
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
        var elementary,
            middle,
            high,
            moreInfo = '';

        // school data
        if (typeof this.state.homeData === 'object') {
            elementary = this.state.homeData.filter(function(item) { return item.type === 'ELEMENTARY'; });
            middle = this.state.homeData.filter(function(item) { return item.type === 'MIDDLE'; });
            high = this.state.homeData.filter(function(item) { return item.type === 'HIGH'; });
            moreInfo = (
                <div className="report-moreinfo mdl-typography--text-left">
                    <p>
                    Transportation eligibility is determined by the transportation zone in which you live. The county is divided into four transportation zones:  violet, grey, blue, and green. Magnet schools are assigned a zone to serve with transportation. If the distance is to the magnet greater than 5 miles, you may be assigned to a shuttle stop location. Some programs (*) provide county-wide transportation, meaning that regardless of your zone, you would receive transportation. For more information please contact Charlotte-Mecklenburg School Transportation Services at (980) 343-6715.
                    </p>
                    <h5>For more information, please visit:</h5>
                    <ul className="list-unstyled">
                        <li><a href="http://www.cms.k12.nc.us/" target="_blank">Charlotte-Mecklenburg Schools</a></li>
                    </ul>
                </div>
            );
        }

        return (
            <div>
                <div className="mdl-typography--text-center">
                    <SchoolDisplay recs={elementary} type="ELEMENTARY" />
                </div>
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <SchoolDisplay recs={middle} type="MIDDLE" />
                    </div>
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">

                        <SchoolDisplay recs={high} type="HIGH" />
                    </div>
                </div>

                <MagnetDisplay recs={this.state.magnetData} />
                <div className="mdl-typography--text-center">
                    <ZoneDisplay recs={high} />
                </div>
                {moreInfo}
            </div>
        );

    }

});

module.exports = SchoolInfo;
