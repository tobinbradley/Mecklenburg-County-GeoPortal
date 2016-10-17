import React from 'react';
import axios from 'axios';


class PostConstruction extends React.Component {
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
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_feature/v1/tax_parcels/post_construction_layers`,
            {
                params: {
                    'columns': 'type, name',
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
            var uhoh = this.state.recs.filter(function(item) { return item.type === 'TRANSIT CORRIDOR' || item.type === 'BUSINESS CORRIDOR'; });
            uhoh = uhoh.map(function(item) { return item.type; });

            if (uhoh.length > 0) {
                uhoh = uhoh.join(' and ').replace('BUSINESS CORRIDOR', 'Distressed Business District'.toUpperCase()).replace('TRANSIT CORRIDOR', 'Transit Station Area'.toUpperCase());
                returnVal = (
                    <div className="report-record-highlight">
                        <i role="presentation" className="material-icons">build</i>
                        <h2>This property is in a</h2>
                        <h1>{uhoh}</h1>
                        <h4><a href="http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx" target="_blank">PCCO mitigation options apply</a>. For more information, please call 704.432.5570.</h4>
                    </div>
                );
            } else {
                returnVal = (
                    <div className="report-record-highlight">
                        <i className="icon icon-tools" role="presentation"></i>
                        <h2>This property is not in a Distressed Business District or Transit Station Area.</h2>
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

export default PostConstruction;
