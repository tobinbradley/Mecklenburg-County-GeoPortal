import React from 'react';
import axios from 'axios';


function naturalSort (a, b) {
    var re = /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,
        sre = /^\s+|\s+$/g,   // trim pre-post whitespace
        snre = /\s+/g,        // normalize all whitespace to single ' ' character
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function(s) {
            return (naturalSort.insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, '');
        },
        // convert all to strings strip whitespace
        x = i(a),
        y = i(b),
        // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
        xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
        yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
        normChunk = function(s, l) {
            // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
            return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
        },
        oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD) {
        if (xD < yD) { return -1; }
        else if (xD > yD) { return 1; }
    }
    // natural sorting through split numeric strings and default strings
    for(var cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl); cLoc < numS; cLoc++) {
        oFxNcL = normChunk(xN[cLoc] || '', xNl);
        oFyNcL = normChunk(yN[cLoc] || '', yNl);
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
            return isNaN(oFxNcL) ? 1 : -1;
        }
        // if unicode use locale comparison
        if (/[^\x00-\x80]/.test(oFxNcL + oFyNcL) && oFxNcL.localeCompare) {
            var comp = oFxNcL.localeCompare(oFyNcL);
            return comp / Math.abs(comp);
        }
        if (oFxNcL < oFyNcL) { return -1; }
        else if (oFxNcL > oFyNcL) { return 1; }
    }
}


