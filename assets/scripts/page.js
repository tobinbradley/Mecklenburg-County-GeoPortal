var map,                        // The map
    overlay = {},               // Holder for overlay layer needed for question
    markers = [],               // Holder for makers
    activeRecord = {};          //  Holder for the selected location

// default data container for Underscore.js
_.templateSettings.variable = "rc";

// Document Load
$(document).ready(function () {
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
    $.subscribe("/data/question", question);
    $.subscribe("/data/question", overlayLayer);
    $.subscribe("/data/addhistory", newHistory);

    // Activate Bootstrap Tooltips
    $('a[rel=tooltip]').tooltip({delay: { show: 500, hide: 100 }});

    // Search dialog sizing
    // This is a hack that shouldn't be required in Bootstrap 3
    if (!$("div.embed-container ")[0]) {
        $(window).resize(function () {
            var width = $('.search').width() - 100;
            $('#searchbox, .question select').width(width);
        });
        $(window).trigger("resize");
    }

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
    if ($("div.embed-container ")[0]) {
        // size or hide query area
        if (getURLParameter("s") === "true" || getURLParameter("qs")) {
            // set top offset of map to accomodate well
            $(".embed-container #map").css("top", Math.abs(0 - $(".embed-container .well").height()) + 20);
        }
        else {
            $(".embed-container .well").remove();
        }
        // hack for search box size - should be fixed in Bootstrap 3
        if (getURLParameter("s") === "true") {
            $('#searchbox').width($('.search').width() - 100);
        }
        else {
            $('.search').remove();
        }
        // show questions, removing ones that weren't passed
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
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            _.each(items, function (item, index) {
                if (item.responsetype !== currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.responsetype + "</li>");
                    currentCategory = item.responsetype;
                }
                item.value = item.value.leftOf(": ");
                that._renderItemData(ul, item);
            });
        }
    });
    $("#searchbox").catcomplete({
        minLength: 4,
        delay: 250,
        autoFocus: true,
        source: function (request, response) {
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v4/ws_geo_ubersearch.php',
                dataType: 'jsonp',
                data: {
                    searchtypes: 'address,pid,business,park,library,school',
                    query: request.term
                },
                success: function (data) {
                    if (data.length > 0) {
                        response($.map(data, function (item) {
                            return {
                                label: item.name,
                                gid: item.gid,
                                responsetype: item.type,
                                lng: item.lng,
                                lat: item.lat,
                                moreinfo: item.moreinfo
                            };
                        }));
                    } else {
                        response($.map([{}], function (item) {
                            return { label: 'No matches found.', responsetype: "I've got nothing" };
                        }));
                    }
                }
            });
        },
        select: function (event, ui) {
            if (ui.item.lat) {
                // Addresses and PID's
                if (ui.item.responsetype === "ADDRESS" || ui.item.responsetype === "PID") {
                    $.publish("/data/select", [ ui.item ]);
                    $.publish("/map/addmarker", [ activeRecord, 0 ]);
                    $.publish("/data/question", [$(".question select ").val()]);
                    $.publish("/data/addhistory", [ activeRecord ]);
                }
                // Non-MAT locations
                else {
                    getNearestMAT(ui.item);
                }
            }
        }
    });
    $(".searchbtn").bind("click", function (event) {
        $("#searchbox").catcomplete("search");
    });

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

    // Embed modal content and interactions
    $('.carousel').carousel({
        interval: false
    });
    var listItems = $(".question select option");
    var split = Math.ceil(listItems.length / 2);
    _.each(listItems, function (item, i) {
        if (i < split) {
            $('#q-col1 ul').append('<li><label class="checkbox"><input type="checkbox" class="embed-q" id="' + $(item).val() + '">' + $(item).text() + '</label></li>');
        }
        else {
            $('#q-col2 ul').append('<li><label class="checkbox"><input type="checkbox" class="embed-q" id="' + $(item).val() + '">' + $(item).text() + '</label></li>');
        }
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

});

// Set Active Record
function setactvieRecord(data) {
    activeRecord.lng = Math.round(data.lng * 10000) / 10000;
    activeRecord.lat = Math.round(data.lat * 10000) / 10000;
    activeRecord.gid = data.gid;
    if (data.responsetype === 'ADDRESS') {
        activeRecord.pid = data.moreinfo;
        activeRecord.label = data.label;
        activeRecord.address = data.label;
    }
    else {
        activeRecord.pid = data.label;
        activeRecord.label = data.moreinfo;
        activeRecord.address = data.moreinfo;
    }
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
}

// Display detailed information
function report(q, data, element) {
    templateLoader.loadRemoteTemplate(q, "templates/" + q + ".html", function (tmpl) {
        var compiled = _.template(tmpl);
        if ($("div.embed-container ")[0] || $(document).width() < 1000) {
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
            'fields': "full_address as label,objectid as gid,x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat, num_parent_parcel as moreinfo, 'ADDRESS' as responsetype",
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
            'fields': "full_address as label,objectid as gid,x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat, num_parent_parcel as moreinfo, 'ADDRESS' as responsetype",
            'limit': 1
        },
        success: function (data) {
            if (!approx.label) {
                approx.label = data[0].full_address;
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
