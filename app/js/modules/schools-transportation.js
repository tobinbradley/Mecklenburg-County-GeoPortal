import React from 'react';
import axios from 'axios';


class Transportation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetchData(this.props.lat, this.props.lng);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.lat, nextProps.lng);
    }

    fetchData(lat, lng) {
        let _this = this;
        this.serverRequest = axios
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/cms_high_districts/${lng},${lat}/4326`,
            {
                params: {
                    'columns': 'zone',
                    'limit': 1
                }
            })
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    render() {
        var zone;
        if (typeof this.state.recs === 'object') {
            zone = (
                    <div className="report-record-highlight">
                        <i role="presentation" className="material-icons">directions_bus</i>
                        <h2>Your Transportation Zone is</h2>
                        <h1>{this.state.recs[0].zone.toUpperCase()}</h1>
                    </div>
            );
        }

        return (
            <div>
            {zone}
            </div>
        );
    }
}

export default Transportation;
