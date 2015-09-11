var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');



var EnvironmentComponent = React.createClass({
    getInitialState: function() {
        return {}
    },
    getData(lat, lng, pid, gid) {
        this.setState({gid: gid});
        // floodplain
        this.polyOverlay(pid, 'view_regulated_floodplains', 't.gid', 'floodplain');
        // soil
        this.polyOverlay(pid, 'soil', 'distinct name,description,hydrologic_group', 'soil');
        // WATER QUALITY buffers
        this.polyOverlay(pid, 'water_quality_buffers', 'distinct type,label', 'waterquality');
        // post construction
        this.polyOverlay(pid, 'post_construction_layers', 'type, name', 'postconstruction');
    },
    pointOverlay: function(lat, lng) {

    },
    polyOverlay: function(pid, table, fields, theState) {
        var args = {
                    'from_table': 'tax_parcels',
                    'to_table': table,
                    'fields': fields,
                    'parameters': `f.pid = '${pid}'`,
                    'from_geometryfield': 'the_geom',
                    'to_geometryfield': 'the_geom'
                    };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_featureoverlay.php' + objectToURI(args),
            function(err, res) {
				this.setState({ [theState]: res.body });
            }.bind(this)
        );
    },
    render: function() {
        var moreInfo;

        if (typeof this.state.floodplain === 'object') {
            moreInfo = (
                <div className="report-moreinfo mdl-typography--text-left">
                    <h5>For more information, please visit:</h5>
                    <ul className="list-unstyled">
                        <li><a href="http://charmeck.org/stormwater/Pages/default.aspx" target="_blank">Storm Water Services</a></li>
                        <li><a href="http://charmeck.org/mecklenburg/county/WaterandLandResources/Pages/default.aspx" target="_blank">Water &amp; Land Resources</a></li>
                        <li><a href="ftp://ftp1.co.mecklenburg.nc.us/WaterQuality/WQ%20Buffers/WaterQualityBufferImplementationGuidelines.pdf" target="_blank">Water Quality Buffer Implementation Guidelines</a></li>
                    </ul>
                </div>
            );
        }

        return (
            <div>
                <div className="mdl-typography--text-center">
                    <FloodplainComponent recs={this.state.floodplain} gid={this.state.gid} />
                </div>
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <WaterQualityComponent recs={this.state.waterquality} />
                    </div>
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <PostConstructionComponent recs={this.state.postconstruction} />
                    </div>
                </div>
                <div className="mdl-typography--text-center">
                    <SoilComponent recs={this.state.soil} />
                </div>
                {moreInfo}
            </div>
        );
    }
});



var FloodplainComponent = React.createClass({
	render: function() {
		var returnVal;

        if (typeof this.props.recs === 'object') {
            if (this.props.recs.length > 0) {
                var fz = "http://meckmap.mecklenburgcountync.gov//3dfz/index.html#matid=" + this.props.gid;
                returnVal = (
    				<div className="report-record-highlight">
    					<i className="icon icon-rain-inv" role="presentation"></i>
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
});


var PostConstructionComponent = React.createClass({
	render: function() {
		var returnVal;

        if (typeof this.props.recs === 'object') {
            var uhoh = this.props.recs.filter(function(item) { return item.type === 'TRANSIT CORRIDOR' || item.type === 'BUSINESS CORRIDOR'; });
            uhoh = uhoh.map(function(item) { return item.type });

            if (uhoh.length > 0) {
                uhoh = uhoh.join(' and ').replace('BUSINESS CORRIDOR', 'Distressed Business District'.toUpperCase()).replace('TRANSIT CORRIDOR', 'Transit Station Area'.toUpperCase());
                returnVal = (
    				<div className="report-record-highlight">
    					<i className="icon icon-tools" role="presentation"></i>
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
});


var WaterQualityComponent = React.createClass({
	render: function() {
		var returnVal;

        if (typeof this.props.recs === 'object') {
            if (this.props.recs.length > 0) {
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
});


var SoilComponent = React.createClass({
	render: function() {
		var returnVal;

        if (typeof this.props.recs === 'object') {
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
                                this.props.recs.map(function(object, i){
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
});


module.exports = EnvironmentComponent;
