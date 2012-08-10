/**
 * This javascript file handles page rendering and events.
 *
 * @author      Tobin license
 * @Bradley     MIT
 */

var map = null; // map
var selectedAddress = {}; // JSON selected record object
var markers = []; // Array of markers


/*  Document Ready  */
$(document).ready(function() {

    // Convert the old URL params to hash
    if (getUrlVars()["matid"]) {
        var matid = getUrlVars()["matid"];
        var cat = getUrlVars()["category"] || "";
        window.location.replace("./#/" + matid + "/" + cat);
    }


    // jQuery UI Accordion
    theHash = window.location.hash.split("/");
    $('#accordion-data').accordion({
        header: "h3",
        active: theHash[2] && $("#accordion-data h3").index($("h3#" + theHash[2] )) !== -1 ? $("#accordion-data h3").index($("h3#" + theHash[2])) : 0,
        collapsible: true,
        autoHeight: false,
        create: function(event, ui) {
            $(this).fadeIn("slow");
        }
    }).bind("accordionchange", function(event, ui) {
        if (ui.newHeader[0]) $.publish("/change/accordion", [ui.newHeader[0].id]);
    });

    // jQuery UI Dialogs
    $("#search-dialog").dialog({
        width: 400,
        autoOpen: false,
        show: 'fade',
        hide: 'fade',
        open: function(event, ui) { $("#search-dialog-video").html('<iframe width="350" height="262" src="http://www.youtube-nocookie.com/embed/aGlmVQXRRj4?rel=0" frameborder="0" allowfullscreen></iframe>'); },
        close: function(event, ui) { $("#search-dialog-video").empty(); }
    });
    $("#help-dialog").dialog({
        width: 670,
        autoOpen: false,
        show: 'fade',
        hide: 'fade',
        open: function(event, ui) { $("#help-dialog-video").html('<iframe width="640" height="480" src="http://www.youtube-nocookie.com/embed/O3S3QobjONM?rel=0" frameborder="0" allowfullscreen></iframe>'); },
        close: function(event, ui) { $("#help-dialog-video").empty(); }
    });
    $("#new-dialog").dialog({
        width: 380,
        autoOpen: false,
        show: 'fade',
        hide: 'fade'
    });
    $("#welcome-dialog").dialog({
        width: 550,
        autoOpen: false,
        show: 'fade',
        hide: 'fade'
    });
    $("#buffer-dialog").dialog({
        width: 280,
        height: 145,
        autoOpen: false,
        position: [485, 120],
        show: 'fade',
        hide: 'fade'
    });
    $("#gallery-dialog").dialog({
        width: 500,
        minHeight: 400,
        autoOpen: false,
        show: 'fade',
        hide: 'fade'
    });
    $("#problem-dialog").dialog({
        minWidth: 600,
        minHeight: 400,
        autoOpen: false,
        show: 'fade',
        hide: 'fade',
        modal: true
    });
    $("#photo-dialog").dialog({
        minWidth: 500,
        minHeight: 400,
        autoOpen: false,
        show: 'fade',
        hide: 'fade',
        modal: true
    });

    // Click events
    $(".searchoptions").click(function() {
        $('#search-dialog').dialog('open');
    });
    $(".video_tutorial").click(function() {
        $('#help-dialog').dialog('open');
    });
    $("#whatsnew").click(function() {
        $('#new-dialog').dialog('open');
    });
    $(".report_data_error").on("click", function(event) {
        url = "http://maps.co.mecklenburg.nc.us/report_data_problems/report_data_errors.php";
        if (selectedAddress) url += "?extradata=" + selectedAddress.address;
        $("#problem-dialog").html('<iframe src="' + url + '" style="width: 600px; min-height: 500px; border: none;"></iframe>');
        $("#problem-dialog").dialog("open");
    });
    $(".toggleLayer").on("click", function() {
        toggleLayer($(this).data("layer"));
    });
    $("#routeGo").on("click", function() {
        calcRoute();
    });
    $("#routeClear").on("click", function() {
        directionsDisplay.setMap(null);
        $("#directionsPanel").empty();
    });
    $("#photo_gallery").on("click", "img", function(event) {
        $(".house_photo").removeClass("house_photo_selected");
        $(this).addClass("house_photo_selected");
        $("#gallery-dialog").html('<img src="' + $(this).prop("src") + '" style="width: 100%" /><h3>' + $(this).data("date") + ' from ' + $(this).data("attribution") + '</h3>');
        $("#gallery-dialog").dialog("open");
    });
    $("#housephoto").on("click", "#newphoto", function(event) {
        url = "http://maps.co.mecklenburg.nc.us/house_photos/index.php?pid=" + selectedAddress.parcelid;
        $("#photo-dialog").html('<iframe src="' + url + '" style="width: 450px; min-height: 500px; border: none;"></iframe>');
        $("#photo-dialog").dialog("open");
    });
    $("#searchinput").click(function() {
        $(this).select();
    });
    $(".selectedLocation").on("click", "a", function() {
        args = $(this).data("panzoom").split(',');
        $.publish("/map/panzoom", [{
            "lon": args[0],
            "lat": args[1],
            "zoom": args[2]
        }]);
    });
    $(".datatable").on("click", "a.locate", function() {
        coords = $(this).data("coords").split(",");
        $.publish("/layers/addmarker", [{
            "lon": coords[0],
            "lat": coords[1],
            "featuretype": 1,
            "label": $(this).data("label"),
            "zoom": map.getZoom()
        }]);
    });
    $(".datatable").on("click", "a.routeLink", function() {
        $("#routeTo").val($(this).data("route"));
        $('#accordion-data').accordion('activate', '#ROUTING');
        calcRoute();
    });

    /* Placeholder fix for crap browsers */
    if (!Modernizr.input.placeholder) {
        $('[placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() === '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    }

    //  Map toolbar
    $("#mapcontrols").buttonset();
    $("#mapcontrols input:radio").click(function() {
        toolbar($(this));
    });
    $("#toolbar").fadeIn("slow");

    // Buttons
    $("#routeGo, #newphoto, #routeClear").button();

    // URL Hash Change Handler
    $(window).hashchange(function() {
        // hash[0] is junk(#), hash[1] is active record, hash[2] is active tab
        theHash = window.location.hash.split("/");

        if (theHash[1] && theHash[1] != selectedAddress.objectid) {
            locationFinder(theHash[1], "ADDRESS", "");
        }
        if (theHash[2] && theHash[2] != $("#accordion-data h3").eq($('#accordion-data').accordion('option', 'active')).prop("id")) {
            $('#accordion-data').accordion('activate', '#' + theHash[2]);
        }

    });

    // Inital PubSub Subscriptions
    $.subscribe("/change/hash", changeHash); // Hash change control
    $.subscribe("/change/selected", accordionDataClearShow); // Selected record change
    $.subscribe("/change/selected", setSelectedAddress); // Selected record change
    $.subscribe("/change/selected", setLocationText); // Selected record change
    $.subscribe("/change/selected", zoomToLonLat); // Zoom to Location
    $.subscribe("/change/selected", addMarker); // Add Marker
    $.subscribe("/change/accordion", processAccordionDataChange); // Change accordion
    $.subscribe("/layers/addmarker", zoomToLonLat); // Zoom to location
    $.subscribe("/layers/addmarker", addMarker); // Add marker
    $.subscribe("/map/panzoom", zoomToLonLat); // Zoom to location

    // jQuery UI Autocomplete
    $("#searchinput").autocomplete({
        minLength: 4,
        delay: 400,
        autoFocus: true,
        source: function(request, response) {
            $.ajax({
                url: config.web_service_base + "v3/ws_geo_ubersearch.php",
                dataType: "jsonp",
                data: {
                    searchtypes: "address,library,school,park,geoname,road,cast,intersection,pid",
                    query: request.term
                },
                success: function(data) {
                    if (data.length > 0) {
                        response($.map(data, function(item) {
                            return {
                                label: item.name,
                                gid: item.gid,
                                responsetype: item.type
                            };
                        }));
                    } else {
                        response($.map([{}], function(item) {
                            return {
                                // No records found message
                                label: "No records found.",
                                responsetype: "I've got nothing"
                            };
                        }));
                    }

                }
            });
        },
        select: function(event, ui) {
            if (ui.item.gid) {
                locationFinder(ui.item.gid, ui.item.responsetype, ui.item.label);
            }
        },
        open: function(event, ui) {
            // Go if only 1 result
            menuItems = $("ul.ui-autocomplete li.ui-menu-item");
            if (menuItems.length == 1 && menuItems.text() != "More information needed for search." && menuItems.text() != "No records found.") {
                $($(this).data('autocomplete').menu.active).find('a').trigger('click');
            }
        }
    }).data("autocomplete")._renderMenu = function(ul, items) {
        var self = this,
            currentCategory = "";
        $.each(items, function(index, item) {
            if (item.responsetype != currentCategory && item.responsetype !== undefined) {
                ul.append("<li class='ui-autocomplete-category'>" + item.responsetype + "</li>");
                currentCategory = item.responsetype;
            }
            self._renderItem(ul, item);
        });
    };

});


/*
    Window Load
    For the stuff that either isn't safe for document ready or for things you don't want to slow page load.
*/
$(window).load(function() {
    // Initialize Map
    initializeMap();

    // Process the hash
    $(window).hashchange();
});


/*  Hash change handler  */

function changeHash(objectid, tabid) {
    var key = objectid || selectedAddress.objectid || "";
    var tab = tabid || $("#accordion-data h3").eq($("#accordion-data").accordion("option", "active")).prop("id");
    window.location.hash = "/" + key + "/" + tab;
}

/*
    Accordion switch handler
    You can toggle a layer when an accordion activates via toggleLayer(layerID)
*/
function processAccordionDataChange(accordionValue) {
    $.publish("/change/hash", [null, accordionValue]);
    if (selectedAddress.objectid) { // Make sure an address is selected
        switch (accordionValue) {

        case "PROPERTY":
            if ($('#parcel_id').html().length === 0) {
                // Show PID
                $('#parcel_id').append("<h5>Parcel ID " + selectedAddress.parcelid + "</h5>");
                // CAMA PHOTO
                url = config.web_service_base + "v1/ws_misc_house_photos.php?pid=" + selectedAddress.parcelid + "&callback=?";
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        $.each(data.rows, function(i, item) {
                            var dateclean = item.row.photo_date.match(/(\d{4})(\d{2})(\d{2})/);
                            formattedDate = dateclean[1] + '-' + dateclean[2] + '-' + dateclean[3];
                            $("#photo_gallery").append('<img src="' + item.row.photo_url + '" data-attribution="' + item.row.attribution + '" data-date="' + formattedDate + '" class="house_photo" title="' + formattedDate + ' from ' + item.row.attribution + '" />');
                        });
                        // remove dead photos
                        $("#photo_gallery img").each(function() {
                            $(this).error(function() {
                                $(this).remove();
                            });
                        });

                        // sort photos
                        $("#photo_gallery img").sort(sortPhotos).appendTo("#photo_gallery");
                    } else $("#photo_gallery").html('No property photos available.');
                });
                // Get ownership
                url = config.web_service_base + "v2/php-cgi/ws_cama_ownership.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                $.getJSON(url, function(data) {
                    $("#ownership table tbody").tableGenerator({
                        'fields': ['item.row.first_name + " " + item.row.last_name', "item.row.address_1 + ' ' + item.row.address_2 + '<br />' + item.row.city + ', ' + item.row.state + ' ' + item.row.zipcode"],
                        'data': data
                    });
                });
                // Get appraisal
                url = config.web_service_base + "v2/php-cgi/ws_cama_appraisal.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                $.getJSON(url, function(data) {
                    $("#appraisal table tbody").tableGenerator({
                        'fields': ['item.row.tax_year', 'item.row.building_value.formatNumber(2, "$")', 'item.row.extra_features_value.formatNumber(2, "$")', 'item.row.land_value.formatNumber(2, "$")', 'item.row.total_value.formatNumber(2, "$")'],
                        'data': data
                    });
                });
                // Get sales history
                url = config.web_service_base + "v2/php-cgi/ws_cama_saleshistory.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                $.getJSON(url, function(data) {
                    //$("#sales_history_template").tmpl(data.rows, { rowCount: data.total_rows }).appendTo("#sales_history table tbody");
                    $("#sales_history table tbody").tableGenerator({
                        'fields': ['item.row.sale_date', 'item.row.sale_price.formatNumber(2, "$")', 'item.row.deed_book', 'item.row.legal_reference'],
                        'data': data
                    });
                });
                // Get land use
                url = config.web_service_base + "v2/php-cgi/ws_cama_landuse.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                $.getJSON(url, function(data) {
                    $("#land_use table tbody").tableGenerator({
                        'fields': ['item.row.land_use', 'parseInt(item.row.units)', 'item.row.neighborhood_code'],
                        'data': data
                    });
                });
                // Get legal information
                url = config.web_service_base + "v2/php-cgi/ws_cama_legal.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                $.getJSON(url, function(data) {
                    $("#legal_information table tbody").tableGenerator({
                        'fields': ['item.row.legal_description', 'item.row.account_type', 'item.row.fire_district'],
                        'data': data
                    });
                });
                // Get building information
                url = config.web_service_base + "v2/php-cgi/ws_cama_building.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                $.getJSON(url, function(data) {
                    $("#building_information_1 table tbody").tableGenerator({
                        'fields': ['item.row.property_use_description + "(" + item.row.card_number + ")"', 'item.row.year_built', 'item.row.total_square_feet.formatNumber()', 'item.row.heated_square_feet.formatNumber()'],
                        'data': data
                    });
                    $("#building_information_2 table tbody").tableGenerator({
                        'fields': ['item.row.property_use_description + "(" + item.row.card_number + ")"', 'item.row.exterior_wall_description', 'item.row.bedrooms', 'parseInt(item.row.full_baths) + parseInt(item.row.half_baths)'],
                        'data': data
                    });
                });
            }
            break;

        case "SERVICES":
            if ($('#parks table tbody').html().length === 0) { // Make sure information isn't already popupated
                // Solid waste services
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'solid_waste', "thetext", "1=1 order by thetext desc", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#solid_waste table tbody").tableGenerator({
                        'fields': ['item.row.thetext'],
                        'data': data
                    });
                });

                // Parks
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'parks', 'prkname as name,prkaddr as address,prktype,city, x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 50000, "", "5", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#parks table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address'],
                        'data': data
                    });
                });
                // Get libraries
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'libraries', 'name,address,city, x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 100000, "", "5", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#libraries table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address'],
                        'data': data
                    });
                });
                // Fire Stations
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'fire_stations', 'name,address,station_ty as type,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 264000, "", "3", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#fire-stations table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.type', 'item.row.address'],
                        'data': data
                    });
                });
                // Police
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'police_stations', "name, address,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat", '', 264000, "", "3", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#police_stations table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address'],
                        'data': data
                    });
                });
            }
            break;

        case "TRANSPORTATION":
            if ($('#bus-stops table tbody').html().length === 0) { // Make sure information isn't already popupated
                // CATS Bus Stops
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'busstops_pt', "stopdesc as name, replace(routes, ',', ', ') as address,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat", '', 10000, "", "5", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#bus-stops table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address'],
                        'data': data
                    });
                });
                // CATS Park and Ride Locations
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cats_park_and_ride', 'name,routes,address,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 100000, "", "3", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#park-and-rides table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address', 'item.row.routes'],
                        'data': data
                    });
                });
                // CATS Light Rail Stops
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cats_light_rail_stations', "name,'' as address, x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat", '', 126400, "", "3", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#light-rail-stops table tbody").tableGenerator({
                        'fields': ['item.row.name'],
                        'data': data
                    });
                });
            }
            break;

        case "VOTING":
            if ($('#polling_location table tbody').html().length === 0) {
                //Polling location
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'polling_locations,voting_precincts', 'polling_locations.name,polling_locations.address,a.precno,x(transform(polling_locations.the_geom, 4326)) as lon, y(transform(polling_locations.the_geom, 4326)) as lat', "a.precno = polling_locations.precno", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#polling_location table tbody").tableGenerator({
                        'fields': ['item.row.precno', 'item.row.name', 'item.row.address'],
                        'data': data
                    });
                });
                //NATIONAL SENATE
                url = config.web_service_base + "v1/ws_boe_officials.php?format=json&district_type=national_senate&district=&callback=?";
                $.getJSON(url, function(data) {
                    $("#national_senate table tbody").tableGenerator({
                        'fields': ['item.row.representative'],
                        'data': data
                    });
                });
                //NATIONAL CONGRESSIONAL
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,national_congressional', 'elected_officials.district, elected_officials.representative', "elected_officials.district_type = 'national_congressional' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.district as varchar(5)))", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#national_congressional table tbody").tableGenerator({
                        'fields': ['item.row.district', 'item.row.representative'],
                        'data': data
                    });
                });
                //STATE SENATE
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,state_senate', 'elected_officials.district,elected_officials.representative', "elected_officials.district_type = 'state_senate' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.senate as varchar(5)))", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#state_senate table tbody").tableGenerator({
                        'fields': ['item.row.district', 'item.row.representative'],
                        'data': data
                    });
                });
                //STATE HOUSE
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,state_house', 'elected_officials.district,elected_officials.representative', "elected_officials.district_type = 'state_house' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.house as varchar(5)))", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#state_house table tbody").tableGenerator({
                        'fields': ['item.row.district', 'item.row.representative'],
                        'data': data
                    });
                });
                //CHARLOTTE CITY COUNCIL
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,city_council', 'elected_officials.district,elected_officials.representative', "elected_officials.district_type = 'charlotte_city_council' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.citydist as varchar(5)))", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#city_council table tbody").tableGenerator({
                        'fields': ['item.row.district', 'item.row.representative'],
                        'data': data
                    });
                });
                // County commissioner
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,voting_precincts', 'elected_officials.district,elected_officials.representative', "elected_officials.district_type = 'county_commission' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.cc as varchar(5)))", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#county_commission table tbody").tableGenerator({
                        'fields': ['item.row.district', 'item.row.representative'],
                        'data': data
                    });
                });
                // School Board
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,voting_precincts', 'elected_officials.district,elected_officials.representative', "elected_officials.district_type = 'board_of_education' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.school as varchar(5)))", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#school_board table tbody").tableGenerator({
                        'fields': ['item.row.district', 'item.row.representative'],
                        'data': data
                    });
                });
            }
            break;

        case "SCHOOLS":
            if ($('#high_school_n table tbody').html().length === 0) {
                tooMany = "This address is too close to a school district boundary to give an accurate school assignment calculation. To locate your student's home school or your transportation zone, email your address to planning@cms.k12.nc.us or call 980-343-6246.";
                // Current school year
                $('#future_school_assignments').html("<br /><h5>2011-2012 School Assignments</h5>");
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'schools_1112,high_school_districts_1112', 'schools_1112.schlname as name,schools_1112.address, x(transform(schools_1112.the_geom, 4326)) as lon, y(transform(schools_1112.the_geom, 4326)) as lat', 'a.schl = schools_1112.schl', 150, "", "", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#high_school_n table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address'],
                        'data': data.total_rows > 1 ? {
                            "total_rows": "0"
                        } : data,
                        'nodataString': tooMany
                    });
                });
                // Get middle school data
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'schools_1112,middle_school_districts_1112', 'schools_1112.schlname as name,schools_1112.address, x(transform(schools_1112.the_geom, 4326)) as lon, y(transform(schools_1112.the_geom, 4326)) as lat', 'a.schl = schools_1112.schl', 150, "", "", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#middle_school_n table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address'],
                        'data': data.total_rows > 1 ? {
                            "total_rows": "0"
                        } : data,
                        'nodataString': tooMany
                    });
                });
                // Get elementary school data
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'schools_1112,elementary_school_districts_1112', 'schools_1112.schlname as name,schools_1112.address, x(transform(schools_1112.the_geom, 4326)) as lon, y(transform(schools_1112.the_geom, 4326)) as lat', 'a.schl = schools_1112.schl', 150, "", "", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#elementary_school_n table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.address'],
                        'data': data.total_rows > 1 ? {
                            "total_rows": "0"
                        } : data,
                        'nodataString': tooMany
                    });
                });
                // Get Transportation Zone
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cms_transportation_zones_1011', 'choicezn', '', 150, "", "", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#transportation_zone_n table tbody").tableGenerator({
                        'fields': ['item.row.choicezn'],
                        'data': data.total_rows > 1 ? {
                            "total_rows": "0"
                        } : data,
                        'nodataString': tooMany
                    });
                });

                // Magnet Schools
                url = config.web_service_base + "v1/ws_geo_attributequery.php?geotable=schools_1112&format=json&parameters=schl in (4344,4429,4488,5497,5513,7376,8364,4427) order by schlname&fields=schlname,address,round(cast(ST_Distance(the_geom,GeomFromText('POINT(" + selectedAddress.x_coordinate + " " + selectedAddress.y_coordinate + ")',2264))/5280 as numeric), 2) as dist&callback=?";
                $.getJSON(url, function(data) {
                    $("#magnet_schools table tbody").tableGenerator({
                        'fields': ['item.row.schlname', 'item.row.address', 'item.row.dist'],
                        'data': data
                    });
                });
            }
            break;

        case "ECONOMIC_DEVELOPMENT":
            if ($('#parcel_ed table tbody').html().length === 0) {
                // Zoning Data
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'view_zoning', 'zone_des, zone_class', "zone_des <> 'sm_towns'", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#parcel_ed table tbody").tableGenerator({
                        'fields': ['selectedAddress.postal_city', 'item.row.zone_des', 'item.row.zone_class'],
                        'data': data
                    });
                });
                // Parcel building permits
                url = featureOverlay("tax_parcels", "building_permits", "extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost", "f.pid = '" + selectedAddress.groundparcel + "' and t.job_status = 'COMPL' ORDER BY t.date_completed_co_process", "json", "?");
                $.getJSON(url, function(data) {
                    $("#parcel_ed_building_permits table tbody").tableGenerator({
                        'fields': ['item.row.theyear', 'item.row.project_name', 'item.row.square_footage', 'item.row.construction_cost.formatNumber(2, "$")'],
                        'data': data
                    });
                });
                // Corridor Data
                url = featureOverlay("economic_development_corridors", "economic_development_loans", "f.name, f.type, sum(t.cityloan) as cityloan", "Contains(f.the_geom,GeometryFromText('POINT(" + selectedAddress.x_coordinate + " " + selectedAddress.y_coordinate + " )', 2264)) group by f.name, f.type", "json", "?");
                $.getJSON(url, function(data) {
                    $("#corridor_permits_1 table tbody").tableGenerator({
                        'fields': ['item.row.name', 'item.row.type', 'item.row.cityloan.formatNumber(2, "$")'],
                        'data': data
                    });
                });
                // Permits - and ugly date garbage
                themonth = (Math.ceil((new Date().getMonth() + 1) / 3) - 1) * 3 + 1;
                theyear = new Date().getFullYear();
                todate = theyear + '-' + themonth + '-01';
                fromdate = (theyear - 2) + '-' + themonth + '-01';
                url = featureOverlay("economic_development_corridors", "building_permits", "extract(quarter from t.date_completed_co_process) as thequarter, extract(year from t.date_completed_co_process) as theyear,count(t.*) as thecount,sum(t.square_footage) as square_footage, sum(t.construction_cost) as construction_cost", "Contains(f.the_geom,GeometryFromText('POINT(" + selectedAddress.x_coordinate + " " + selectedAddress.y_coordinate + " )', 2264)) and t.job_status = 'COMPL' and t.date_completed_co_process >= '" + fromdate + "' and t.date_completed_co_process < '" + todate + "' group by thequarter, theyear order by theyear, thequarter", "json", "?");
                $.getJSON(url, function(data) {
                    $("#corridor_permits_2 table tbody").tableGenerator({
                        'fields': ['item.row.theyear', 'item.row.thequarter', 'item.row.thecount', 'item.row.square_footage', 'item.row.construction_cost.formatNumber(2, "$")'],
                        'data': data
                    });
                });
                // Grants and Loans
                url = featureOverlay("tax_parcels", "economic_development_loans", "t.type, t.company,t.approval_date,t.cityloan", "f.pid = '" + selectedAddress.groundparcel + "' order by t.approval_date", "json", "?");
                $.getJSON(url, function(data) {
                    $("#grantsandloans table tbody").tableGenerator({
                        'fields': ['item.row.type', 'item.row.company', 'item.row.approval_date', 'item.row.cityloan.formatNumber(2, "$")'],
                        'data': data
                    });
                });
                // Business Investment Program
                url = featureOverlay("tax_parcels", "economic_development_business_investment_program", "t.com_name, t.year,t.invstmnt,t.jobs", "f.pid = '" + selectedAddress.groundparcel + "'", "json", "?");
                $.getJSON(url, function(data) {
                    $("#business_investment table tbody").tableGenerator({
                        'fields': ['item.row.com_name', 'item.row.year', 'item.row.invstmnt.formatNumber(2, "$")', 'item.row.jobs'],
                        'data': data
                    });
                });
            }
            break;

        case "COMMUNITY":
            if ($('#crime table tbody').html().length === 0) {
                // Crime Stats
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cmpd_districts', 'division, div_name,murder_and_non_negligent_manslaughter,murder_and_non_negligent_manslaughter_change, rape, rape_change,robbery,robbery_change,aggravated_assault,aggravated_assault_change,burglary, burglary_change,larceny , larceny_change, vehicle_theft, vehicle_theft_change, arson, arson_change, total_incidents, total_incidents_change, violent_incidents, violent_incidents_change, property_incidents, property_incidents_change', "", 'json', '?');
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) $("#crime table th:first").html(data.rows[0].row.div_name);
                    $("#crime table tbody").tableGenerator({
                        'returnType': 'rowsv',
                        'fields': ['Murder and Non-Negligent Homicide', 'settings.data.rows[0].row.murder_and_non_negligent_manslaughter.formatNumber()', 'settings.data.rows[0].row.murder_and_non_negligent_manslaughter_change + "%"', 'Rape', 'settings.data.rows[0].row.rape.formatNumber()', 'settings.data.rows[0].row.rape_change + "%"', 'Robbery', 'settings.data.rows[0].row.robbery.formatNumber()', 'settings.data.rows[0].row.robbery_change + "%"', 'Aggravated Assault', 'settings.data.rows[0].row.aggravated_assault.formatNumber()', 'settings.data.rows[0].row.aggravated_assault_change + "%"', 'Burglary', 'settings.data.rows[0].row.burglary.formatNumber()', 'settings.data.rows[0].row.burglary_change + "%"', 'Larceny', 'settings.data.rows[0].row.larceny.formatNumber()', 'settings.data.rows[0].row.larceny_change + "%"', 'Vehicle Theft', 'settings.data.rows[0].row.vehicle_theft.formatNumber()', 'settings.data.rows[0].row.vehicle_theft_change + "%"', 'Arson', 'settings.data.rows[0].row.arson.formatNumber()', 'settings.data.rows[0].row.arson_change + "%"', 'Total Incidents', 'settings.data.rows[0].row.total_incidents.formatNumber()', 'settings.data.rows[0].row.total_incidents_change + "%"', 'Violent Incidents', 'settings.data.rows[0].row.violent_incidents.formatNumber()', 'settings.data.rows[0].row.violent_incidents_change + "%"', 'Property Incidents', 'settings.data.rows[0].row.property_incidents.formatNumber()', 'settings.data.rows[0].row.property_incidents_change + "%"'],
                        'data': data
                    });
                });

                // Demographics
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'census_blockgroup_2010', 'popcy, popcyfam, popcynfm, agecymed, raccywhite, raccyblack, raccyamind, raccyasian, raccymult, hiscyhisp, agecygt15, agecygt25, hhdcy, dwlcy, inccypcap, inccymedhh, inccyavedd, unecyrate', "", 'json', '?');
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'census_blockgroup_2016_projection', 'poppy, poppyfam, poppynfm, agepymed, racpywhite, racpyblack, racpyamind, racpyasian, racpymult, hispyhisp, agepygt15, agepygt25, hhdpy, dwlpy, incpypcap, incpymedhh, incpyavedd, unepyrate', "", 'json', '?');
                        $.getJSON(url, function(data2) {
                            $("#demographics table tbody").tableGenerator({
                                'returnType': 'rowsv',
                                'fields': ['POPULATION', 'settings.data.rows[0].row.popcy.formatNumber()', 'settings.data2.rows[0].row.poppy.formatNumber()', 'IN FAMILY HOUSEHOLDS', 'settings.data.rows[0].row.popcyfam.formatNumber()', 'settings.data2.rows[0].row.poppyfam.formatNumber()', 'IN NON-FAMILY HOUSEHOLDS', 'settings.data.rows[0].row.popcynfm.formatNumber()', 'settings.data2.rows[0].row.poppynfm.formatNumber()', 'MEDIAN AGE', 'settings.data.rows[0].row.agecymed.formatNumber()', 'settings.data2.rows[0].row.agepymed.formatNumber()', 'WHITE', 'settings.data.rows[0].row.raccywhite.formatNumber()', 'settings.data2.rows[0].row.racpywhite.formatNumber()', 'BLACK', 'settings.data.rows[0].row.raccyblack.formatNumber()', 'settings.data2.rows[0].row.racpyblack.formatNumber()', 'AMERICAN INDIAN', 'settings.data.rows[0].row.raccyamind.formatNumber()', 'settings.data2.rows[0].row.racpyamind.formatNumber()', 'ASIAN OR PACIFIC ISLANDER', 'settings.data.rows[0].row.raccyasian.formatNumber()', 'settings.data2.rows[0].row.racpyasian.formatNumber()', 'MULTI-RACE', 'settings.data.rows[0].row.raccymult.formatNumber()', 'settings.data2.rows[0].row.racpymult.formatNumber()', 'HISPANIC', 'settings.data.rows[0].row.hiscyhisp.formatNumber()', 'settings.data2.rows[0].row.hispyhisp.formatNumber()', 'AGE 15+', 'settings.data.rows[0].row.agecygt15.formatNumber()', 'settings.data2.rows[0].row.agepygt15.formatNumber()', 'AGE 25+', 'settings.data.rows[0].row.agecygt25.formatNumber()', 'settings.data2.rows[0].row.agepygt25.formatNumber()', 'HOUSEHOLDS', 'settings.data.rows[0].row.hhdcy.formatNumber()', 'settings.data2.rows[0].row.hhdpy.formatNumber()', 'HOUSING UNITS', 'settings.data.rows[0].row.dwlcy.formatNumber()', 'settings.data2.rows[0].row.hhdpy.formatNumber()', 'PER CAPITA INCOME', 'settings.data.rows[0].row.inccypcap.formatNumber(2, "$")', 'settings.data2.rows[0].row.incpypcap.formatNumber(2, "$")', 'MEDIAN HOUSEHOLD INCOME', 'settings.data.rows[0].row.inccymedhh.formatNumber(2, "$")', 'settings.data2.rows[0].row.incpymedhh.formatNumber(2, "$")', 'AVERAGE DISPOSABLE INCOME', 'settings.data.rows[0].row.inccyavedd.formatNumber(2, "$")', 'settings.data2.rows[0].row.incpyavedd.formatNumber(2, "$")', 'UNEMPLOYMENT RATE', 'settings.data.rows[0].row.unecyrate.formatNumber()', 'settings.data2.rows[0].row.unepyrate.formatNumber()'],
                                'data': data,
                                'data2': data2
                            });
                        });
                    }
                });

            }
            break;

        case "ENVIRONMENT":
            if ($('#environment_general').html().length === 0) {
                //Impervious Surface
                url = config.web_service_base + "v1/ws_geo_attributequery.php?geotable=impervious_surface_area&fields=sum(sum_of_area) as sum_of_area,subtheme&parameters=commonpid='" + selectedAddress.parcelid + "' group by subtheme&format=json&callback=?";
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        total_imperv = 0;
                        subthemes = "";
                        $.each(data.rows, function(i, item) {
                            total_imperv += parseInt(item.row.sum_of_area, 10);
                            subthemes += item.row.subtheme + ":" + item.row.sum_of_area.formatNumber() + "ft<sup>2</sup><br />";
                        });
                        impbuffer = "This parcel contains <b>" + total_imperv + " square feet</b> of impervious surface area. <br />" + subthemes;

                        // Get date updated
                        url = config.web_service_base + "v1/ws_geo_attributequery.php?geotable=impervious_surface_update&fields=type,last_update&parameters=&format=json&callback=?";
                        $.getJSON(url, function(data) {
                            if (data.total_rows > 0) {
                                $.each(data.rows, function(i, item) {
                                    $('#environment_critical').append("<li class='environment-water'>" + impbuffer + " " + item.row.type + " impervious information was last updated on " + item.row.last_update + ".</li>");
                                });
                            }
                        });
                    } else $('#environment_general').append('<li class="environment-water">No impervious surface area was found on this parcel.</li>');
                });

                //Floodplain
                url = featureOverlay("tax_parcels", "view_regulated_floodplains", "t.gid", "f.pid = '" + selectedAddress.groundparcel + "' limit 1", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        $('#environment_critical').append('<li class="environment-water">This property <b>is in a regulated floodplain</b>. <a target="_blank" href="http://mapserver.mecklenburgcountync.gov/3dfz/index.html?matid=' + selectedAddress.objectid + '">Special restrictions may apply</a>. For more information, please call 704.336.3728.</li>');
                    } else $('#environment_general').append('<li class="environment-water">This property <b>is not in a regulated floodplain</b>.</li>');
                });

                // Land Classification
                url = config.web_service_base + "v1/ws_geo_rasterfeatureoverlay.php?format=json&from_geotable=tax_parcels&to_raster=land_classification_2008&parameters=pid='" + selectedAddress.groundparcel + "'&callback=?";
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        landbuffer = "This property contains the following land classifications: ";
                        $.each(data.rows, function(i, item) {
                            landbuffer += '<br />' + landClass(item.row.value) + ': ' + item.row.area.formatNumber() + 'ft<sup>2</sup> (' + Math.round(item.row.pct * 1000) / 10 + '%)';
                        });
                        $("#environment_general").append("<li class='environment-land'>" + landbuffer + "</li>");
                    } else $("#environment_general").append('<li class="environment-land">No land classification information was found on this parcel.</li>');
                });

                //Water quality buffer
                url = featureOverlay("tax_parcels", "water_quality_buffers", "distinct type,label", "f.pid = '" + selectedAddress.groundparcel + "'", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        wqbuffer = 'This property <b>includes water quality buffers</b>:';

                        $.each(data.rows, function(i, item) {
                            wqbuffer += '<br />' + item.row.label + ' ' + item.row.type;
                        });
                        $("#environment_critical").append('<li class="environment-water">' + wqbuffer + '<br /><a target="_blank" href="ftp://ftp1.co.mecklenburg.nc.us/WaterQuality/WQ%20Buffers/WaterQualityBufferImplementationGuidelines.pdf">Special restrictions may apply</a>. For more information, please call 704.336.5456 for existing single-family lots and those projects not needing a grading permit or call 704.432.5570 for other projects.</li>');
                    } else $("#environment_general").append('<li class="environment-water">This property <b>does not include water quality buffers</b>.</li>');
                });

                //Contamination sites
                url = featureBuffer("tax_parcels", "mpl_sites", "t.gid", "f.pid = '" + selectedAddress.parcelid + "' limit 1", "1500", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) $("#environment_critical").append('<li class="environment-land">This property <b>is within 1500 feet of a contamination site</b>. <a target="_blank" href="http://mapserver.mecklenburgcountync.gov/WIS_2/index.html?x=${$item.x}&y=${$item.y}">Special restrictions may apply</a>. For more information, please call 704.336.5103.</li>');
                    else $("#environment_general").append('<li class="environment-land">This property <b>is not within 1500 feet of a contamination site</b>.</li>');
                });

                //Soils
                url = featureOverlay("tax_parcels", "soil", "distinct name,description,hydrologic_group", "f.pid = '" + selectedAddress.groundparcel + "'", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        soilbuffer = "This property contains the soil types: ";
                        $.each(data.rows, function(i, item) {
                            soilbuffer += '<br />' + item.row.name + ' (' + item.row.description + ', hydrologic group ' + item.row.hydrologic_group + ')';
                        });
                        $("#environment_general").append("<li class='environment-land'>" + soilbuffer + "</li>");
                    } else $("#environment_general").append('<li class="environment-land">Unable to determine soil types.</li>');
                });

                // Solar
                url = featureOverlay("tax_parcels", "buildings", "sum(ST_Area(t.the_geom)) as thearea", "f.pid = '" + selectedAddress.groundparcel + "'", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0 && data.rows[0].row.thearea.length > 0) $("#environment_general").append('<li class="environment-green">This property has <strong>' + data.rows[0].row.thearea.formatNumber() + '</strong>sqft of roof area. Using 10% of your roof with an unobstructed view to the south for photovoltaic energy, you have <strong>' + parseInt(data.rows[0].row.thearea * 0.1 * 103.9, 10) + '</strong>  kWh of estimated annual AC energy output for an annual savings of <strong>' + (data.rows[0].row.thearea * 0.1 * 8.84).toString().formatNumber(2, "$") + '</strong>.</li>');
                    else $("#environment_general").append('<li class="environment-green">No solar power information found.</li>');
                });

                // Critical Protection Areas
                url = featureOverlay("tax_parcels", "conservation_protection_areas", "t.gid", "f.pid = '" + selectedAddress.groundparcel + "' limit 1", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        $('#environment_general').append('<li class="environment-green">This property <b>overlaps a critical protection area</b>.</li>');
                    } else $('#environment_general').append('<li class="environment-green">This property <b>does not overlap a critical protection area</b>.</li>');
                });

                //e85 stations
                url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'e85_fuel_stations', "name,address,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat", '', 500000, "", "1", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#environment_general").append('<li class="environment-green">The nearest <a href="http://www.e85refueling.com/" target="_blank">E85 Fuel Station</a> to this location is:    <a href="javascript:void(0);" title="Locate on the map." onclick="addMarker(' + data.rows[0].row.lon + ', ' + data.rows[0].row.lat + ', 1, \'' + data.rows[0].row.name + '\')">' + data.rows[0].row.name + '</a> (<a href="javascript:void(0);"  title="Get driving directions." onclick="window.open(googleRoute(selectedAddress.address, \'' + data.rows[0].row.lat + ', ' + data.rows[0].row.lon + '\'));">route</a>).</li>');
                });

                //Thoroughfares
                url = featureBuffer("tax_parcels", "proposed_thoroughfares", "t.gid", "f.pid = '" + selectedAddress.parcelid + "' limit 1", "100", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) $("#environment_critical").append('<li class="environment-air">This property <b>is within 100 feet of an existing or proposed thoroughfare</b>. Special restrictions may apply. For more information, please call 704.336.4695.</li>');
                    else $("#environment_general").append('<li class="environment-air">This property <b>is not within 100 feet of an existing or proposed thoroughfare</b>.</li>');
                });

                //Air pollution facility
                url = featureBuffer("tax_parcels", "air_pollution_facilities", "t.gid", "f.pid = '" + selectedAddress.parcelid + "' limit 1", "1500", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) $("#environment_critical").append('<li class="environment-air">This property <b>is within 1500 feet of an Air Pollution Facility</b>. <a target="_blank" href="http://maps.co.mecklenburg.nc.us/website/airpollution/defaultpidentry.asp?PID=' + selectedAddress.parcelid + '">Special restrictions may apply</a>. For more information, please call 704.336.5430.</li>');
                    else $("#environment_general").append('<li class="environment-air">This property <b>is not within 1500 feet of an Air Pollution Facility</b>.</li>');
                });

                // Watershed
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'watersheds', 'name,protected_watershed,subarea,webpage', "1=1 limit 1", 'json', '?');
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) {
                        if (data.rows[0].row.subarea.length > 0) $("#environment_critical").append('<li class="environment-water">This property is in the <a target="_blank" title="Learn more about this watershed." href="' + data.rows[0].row.webpage + '">' + data.rows[0].row.name + '</a> watershed. <b>It is a water supply watershed (' + data.rows[0].row.protected_watershed + ' ' + data.rows[0].row.subarea + ')</b>. <a target="_blank" href="http://charmeck.org/stormwater/regulations/Pages/WaterSupplyWatershedOrdinances.aspx">Special restrictions may apply</a>. For more information, please call 704.336.5500 or visit <a href="http://mapserver.mecklenburgcountync.gov/3dfz/index.html?matid=' + selectedAddress.objectid + '" target="_blank">Floodzone 3D</a>.</li>');
                        else $("#environment_general").append('<li class="environment-water">This property is in the <a target="_blank" title="Learn more about this watershed." href="' + data.rows[0].row.webpage + '">' + data.rows[0].row.name + '</a> watershed. It is not a water supply watershed.</li>');
                    } else $("#environment_general").append('<li class="environment-water">No watershed records found.</li>');
                });

                //Busindess Corridor
                url = featureOverlay("tax_parcels", "business_corridor_revitalization", "t.gid", "f.pid = '" + selectedAddress.groundparcel + "' limit 1", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) $("#environment_critical").append('<li class="environment-water">This property <b>is located within a distressed business district</b>. <a href="http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx" target="_blank">PCCO mitigation options apply</a>. For more information, please call 704.432.5570.</li>');
                    else $("#environment_general").append('<li class="environment-water">This property <b>is not located within a distressed business district.</b>.<li>');
                });

                //Transit Corridor
                url = featureOverlay("tax_parcels", "pcco_transit_corridor_stations", "t.gid", "f.pid = '" + selectedAddress.groundparcel + "' limit 1", "json", "?");
                $.getJSON(url, function(data) {
                    if (data.total_rows > 0) $("#environment_critical").append('<li class="environment-water">This property <b>is located within a transit station area</b>. <a href="http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx" target="_blank">PCCO mitigation options apply</a>. For more information, please call 704.432.5570.</li>');
                    else $("#environment_general").append('<li class="environment-water">This property <b>is not located within a transit station area</b>.</li>');
                });


                //Post Construction District Information
                url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'post_construction_districts', 'juris,district', "", 'json', '?');
                $.getJSON(url, function(data) {
                    $("#environment_general").append('<li class="environment-water">This property is located in the <b>' + data.rows[0].row.district + ' Post Construction District</b> in the <b>' + data.rows[0].row.juris + ' Jurisdiciton</b>.</li>');
                });

            }
            break;

        }
    }
}


