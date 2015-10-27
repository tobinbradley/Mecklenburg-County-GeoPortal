// Test information
// 3810 Warrington is orange (odd)
// 5501 Ruth is green (even)

var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');

var TrashInfo = React.createClass({
    propTypes: {
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.getTrash(this.props.lat, this.props.lng);
    },
    componentWillReceiveProps: function(nextProps) {
        this.getTrash(nextProps.lat, nextProps.lng);
    },
    getTrash: function(lat, lng) {
        var args = {
            'geom_column': 'the_geom',
            'columns': 'jurisdiction, day, week, type'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get(`http://maps.co.mecklenburg.nc.us:80/api/intersect_point/v1/solid_waste/${lng},${lat}/4326` + objectToURI(args),
            function(err, res) {
                this.setState({ theTrash: res.body });
            }.bind(this)
        );
    },
    checkOddEven: function(num) {
        if(num % 2 === 0) {
            return 'even';
        } else {
            return 'odd';
        }
    },
    weekNumber: function(d) {
        // the length of a week
        var one_week = 1000 * 60 * 60 * 24 * 7;
        // the start of a Green or A week
        var a = new Date('2015-08-30').getTime();

        var weekN = Math.floor((d - a) / one_week);
        return weekN;
    },
    weekEvenOdd: function(w) {
        if (w === 'A' || w === 'GREEN') {
            return 'even';
        } else {
            return 'odd';
        }
    },
    recyclingWeek: function(w) {
        var theDate = new Date().getTime();
        var currentWeek = this.checkOddEven(this.weekNumber(theDate));
        var propertyWeek = this.weekEvenOdd(w);

        if (currentWeek === propertyWeek) {
            return 'this week';
        } else {
            return 'next week';
        }
    },
    render: function() {
        var trash, moreInfo;

        if (typeof this.state.theTrash === 'object') {
            if (this.state.theTrash.length === 0) {
                trash = (
                    <div className="mdl-typography--text-center">
                        <div className="report-record-highlight">
                            <i className="icon icon-trash" role="presentation"></i>
                            <h2>Unfortunately we only know collection information for Huntersville, Cornelius, and Charlotte. For collection information for you location, please visit you local government web site.</h2>
                        </div>
                    </div>
                );
            } else {
                var item = this.state.theTrash[0];

                var tableStyle={
                    'minWidth': '300px',
                    'maxWidth': '100%'
                };

                if (item.jurisdiction === 'huntersville') {
                    trash = (
                        <div className="mdl-grid">
                            <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                                <div className="report-record-highlight">
                                    <i className="icon icon-trash" role="presentation"></i>
                                    <h2>Your TRASH day is</h2>
                                    <h1>{item.day.toUpperCase()}</h1>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                                <div className="report-record-highlight">
                                    <i className="icon icon-recycle" role="presentation"></i>
                                    <h2>Your RECYCLING day is</h2>
                                    <h1>{item.day.toUpperCase()}  {this.recyclingWeek(item.week)}</h1>
                                    <h4>Recycling pickup is every other week.</h4>
                                </div>
                            </div>
                        </div>
                    );
                } else if (item.jurisdiction === 'cornelius') {
                    trash = (
                        <div className="mdl-typography--text-center">
                            <div className="report-record-highlight">
                                <i className="icon icon-trash" role="presentation"></i>
                                <h2>Your collection day is</h2>
                                <h1>{item.day.toUpperCase()}</h1>
                                <h3>for {item.type}</h3>
                                <h4></h4>
                            </div>
                        </div>
                    );

                } else {
                    var garbage = this.state.theTrash.filter(function(rec) { return rec.type === 'GARBAGE'; });
                    var recycling = this.state.theTrash.filter(function(rec) { return rec.type === 'RECYCLING'; });
                    var yard = this.state.theTrash.filter(function(rec) { return rec.type === 'YARD WASTE'; });
                    var bulk = this.state.theTrash.filter(function(rec) { return rec.type === 'BULKY'; });
                    trash = (
                        <div>
                            <div className="mdl-grid">
                                <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                                    <div className="report-record-highlight">
                                        <i className="icon icon-trash" role="presentation"></i>
                                        <h2>Your TRASH day is</h2>
                                        <h1>{garbage[0].day.toUpperCase()}</h1>
                                    </div>
                                </div>
                                <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet mdl-typography--text-center">
                                    <div className="report-record-highlight">
                                        <i className="icon icon-recycle" role="presentation"></i>
                                        <h2>Your RECYCLING day is</h2>
                                        <h1>{recycling[0].day.toUpperCase()} {this.recyclingWeek(recycling[0].week)}</h1>
                                        <h4>Recycling pickup is every other week ({recycling[0].week})</h4>
                                    </div>
                                </div>
                            </div>
                            <table className="mdl-data-table" style={tableStyle}>
                                <caption>Other Collection Services</caption>
                                <thead>
                                    <tr>
                                        <th className="mdl-data-table__cell--non-numeric">Collection Service</th>
                                        <th className="mdl-data-table__cell--non-numeric">Day</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            Yard Waste
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {yard[0].day}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            Bulky Items
                                        </td>
                                        <td className="mdl-data-table__cell--non-numeric">
                                            {bulk[0].day} <br /> Call 311 to schedule.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                }

                moreInfo = (
                    <div className="report-moreinfo mdl-typography--text-left">
                        <h5>For more information, please visit:</h5>
                        <ul className="list-unstyled">
                            <li><a href="http://charmeck.org/city/charlotte/SWS" target="_blank">Charlotte Solid Waste Services</a></li>
                            <li><a href="http://www.cornelius.org/index.aspx?nid=208" target="_blank">Cornelius Solid Waste Services</a></li>
                            <li><a href="http://www.huntersville.org/Departments/EngineeringPublicWorks/SolidWasteRecycling.aspx" target="_blank">Huntersville Solid Waste and Recycling Collection</a></li>
                        </ul>
                    </div>
                );
            }
        }

        return (
            <div>
                {trash}
                {moreInfo}
            </div>
        );

    }

});

module.exports = TrashInfo;
