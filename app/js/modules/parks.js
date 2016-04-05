import React from 'react';
import axios from 'axios';
import format from 'format-number';

class ParkInfo extends React.Component {
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
            .get(`http://maps.co.mecklenburg.nc.us/api/nearest/v1/parks_all/${lng},${lat}/4326`,
            {
                params: {
                    'columns': 'name, address, city, st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat',
                    'limit': '6'
                }
            })
            .then(function(response) {
                _this.setState({ theParks: response.data });
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
                        <h4>{format({'truncate': 1, 'suffix': ' miles'})(this.state.theParks[0].distance / 5280)}</h4>
                    </div>
                    <table className="mdl-data-table mdl-js-data-table">
                        <caption>Other Parks Nearby</caption>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Park</th>
                                <th className="mdl-data-table__cell--non-numeric">Address</th>
                                <th className="col-responsive">Distance</th>
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
                                            <td className="nowrap col-responsive">
                                                {format({'truncate': 1, 'suffix': ' miles'})(object.distance / 5280)}
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

}

ParkInfo.propTypes = {
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired
};

module.exports = ParkInfo;
