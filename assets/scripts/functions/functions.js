// Make console usage safe
(function (b) {
    function c() {}
    for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","), a; a = d.pop();) {
        b[a] = b[a] || c;
    }
})((function () {
    try {
        console.log();
        return window.console;
    } catch (err) {
        return window.console = {};
    }
})());

// jQuery pub/sub plugin by Peter Higgins modified by Tobin Bradley
(function (d) {
    var cache = {};
    d.publish = function (topic, args) {
        cache[topic] && d.each(cache[topic], function () {
            try {
                this.apply(d, args || []);
            } catch (err) {
                console.log(err, d, args, this);
            }
        });
    };
    d.subscribe = function (topic, callback) {
        if (!cache[topic]) {
            cache[topic] = [];
        }
        cache[topic].push(callback);
        return [topic, callback];
    };
    d.unsubscribe = function (topic, callback) {
        cache[topic] && d.each(cache[topic], function (idx) {
            if (this == callback) {
                cache[topic].splice(idx, 1);
            }
        });
    };
    d.subscribers = function (topic) {
        l = [];
        cache[topic] && d.each(cache[topic], function (idx) {
            l.push(this.name);
        });
        return l;
    };
})(jQuery);

// get url parameters
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

// left of : in string
String.prototype.leftOf = function (str) {
    if (this.indexOf(":")) {
        return this.substring(0, this.indexOf(":"));
    }
    else { return this; }
};

// Clean up numbers - add commas, suffix, prefix
function prettyNumber(x, prefix, suffix, round) {
    if ($.isNumeric(x)) {
        if (typeof(prefix) === 'undefined') { prefix = ""; }
        if (typeof(suffix) === 'undefined') { suffix = ""; }
        if (typeof(round) === 'undefined') { round = 2; }
        return prefix + (Math.round(x * (10 * round)) / (10 * round)).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",") + suffix;
    }
    else {
        return "N/A";
    }
}

// Extract Jurisdiction from Address
function findJurisdiction(theString) {
    var jurisdictions = ['CHARLOTTE', 'PINEVILLE', 'MINT HILL', 'MATTHEWS', 'HUNTERSVILLE', 'DAVIDSON', 'CORNELIUS'];
    var theJuris = 'CHARLOTTE';
    _.each(jurisdictions, function (item) {
        if (theString.toUpperCase().indexOf(item) !== -1) { theJuris = item; }
    });
    return theJuris;
}

// Land classification values
function landClass(classNumber) {
    if (classNumber == 1) return "Open Space";
    if (classNumber == 2) return "Trees";
    if (classNumber == 3) return "Urban";
    if (classNumber == 4) return "Water";
    if (classNumber == 5) return "Bare";
    return "Unidentified";
}

// Title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Fix trim() being unsupported in ie8. Damn you IE8.
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
