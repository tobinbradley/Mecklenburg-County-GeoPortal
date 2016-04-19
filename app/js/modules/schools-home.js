import React from 'react';
import axios from 'axios';
import format from 'format-number';


class HomeSchool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetchData(this.props.lat, this.props.lng, this.props.filter);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.lat, nextProps.lng, nextProps.filter);
    }

    fetchData(lat, lng, filter) {
        let _this = this;
        this.serverRequest = axios
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/school_districts/${lng},${lat}/4326`,
            {
                params: {
                    'geom_column': 'the_geom',
                    'distance': 150,
                    'columns': `type, schlname, choice_zone, address, city, x as lng, y as lat, ST_Distance(ST_Transform(ST_GeomFromText('POINT(${lng} ${lat})',4326), 2264), ST_transform(ST_GeomFromText('POINT(' || x || ' ' || y || ')',4326), 2264)) as dist`,
                    'filter': `type = '${filter}'`
                }
            })
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
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

    render() {
        var school;

        if (typeof this.state.recs === 'object') {
            if (this.state.recs.length === 1) {
                school = (
                    <div className="report-record-highlight">
                        <i className="icon icon-school" role="presentation"></i>
                        <h2>Your {this.props.filter} school is</h2>
                        <h1>{this.state.recs[0].schlname}</h1>
                        <h3><a href="javascript:void(0)"
                            data-lat={this.state.recs[0].lat}
                            data-lng={this.state.recs[0].lng}
                            data-label={this.state.recs[0].schlname}
                            data-address={this.state.recs[0].address}
                            onClick={this.handleLocationClick}>{this.state.recs[0].address}</a></h3>
                        <h4>{format({'truncate': 1, 'suffix': ' miles'})(this.state.recs[0].dist / 5280)}</h4>
                    </div>
                );
            } else {
                school = (
                    <div className="mdl-typography--text-center">
                        <div className="report-record-highlight">
                            <i className="icon icon-school" role="presentation"></i>
                            <h2>This address is too close to a school district boundary to give an accurate {this.props.filter} school assignment.</h2>
                            <h4>To locate your student&#39;s home school, email your address to planning@cms.k12.nc.us or call 980-343-6246.</h4>
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
}

export default HomeSchool;
