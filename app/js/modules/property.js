import React from 'react';
import Permits from './property-permits.js';
import Ownership from './property-ownership.js';
import Appraisal from './property-appraisal.js';
import Sales from './property-sales.js';
import Landuse from './property-landuse.js';
import Buildings from './property-buildings.js';
import PID from './property-pid.js';


class PropertyClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var moreInfo = (
            <div className="report-moreinfo mdl-typography--text-left">
                <h5>For more information, please visit:</h5>
                <ul className="list-unstyled">
                    <li><a href="http://polaris.mecklenburgcountync.gov/" target="_blank">POLARIS</a></li>
                    <li><a href="http://charmeck.org/mecklenburg/county/AssessorsOffice/Pages/Home.aspx" target="_blank">County Assessor's Office</a></li>
                    <li><a href="http://charmeck.org/city/charlotte/planning/Pages/Home.aspx" target="_blank">Charlotte-Mecklenburg Planning</a></li>
                </ul>
            </div>
        );
        return (
            <div className="mdl-typography--text-center">
                <PID pid={this.props.pid} lat={this.props.lat} lng={this.props.lng} />
                <Ownership pid={this.props.pid} />
                <Appraisal pid={this.props.pid} />
                <Sales pid={this.props.pid} />
                <Landuse pid={this.props.pid} />
                <Buildings pid={this.props.pid} />
                <Permits pid={this.props.pid} />
                {moreInfo}
            </div>
        );
    }

}

PropertyClass.propTypes = {
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
    pid: React.PropTypes.string.isRequired
};

module.exports = PropertyClass;
