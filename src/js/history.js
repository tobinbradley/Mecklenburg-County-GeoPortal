import getURLParameter from './geturlparams';

function urlArgsToHash() {
    let lngLat = [];
    let q = '';
    if (getURLParameter('latlng') !== 'null') {
        lngLat = getURLParameter('latlng').split(',').reverse();        
    }
    if (getURLParameter('q') !== 'null' && getURLParameter('q') !== 'welcome') {
        q = getURLParameter('q');
    }
    if (lngLat.length > 0 || q.length > 0) {
        history.replaceState(null, null, '.');
        setHash(lngLat, q);
    } 
}

function setHash(lngLat = [], q = 'welcome') {
    location.hash = lngLat.join(',') + '/' + q;
}

function getHashLngLat() {
    let hash = location.hash.replace('#', '').split('/');
    if (hash[0].length > 0) {
        return hash[0].split(',');
    } else {
        return false;
    }
}

function getHashQ() {
    let hash = location.hash.split('/');
    if (hash[1] && hash[1].length > 0) {
        return hash[1];
    } else {
        return false;
    }
}

export {getHashQ, getHashLngLat, setHash, urlArgsToHash};
