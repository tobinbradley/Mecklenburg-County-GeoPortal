/********************************************
    Page Stuff
*********************************************/

var map,
    overlay = {},
    markers = [],
    activeRecord = {},
    popped = false;

_.templateSettings.variable = "rc";

$(document).ready(function () {

    // Activate any tooltips and popovers
    $('a[rel=tooltip]').tooltip({delay: { show: 500, hide: 100 }});
    $('*[rel=popover]').popover();

    // Data select
    $(".question select").change(function () {
        newHistory(activeRecord);
        $.publish("/data/question", [$(this).val()]);
    });

    // embed map height - only run in embed mode
    if ($("div.embed-container ")[0]) {
        // size or hide query area
        if (getURLParameter("s") === "true" || getURLParameter("qs")) {
            $(".embed-container #map").css("top", Math.abs(0 - $(".embed-container .well").height()) + 20);
        }
        else {
            $(".embed-container .well").hide();
        }
        // size the search box
        $('#searchbox').width($('.search').width() - 100);
        // show questions
        if (getURLParameter("qs")) {
            var qs = getURLParameter("qs").split(",");
            _.each(qs, function (item) {
                $('select option[value="' + item + '"]').removeClass("hide").parent("optgroup").removeClass("hide");
            });
            $("select").val($("select option:not(.hide)").first().val());
        }
    }

    // create iframe
    createIframe();

    // search sizing - should be able to remove in BS 3.x
    if (!$("div.embed-container ")[0]) {
        $(window).resize(function () {
            $("#searchbox").width($(".span4").width() - ($(".searchbtn").width() + 26));
        });
        $(window).trigger("resize");
    }

    // .table-location click event
    $(".details").on("click", "tr[data-location]", function (event) {
        var rec = $(this);
        var latlng = rec.data("location").split(",");
        var label = rec.data("label");
        $.publish("/map/addmarker", [ {'lng': latlng[0], 'lat': latlng[1], 'label': label}, 1 ]);
    });

    // Feedback
    $("#talkback").submit(function (e) {
        e.preventDefault();
        $('#modalTalkback').modal('hide');
        $.ajax({
            type: "POST",
            url: "php/feedback.php",
            data: { inputName: $("#inputName").val(), inputEmail: $("#inputEmail").val(), inputURL: window.location.href, inputFeedback: $("#inputFeedback").val() }
        });
    });

    // Pubsub
    // /map/addmarker       Adds marker to the map and zooms in
    // /data/select         Make a data selection
    // /data/question     Process the report area and layer overlay
    // /data/addhistory     Adds current activeRecord/Question to history via pushstate
    $.subscribe("/map/addmarker", zoomToLngLat);
    $.subscribe("/map/addmarker", addMarker);
    $.subscribe("/data/select", setactvieRecord);
    $.subscribe("/data/select", showQuestion);
    $.subscribe("/data/select", enableReportOption);
    $.subscribe("/data/question", question);
    $.subscribe("/data/question", overlayLayer);
    $.subscribe("/data/addhistory", newHistory);

    // jQuery UI Autocomplete
    $("#searchbox").click(function () { $(this).select(); }).focus();
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (index, item) {
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
                    searchtypes: 'address,pid,business',
                    query: request.term
                },
                open: function () {
                    setTimeout(function () {
                        $('.ui-autocomplete').css('z-index', 99999999999999);
                    }, 0);
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
                    $.publish("/data/question", [$(".question select ").val()]);
                    $.publish("/map/addmarker", [ activeRecord, 0 ]);
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
            if (!popped) { // not my problem
                popped = true;
                return;
            }
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
        });
        $(window).trigger("popstate");
    }


    // embed tool content
    $('.carousel').carousel({
        interval: false
    });
    var listItems = $(".question select option");
    var split = Math.ceil(listItems.length / 2);
    $.each(listItems, function (i, item) {
        if (i < split) {
            $('#q-col1 ul').append('<li><label class="checkbox"><input type="checkbox" id="' + $(item).val() + '">' + $(item).text() + '</label></li>');
        }
        else {
            $('#q-col2 ul').append('<li><label class="checkbox"><input type="checkbox" id="' + $(item).val() + '">' + $(item).text() + '</label></li>');
        }
    });

    // embed tool interactions
    $("#step3 img").on("click", function () {
        var selected = $(this);
        selected.addClass("selected-size").siblings().removeClass("selected-size");
        $("#embed-width").val(selected.data("width"));
        $("#embed-height").val(selected.data("height"));
        createIframe();
    });
    $(".embed-size").keypress(function () { createIframe(); });
    $("#embed-carousel input[type=checkbox]").change(function () { createIframe(); });
    $("#step3 textarea, #step3 input").on("click", function () {
        $(this).select();
    });

    // pulse the search box
    pulse(1000, 6, $('.search > .blink'));
});

// Set activerecord
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

// Push state
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

// create report
function report(q, data, element) {
    $(".details").empty();
    templateLoader.loadRemoteTemplate(q, "templates/" + q + ".html", function (tmpl) {
        var compiled = _.template(tmpl);
        element.append(compiled(data));
        // resize and reposition marker popup
        markers[0]._popup._updateLayout();
        markers[0]._popup._updatePosition();
        markers[0]._popup._content = null;
    });
}

function showQuestion () {
    $(".question").fadeIn("slow", function(){
        pulse(1000, 6, $('.question > .blink'));
    })
}


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
            $.publish("/data/question", [$(".question select ").val()]);
            $.publish("/map/addmarker", [ activeRecord, 0 ]);
        },
        error: function (error, status, desc) {
            console.log(status, desc);
        }
    });
}

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
            $.publish("/data/question", [$(".question select ").val()]);
            $.publish("/map/addmarker", [ activeRecord, 0 ]);
            $.publish("/data/addhistory", [activeRecord]);
        },
        error: function (error, status, desc) {
            console.log(error);
        }
    });
}

function enableReportOption() {
    $("#embed_selected .muted").text(activeRecord.label);
    $("#embed_selected").show();
    $("#embed_selected input").data("matid", activeRecord.gid);
}

function createIframe() {
    // TODO: change url from localhost
    // search option
    var getSearch = '?s=' + $("#embed_search input").is(":checked");
    // matid option
    var getMatid;
    $("#embed_selected input").is(":checked") ? getMatid = "&matid=" + $("#embed_selected input").data("matid") : getMatid = '';
    // q's
    var questions = [];
    $('.embed-cols input').each(function (i, item) {
        if ($(item).is(':checked')) { questions.push($(item).attr('id')); }
    });
    var getQ = '&qs=' + questions.join();
    // size
    var w = $('#embed-width').val();
    var h = $('#embed-height').val();

    var url = 'http://localhost/geoportal/embed.html' + getSearch + getMatid + getQ;
    // write iframe
    $('#embed-code').val('<iframe frameborder="0" width="' + w + '" height="' + h + '" src="' + url + '"></iframe>');
}

function submitPhoto() {
    url = "http://maps.co.mecklenburg.nc.us/house_photos/index.php?pid=" + activeRecord.pid;
    $("#modalPhoto .modal-body").html('<iframe src="' + url + '" style="width: 450px; min-height: 500px; border: none;"></iframe>');
    $('#modalPhoto').modal();
}
