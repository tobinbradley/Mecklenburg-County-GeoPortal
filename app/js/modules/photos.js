var React = require('react'),
    httpplease = require('httpplease'),
    jsonresponse = require('httpplease/plugins/jsonresponse'),
    objectToURI = require('./objectToURI');

var HousePhotos = React.createClass({
    propTypes: {
        pid: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return { photoIndex: 0 };
    },
    componentDidMount: function() {
        this.getPhotos(this.props.pid);
    },
    componentWillReceiveProps: function(nextProps) {
        this.getPhotos(nextProps.pid);
    },
    getPhotos: function(thePid) {
        var args = {
            'pid': thePid,
            'photo_source': 'mvideo,ilookabout'
        };
        httpplease = httpplease.use(jsonresponse);
        httpplease.get('http://maps.co.mecklenburg.nc.us/rest/v2/ws_misc_house_photos.php' + objectToURI(args),
            function(err, res) {
                this.setState({ thePhotos: res.body });
            }.bind(this)
        );
    },
    handleThumbClick: function(event) {
        var theItem = event.target;
        this.setState({photoIndex: theItem.getAttribute('data-index')});
    },
    handleError: function(event) {
        var theItem = event.target;
        theItem.style.display = 'none';
    },
    render: function() {
        var photos = '';
        if (typeof this.state.thePhotos === 'object' && this.state.thePhotos.length > 0) {
            var bigPhoto = this.state.thePhotos[this.state.photoIndex];
            photos =  (
                <div>
                    <div className="mdl-card__title mdl-color--teal-300 photo-big">
                        <a href={bigPhoto.photo_url.trim()} target="_blank"><img className="mdl-shadow--2dp" src={bigPhoto.photo_url.trim()} onError={this.handleError} /></a>

                    </div>
                    <div className="mdl-card__supporting-text mdl-typography--text-center ">
                        {bigPhoto.attribution} &#8226; {bigPhoto.source}
                    </div>
                    <div className="mdl-card__actions mdl-card--border photo-thumb">
                        {
                            this.state.thePhotos.map(function(object, i){
                                return (
                                    <img className="mdl-shadow--2dp" key={i} src={object.photo_url.trim()} onClick={this.handleThumbClick} data-index={i} onError={this.handleError} />
                                );
                            }, this)
                        }
                    </div>
                </div>
            );
        }

        return (
            <div>
                {photos}
            </div>
        );

    }

});

module.exports = HousePhotos;
