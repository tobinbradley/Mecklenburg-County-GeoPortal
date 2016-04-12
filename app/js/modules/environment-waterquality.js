import React from 'react';
import axios from 'axios';

class WaterQuality extends React.Component {
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
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_feature/v1/tax_parcels/water_quality_buffers`,
            {
                params: {
                    'columns': 'distinct type,label',
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
                returnVal = (
                    <div className="report-record-highlight">
                        <i className="icon icon-droplet" role="presentation"></i>
                        <h2>This property is in a</h2>
                        <h1>WATER QUALITY BUFFER</h1>
                        <h4><a target="_blank" href="ftp://ftp1.co.mecklenburg.nc.us/WaterQuality/WQ%20Buffers/WaterQualityBufferImplementationGuidelines.pdf">Special restrictions may apply</a>. For more information,
                        please call 704.336.5456 for existing single-family lots and those projects not needing a grading permit or call 704.432.5570 for
                        other projects.</h4>
                </div>
            );
            } else {
                returnVal = (
                    <div className="report-record-highlight">
                        <i className="icon icon-droplet" role="presentation"></i>
                        <h2>This property is not in a Water Quality Buffer.</h2>
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


export default WaterQuality;
