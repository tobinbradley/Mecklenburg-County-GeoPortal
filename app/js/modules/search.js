import React from 'react';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';


var SearchTemplate = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        return {
            searchData: null
        };
    },
    handleClick: function(gid, latlng, label, pid, address) {
        if (typeof processRecord === 'function') {
            processRecord(gid, latlng, label, pid, address);
        }
    },
    getRecords(query) {
        this.clearTimeout(this.timer);
        this.timer = this.setTimeout( function() {
            if (query.trim().length >= 3) {
                let _this = this;
                this.serverRequest = axios
                    .get(`http://maps.co.mecklenburg.nc.us:80/api/search/v1/${query.toLowerCase()}`,
                    {
                        params: {
                            'tables': 'address,park,library,school,pid,business'
                        }
                    })
                    .then(function(response) {
                        _this.setState({ searchData: response.data });
                    });
            } else {
                this.setState({ searchData: null });
            }
        }, 250);
    },
    render: function() {

        var searchResults;

        if (this.state.searchData !== null && this.state.searchData.length > 0) {
            searchResults =  (
                <ul>
                    {
                        this.state.searchData.map(function(object, i){
                            return (
                                <li key={i} onClick={this.handleClick.bind(null, object.id, object.lat + ',' + object.lng, object.label, object.pid, object.address)} >
                                    <span className='search-result-type'>{object.type}</span>
                                    <span className='search-result-label'>{object.label}</span>
                                    <i className="icon icon-right-open"></i>
                                </li>
                            );
                        }, this)
                    }
                </ul>
            );
        } else if (this.state.searchData !== null && this.state.searchData.length === 0) {
            searchResults = (
                <p className='search-result-empty'>
                    <i className="icon-attention-alt mdl-color-text--accent"></i> <b>No results found!</b> Please try again.
                </p>
            );
        } else {
            searchResults = '';
        }

        return (
            <div>
            {searchResults}
            </div>
        );
    }
});



module.exports = SearchTemplate;
