import React from 'react';
import axios from 'axios';

class PID extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.lng, nextProps.lat);
    }

    componentDidMount() {
        this.fetchData(this.props.lng, this.props.lat);
    }

    fetchData(lng, lat) {
        let _this = this;
        this.serverRequest = axios
            .get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_pointoverlay.php',
            {
                params: {
                    'x': lng,
                    'y': lat,
                    'srid': 4326,
                    'table': 'view_zoning',
                    'fields': 'zone_des, zone_class',
                    'parameters': "zone_des <> 'sm_towns'",
                    'geometryfield': 'the_geom'
                }
            })
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        let returnVal;
        if (typeof this.state.recs === 'object' && this.state.recs.length > 0) {
            returnVal = (
                <div className="report-record-highlight">
                    <i className="icon-home"></i>
                    <h2>Tax Parcel</h2>
                    <h1>{this.props.pid}</h1>
                    <h3>Zoned as {this.state.recs[0].zone_class} {this.state.recs[0].zone_des}</h3>
                </div>
            );
        } else {
            returnVal = (
                <div className="report-record-highlight">
                    <i className="icon-home"></i>
                    <h2>Tax Parcel</h2>
                    <h1>{this.props.pid}</h1>
                </div>
            );
        }

        return (
            <div>{returnVal}</div>
        );
    }
}

export default PID;
