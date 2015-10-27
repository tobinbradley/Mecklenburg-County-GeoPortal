var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');


var PollingComponent = React.createClass({
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
    render: function() {
        var returnVal;

        if (typeof this.props.recs === 'object' && this.props.recs.length !== 0) {
            returnVal = (
				<div className="report-record-highlight">
					<i className="icon icon-check" role="presentation"></i>
					<h2>Your Polling Location is</h2>
					<h1>{this.props.recs[0].label}</h1>
					<h3><a href="javascript:void(0)"
						data-lat={this.props.recs[0].lat}
						data-lng={this.props.recs[0].lng}
						data-label={this.props.recs[0].label}
						data-address={this.props.recs[0].address}
						onClick={this.handleLocationClick}>{this.props.recs[0].address}</a></h3>
					<h4>Precinct {this.props.recs[0].precinct}</h4>
				</div>
			);
        }

        return (
			<div>
			{returnVal}
			</div>
		);
    }
});

var RepresentativeComponent = React.createClass({
    getDefaultProps: function() {
        return {
            recs: '',
            type: ''
        };
    },
    render: function() {
        var returnVal;

        if (typeof this.props.recs === 'object' && this.props.recs.length !== 0) {
            var atLargeText = '';
            var atLarge = this.props.recs.slice(0);

            atLarge.shift();
            atLarge = atLarge.map(function(item) { return item.representative; });

            if ( atLarge.length > 0 ) {
                atLargeText = 'At Large: ' + atLarge.join(', ');
            }

            returnVal = (
				<div className="report-record-highlight">
					<i className="icon icon-user" role="presentation"></i>
					<h2>Your {this.props.type} Representative is</h2>
					<h1>{this.props.recs[0].representative}</h1>
					<h3>District {this.props.recs[0].district}</h3>
					<h4>{atLargeText}</h4>
				</div>
			);
        }

        return (
			<div>
			{returnVal}
			</div>
		);
    }
});

var SenateComponent = React.createClass({
    getDefaultProps: function() {
        return {
            recs: ''
        };
    },
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object' && this.props.recs.length !== 0) {
            returnVal = (
				<div className="report-record-highlight">
					<i className="icon icon-user" role="presentation"></i>
					<h2>Your US SENATE Representatives are</h2>
					<h1>{this.props.recs[0].representative} <br /> {this.props.recs[1].representative}</h1>
				</div>
			);
        }
        return (
			<div>
			{returnVal}
			</div>
		);
    }
});


var VotingComponent = React.createClass({
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
        this.getPollingLocation(lat, lng);
        this.getDistrict(lat, lng, 'national_congressional', 'national_congressional', 'natCongress', 'district');
        this.getNationalSenate();
        this.getDistrict(lat, lng, 'state_senate', 'state_senate', 'stateSenate', 'senate');
        this.getDistrict(lat, lng, 'state_house', 'state_house', 'stateHouse', 'house');
        this.getDistrict(lat, lng, 'county_commission', 'voting_precincts', 'countyCommission', 'cc');
        this.getDistrict(lat, lng, 'board_of_education', 'voting_precincts', 'countySchool', 'school');
        this.getDistrict(lat, lng, 'charlotte_city_council', 'city_council', 'cityCharlotte', 'citydist');
    },
    getPollingLocation: function(lat, lng) {
        var args = {
            'x': lng,
            'y': lat,
            'srid': 4326,
            'table': 'polling_locations,voting_precincts',
            'geometryfield': 'the_geom',
            'limit': 1,
            'fields': `polling_locations.name as label,polling_locations.address,a.precno as precinct,st_x(st_transform(polling_locations.the_geom, 4326)) as lng, st_y(st_transform(polling_locations.the_geom, 4326)) as lat, ST_Distance(polling_locations.the_geom,ST_Transform(GeomFromText('POINT(${lng} ${lat})',4326), 2264)) as distance`,
            'parameters': 'a.precno = polling_locations.precno'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php' + objectToURI(args),
            function(err, res) {
                this.setState({ pollingRecs: res.body });
            }.bind(this)
        );
    },
    getNationalSenate: function() {
        var args = {
            'table': 'elected_officials',
            'fields': 'representative',
            'parameters': `district_type = 'national_senate'`
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_attributequery.php' + objectToURI(args),
            function(err, res) {
                this.setState({ natSenate: res.body });
            }.bind(this)
        );
    },
    getDistrict: function(lat, lng, type, layer, theState, distField) {
        var args = {
            'x': lng,
            'y': lat,
            'srid': 4326,
            'table': `elected_officials,${layer}`,
            'geometryfield': 'the_geom',
            'fields': 'elected_officials.district, elected_officials.representative',
            'order': 'elected_officials.district',
            'parameters': `elected_officials.district_type = '${type}' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.${distField} as varchar(5)))`
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php' + objectToURI(args),
            function(err, res) {
                this.setState({ [theState]: res.body });
            }.bind(this)
        );
    },
    render: function() {
        var moreInfo;

        if (typeof this.state.pollingRecs === 'object') {
            moreInfo = (
				<div className="report-moreinfo mdl-typography--text-left">
                    <h5>For more information, please visit:</h5>
                    <ul className="list-unstyled">
                        <li><a href="http://www.meckboe.org/" target="_blank">Mecklenburg County Board of Elections</a></li>
                    </ul>
				</div>
			);
        }

        return (
			<div>
				<div className="mdl-typography--text-center">
					<PollingComponent recs={this.state.pollingRecs} />
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<SenateComponent recs={this.state.natSenate} />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.natCongress} type='US CONGRESSIONAL DISTRICT' />
					</div>
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.stateSenate} type='NC SENATE DISTRICT' />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.stateHouse} type='NC HOUSE DISTRICT' />
					</div>
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.countyCommission} type='COUNTY COMMISSIONER DISTRICT' />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.countySchool} type='SCHOOL BOARD DISTRICT' />
					</div>
				</div>
				<div className="mdl-typography--text-center">
					<RepresentativeComponent recs={this.state.cityCharlotte} type='CHARLOTTE CITY COUNCIL DISTRICT' />
				</div>

				{moreInfo}
			</div>
		);
    }
});

module.exports = VotingComponent;
