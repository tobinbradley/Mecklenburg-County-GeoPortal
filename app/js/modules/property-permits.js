import React from 'react';
import axios from 'axios';
import format from 'format-number';


class Permits extends React.Component {
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
            .get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_featureoverlay.php',
            {
                params: {
                    'from_table': 'tax_parcels',
                    'to_table': 'building_permits',
                    'fields': 'extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost',
                    'parameters': `f.pid = '${pid}' and t.job_status = 'COMPL'`,
                    'order': 't.date_completed_co_process desc',
                    'limit': 10,
                    'from_geometryfield': 'the_geom',
                    'to_geometryfield': 'the_geom'
                }
            })
            .then(function(response) {
                _this.setState({ permits: response.data });
            });
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        var returnVal;
        if (typeof this.state.permits === 'object' && this.state.permits.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Permits</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Year</th>
                            <th className="mdl-data-table__cell--non-numeric">Project</th>
                            <th className="col-responsive">Area</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.permits.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.theyear}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.project_name}
                                        </td>
                                        <td className="col-responsive">
                                            {format({'suffix': ' Sq. Ft.', 'truncate': 0})(object.square_footage)}
                                        </td>
                                        <td>
                                            {format({'prefix': '$', 'truncate': 0})(object.construction_cost)}
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


export default Permits;
