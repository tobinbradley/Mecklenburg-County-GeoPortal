import React from 'react';
import axios from 'axios';
import format from 'format-number';

class Buildings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetchData(this.props.pid);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.pid);
    }

    fetchData(pid) {
        let _this = this;
        this.serverRequest = axios
            .get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_building.php', {params: {'pid': pid}})
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        var returnVal;
        if (typeof this.state.recs === 'object' && this.state.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Buildings</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Structure</th>
                            <th>Year Built</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Exterior</th>
                            <th className="mdl-data-table__cell--non-numeric">Area</th>
                            <th className="col-responsive">Beds</th>
                            <th className="col-responsive">Baths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.property_use_description}
                                        </td>
                                        <td>
                                            {object.year_built}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.exterior_wall_description}
                                        </td>
                                        <td>
                                            {format({'truncate': 0, 'suffix': ' Sq. Ft.'})(object.total_square_feet)}
                                        </td>
                                        <td className="col-responsive">
                                            {object.bedrooms}
                                        </td>
                                        <td className="col-responsive">
                                            {Number(object.full_baths) + Number(object.three_quarter_baths) + Number(object.half_baths)}
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
            <div>{returnVal}</div>
        );
    }
}

export default Buildings;
