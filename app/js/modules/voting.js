import React from 'react';
import axios from 'axios';


var PollingComponent = React.createClass({
    getDefaultProps: function() {
        return {
            recs: ''
        };
    },
    handleLocationClick: function(event) {
        if (typeof map === 'object') {
            let theItem = event.target;
            let label = `
                <div class="marker-title">${theItem.getAttribute('data-label')}</div>
                ${theItem.getAttribute('data-address').replace(',', '<br />')}
            `;
            map.interestMarker([theItem.getAttribute('data-lng'), theItem.getAttribute('data-lat')], label);
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

        if (!isNaN(parseInt(this.props.recs))) {
            var rep = this.props.officials.filter(function(r) { return r.district_type === this.props.filter && r.district == this.props.recs; }.bind(this));
            var atlarge = this.props.officials.filter(function(r) { return r.district_type === this.props.filter && r.district === 'At-Large'; }.bind(this));

            var atLargeText = '';
            if ( atlarge.length > 0 ) {
                atLargeText = 'At Large: ' + atlarge.map(function(item) { return item.representative; }).join(', ');
            }

            returnVal = (
				<div className="report-record-highlight">
					<i className="icon icon-user" role="presentation"></i>
					<h2>Your {this.props.type} Representative is</h2>
					<h1>{rep[0].representative}</h1>
					<h3>District {this.props.recs}</h3>
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
            var reps = this.props.recs.filter(function(r) { return r.district_type === 'national_senate'; });
            returnVal = (
				<div className="report-record-highlight">
					<i className="icon icon-user" role="presentation"></i>
					<h2>Your US SENATE Representatives are</h2>
					<h1>{reps[0].representative} <br /> {reps[1].representative}</h1>
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
        this.getOfficials();
        this.getPrecinct(lat, lng);
        this.getDistrict(lat, lng, 'national_congressional', 'national_congressional', 'natCongress', 'district');
        this.getDistrict(lat, lng, 'state_senate', 'state_senate', 'stateSenate', 'senate');
        this.getDistrict(lat, lng, 'state_house', 'state_house', 'stateHouse', 'house');
        this.getDistrict(lat, lng, 'charlotte_city_council', 'city_council', 'cityCharlotte', 'citydist');
    },
    getOfficials: function() {
        let _this = this;
        axios
            .get(`http://maps.co.mecklenburg.nc.us/api/query/v1/elected_officials`,
            {
                params: {
                    'sort': 'district'
                }
            })
            .then(function(response) {
                _this.setState({ officials: response.data });
            });
    },
    getPrecinct: function(lat, lng) {
        let _this = this;
        axios
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/voting_precincts/${lng},${lat}/4326`,
            {
                params: {
                    'geom_column': 'the_geom',
                    'limit': 1,
                    'columns': `voting_precincts.cc, voting_precincts.school, polling_locations.name as label,polling_locations.address,voting_precincts.precno as precinct,st_x(st_transform(polling_locations.the_geom, 4326)) as lng, st_y(st_transform(polling_locations.the_geom, 4326)) as lat, ST_Distance(polling_locations.the_geom,ST_Transform(GeomFromText('POINT(${lng} ${lat})',4326), 2264)) as distance`,
                    'join': 'polling_locations;voting_precincts.precno = polling_locations.precno'
                }
            })
            .then(function(response) {
                _this.setState({
                    pollingRecs: response.data,
                    countyCommission: response.data[0].cc,
                    countySchool: response.data[0].school
                });
            });
    },
    getDistrict: function(lat, lng, type, layer, theState, distField) {
        let _this = this;
        axios
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/${layer}/${lng},${lat}/4326`,
            {
                params: {
                    'geom_column': 'the_geom',
                    'columns': `${distField} as district`
                }
            })
            .then(function(response) {
                if (response.data.length > 0) {
                    _this.setState({ [theState]: response.data[0].district });
                } else {
                    _this.setState({ [theState]: null });
                }
            });
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
						<SenateComponent recs={this.state.officials} />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.natCongress} type='US CONGRESSIONAL DISTRICT' officials={this.state.officials} filter='national_congressional' />
					</div>
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.stateSenate} type='NC SENATE DISTRICT' officials={this.state.officials} filter='state_senate' />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.stateHouse} type='NC HOUSE DISTRICT' officials={this.state.officials} filter='state_house' />
					</div>
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.countyCommission} type='COUNTY COMMISSIONER DISTRICT' officials={this.state.officials} filter='county_commission' />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<RepresentativeComponent recs={this.state.countySchool} type='SCHOOL BOARD DISTRICT' officials={this.state.officials} filter='board_of_education' />
					</div>
				</div>
				<div className="mdl-typography--text-center">
					<RepresentativeComponent recs={this.state.cityCharlotte} type='CHARLOTTE CITY COUNCIL DISTRICT' officials={this.state.officials} filter='charlotte_city_council' />
				</div>

				{moreInfo}
			</div>
		);
    }
});

module.exports = VotingComponent;
