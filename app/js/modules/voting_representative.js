import React from 'react';
import axios from 'axios';


class Representative extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.lng) {
            this.fetchData(this.props.lng, this.props.lat, this.props.layer, this.props.column);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lng) {
            this.fetchData(nextProps.lng, nextProps.lat, nextProps.layer, nextProps.column);
        }
    }

    fetchData(lng, lat, layer, distField) {
        let _this = this;
        axios
            .get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/${layer}/${lng},${lat}/4326`,
            {
                params: {
                    'geom_column': 'the_geom',
                    'columns': `${distField} as district`
                }
            })
            .then(function(response) {
                _this.setState({ recs: response.data });
            });
    }

    render() {
        var returnVal;

        let _this = this;



        // Go if you have officials
        if (typeof _this.props.officials === 'object') {
            if (typeof _this.props.lng === 'number') {
                // not senate
                if (typeof _this.state.recs === 'object' && _this.state.recs.length > 0) {
                    // filter reps
                    let reps = _this.props.officials.filter(function(r) { return r.district_type === _this.props.filter && r.district == _this.state.recs[0].district; });
                    let atlarge = _this.props.officials.filter(function(r) { return r.district_type === _this.props.filter && r.district === 'At-Large'; });

                    var atLargeText = '';
                    if ( atlarge.length > 0 ) {
                        atLargeText = 'At Large: ' + atlarge.map(function(item) { return item.representative; }).join(', ');
                    }

                    returnVal = (
                        <div className="report-record-highlight">
                            <i className="icon icon-user" role="presentation"></i>
                            <h2>Your {this.props.label} Representative is</h2>
                            <h1>{reps[0].representative}</h1>
                            <h3>District {this.state.recs[0].district}</h3>
                            <h4>{atLargeText}</h4>
                            </div>
                        );
                }
            } else {
                // senate
                let reps = _this.props.officials.filter(function(r) { return r.district_type === _this.props.filter; });
                returnVal = (
                    <div className="report-record-highlight">
                    <i className="icon icon-user" role="presentation"></i>
                    <h2>Your {this.props.label} Representatives are</h2>
                        {
                            reps.map(function(object, i){
                                return (
                                    <h1 key={i}>{object.representative}</h1>
                                );
                            }, this)
                        }
                        </div>
                    );
            }

        }

        // get officials

        // if (!isNaN(parseInt(this.props.recs))) {
        //     var rep = this.props.officials.filter(function(r) { return r.district_type === this.props.filter && r.district == this.props.recs; }.bind(this));
        //     var atlarge = this.props.officials.filter(function(r) { return r.district_type === this.props.filter && r.district === 'At-Large'; }.bind(this));
        //
        //     var atLargeText = '';
        //     if ( atlarge.length > 0 ) {
        //         atLargeText = 'At Large: ' + atlarge.map(function(item) { return item.representative; }).join(', ');
        //     }
        //
        //     returnVal = (
		// 		<div className="report-record-highlight">
		// 			<i className="icon icon-user" role="presentation"></i>
		// 			<h2>Your {this.props.type} Representative is</h2>
		// 			<h1>{rep[0].representative}</h1>
		// 			<h3>District {this.props.recs}</h3>
		// 			<h4>{atLargeText}</h4>
		// 		</div>
		// 	);
        // }

        return (
			<div>
			{returnVal}
			</div>
		);
    }
}


export default Representative;
