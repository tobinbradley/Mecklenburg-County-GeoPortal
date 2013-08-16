var map,                        // The map
    overlay = {},               // Holder for overlay layer needed for question
    markers = [],               // Holder for makers
    activeRecord = {},          // Holder for the selected location
    pageType = "DEFAULT";       // Type of page - DEFAULT, PRINT, or EMBED set in document ready

// default data container for Underscore.js
_.templateSettings.variable = "rc";

// Document Ready
$(document).ready(function () {
    // Set Page Type
    if ($("div.embed-container ")[0]) { pageType = "EMBED"; }
    if ($("div.container-print ")[0]) { pageType = "PRINT"; }

    // Pubsub
    // /map/addmarker           Adds marker to the map and zooms in
    // /data/select             Make a data selection
    // /data/question           Process the report area and layer overlay
    // /data/addhistory         Adds current activeRecord/Question to history via pushstate
    $.subscribe("/map/addmarker", zoomToLngLat);
    $.subscribe("/map/addmarker", addMarker);
    $.subscribe("/data/select", setactvieRecord);
    $.subscribe("/data/select", showQuestion);
    $.subscribe("/data/select", enableReportOption);
    if (pageType === "PRINT") { $.subscribe("/data/select", printSelect); }
    $.subscribe("/data/question", question);
    if (pageType !== "PRINT") { $.subscribe("/data/question", overlayLayer); }
    $.subscribe("/data/addhistory", newHistory);

    // Activate Bootstrap Popovers
    $('a[rel=popover]').popover({delay: { show: 500, hide: 100 }});

    // Question change event
    $(".question select").change(function () {
        newHistory(activeRecord);
        $.publish("/data/question", [$(this).val()]);
    });

    // Create embed Iframe code
    createIframe();

    // If a table TR has location info, make it clickable
    $(document).on("click", "tr[data-location]", function (event) {
        var rec = $(this);
        var latlng = rec.data("location").split(",");
        var label = rec.data("label");
        $.publish("/map/addmarker", [ {'lng': latlng[0], 'lat': latlng[1], 'label': label}, 1 ]);
    });

    // Feedback form
    $("#talkback").submit(function (e) {
        e.preventDefault();
        $('#modalTalkback').modal('hide');
        $.ajax({
            type: "POST",
            url: "php/feedback.php",
            data: { inputName: $("#inputName").val(), inputEmail: $("#inputEmail").val(), inputURL: window.location.href, inputFeedback: $("#inputFeedback").val() }
        });
    });

    // This stuff is just for the embedded map
    if (pageType === "EMBED") {
        // size or hide query area
        if (getURLParameter("s") === "true" || getURLParameter("qs")) {
            // set top offset of map to accomodate well
            $(".embed-container #map").css("top", Math.abs(0 - $(".embed-container .well").height()) + 20);
        }
        else {
            $(".embed-container .well").remove();
        }
        // show or hide search box
        if (getURLParameter("s") !== "true") {
            $('.search').remove();
        }

        // show questions, removing ones that weren't passed
        // removed because ie8 won't hide options in a select
        if (getURLParameter("qs")) {
            var qs = getURLParameter("qs").split(",");
            _.each($('.question select option'), function (item) {
                if (!_.contains(qs, $(item).val())) { $(item).remove();  }
            });
            _.each($('.question select optgroup'), function (item) {
                if ($(item).children().length < 1) { $(item).remove(); }
            });
            $(".question select").val($(".question select option[value=" + getURLParameter("dq") + "]").val());
        }
        else {
            $(".question").remove();
        }
    }

    // jQuery UI Autocomplete
    $("#searchbox").click(function () { $(this).select(); }).focus();
    $('.typeahead').typeahead([
        {
            name: 'Address',
            remote: {
                url: 'http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_ubersearch.php?searchtypes=address&query=%QUERY',
                dataType: 'jsonp',
                filter: function (data) {
                    var dataset = [];
                    _.each(data, function (item) {
                        dataset.push({
                            value: item.name,
                            label: item.name,
                            gid: item.gid,
                            pid: item.moreinfo,
                            layer: 'Address',
                            lat: item.lat,
                            lng: item.lng
                        });
                    });
                    var query = $(".typeahead").val();
                    if (dataset.length === 0 && $.isNumeric(query.split(" ")[0]) && query.trim().split(" ").length > 1) {
                        dataset.push({ value: "No records found." });
                    }
                    return dataset;
                }
            },
            minLength: 4,
            limit: 10,
            header: '<h4 class="typeahead-header"><span class="glyphicon glyphicon-home"></span> Address</h4>'
        }, {
            name: 'PID',
            remote: {
                url: 'http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_ubersearch.php?searchtypes=pid&query=%QUERY',
                dataType: 'jsonp',
                filter: function (data) {
                    var dataset = [];
                    _.each(data, function (item) {
                        dataset.push({
                            value: item.name,
                            label: item.moreinfo,
                            gid: item.gid,
                            pid: item.name,
                            layer: 'PID',
                            lat: item.lat,
                            lng: item.lng
                        });
                    });
                    var query = $(".typeahead").val();
                    if (dataset.length === 0 && query.length === 8 && query.indexOf(" ") === -1 && $.isNumeric(query.substring(0, 5))) {
                        dataset.push({ value: "No records found." }); }
                    return dataset;
                }
            },
            minLength: 8,
            limit: 5,
            header: '<h4 class="typeahead-header"><span class="glyphicon glyphicon-home"></span> Parcel</h4>'
        }, {
            name: 'POI',
            remote: {
                url: 'http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_ubersearch.php?searchtypes=park,library,school&query=%QUERY',
                dataType: 'jsonp',
                filter: function (data) {
                    var dataset = [];
                    _.each(data, function (item) {
                        dataset.push({
                            value: item.name,
                            label: item.name,
                            layer: 'Point of Interest',
                            lat: item.lat,
                            lng: item.lng
                        });
                    });
                    if (dataset.length === 0) { dataset.push({ value: "No records found." }); }
                    return _(dataset).sortBy("value");
                }
            },
            minLength: 4,
            limit: 15,
            header: '<h4 class="typeahead-header"><span class="glyphicon glyphicon-star"></span> Point of Interest</h4>'
        }, {
            name: 'business',
            remote: {
                url: 'http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_ubersearch.php?searchtypes=business&query=%QUERY',
                dataType: 'jsonp',
                filter: function (data) {
                    var dataset = [];
                    _.each(data, function (item) {
                        dataset.push({
                            value: item.name,
                            label: item.name,
                            layer: 'Point of Interest',
                            lat: item.lat,
                            lng: item.lng
                        });
                    });
                    if (dataset.length === 0) { dataset.push({ value: "No records found." }); }
                    return _(dataset).sortBy("value");
                }
            },
            minLength: 4,
            limit: 15,
            header: '<h4 class="typeahead-header"><span class="glyphicon glyphicon-briefcase"></span> Business</h4>'
        }
    ]).on('typeahead:selected', function (obj, datum) {
        if (datum.layer === 'Address' || datum.layer === 'PID') {
            $.publish("/data/select", [ datum ]);
            $.publish("/map/addmarker", [ activeRecord, 0 ]);
            $.publish("/data/question", [$(".question select ").val()]);
            $.publish("/data/addhistory", [ activeRecord ]);
        }
        else if (datum.layer) {
            getNearestMAT(datum);
        }
    });
    $("#btn-search").bind("click", function (event) {
        $('.typeahead').focus();
    });
    $("#searchbox").focus();

});

