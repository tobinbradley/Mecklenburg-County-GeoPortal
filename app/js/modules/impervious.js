import React from 'react';
import axios from 'axios';
import format from 'format-number';

class ImperviousInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.pid);
    }

    componentDidMount() {
        this.fetchData(this.props.pid);
    }

    fetchData(pid) {
        let _this = this;
        this.serverRequest = axios
            .get('http://maps.co.mecklenburg.nc.us/api/query/v1/impervious_surface_area',
            {
                params: {
                    'columns': 'sum(sum_of_area) as area, subtheme',
                    'filter': `commonpid='${pid}'`,
                    'sort': 'subtheme',
                    'group': 'subtheme'
                }
            })
            .then(function(response) {
                _this.setState({ theImpervious: response.data });
            });
    }

    render() {
        var tableStyle={
            'minWidth': '300px',
            'maxWidth': '100%'
        };

        if (typeof this.state.theImpervious === 'object') {
            var theTotal = 0;
            this.state.theImpervious.forEach(function(item) {
                theTotal = theTotal + Number(item.area);
            });

            var impervious = (
                <div className="mdl-typography--text-center">
                    <div className="report-record-highlight">
                        <i role="presentation" className="material-icons">invert_colors_off</i>
                        <h2>You have</h2>
                        <h1>{format({'truncate': 0, 'suffix': ' Sq. Ft.'})(theTotal)}</h1>
                        <h3>of Impervious Surface</h3>
                        <h4></h4>
                    </div>
                    <table className="mdl-data-table mdl-js-data-table" style={tableStyle}>
                        <caption>Details</caption>
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Type</th>
                                <th>Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.theImpervious.map(function(object, i){
                                    return (
                                        <tr key={i}>
                                            <td className="mdl-data-table__cell--non-numeric">
                                                {object.subtheme}
                                            </td>
                                            <td className="nowrap">
                                                {format({'truncate': 0, 'suffix': ' Sq. Ft.'})(object.area)}
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
					<p>Impervious surfaces are mainly artificial structures, such as pavements (roads, sidewalks, driveways and parking lots) and rooftops that are covered by impenetrable materials such as asphalt, concrete, brick, wood and stone.</p>
                    <h5>For more information, please visit:</h5>
					<ul className="list-unstyled">
                        <li><a href="http://charmeck.org/stormwater/FeesandBilling/Pages/Default.aspx" target="_blank">Charlotte-Mecklenburg Storm Water Services</a></li>
                    </ul>
				</div>
			);
        }

        return (
            <div>
                {impervious}
				{moreInfo}
            </div>
        );

    }

}

ImperviousInfo.propTypes = {
    pid: React.PropTypes.string.isRequired
};

module.exports = ImperviousInfo;
