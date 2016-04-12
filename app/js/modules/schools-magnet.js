import React from 'react';
import axios from 'axios';
import format from 'format-number';


class Magnet extends React.Component {
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

    getAsterik(id) {
        if ([4429, 8364, 5532, 8482, 7405, 7496, 5520].indexOf(Number(id)) !== -1) {
            return '*';
        } else {
            return '';
        }
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

    fetchData(lat, lng) {
        let _this = this;
        this.serverRequest = axios
            .get(`http://maps.co.mecklenburg.nc.us/api/query/v1/view_schools_magnet`,
            {
                params: {
                    'columns': `schl, schlname, address, city, ST_Distance(the_geom,ST_Transform(GeomFromText('POINT( ${lng} ${lat} )',4326), 2264)) as distance, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat`,
                    'sort': 'distance'
                }
            })
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    render() {
        var magnet;
        if (typeof this.state.recs === 'object') {
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
                                this.state.recs.map(function(object, i){
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
                                                {format({'truncate': 1, 'suffix': ' miles'})(object.distance / 5280)}
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
}

export default Magnet;
