var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');

//var PropTypes = React.PropTypes;

var PropertyClass = React.createClass({
    propTypes: {
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired,
        pid: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.getData(this.props.pid, this.props.lat, this.props.lng);
    },
    componentWillReceiveProps: function(nextProps) {
        this.getData(nextProps.pid, nextProps.lat, nextProps.lng);
    },
    getData: function(pid, lat, lng) {
        this.setState({pid: pid});
        this.getCamaRecords(pid, 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_ownership.php', 'ownership');
        this.getCamaRecords(pid, 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_appraisal.php', 'appraisal');
        this.getCamaRecords(pid, 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_saleshistory.php', 'sales');
        this.getCamaRecords(pid, 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_landuse.php', 'landuse');
        this.getCamaRecords(pid, 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_cama_building.php', 'building');
        this.getZoning(lat, lng);
        this.getPermits(pid);
    },
    getCamaRecords: function(pid, url, stateVar) {
        var args = {
            'pid': pid
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get(url + objectToURI(args),
            function(err, res) {
                this.setState({ [stateVar]: res.body });
            }.bind(this)
        );
    },
    getZoning: function(lat, lng) {
        var args = {
            'x': lng,
            'y': lat,
            'srid': 4326,
            'table': 'view_zoning',
            'fields': 'zone_des, zone_class',
            'parameters': "zone_des <> 'sm_towns'",
            'geometryfield': 'the_geom'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_pointoverlay.php' + objectToURI(args),
            function(err, res) {
                this.setState({ zoning: res.body });
            }.bind(this)
        );
    },
    getPermits: function(pid) {
        var args = {
            'from_table': 'tax_parcels',
            'to_table': 'building_permits',
            'fields': 'extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost',
            'parameters': `f.pid = '${pid}' and t.job_status = 'COMPL'`,
            'order': 't.date_completed_co_process desc',
            'limit': 10,
            'from_geometryfield': 'the_geom',
            'to_geometryfield': 'the_geom'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_featureoverlay.php' + objectToURI(args),
            function(err, res) {
                this.setState({ permits: res.body });
            }.bind(this)
        );
    },
    render: function() {
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
                <PIDClass pid={this.state.pid} zoning={this.state.zoning} />
                <OwnershipClass recs={this.state.ownership} />
                <AppraisalClass recs={this.state.appraisal} />
                <SalesClass recs={this.state.sales} />
                <LandUseClass recs={this.state.landuse} />
                <BuildingsClass recs={this.state.building} />
                <PermitsClass recs={this.state.permits} />
                {moreInfo}
            </div>
        );
    }

});

module.exports = PropertyClass;



var PIDClass = React.createClass({
    render: function() {
        return (
            <div className="report-record-highlight">
                <i className="icon-home"></i>
                <h2>Tax Parcel</h2>
                <h1>{this.props.pid}</h1>
                <ZoningClass recs={this.props.zoning}/>
            </div>
        );
    }
});

var ZoningClass = React.createClass({
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object' && this.props.recs.length > 0) {
            returnVal = (
                <h3>Zoned as {this.props.recs[0].zone_class} {this.props.recs[0].zone_des}</h3>
            );
        }
        return (
            <div>
                {returnVal}
            </div>
        );
    }

});



var OwnershipClass = React.createClass({
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object' && this.props.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Ownership</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Owner</th>
                            <th className="mdl-data-table__cell--non-numeric">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.first_name} {object.last_name}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.address_1} <br />
                                            {object.city}, {object.state} {object.zipcode}
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
            <div>{returnVal}</div>
        );
    }

});

var AppraisalClass = React.createClass({
    money: function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = parseInt(val).toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return '$' + val;
    },
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object' && this.props.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Tax Appraisal</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Year</th>
                            <th>Building</th>
                            <th className="col-responsive">Land</th>
                            <th className="col-responsive">Extra</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.tax_year}
                                        </td>
                                        <td>
                                            {this.money(object.building_value)}
                                        </td>
                                        <td className="col-responsive">
                                            {this.money(object.land_value)}
                                        </td>
                                        <td className="col-responsive">
                                            {this.money(object.extra_features_value)}
                                        </td>
                                        <td>
                                            {this.money(object.total_value)}
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
            <div>{returnVal}</div>
        );
    }
});

var SalesClass = React.createClass({
    money: function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = parseInt(val).toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return '$' + val;
    },
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object' && this.props.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Sale History</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Date</th>
                            <th>Price</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Deed Book</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Legal Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.sale_date}
                                        </td>
                                        <td>
                                            {this.money(Number(object.sale_price).toFixed(0))}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.deed_book}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.legal_reference}
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
            <div>{returnVal}</div>
        );
    }
});

var LandUseClass = React.createClass({
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object'  && this.props.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Land Use</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Use</th>
                            <th>Units</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Neighborhood</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.land_use}
                                        </td>
                                        <td>
                                            {Number(object.units).toFixed(0)}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.neighborhood}
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
            <div>{returnVal}</div>
        );
    }

});

var BuildingsClass = React.createClass({
    commafy: function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = parseInt(val).toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    },
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object'  && this.props.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Buildings</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Structure</th>
                            <th>Year Built</th>
                            <th className="mdl-data-table__cell--non-numeric col-responsive">Exterior</th>
                            <th className="mdl-data-table__cell--non-numeric">Area</th>
                            <th className="col-responsive">Beds</th>
                            <th className="col-responsive">Baths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.property_use_description}
                                        </td>
                                        <td>
                                            {object.year_built}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric col-responsive">
                                            {object.exterior_wall_description}
                                        </td>
                                        <td>
                                            {this.commafy(object.total_square_feet)} ft<sup>2</sup>
                                        </td>
                                        <td className="col-responsive">
                                            {object.bedrooms}
                                        </td>
                                        <td className="col-responsive">
                                            {Number(object.full_baths) + Number(object.three_quarter_baths) + Number(object.half_baths)}
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
            <div>{returnVal}</div>
        );
    }
});



var PermitsClass = React.createClass({
    commafy: function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = parseInt(val).toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    },
    render: function() {
        var returnVal;
        if (typeof this.props.recs === 'object' && this.props.recs.length > 0) {
            returnVal = (
                <table className="mdl-data-table mdl-js-data-table">
                    <caption>Permits</caption>
                    <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Year</th>
                            <th className="mdl-data-table__cell--non-numeric">Project</th>
                            <th className="col-responsive">Area</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.recs.map(function(object, i){
                                return (
                                    <tr key={i}>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.theyear}
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {object.project_name}
                                        </td>
                                        <td className="col-responsive">
                                            {this.commafy(object.square_footage)} ft<sup>2</sup>
                                        </td>
                                        <td>
                                            ${this.commafy(object.construction_cost)}
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
            <div>{returnVal}</div>
        );
    }

});
