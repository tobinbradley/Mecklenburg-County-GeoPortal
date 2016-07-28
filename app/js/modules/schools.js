import React from 'react';
import axios from 'axios';
import format from 'format-number';
import Magnet from './schools-magnet';
import Transportation from './schools-transportation';
import HomeSchool from './schools-home';


var SchoolInfo = React.createClass({
    propTypes: {
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return {};
    },
    render: function() {
        let moreInfo = (
                <div className="report-moreinfo mdl-typography--text-left">
                    <p>
                    Transportation eligibility is determined by the transportation zone in which you live. The county is divided into four transportation zones:  violet, grey, blue, and green. Magnet schools are assigned a zone to serve with transportation. If the distance is to the magnet greater than 5 miles, you may be assigned to a shuttle stop location. Some programs (*) provide county-wide transportation, meaning that regardless of your zone, you would receive transportation. For more information please contact Charlotte-Mecklenburg School Transportation Services at (980) 343-6715.
                    </p>
                    <h5>For more information, please visit:</h5>
                    <ul className="list-unstyled">
                        <li><a href="http://www.cms.k12.nc.us/" target="_blank">Charlotte-Mecklenburg Schools</a></li>
                    </ul>
                </div>
            );

        return (
            <div>
                <div className="mdl-typography--text-center">
                    <HomeSchool lat={this.props.lat} lng={this.props.lng} filter="ELEMENTARY" layer="elementary_school_districts" />
                </div>
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <HomeSchool lat={this.props.lat} lng={this.props.lng} filter="MIDDLE" layer="middle_school_districts" />
                    </div>
                    <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                        <HomeSchool lat={this.props.lat} lng={this.props.lng} filter="HIGH" layer="high_school_districts" />
                    </div>
                </div>
                <div className="mdl-typography--text-center">
                    <Transportation lat={this.props.lat} lng={this.props.lng} />
                </div>
                <Magnet lat={this.props.lat} lng={this.props.lng} />
                {moreInfo}
            </div>
        );

    }

});

module.exports = SchoolInfo;
