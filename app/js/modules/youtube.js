function youtubeLoader(identifier) {
	var collection = document.querySelectorAll(identifier);

	for (var i = 0; i < collection.length; ++i) {
		var theElem = collection[i];
		var id = theElem.getAttribute("id");

		// set bg image
		if (theElem.hasAttribute('data-background')) {
			theElem.style.backgroundImage = 'url(' + theElem.getAttribute('data-background') + ')';
		} else {
			theElem.style.backgroundImage = 'url(//i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
		}

		// click event
		theElem.addEventListener("click", function(e) {
			// build iframe
			var iframe = document.createElement('iframe');
			var url = '//www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&' + theElem.getAttribute('data-params');
			iframe.src = url;
			iframe.setAttribute('allowfullscreen', 'allowfullscreen');
			iframe.setAttribute('frameborder', '0');
			iframe.setAttribute('aria-label', 'GeoPortal video tutorial');
			theElem.appendChild(iframe);
		});
	};

}

if (typeof module === 'object') {
    module.exports = youtubeLoader;
}
