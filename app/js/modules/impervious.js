var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');


var ImperviousInfo = React.createClass({
    propTypes: {
        pid: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.getImpervious(this.props.pid);
    },
    componentWillReceiveProps: function(nextProps) {
        this.getImpervious(nextProps.pid);
    },
    getImpervious: function(pid) {
        var args = {
            'table': 'impervious_surface_area',
            'fields': 'sum(sum_of_area) as area, subtheme',
            'parameters': `commonpid='${pid}' group by subtheme`,
            'order': 'subtheme'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_attributequery.php' + objectToURI(args),
            function(err, res) {
                this.setState({ theImpervious: res.body });
            }.bind(this)
        );
    },
    prettyNumber: function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = parseInt(val).toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    },
    render: function() {

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
                        <i className="icon icon-rain-1" role="presentation"></i>
                        <h2>You have</h2>
                        <h1>{this.prettyNumber(theTotal)}  ft<sup>2</sup></h1>
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
                                                {this.prettyNumber(object.area)} ft<sup>2</sup>
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

});

module.exports = ImperviousInfo;
