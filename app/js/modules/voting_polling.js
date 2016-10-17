import React from 'react';
import axios from 'axios';


class PollingLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetchData(this.props.lng, this.props.lat);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.lng, this.props.lat);
    }

    handleLocationClick(event) {
        if (typeof map === 'object') {
            let theItem = event.target;
            let label = `
                <div class="marker-title">${theItem.getAttribute('data-label')}</div>
                ${theItem.getAttribute('data-address').replace(',', '<br />')}
            `;
            map.interestMarker([theItem.getAttribute('data-lng'), theItem.getAttribute('data-lat')], label);
        }
    }

    fetchData(lng, lat) {
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
                _this.setState({ recs: response.data });
            });
    }

    render() {
        var returnVal;

        if (typeof this.state.recs === 'object' && this.state.recs.length !== 0) {
            returnVal = (
				<div className="report-record-highlight">
                    <i role="presentation" className="material-icons">check_box</i>
					<h2>Your Polling Location is</h2>
					<h1>{this.state.recs[0].label}</h1>
					<h3><a href="javascript:void(0)"
						data-lat={this.state.recs[0].lat}
						data-lng={this.state.recs[0].lng}
						data-label={this.state.recs[0].label}
						data-address={this.state.recs[0].address}
						onClick={this.handleLocationClick}>{this.state.recs[0].address}</a></h3>
					<h4>Precinct {this.state.recs[0].precinct}</h4>
				</div>
			);
        }

        return (
			<div>
			{returnVal}
			</div>
		);
    }
}


export default PollingLocation;