class QualityOfLife extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeMetric = this.changeMetric.bind(this);
    }

    componentDidMount() {
        var _this = this;
        this.setState({ metric: 37 });
        this.fetchData(this.props.lat, this.props.lng);

        window.onmessage = function(e){
            let data = e.data;
            if (data.summary) {
                _this.setState({ compareKeys: Object.keys(data.summary.values), compare: data.summary.values });
                // Remove non-numeric chars (except decimal point/minus sign):
                //priceVal = parseFloat(price.replace(/[^0-9-.]/g, '')); // 12345.99
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.lat, nextProps.lng);
    }

    fetchData(lat, lng) {
        let _this = this;
        this.serverRequest = axios.get(`http://maps.co.mecklenburg.nc.us/api/intersect_point/v1/neighborhoods/${lng},${lat}/4326`, {
            params: {
                'geom_column': 'the_geom',
                'columns': 'id',
                'limit': 1
            }
        }).then(function(response) {
            _this.setState({ data: response.data });
        });
    }

    compareStyle(group) {
        if (group === "Neighborhood") {
            return 'table-cell-bold';
        } else {
            return '';
        }
    }

    changeMetric(e) {
        //this.setState({ metric: e.target.value });
        document.querySelector(".iframe-qol").contentWindow.postMessage({"metric": e.target.value}, '*');
    }

    render() {
        var qol, compare, moreInfo;
        var tableStyle={
            'width': '350px',
            'maxWidth': '100%'
        };

        if (typeof this.state.data === 'object') {
            var neighborhood = this.state.data[0].id;

            if (typeof this.state.compare === 'object') {
                let compareKeys = Object.keys(this.state.compare);
                let compareData = [];
                for (let i = 0; i < compareKeys.length; i++) {
                    compareData.push([ compareKeys[i], this.state.compare[compareKeys[i]][this.state.compare[compareKeys[i]].length - 1] ]);
                }
                compareData = compareData.sort(function(a, b) {
                    // if (parseFloat(b[1].replace(/[^0-9-.]/g, '')) && parseFloat(a[1].replace(/[^0-9-.]/g, ''))) {
                    //     return parseFloat(b[1].replace(/[^0-9-.]/g, '')) - parseFloat(a[1].replace(/[^0-9-.]/g, ''));
                    // } else {
                    //     console.log('nan');
                    //     return -1;
                    // }

                    return naturalSort(b[1], a[1]);
                });


                compare = (
                        <div className="mdl-typography--text-center">
                                <table className="mdl-data-table" style={tableStyle}>
                                    <caption>How Your Neighborhood Compares</caption>
                                    <tbody>
                                    {
                                        compareData.map(function(object, i){
                                            return (
                                                <tr key={i} data-qolgroup={object[0]}>
                                                    <td className="mdl-data-table__cell--non-numeric">
                                                        {object[0]}
                                                    </td>
                                                    <td>
                                                        {object[1]}
                                                    </td>
                                                </tr>
                                            );
                                        }, this)
                                    }
                                    </tbody>
                                </table>
                        </div>

                );
            }

            qol = (
                <div className="qol">
                    <div className="mdl-typography--text-center">
                        <div className="report-record-highlight">
                            <i role="presentation" className="material-icons">favorite</i>
                            <h2>Quality of Life</h2>
                        </div>
                    </div>

                    <div className="mdl-selectfield">
                        <label>Choose a Metric</label>
                        <select id="mapmetric" onChange={this.changeMetric}>
                            <option value="" disabled selected="true">Choose a Metric</option>
                            <optgroup label="Demographics">
                                <option value="13">Population - Older Adult</option>
                                <option value="12">Population - Youth</option>
                                <option value="47">Population Density</option>
                                <option value="17">Race/Ethnicity - All Other Races</option>
                                <option value="16">Race/Ethnicity - Asian</option>
                                <option value="15">Race/Ethnicity - Black or African American</option>
                                <option value="18">Race/Ethnicity - Hispanic or Latino</option>
                                <option value="14">Race/Ethnicity - White or Caucasian</option>
                                <option value="11">Vacant Land</option>
                            </optgroup>
                            <optgroup label="Economics">
                                <option value="19">Commercial Construction</option>
                                <option value="41">Commercial Space</option>
                                <option value="38">Employment</option>
                                <option value="80">Food and Nutrition Services</option>
                                <option value="76">Home Sales Price</option>
                                <option value="37">Household Income</option>
                                <option value="75">Job Density</option>
                                <option value="82">Housing Assistance</option>
                                <option value="40">Rental Costs</option>
                                <option value="69">Residential Foreclosures</option>
                                <option value="8">Residential New Construction</option>
                            </optgroup>
                            <optgroup label="Health">
                                <option value="57">Age of Death</option>
                                <option value="54">Births to Adolescents</option>
                                <option value="59">Crime - Property</option>
                                <option value="58">Crime - Violent</option>
                                <option value="60">Disorder-related Calls</option>
                                <option value="20">Education Level - Bachelor&#39;s Degree</option>
                                <option value="39">Education Level - High School Diploma</option>
                                <option value="65">High School Graduation Rate</option>
                                <option value="51">Library Card Holders</option>
                                <option value="36">Proximity to Public Transportation</option>
                                <option value="81">Public Health Insurance</option>
                                <option value="44">Transit Ridership</option>
                                <option value="62">Test Proficiency - Elementary School</option>
                                <option value="64">Test Proficiency - High School</option>
                                <option value="63">Test Proficiency - Middle School</option>
                                <option value="48">Voter Participation</option>
                            </optgroup>
                            <optgroup label="Environment">
                                <option value="34">Bicycle Friendliness</option>
                                <option value="10">Commuters Driving Alone</option>
                                <option value="26">Energy Consumption - Electricity</option>
                                <option value="77">Energy Consumption - Natural Gas</option>
                                <option value="4">Impervious Surface</option>
                                <option value="33">Long Commute</option>
                                <option value="23">Residential Recycling</option>
                                <option value="24">Residential Solid Waste</option>
                                <option value="3">Tree Canopy</option>
                                <option value="27">Water Consumption</option>
                            </optgroup>
                        </select>
                    </div>
                    <iframe className="iframe-qol" src={`http://mcmap.org/qol-embed/embed.html?m=37&s=${neighborhood}`} style={{width: '100%', height: '500px', border: '1px solid #595959'}}></iframe>
                </div>
            );

            moreInfo = (
				<div className="report-moreinfo mdl-typography--text-left">
					<h5>For more information, please visit:</h5>
					<ul className="list-unstyled">
                        <li><a href={"http://mcmap.org/qol/?s=" + neighborhood} target="_blank">Quality of Life Explorer</a></li>
                    </ul>
				</div>
			);


        }

        return (
            <div>
                {qol}
                {compare}
                {moreInfo}
            </div>
        );


    }
}



QualityOfLife.propTypes = {
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired
};


module.exports = QualityOfLife;
