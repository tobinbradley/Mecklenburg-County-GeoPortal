import React from 'react';
import axios from 'axios';
import format from 'format-number';

class Appraisal extends React.Component {
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
            .get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_appraisal.php', {params: {'pid': pid}})
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
                    <caption>Tax Appraisal</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Year</th>
                            <th>Building</th>
                            <th className="col-responsive">Land</th>
                            <th className="col-responsive">Extra</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.tax_year}
                                        </td>
                                        <td>
                                            {format({'prefix': '$', 'truncate': 0})(object.building_value)}
                                        </td>
                                        <td className="col-responsive">
                                            {format({'prefix': '$', 'truncate': 0})(object.land_value)}
                                        </td>
                                        <td className="col-responsive">
                                            {format({'prefix': '$', 'truncate': 0})(object.extra_features_value)}
                                        </td>
                                        <td>
                                            {format({'prefix': '$', 'truncate': 0})(object.total_value)}
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

export default Appraisal;