// Window load
$(window).load(function () {
    // initialize map
    mapInit();

    // History API
    if (Modernizr.history) {
        // history is supported, do magical things
        $(window).bind("popstate", function (e) {
            handleGETArgs();
        });
    }

    // hack because of Chrome popstate on load bug
    var isChrome = window.chrome;
    if (!isChrome) { handleGETArgs(); }

    // this is for the print map only
    if (pageType === "PRINT") {
        // hide controls on print
        $(".leaflet-control-zoom, .leaflet-control-attribution, .leaflet-locate, .map-info").addClass("hidden-print");
        // turn off map events
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
    }

    // Embed modal content and interactions
    $('.carousel').carousel({
        interval: false
    });
    $("#step3 img").on("click", function () {
        var selected = $(this);
        selected.addClass("selected-size").siblings().removeClass("selected-size");
        $("#embed-width").val(selected.data("width"));
        $("#embed-height").val(selected.data("height"));
        createIframe();
    });
    $(".embed-size").keypress(function () { createIframe(); });
    $("#embed-carousel input[type=checkbox]").click(function () {
        if ($(this).hasClass('embed-q')) {
            if (this.checked) {
                $("#embed-defaultquestion").append('<option value="' + $(this).attr("id") + '">' + $(this).parent().text()  + '</option>');
            }
            else {
                $("#embed-defaultquestion option[value=" + $(this).attr('id') + "]").remove();
            }
        }
        createIframe();
    });
    $("#step3 textarea, #step3 input").on("click", function () {
        $(this).select();
    });

    // Print Modal
    $("#print").on("click", function () {
        var args = [];
        if (activeRecord.lat) {
            args.push({name: "matid", value: activeRecord.gid});
            args.push({name: "lat", value: activeRecord.lat});
            args.push({name: "lng", value: activeRecord.lng});
        }
        // overlay
        args.push({name: "overlay", value: $("#print-overlay").val() });
        // qs
        var qs = [];
        $.each($("#modalPrint input[type=checkbox]"), function () {
            if (this.checked) {
                qs.push($(this).attr("id"));
            }
        });
        args.push({name: "qs", value: qs.join()});
        var url = "print.html?" + $.param(args);
        var win = window.open(url, '_blank');
        win.focus();
    });
});

// Set Active Record
function setactvieRecord(data) {
    activeRecord = data;
    activeRecord.lat = Math.round(data.lat * 10000) / 10000;
    activeRecord.lng = Math.round(data.lng * 10000) / 10000;
    activeRecord.value = data.label;
}

// Set subtitle on print page
function printSelect() {
    // set subheader
    $("header h2").html(activeRecord.value + " &bull; Parcel ID " + activeRecord.pid);
    // run overlay
    overlayLayer(getURLParameter("overlay"));
    // run q's
    _.each(getURLParameter("qs").split(","), function (item) {
        question(item);
    });

}

