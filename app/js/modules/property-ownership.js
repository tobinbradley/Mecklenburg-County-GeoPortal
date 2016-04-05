import React from 'react';
import axios from 'axios';

class Ownership extends React.Component {
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
            .get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_ownership.php', {params: {'pid': pid}})
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
                    <caption>Ownership</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Owner</th>
                            <th className="mdl-data-table__cell--non-numeric">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.first_name} {object.last_name}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.address_1} <br />
                                            {object.city}, {object.state} {object.zipcode}
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

export default Ownership;
