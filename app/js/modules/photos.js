import React from 'react';
import axios from 'axios';

class HousePhotos extends React.Component {
    constructor(props) {
        super(props);
        this.state = { photoIndex: 0 };
        this.handleThumbClick = this.handleThumbClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.pid);
    }

    componentDidMount() {
        this.fetchData(this.props.pid);
    }

    fetchData(pid) {
        let _this = this;
        this.serverRequest = axios
            .get('http://maps.co.mecklenburg.nc.us/rest/v2/ws_misc_house_photos.php',
            {
                params: {
                    'pid': pid,
                    'photo_source': 'mvideo,ilookabout'
                },
                timeout: 3000
            })
            .then(function(response) {
                _this.setState({ thePhotos: response.data });
            });
    }

    handleThumbClick(event) {
        var theItem = event.target;
        this.setState({photoIndex: theItem.getAttribute('data-index')});
    }

    handleError(event) {
        var theItem = event.target;
        theItem.style.display = 'none';
    }

    render() {
        var photos = '';
        if (typeof this.state.thePhotos === 'object' && this.state.thePhotos.length > 0) {
            var bigPhoto = this.state.thePhotos[this.state.photoIndex];
            photos =  (
                <div>
                    <div className="mdl-card__title mdl-color--teal-300 photo-big">
                        <a href={bigPhoto.photo_url.trim()} target="_blank"><img src={bigPhoto.photo_url.trim()} onError={this.handleError} /></a>

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

}

HousePhotos.propTypes = {
    pid: React.PropTypes.string.isRequired
};

module.exports = HousePhotos;