// Get URL Arguments
function handleGETArgs() {
    if (getURLParameter("q")) {
        $('.question select').val(getURLParameter("q"));
    }
    if (getURLParameter("matid")) {
        if (activeRecord && activeRecord.gid !== getURLParameter("matid")) {
            getMAT(getURLParameter("matid"));
        }
        else {
            $.publish("/data/select", activeRecord);
            $.publish("/data/question", [$(".question select ").val()]);
        }
    }
    else {
        pulse(1000, 4, $('.search > .blink'));
    }
}

// Push state change into history
function newHistory(data) {
    if (Modernizr.history) {
        var hist = [];
        if (data.gid) {
            hist.push({name: "matid", value: data.gid}, {name: "lng", value: data.lng}, {name: "lat", value: data.lat});
        }
        if ($(".question select").val() !== null) {
            hist.push({name: "q", value: $(".question select").val()});
        }
        history.pushState({myTag: true}, null, "?" + $.param(hist));
    }
    ga('send', 'pageview');
}

// Display detailed information
function report(q, data, element) {
    templateLoader.loadRemoteTemplate(q, "templates/" + q + ".html", function (tmpl) {
        var compiled = _.template(tmpl);
        if (pageType === "EMBED" || $(document).width() < 1000) {
            // iframe or mobile/small
            $(".leaflet-popup-content .report " + element).append(compiled(data));
            markers[0].setPopupContent($('.leaflet-popup-conent').html());
        }
        else {
            $(".overview .report " + element).append(compiled(data));
        }
    });
}

// Enable question area when location selected
function showQuestion () {
    $(".question").fadeIn("slow", function(){
        pulse(1000, 4, $('.question > .blink'));
    })
}

// Get information for record based on our master address table ID
function getMAT(gid) {
    $.ajax({
        url: 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_attributequery.php',
        type: 'GET',
        dataType: 'jsonp',
        data: {
            'table': 'master_address_table',
            'fields': "full_address as label,objectid as gid,x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat, num_parent_parcel as pid, 'ADDRESS' as responsetype",
            'parameters': "objectid = " + gid
        },
        success: function (data) {
            $.publish("/data/select", [ data[0] ]);
            $.publish("/map/addmarker", [ activeRecord, 0 ]);
            $.publish("/data/question", [$(".question select ").val()]);
        },
        error: function (error, status, desc) {
            console.log(status, desc);
        }
    });
}

// Get the nearest master address record to a coordinate
function getNearestMAT(approx) {
    $.ajax({
        url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_geo_nearest.php',
        type: 'GET',
        dataType: 'jsonp',
        data: {
            'x': approx.lng,
            'y': approx.lat,
            'srid': 4326,
            'table': 'master_address_table',
            'fields': "full_address as label,objectid as gid,x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat, num_parent_parcel as pid, 'ADDRESS' as responsetype",
            'limit': 1
        },
        success: function (data) {
            if (approx.label) {
                data[0].label = approx.label + "<br>" + data[0].label;
            }
            $.publish("/data/select", [ data[0] ]);
            $.publish("/map/addmarker", [ activeRecord, 0 ]);
            $.publish("/data/question", [$(".question select ").val()]);
            $.publish("/data/addhistory", [activeRecord]);
        },
        error: function (error, status, desc) {
            console.log(error);
        }
    });
}

// Enable active record option in embed modal
function enableReportOption() {
    $("#embed_selected .muted").text(activeRecord.label);
    $("#embed_selected").show();
    $("#embed_selected input").data("matid", activeRecord.gid);
}

// Create iframe content
function createIframe() {
    // TODO: change url from localhost
    // search option
    var getSearch = '?s=' + $("#embed_search input").is(":checked");
    // matid option
    var getMatid;
    $("#embed_selected input").is(":checked") ? getMatid = "&matid=" + activeRecord.gid + "&lng=" + activeRecord.lng + "&lat=" + activeRecord.lat : getMatid = '';
    // q's
    var questions = [];
    $('.embed-cols input').each(function (i, item) {
        if ($(item).is(':checked')) { questions.push($(item).attr('id')); }
    });
    var getQ = '&qs=' + questions.join();
    // default question
    var getDQ = '&dq=' + $('#embed-defaultquestion').val();
    // size
    var w = $('#embed-width').val();
    var h = $('#embed-height').val();

    var url = 'http://maps.co.mecklenburg.nc.us/geoportal/embed.html' + getSearch + getMatid + getQ + getDQ;
    // write iframe
    $('#embed-code').val('<iframe frameborder="0" width="' + w + '" height="' + h + '" src="' + url + '"></iframe>');
}

// Submit photo modal
function submitPhoto() {
    url = "http://maps.co.mecklenburg.nc.us/house_photos/index.php?pid=" + activeRecord.pid;
    $("#modalPhoto .modal-body").html('<iframe src="' + url + '" style="width: 450px; min-height: 500px; border: none;"></iframe>');
    $('#modalPhoto').modal();
}
