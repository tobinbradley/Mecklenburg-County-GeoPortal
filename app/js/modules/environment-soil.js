import React from 'react';
import axios from 'axios';


class Soil extends React.Component {
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
        axios
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_feature/v1/tax_parcels/soil`,
            {
                params: {
                    'columns': 'distinct name,description,hydrologic_group',
                    'filter': `f.pid = '${pid}'`,
                    'geom_column_from': 'the_geom',
                    'geom_column_to': 'the_geom'
                }
            })
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    render() {
        var returnVal;

        if (typeof this.state.recs === 'object') {
            returnVal = (
                    <table className="mdl-data-table mdl-js-data-table">
                        <caption>Soil Types</caption>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Type</th>
                                <th className="mdl-data-table__cell--non-numeric">Group</th>
                                <th className="mdl-data-table__cell--non-numeric">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.recs.map(function(object, i){
                                    return (
                                        <tr key={i}>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                {object.name}
                                            </td>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                {object.hydrologic_group}
                                            </td>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                {object.description}
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
			{returnVal}
			</div>
		);
    }
}

export default Soil;
