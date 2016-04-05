import React from 'react';
import axios from 'axios';
import format from 'format-number';

class Sales extends React.Component {
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
            .get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_saleshistory.php', {params: {'pid': pid}, timeout: 3000})
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    render() {
        var returnVal;
        if (typeof this.state.recs === 'object' && this.state.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Sale History</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Date</th>
                            <th>Price</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Deed Book</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Legal Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.sale_date}
                                        </td>
                                        <td>
                                            {format({'prefix': '$', 'truncate': 0})(object.sale_price)}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.deed_book}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.legal_reference}
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

export default Sales;
