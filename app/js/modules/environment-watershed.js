import React from 'react';
import axios from 'axios';


class Watershed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetchData(this.props.lng, this.props.lat);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.lng, nextProps.lat);
    }

    fetchData(lng, lat) {
        let _this = this;
        axios
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/watersheds/${lng},${lat}/4326`,
            {
                params: {
                    'columns': 'name',
                    'geom_column': 'the_geom'
                }
            })
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    render() {
        var returnVal;

        if (typeof this.state.recs === 'object' && this.state.recs.length > 0) {
            returnVal = (
                <div className="report-record-highlight">
                    <i role="presentation" className="material-icons">terrain</i>
                    <h2>This property is in the</h2>
                    <h1>{this.state.recs[0].name.toUpperCase()} WATERSHED</h1>
                    <h4>A watershed, or drainage basin, is an area of land where all surface water converges to a single point at a lower elevation,
                    usually the exit of the basin such as a river, lake, or wetland.</h4>
                </div>
            );
        }

        return (
			<div>
			{returnVal}
			</div>
		);
    }
}

export default Watershed;
