import React from 'react';
import axios from 'axios';
import format from 'format-number';

class Landuse extends React.Component {
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
            .get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_landuse.php', {params: {'pid': pid}})
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
                    <caption>Land Use</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Use</th>
                            <th>Units</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Neighborhood</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.land_use}
                                        </td>
                                        <td>
                                            {format({'truncate': 0})(object.units)}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.neighborhood}
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

export default Landuse;
