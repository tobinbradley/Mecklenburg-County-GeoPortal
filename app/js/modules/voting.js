import React from 'react';
import axios from 'axios';
import PollingLocation from './voting_polling';
import Representative from './voting_representative';


var VotingComponent = React.createClass({
    propTypes: {
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.getOfficials();
    },
    componentWillReceiveProps: function() {
        this.getOfficials();
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
					<PollingLocation lat={this.props.lat} lng={this.props.lng} />
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<Representative officials={this.state.officials} label='US SENATE' filter='national_senate' />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<Representative lat={this.props.lat} lng={this.props.lng} layer='national_congressional' column='district' label='US CONGRESSIONAL DISTRICT' officials={this.state.officials} filter='national_congressional' />
					</div>
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<Representative lat={this.props.lat} lng={this.props.lng} layer='state_senate' column='senate' label='NC SENATE DISTRICT' officials={this.state.officials} filter='state_senate' />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<Representative lat={this.props.lat} lng={this.props.lng} layer='state_house' column='house' label='NC HOUSE DISTRICT' officials={this.state.officials} filter='state_house' />
					</div>
				</div>
				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<Representative lat={this.props.lat} lng={this.props.lng} layer='voting_precincts' column='cc' label='COUNTY COMMISSIONER DISTRICT' officials={this.state.officials} filter='county_commission' />
					</div>
					<div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
						<Representative lat={this.props.lat} lng={this.props.lng} layer='voting_precincts' column='school' label='SCHOOL BOARD DISTRICT' officials={this.state.officials} filter='board_of_education' />
					</div>
				</div>
				<div className="mdl-typography--text-center">
					<Representative lat={this.props.lat} lng={this.props.lng} layer='city_council' column='citydist' label='CHARLOTTE CITY COUNCIL DISTRICT' officials={this.state.officials} filter='charlotte_city_council' />
				</div>

				{moreInfo}
			</div>
		);
    }
});

module.exports = VotingComponent;
