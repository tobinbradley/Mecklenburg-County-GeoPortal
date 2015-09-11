var React = require('react'),
	forEach = require('./foreach'),
	getURLParameter = require('./geturlparams');


var questionChange = function(elem, navs, container, changeType) {
	var q = elem.getAttribute('data-type');

	// add active class
    forEach(navs, function (index, value) {
        navs[index].classList.remove('active');
    });
    elem.classList.add('active');

    // activate layers
	if (elem.getAttribute("data-layers")) {
        addOverlay(elem.getAttribute("data-layers"));
    } else {
		removeOverlay();
	}

    // clean up existing react content
	React.unmountComponentAtNode(container);

	// history
	if (changeType !== 'page') {
		var matArg = '';
		if (getURLParameter('latlng') !== 'null') {
			matArg = '&latlng=' + getURLParameter('latlng');
		}
		history.replaceState(null, null, `?q=${q}${matArg}`);
	}

	// analytics
    if (window.ga) { ga('send', 'event', q, changeType); }
};

module.exports = questionChange;
