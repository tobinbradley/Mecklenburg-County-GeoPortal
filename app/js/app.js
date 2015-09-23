// __________________________________
// / GeoPortal v3, by Tobin Bradley and \
// \ Mecklenburg County GIS.            /
// ----------------------------------
//        \   ^__^
//         \  (oo)\_______
//            (__)\       )\/\
//                ||----w |
//                ||     ||
//

let forEach = require('./modules/foreach'),
    componentHandler = require('./modules/material'),
    getURLParameter = require('./modules/geturlparams'),
    React = require('react'),
    SearchTemplate = require('./modules/search'),
    HousePhotos = require('./modules/photos'),
    questionChange = require('./modules/question-change'),
    questionRun = require('./modules/question-run'),
    fetchNearest = require('./modules/nearest');

// map module just dumps because stupid brains
require('./modules/map');

// the selected location
global.activeRecord = '';

// initial react components for search results
let searchComponent = React.render( <SearchTemplate /> ,
    document.getElementById('search-results')
);



// search box input and click events
let theSearch = document.querySelector(".search-input");
theSearch.addEventListener("input", function(e) {
    searchComponent.getRecords(e.target.value);
});
theSearch.addEventListener("click", function(e) {
    e.target.focus();
    e.target.select();
});

// Data type/sidebar switching links
let navlinks = document.querySelectorAll(".mdl-navigation__link");
forEach(navlinks, function(index, value) {
    navlinks[index].addEventListener("click", function(e) {
        let item = navlinks[index];
        if (!item.classList.contains('active')) {
            let container = document.querySelector('.report-container');
            let drawer = document.querySelector('.mdl-layout__drawer');
            if (drawer) {
                drawer.classList.remove('is-visible');
            }
            questionChange(item, navlinks, container, 'click');
            if (typeof activeRecord === 'object') {
                let q = item.getAttribute("data-type");
                scrollToElement(document.querySelector('.report-container'));
                questionRun(q, activeRecord.latlng, activeRecord.label, activeRecord.pid, activeRecord.address, activeRecord.id);
            } else {
                scrollToElement(document.querySelector('.search-container'));
                document.querySelector(".search-input").focus();
            }
        }
    });
});

// scroll to element if top is past viewport available, otherwise it jumps
function scrollToElement(elem) {
    if (elem.getBoundingClientRect().top < 0) {
        elem.scrollIntoView({block: "start", behavior: "smooth"});
    }
}


// process a newly selected location
global.processRecord = function(gid, latlng, label, pid, address) {
    let q = document.querySelector(".mdl-navigation__link.active").getAttribute("data-type");
    activeRecord = {
        "id": gid,
        "latlng": latlng,
        "label": label,
        "pid": pid,
        "address": address
    };
    // populate search box
    document.querySelector('.search-input').value = label;
    // clear search results
    searchComponent.setState({
        searchData: null
    });
    // add map marker, popup, and zoom
    addMarker(latlng, label, pid, address);
    // push state
    history.replaceState(null, null, `?q=${q}&latlng=${latlng}`);
    // reports
    questionRun(q, latlng, label, pid, gid);
    // photos
    let photos = React.render( <HousePhotos pid={pid} />,
        document.querySelector('.photos')
    );
};

// process URL arguments on page load
if (getURLParameter('q') !== 'null') {
    var navs = document.querySelectorAll(".mdl-navigation__link"),
        q = getURLParameter('q'),
        elem = document.querySelector(`.mdl-navigation__link[data-type="${q}"]`),
        container = document.querySelector('.report-container');

    if (elem) {
        questionChange(elem, navs, container, 'page');
    }
}
if (getURLParameter('latlng') !== 'null') {
    let latlng = getURLParameter('latlng').split(',');
    fetchNearest(latlng[0], latlng[1]);
}

// set focus to search input after waiting a second
window.onload = function() {
    setTimeout(function() {
        document.querySelector(".search-input").focus();
    }, 1000);
};