/*  Set selected address  */
function setSelectedAddress(data) {
    selectedAddress = {
        "objectid": data.objectid,
        "x_coordinate": data.x_coordinate,
        "y_coordinate": data.y_coordinate,
        "parcelid": data.parcel_id,
        "groundparcel": data.ground_pid,
        "address": data.address,
        "postal_city": data.postal_city,
        "lon": data.longitude,
        "lat": data.latitude
    };
}

/*  update selected location text  */
function setLocationText(data) {
    $('.selectedLocation').html('<strong><a href="javascript:void(0)" data-panzoom="' + data.longitude + ', ' + data.latitude + ', 17" > ' + data.address + '</a></strong>');
    $("#routeFrom").val(data.address);
}

/*  clear data areas and make them visible  */
function accordionDataClearShow() {
    $('.selected-data-clear, .datatable tbody').empty();
    $('.selected-data').show();
}

// Function to replace land classification numbers with values
function landClass(classNumber) {
    if (classNumber == 1) return "Open Space";
    if (classNumber == 2) return "Trees";
    if (classNumber == 3) return "Urban";
    if (classNumber == 4) return "Water";
    if (classNumber == 5) return "Bare";
    return "Unidentified";
}

/*
    Find locations
    @param {string} findID  The value to search for
    @param {string} findType  The type of find to perform
    @param {string} findValue  The value to search for (street name)
*/
function locationFinder(findID, findType, findValue) {
    switch (findType) {
    case "ADDRESS":
    case "PID":
        url = config.web_service_base + 'v2/ws_mat_addressnum.php?format=json&callback=?&jsonp=?&addressnum=' + findID;
        $.getJSON(url, function(data) {
            if (data.total_rows > 0) {
                // Add some properties for addmarker
                data.rows[0].row.lon = data.rows[0].row.longitude;
                data.rows[0].row.lat = data.rows[0].row.latitude;
                data.rows[0].row.featuretype = 0;
                data.rows[0].row.label = "<h5>Address</h5>" + data.rows[0].row.address;
                data.rows[0].row.zoom = 17;
                $.publish("/change/selected", [data.rows[0].row]);
                $.publish("/change/hash");
                $.publish("/change/accordion", [$("#accordion-data h3").eq($('#accordion-data').accordion('option', 'active')).prop("id")]);
            }
        });
        break;
    case "LIBRARIES":
    case "PARKS":
    case "SCHOOLS":
    case "GEONAMES":
    case "CATS LIGHT RAIL":
    case "CATS PARK AND RIDE":
        // Set list of fields to retrieve from POI Layers
        poiData = {
            "LIBRARIES" : { "table": "libraries", "fields" : "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || name || '</h5><p>' || address || '</p>' AS label" },
            "PARKS": { "table": "parks" , "fields": "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || prkname || '</h5><p>Type: ' || prktype || '</p><p>' || prkaddr || '</p>' AS label"},
            "SCHOOLS": { "table": "schools_1112", "fields": "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || coalesce(schlname,'') || '</h5><p>' || coalesce(type,'') || ' School</p><p>' || coalesce(address,'') || '</p>' AS label" },
            "GEONAMES": { "table": "geonames", "fields": "longitude as lon, latitude as lat, '<h5>' || name || '</h5>'  as label" },
            "CATS LIGHT RAIL": { "table": "cats_light_rail_stations", "fields": "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || name || '</h5><p></p>' as label"},
            "CATS PARK AND RIDE": { "table":  "cats_park_and_ride", "fields": "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || name || '</h5><p>Routes ' || routes || '</p><p>' || address || '</p>' AS label"}
        };
        url = config.web_service_base + "v1/ws_geo_attributequery.php?format=json&geotable=" + poiData[findType].table + "&parameters=gid = " + findID + "&fields=" + urlencode(poiData[findType].fields) + '&callback=?';
        $.getJSON(url, function(data) {
            $.publish("/layers/addmarker", [{
                "lon": data.rows[0].row.lon,
                "lat": data.rows[0].row.lat,
                "featuretype": 1,
                "label": "<h5>Location</h5>" + data.rows[0].row.label,
                "zoom": 16
            }]);
        });
        break;
    case "ROADS":
        url = config.web_service_base + "v1/ws_geo_getcentroid.php?format=json&geotable=roads&parameters=streetname='" + findValue.toUpperCase() + "' order by ll_add limit 1&forceonsurface=true&srid=4326&callback=?";
        $.getJSON(url, function(data) {
            $.publish("/layers/addmarker", [{
                "lon": data.rows[0].row.x,
                "lat": data.rows[0].row.y,
                "featuretype": 1,
                "label": "<h5>Road</h5>" + findValue,
                "zoom": 16
            }]);
        });

        break;
    case "INTERSECTION":
        url = config.web_service_base + "v1/ws_geo_centerlineintersection.php?format=json&callback=?";
        streetnameArray = findValue.split("&");
        args = "&srid=4326&streetname1=" + urlencode(jQuery.trim(streetnameArray[0].toUpperCase())) + "&streetname2=" + urlencode(jQuery.trim(streetnameArray[1].toUpperCase()));
        $.getJSON(url + args, function(data) {
            if (data.total_rows > 0) {
                $.publish("/layers/addmarker", [{
                    "lon": data.rows[0].row.xcoord,
                    "lat": data.rows[0].row.ycoord,
                    "featuretype": 1,
                    "label": "<h5>Intersection</h5>" + findValue,
                    "zoom": 15
                }]);
            }
        });
        break;
    }
}
