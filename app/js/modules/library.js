import React from 'react';
import axios from 'axios';
import format from 'format-number';

class LibraryInfo extends React.Component {
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
            .get(`http://maps.co.mecklenburg.nc.us/api/nearest/v1/libraries/${lng},${lat}/4326`,
            {
                params: {
                    'geom_column': 'the_geom',
                    'columns': 'name, address, city, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat',
                    'limit': '6'
                }
            })
            .then(function(response) {
                _this.setState({ theLibraries: response.data });
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
        if (typeof this.state.theLibraries === 'object') {
            var otherLibraries = this.state.theLibraries.slice(0);
            otherLibraries.shift();

            var libraries = (
                <div className="mdl-typography--text-center">
                    <div className="report-record-highlight">
                        <i role="presentation" className="material-icons">local_library</i>
                        <h2>Your closest library is</h2>
                        <h1>{this.state.theLibraries[0].name}</h1>
                        <h3><a href="javascript:void(0)"
                            data-lat={this.state.theLibraries[0].lat}
                            data-lng={this.state.theLibraries[0].lng}
                            data-label={this.state.theLibraries[0].name}
                            data-address={this.state.theLibraries[0].address + ', ' + this.state.theLibraries[0].city}
                            onClick={this.handleLocationClick}>{this.state.theLibraries[0].address + ', ' + this.state.theLibraries[0].city}</a></h3>
                        <h4>{format({'truncate': 1, 'suffix': ' miles'})(this.state.theLibraries[0].distance / 5280)}</h4>
                    </div>
                    <table className="mdl-data-table mdl-js-data-table">
                        <caption>Other Libraries Nearby</caption>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Library</th>
                                <th className="mdl-data-table__cell--non-numeric">Address</th>
                                <th className="col-responsive">Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                otherLibraries.map(function(object, i){
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
                        <li><a href="http://www.plcmc.org/" target="_blank">Charlotte Mecklenburg Library</a></li>
                    </ul>
				</div>
			);
        }

        return (
            <div>
                {libraries}
				{moreInfo}
            </div>
        );

    }
}

LibraryInfo.propTypes = {
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired
};


module.exports = LibraryInfo;
