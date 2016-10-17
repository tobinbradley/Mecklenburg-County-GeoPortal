import React from 'react';
import axios from 'axios';


class Floodplain extends React.Component {
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
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_feature/v1/tax_parcels/view_regulated_floodplains`,
            {
                params: {
                    'columns': 't.gid',
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
            if (this.state.recs.length > 0) {
                var fz = 'http://meckmap.mecklenburgcountync.gov/3dfz/index.html#matid=' + this.props.gid;
                returnVal = (
                    <div className="report-record-highlight">
                        <i role="presentation" className="material-icons">flash_on</i>
                        <h2>This property is in a</h2>
                        <h1>REGULATED FLOODPLAIN</h1>
                        <h4><a target="_blank" href={fz}>Special restrictions may apply</a>. For more information, please call 704.336.3728.</h4>
                    </div>
                );
            } else {
                returnVal = (
                    <div className="report-record-highlight">
                        <i className="icon icon-rain-inv" role="presentation"></i>
                        <h2>This property is not in a regulated floodplain.</h2>
                    </div>
                );
            }
        }

        return (
			<div>
			{returnVal}
			</div>
		);
    }
}

export default Floodplain;
