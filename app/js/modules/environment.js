import React from 'react';
import WaterQuality from './environment-waterquality';
import Floodplain from './environment-floodplain';
import PostConstruction from './environment-postconstruction';
import Soil from './environment-soil';
import Watershed from './environment-watershed';



var EnvironmentComponent = React.createClass({
    propTypes: {
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired,
        pid: React.PropTypes.string.isRequired,
        gid: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return {};
    },
    render: function() {
        let moreInfo = (
            <div className="report-moreinfo mdl-typography--text-left">
                <h5>For more information, please visit:</h5>
                <ul className="list-unstyled">
                    <li><a href="http://charmeck.org/stormwater/Pages/default.aspx" target="_blank">Storm Water Services</a></li>
                    <li><a href="http://charmeck.org/mecklenburg/county/WaterandLandResources/Pages/default.aspx" target="_blank">Water &amp; Land Resources</a></li>
                    <li><a href="ftp://ftp1.co.mecklenburg.nc.us/WaterQuality/WQ%20Buffers/WaterQualityBufferImplementationGuidelines.pdf" target="_blank">Water Quality Buffer Implementation Guidelines</a></li>
                </ul>
            </div>
        );

        return (
            <div>
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <Floodplain pid={this.props.pid} />
                    </div>                    
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <WaterQuality pid={this.props.pid} />
                    </div>
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <PostConstruction pid={this.props.pid} />
                    </div>
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <Watershed lat={this.props.lat} lng={this.props.lng} />
                    </div>
                </div>
                <div className="mdl-typography--text-center">
                    <Soil pid={this.props.pid} />
                </div>
                {moreInfo}
            </div>
        );
    }
});

module.exports = EnvironmentComponent;
