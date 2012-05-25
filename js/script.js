/**
 * This javascript file handles page rendering and events.
 *
 * @author      Tobin Bradley
 * @license     MIT
 */


/**
 * Document Ready and Window Load events.
 */
$(document).ready(function() {
    
    // Accordions
    $('#accordion-data').accordion({header: "h3", collapsible: true, autoHeight: false,  create: function(event, ui) {  $(this).fadeIn("slow");  }}).bind("accordionchange", function(event, ui) {
        if (ui.newHeader[0]) processAccordionDataChange(ui.newHeader[0].id);
    });
    
   
    // Dialogs
    $("#search-dialog").dialog({ width: $("#searchdiv").width(), autoOpen: false, show: 'fade', hide: 'fade' });
    $("#new-dialog").dialog({ width: 380, autoOpen: false, show: 'fade', hide: 'fade' });
    $("#welcome-dialog").dialog({ width: 550, autoOpen: false, show: 'fade', hide: 'fade' });
    $("#buffer-dialog").dialog({ width: 280, height: 135, autoOpen: false, position: [485, 120], show: 'fade', hide: 'fade' });
    if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
        $("#gcf-dialog a").button();
        $("#gcf-dialog").dialog({ width: 550, autoOpen: true, show: 'fade', hide: 'fade', modal: true });
    }
    $("#gallery-dialog").dialog({ width: 500, minHeight: 400, autoOpen: false, show: 'fade', hide: 'fade' });
    $("#problem-dialog").dialog({ minWidth: 600, minHeight: 400, autoOpen: false, show: 'fade', hide: 'fade', modal: true });
    $("#photo-dialog").dialog({ minWidth: 500, minHeight: 400, autoOpen: false, show: 'fade', hide: 'fade', modal: true });


    // Click events
    $(".searchoptions").click(function(){ $('#search-dialog').dialog('open'); });
    $("#whatsnew").click(function(){ $('#new-dialog').dialog('open'); });
    $("#searchinput").click(function() { $(this).select(); });
    $("#apply_radius").click(function() {  circle.setRadius( $("#radius").val() * 0.3088 );  });
    $(".report_data_error").on("click", function(event){
        url = "http://maps.co.mecklenburg.nc.us/report_data_problems/report_data_errors.php";
        if (selectedAddress) url += "?extradata=" + selectedAddress.address;
        $("#problem-dialog").html('<iframe src="' + url + '" style="width: 600px; min-height: 500px; border: none;"></iframe>');
        $("#problem-dialog").dialog("open");
    });
    $("#housephoto").on("click", "img", function(event){
        $(".house_photo").removeClass("house_photo_selected");
        $(this).addClass("house_photo_selected");
        $("#gallery-dialog").html('<img src="' + $(this).attr("src") + '" style="width: 100%" /><h3>' + $(this).attr("data-date") + ' from ' + $(this).attr("data-attribution") + '</h3>');
        $("#gallery-dialog").dialog("open");
    });
    $("#housephoto").on("click", "#newphoto", function(event){
        url = "http://maps.co.mecklenburg.nc.us/house_photos/index.php?pid=" + selectedAddress.parcelid;
        $("#photo-dialog").html('<iframe src="' + url + '" style="width: 450px; min-height: 500px; border: none;"></iframe>');
        $("#photo-dialog").dialog("open");
    });

    //  Map toolbar
    $("#mapcontrols").buttonset();
    $("#mapcontrols input:radio").click( function() { toolbar($(this)); });
    $("#toolbar").fadeIn("slow");
    

    // URL Hash Change Handler
    $(window).hashchange( function(){
        if (window.location.hash.length > 1) {
            // read the hash
            theHash = window.location.hash.replace("#","");
            
            // Process the lat,lon or neighborhood number
            if (theHash != selectedAddress.objectid) {
                locationFinder("Address", 'master_address_table', 'objectid', theHash);
            }
        }
    });

    
    // GPS
    if (Modernizr.geolocation) {
        $(".gpslocation").show();
        $("#gogpslocation").click(function(){
            if (typeof gpsWatch != "number") {
                $("#gogpslocation").text("Stop Following My Location");
                gpsWatch = navigator.geolocation.watchPosition(
                    function(position) {
                        (typeof position.coords.altitude  == "undefined") ? altitude = position.coords.altitude + "m" : altitude = "Unknown";
                        isNaN(position.coords.speed) ? speed = "Unknown" : speed = position.coords.speed + "m/sec";
                        addMarker(position.coords.longitude, position.coords.latitude, 2, "<h5>Estimated Current Position</h5><p>Accuracy: " + position.coords.accuracy + "m<br />Timestamp: " + position.timestamp + "<br />Altitude: " + altitude + "<br />Speed: " + speed + "</p>");
                    },
                    function() { /* error handler */ },
                    {enableHighAccuracy:true, maximumAge:30000, timeout:27000}
                );
            }
            else {
                gpsWatch = navigator.geolocation.clearWatch(gpsWatch);
                $("#gogpslocation").text("Follow My Location");
            }
        });
    }
    
    // Autocomplete
    $("#searchinput").autocomplete({
        minLength: 4,
        delay: 400,
        autoFocus: true,
        source: function(request, response) {
           
              $.ajax({
                   url: wsbase + "v2/ws_geo_ubersearch.php",
                   dataType: "jsonp",
                   data: {
                        searchtypes: "Address,Library,School,Park,GeoName,Road,CATS,Intersection,PID",
                        query: request.term
                   },
                   success: function(data) {
                        if (data.total_rows > 0) {
                            response($.map(data.rows, function(item) {                               
                                return {
                                    label: urldecode(item.row.displaytext),
                                    value: item.row.displaytext,
                                    responsetype: item.row.responsetype,
                                    responsetable: item.row.responsetable,
                                    getfield: item.row.getfield,
                                    getid: item.row.getid
                                }
                             }));
                        }
                        else if (data.total_rows == 0) {
                             response($.map([{}], function(item) {
                                  return {
                                        // No records found message
                                       label: "No records found.",
                                       responsetype: "I've got nothing"
                                  }
                             }))
                        }
                        else if  (data.total_rows == -1) {
                             response($.map([{}], function(item) {
                                  return {
                                       // Message indicating no search performed
                                       label: "More information needed for search.",
                                       responsetype: "More please"
                                  }
                             }))
                        }
                        
                   }
              })
         },
         select: function(event, ui) {
            $("#searchinput").autocomplete('widget').trigger('mousedown.choose_option');
              // Run function on selected record
              if (ui.item.responsetable) {
                   locationFinder(ui.item.responsetype, ui.item.responsetable, ui.item.getfield, ui.item.getid, ui.item.label, ui.item.value);
              }
         },
         open: function(event, ui) {
            $(this).keypress(function(e){
                /* horizontal keys */
                if (e.keyCode == 13 || e.keyCode == 39) {
                   $($(this).data('autocomplete').menu.active).find('a').trigger('click');
                }
            });
            if ($("ul.ui-autocomplete li.ui-menu-item").length == 1) {
                // If there is only 1 result and it isn't a can't-find-squat message, select it
                //if (theResult != "More information needed for search." && theResult != "No records found.") $($(this).data('autocomplete').menu.active).find('a').trigger('click');
            }
        }

    }).data("autocomplete")._renderMenu = function (ul, items) {
        var self = this, currentCategory = "";
         $.each( items, function( index, item ) {
              if ( item.responsetype != currentCategory && item.responsetype !== undefined) {
                   ul.append( "<li class='ui-autocomplete-category'>" + item.responsetype + "</li>" );
                   currentCategory = item.responsetype;
              }
              self._renderItem( ul, item );
         });
    };
    
     
});

$(window).load(function() {
   
    // Initialize Map
    initializeMap();
  
    // Detect arguments or localstorage
    if (window.location.hash.length > 1) {
        theHash = window.location.hash.replace("#","");
        locationFinder("Address", 'master_address_table', 'objectid', theHash);
    }
    else if (getUrlVars()["matid"]) {
        // Move to accordion if api argument passed
        if (getUrlVars()["category"]) {
           jQuery.each($('#accordion-data h3'), function(i, val) {
               if (val.id == getUrlVars()["category"] ) $('#accordion-data').accordion("activate", i);
           });
        }
        locationFinder("API", 'master_address_table', 'objectid', getUrlVars()["matid"]);
    }
    else if (window.localStorage) {
        if (localStorage.getItem('gp_lastSelected')) locationFinder("Address", 'master_address_table', 'objectid', localStorage.getItem('gp_lastSelected'));
    }
   
});






/******************************************************************************/

/**
 * Accordion switch handler
 * @author      Tobin Bradley
 * @license     MIT
 */
function processAccordionDataChange(accordionValue) {
    if (null !== selectedAddress) { // Make sure an address is selected
        switch (accordionValue) {
          
            case "SERVICES":
                if ($('#parks table tbody').html().length === 0) { // Make sure information isn't already popupated
                    // Solid waste services
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'solid_waste', "thetext", "1=1 order by thetext desc", 'json', '?');                   
                    $.getJSON(url, function(data) {
                        $("#solid_waste table tbody").tableGenerator({'fields': ['item.row.thetext'], 'data': data}); 
                    });
                    
                    // Parks
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'parks', 'prkname as name,prkaddr as address,prktype,city, x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 50000, "", "5", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#parks table tbody").tableGenerator({'fields': ['item.row.name','item.row.address'], 'data': data});
                    });
                    // Get libraries
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'libraries', 'name,address,city, x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 100000, "", "5", 'json', '?');
                    $.getJSON(url, function(data) {                   
                        $("#libraries table tbody").tableGenerator({'fields': ['item.row.name','item.row.address'], 'data': data}); 
                    });
                    // Fire Stations
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'fire_stations', 'name,address,station_ty as type,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 264000, "", "3", 'json', '?');
                    $.getJSON(url, function(data) {                                          
                        $("#fire-stations table tbody").tableGenerator({'fields': ['item.row.name','item.row.type','item.row.address'], 'data': data}); 
                    });
                    // Police
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'police_stations', "name, address,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat", '', 264000, "", "3", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#police_stations table tbody").tableGenerator({'fields': ['item.row.name','item.row.address'], 'data': data}); 
                    });
                }
            break;
          
            case "TRANSPORTATION":
                if ($('#bus-stops table tbody').html().length == 0) { // Make sure information isn't already popupated
                    // CATS Bus Stops
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'busstops_pt', "stopdesc as name, replace(routes, ',', ', ') as address,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat", '', 10000, "", "10", 'json', '?');                   
                    $.getJSON(url, function(data) {                   
                        $("#bus-stops table tbody").tableGenerator({'fields': ['item.row.name','item.row.address'], 'data': data}); 
                    });
                    // CATS Park and Ride Locations
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cats_park_and_ride', 'name,routes,address,x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat', '', 100000, "", "3", 'json', '?');
                    $.getJSON(url, function(data) {                   
                         $("#park-and-rides table tbody").tableGenerator({'fields': ['item.row.name','item.row.address','item.row.routes.replace(/,/i, ", ")'], 'data': data}); 
                    });
                    // CATS Light Rail Stops
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cats_light_rail_stations', "name,'N/A' as address, x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat", '', 126400, "", "3", 'json', '?');
                    $.getJSON(url, function(data) {                   
                        $("#light-rail-stops table tbody").tableGenerator({'fields': ['item.row.name'], 'data': data}); 
                    });
                }
            break;
        
            case "PROPERTY":
                autoDataVisibility(null);
                if ($('#ownership table tbody').html().length == 0) {
                    // Show PID
                    $('#parcel_id').append("<h5>Parcel ID " + selectedAddress.parcelid + "</h5>");
                    // CAMA PHOTO
                    url = wsbase + "v1/ws_misc_house_photos.php?pid=" + selectedAddress.parcelid + "&callback=?";
                    $.getJSON(url, function(data) { 
                        if (data.total_rows > 0)  {
                            $.each(data.rows, function(i, item){
                                var dateclean = item.row.photo_date.match(/(\d{4})(\d{2})(\d{2})/);
                                formattedDate = dateclean[1] + '-' + dateclean[2] + '-' + dateclean[3];
                                $("#housephoto").append('<img src="' + item.row.photo_url + '" data-attribution="' + item.row.attribution + '" data-date="' + formattedDate + '" class="house_photo" title="' + formattedDate + ' from ' + item.row.attribution + '" />');
                            });
                            // remove dead photos
                            $("#housephoto img").each(function() {
                                $(this).error(function() {
                                    $(this).remove();
                                });
                            });

                            // sort photos
                            $("#housephoto img").sort(sortPhotos).appendTo("#housephoto");
                        }
                        else $("#housephoto").html('No property photos available.');
                        // add Submit Photo button
                        $("#housephoto").append('<div class="textcenter" style="margin-top: 10px;"><button type="button" id="newphoto">Submit a Photo!</button></div>');
                        $("#newphoto").button();
                    });
                    // Get ownership
                    url = wsbase + "v2/php-cgi/ws_cama_ownership.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                    $.getJSON(url, function(data) {
                        $("#ownership table tbody").tableGenerator({'fields': ['item.row.first_name + " " + item.row.last_name', "item.row.address_1 + ' ' + item.row.address_2 + '<br />' + item.row.city + ', ' + item.row.state + ' ' + item.row.zipcode"], 'data': data});  
                    });
                    // Get appraisal
                    url = wsbase + "v2/php-cgi/ws_cama_appraisal.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                    $.getJSON(url, function(data) {
                        //$("#appraisal_template").tmpl(data.rows, { rowCount: data.total_rows }).appendTo("#appraisal table tbody");
                        $("#appraisal table tbody").tableGenerator({'fields': ['item.row.tax_year', 'item.row.building_value.moneyfy()', 'item.row.extra_features_value.moneyfy()', 'item.row.land_value.moneyfy()', 'item.row.total_value.moneyfy()'], 'data': data});     
                    });
                    // Get sales history
                    url = wsbase + "v2/php-cgi/ws_cama_saleshistory.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                    $.getJSON(url, function(data) {
                        //$("#sales_history_template").tmpl(data.rows, { rowCount: data.total_rows }).appendTo("#sales_history table tbody");
                        $("#sales_history table tbody").tableGenerator({'fields': ['item.row.sale_date', 'item.row.sale_price.moneyfy()', 'item.row.deed_book', 'item.row.legal_reference'], 'data': data});
                    });
                    // Get land use
                    url = wsbase + "v2/php-cgi/ws_cama_landuse.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                    $.getJSON(url, function(data) {
                        //$("#land_use_template").tmpl(data.rows, { rowCount: data.total_rows }).appendTo("#land_use table tbody");
                        $("#land_use table tbody").tableGenerator({'fields': ['item.row.land_use', 'parseInt(item.row.units)', 'item.row.neighborhood_code'], 'data': data});
                    });
                    // Get legal information
                    url = wsbase + "v2/php-cgi/ws_cama_legal.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                    $.getJSON(url, function(data) {
                        //$("#legal_information_template").tmpl(data.rows, { rowCount: data.total_rows }).appendTo("#legal_information table tbody");
                        $("#legal_information table tbody").tableGenerator({'fields': ['item.row.legal_description', 'item.row.account_type', 'item.row.fire_district'], 'data': data});
                    });
                    // Get building information
                    url = wsbase + "v2/php-cgi/ws_cama_building.php?format=json&pidtype=tax&pid=" + selectedAddress.parcelid + "&callback=?";
                    $.getJSON(url, function(data) { 
                        //$("#building_information_1_template").tmpl(data.rows, { rowCount: data.total_rows }).appendTo("#building_information_1 table tbody");
                        $("#building_information_1 table tbody").tableGenerator({'fields': ['item.row.property_use_description + "(" + item.row.card_number + ")"', 'item.row.year_built', 'item.row.total_square_feet.commafy()', 'item.row.heated_square_feet.commafy()'], 'data': data});
                        //$("#building_information_2_template").tmpl(data.rows, { rowCount: data.total_rows }).appendTo("#building_information_2 table tbody");
                        $("#building_information_2 table tbody").tableGenerator({'fields': ['item.row.property_use_description + "(" + item.row.card_number + ")"', 'item.row.exterior_wall_description', 'item.row.bedrooms', 'parseInt(item.row.full_baths) + parseInt(item.row.half_baths)'], 'data': data});
                    });
                }
                break;
            
            case "VOTING":
                autoDataVisibility(null);
                if ($('#polling_location table tbody').html().length == 0) {
                    //Polling location
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'polling_locations,voting_precincts', 'polling_locations.name,polling_locations.address,a.precno,x(transform(polling_locations.the_geom, 4326)) as lon, y(transform(polling_locations.the_geom, 4326)) as lat', "a.precno = polling_locations.precno", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#polling_location table tbody").tableGenerator({'fields': ['item.row.precno', 'item.row.name', 'item.row.address'], 'data': data});
                    });
                    //NATIONAL SENATE
                    url = wsbase + "v1/ws_boe_officials.php?format=json&district_type=national_senate&district=&callback=?";
                    $.getJSON(url, function(data) {
                        $("#national_senate table tbody").tableGenerator({'fields': ['item.row.representative'], 'data': data});
                    });
                    //NATIONAL CONGRESSIONAL
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,national_congressional', 'elected_officials.district, elected_officials.representative',
                    "elected_officials.district_type = 'national_congressional' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.district as varchar(5)))", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#national_congressional table tbody").tableGenerator({'fields': ['item.row.district', 'item.row.representative'], 'data': data});
                    });
                    //STATE SENATE
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,state_senate', 'elected_officials.district,elected_officials.representative', 
                    "elected_officials.district_type = 'state_senate' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.senate as varchar(5)))", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#state_senate table tbody").tableGenerator({'fields': ['item.row.district', 'item.row.representative'], 'data': data});
                    });
                    //STATE HOUSE
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,state_house', 'elected_officials.district,elected_officials.representative', 
                    "elected_officials.district_type = 'state_house' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.house as varchar(5)))", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#state_house table tbody").tableGenerator({'fields': ['item.row.district', 'item.row.representative'], 'data': data});
                    });
                    //CHARLOTTE CITY COUNCIL
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,city_council', 'elected_officials.district,elected_officials.representative', 
                    "elected_officials.district_type = 'charlotte_city_council' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.citydist as varchar(5)))", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#city_council table tbody").tableGenerator({'fields': ['item.row.district', 'item.row.representative'], 'data': data});
                    });
                    // County commissioner
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,voting_precincts', 'elected_officials.district,elected_officials.representative', 
                    "elected_officials.district_type = 'county_commission' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.cc as varchar(5)))", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#county_commission table tbody").tableGenerator({'fields': ['item.row.district', 'item.row.representative'], 'data': data});
                    });
                    // School Board
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'elected_officials,voting_precincts', 'elected_officials.district,elected_officials.representative', 
                    "elected_officials.district_type = 'board_of_education' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.school as varchar(5)))", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#school_board table tbody").tableGenerator({'fields': ['item.row.district', 'item.row.representative'], 'data': data});
                    }); 
                }
            break;
        
            case "SCHOOLS":
                autoDataVisibility(null);
                if ($('#high_school_n table tbody').html().length == 0) {           
                    tooMany = "This address is too close to a school district boundary to give an accurate school assignment calculation. To locate your student's home school or your transportation zone, email your address to planning@cms.k12.nc.us or call 980-343-6246.";                    
                                        
                    // Current school year
                    $('#future_school_assignments').html("<br /><h5>2011-2012 School Assignments</h5>");
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'schools_1112,high_school_districts_1112', 'schools_1112.schlname,schools_1112.address, x(transform(schools_1112.the_geom, 4326)) as lon, y(transform(schools_1112.the_geom, 4326)) as lat', 'a.schl = schools_1112.schl', 150, "", "", 'json', '?');               
                    $.getJSON(url, function(data) {
                        $("#high_school_n table tbody").tableGenerator({'fields': ['item.row.schlname', 'item.row.address'], 'data': data.total_rows > 1 ? { "total_rows": "0"} : data, 'nodataString': tooMany });
                    });
                    // Get middle school data
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'schools_1112,middle_school_districts_1112', 'schools_1112.schlname,schools_1112.address, x(transform(schools_1112.the_geom, 4326)) as lon, y(transform(schools_1112.the_geom, 4326)) as lat', 'a.schl = schools_1112.schl', 150, "", "", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#middle_school_n table tbody").tableGenerator({'fields': ['item.row.schlname', 'item.row.address'], 'data': data.total_rows > 1 ? { "total_rows": "0"} : data, 'nodataString': tooMany });   
                    });
                    // Get elementary school data               
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'schools_1112,elementary_school_districts_1112', 'schools_1112.schlname,schools_1112.address, x(transform(schools_1112.the_geom, 4326)) as lon, y(transform(schools_1112.the_geom, 4326)) as lat', 'a.schl = schools_1112.schl', 150, "", "", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#elementary_school_n table tbody").tableGenerator({'fields': ['item.row.schlname', 'item.row.address'], 'data': data.total_rows > 1 ? { "total_rows": "0"} : data, 'nodataString': tooMany });   
                    });
                    // Get Transportation Zone
                    url = pointBuffer(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cms_transportation_zones_1011', 'choicezn', '', 150, "", "", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#transportation_zone_n table tbody").tableGenerator({'fields': ['item.row.choicezn'], 'data': data.total_rows > 1 ? { "total_rows": "0"} : data, 'nodataString': tooMany });
                    });
                    
                    // Magnet Schools
                    url = wsbase + "v1/ws_geo_attributequery.php?geotable=schools_1112&format=json&parameters=schl in (4344,4429,4488,5497,5513,7376,8364,4427) order by schlname&fields=schlname,address,round(cast(ST_Distance(the_geom,GeomFromText('POINT(" + selectedAddress.x_coordinate + " " + selectedAddress.y_coordinate + ")',2264))/5280 as numeric), 2) as dist&callback=?";                  
                    $.getJSON(url, function(data) {
                        $("#magnet_schools table tbody").tableGenerator({'fields': ['item.row.schlname', 'item.row.address', 'item.row.dist'], 'data': data});
                    });
                }
            break;
        
            case "ECONOMIC_DEVELOPMENT":
                autoDataVisibility("Economic Development");
                if ($('#parcel_ed table tbody').html().length == 0) {
                    // Zoning Data
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'view_zoning', 'zone_des, zone_class', "zone_des <> 'sm_towns'", 'json', '?');
                    $.getJSON(url, function(data) {
                        $("#parcel_ed table tbody").tableGenerator({'fields': ['selectedAddress.postal_city', 'item.row.zone_des', 'item.row.zone_class'], 'data': data });
                    });
                    // Parcel building permits
                    url = featureOverlay("tax_parcels", "building_permits", "extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost", "f.pid = '" + selectedAddress.groundparcel + "' and t.job_status = 'COMPL' ORDER BY t.date_completed_co_process", "json", "?");
                    $.getJSON(url, function(data) {
                        $("#parcel_ed_building_permits table tbody").tableGenerator({'fields': ['item.row.theyear', 'item.row.project_name', 'item.row.square_footage', 'item.row.construction_cost.moneyfy()'], 'data': data });
                    });
                    // Corridor Data
                    url = featureOverlay("economic_development_corridors", "economic_development_loans", "f.name, f.type, sum(t.cityloan) as cityloan", "Contains(f.the_geom,GeometryFromText('POINT(" + selectedAddress.x_coordinate + " " + selectedAddress.y_coordinate + " )', 2264)) group by f.name, f.type", "json", "?"); 
                    $.getJSON(url, function(data) {
                        $("#corridor_permits_1 table tbody").tableGenerator({'fields': ['item.row.name', 'item.row.type', 'item.row.cityloan.moneyfy()'], 'data': data });
                    });
                    // Permits - and ugly date garbage
                    themonth = (Math.ceil(( new Date().getMonth() + 1) / 3) - 1) * 3 + 1;
                    theyear = new Date().getFullYear();
                    todate = theyear + '-' + themonth + '-01';
                    fromdate = (theyear - 2) + '-' + themonth + '-01';
                    url = featureOverlay("economic_development_corridors", "building_permits", "extract(quarter from t.date_completed_co_process) as thequarter, extract(year from t.date_completed_co_process) as theyear,count(t.*) as thecount,sum(t.square_footage) as square_footage, sum(t.construction_cost) as construction_cost", "Contains(f.the_geom,GeometryFromText('POINT(" + selectedAddress.x_coordinate + " " + selectedAddress.y_coordinate + " )', 2264)) and t.job_status = 'COMPL' and t.date_completed_co_process >= '" + fromdate + "' and t.date_completed_co_process < '" + todate + "' group by thequarter, theyear order by theyear, thequarter", "json", "?");
                    $.getJSON(url, function(data) {
                        $("#corridor_permits_2 table tbody").tableGenerator({'fields': ['item.row.theyear', 'item.row.thequarter', 'item.row.thecount', 'item.row.square_footage', 'item.row.construction_cost.moneyfy()'], 'data': data });
                    });
                    // Grants and Loans
                    url = featureOverlay("tax_parcels", "economic_development_loans", "t.type, t.company,t.approval_date,t.cityloan", "f.pid = '" + selectedAddress.groundparcel + "' order by t.approval_date", "json", "?");
                    $.getJSON(url, function(data) {
                        $("#grantsandloans table tbody").tableGenerator({'fields': ['item.row.type', 'item.row.company', 'item.row.approval_date', 'item.row.cityloan.moneyfy()'], 'data': data });
                    });
                    // Business Investment Program
                    url = featureOverlay("tax_parcels", "economic_development_business_investment_program", "t.com_name, t.year,t.invstmnt,t.jobs", "f.pid = '" + selectedAddress.groundparcel + "'", "json", "?");
                    $.getJSON(url, function(data) {
                        $("#business_investment table tbody").tableGenerator({'fields': ['item.row.com_name', 'item.row.year', 'item.row.invstmnt.moneyfy()', 'item.row.jobs'], 'data': data });
                    });
                }
            break;
        
            case "COMMUNITY":
                autoDataVisibility(null);
                if ($('#crime table tbody').html().length === 0) {
                    // Crime Stats
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'cmpd_districts', 'division, div_name,murder_and_non_negligent_manslaughter,murder_and_non_negligent_manslaughter_change, rape, rape_change,robbery,robbery_change,aggravated_assault,aggravated_assault_change,burglary, burglary_change,larceny , larceny_change, vehicle_theft, vehicle_theft_change, arson, arson_change, total_incidents, total_incidents_change, violent_incidents, violent_incidents_change, property_incidents, property_incidents_change', "", 'json', '?');
                    $.getJSON(url, function(data) {
                        if (data.total_rows > 0) $("#crime table th:first").html(data.rows[0].row.div_name);
                        $("#crime table tbody").tableGenerator({'returnType': 'rowsv', 'fields': [
                                'Murder and Non-Negligent Homicide', 'settings.data.rows[0].row.murder_and_non_negligent_manslaughter.commafy()', 'settings.data.rows[0].row.murder_and_non_negligent_manslaughter_change + "%"',
                                'Rape', 'settings.data.rows[0].row.rape.commafy()', 'settings.data.rows[0].row.rape_change + "%"',
                                'Robbery', 'settings.data.rows[0].row.robbery.commafy()', 'settings.data.rows[0].row.robbery_change + "%"',
                                'Aggravated Assault', 'settings.data.rows[0].row.aggravated_assault.commafy()', 'settings.data.rows[0].row.aggravated_assault_change + "%"',
                                'Burglary', 'settings.data.rows[0].row.burglary.commafy()', 'settings.data.rows[0].row.burglary_change + "%"',
                                'Larceny', 'settings.data.rows[0].row.larceny.commafy()', 'settings.data.rows[0].row.larceny_change + "%"',
                                'Vehicle Theft', 'settings.data.rows[0].row.vehicle_theft.commafy()', 'settings.data.rows[0].row.vehicle_theft_change + "%"',
                                'Arson', 'settings.data.rows[0].row.arson.commafy()', 'settings.data.rows[0].row.arson_change + "%"',
                                'Total Incidents', 'settings.data.rows[0].row.total_incidents.commafy()', 'settings.data.rows[0].row.total_incidents_change + "%"',
                                'Violent Incidents', 'settings.data.rows[0].row.violent_incidents.commafy()', 'settings.data.rows[0].row.violent_incidents_change + "%"',
                                'Property Incidents', 'settings.data.rows[0].row.property_incidents.commafy()', 'settings.data.rows[0].row.property_incidents_change + "%"'
                            ], 'data': data });
                    });
                    
                    // Demographics
                    url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'census_blockgroup_2010', 'popcy, popcyfam, popcynfm, agecymed, raccywhite, raccyblack, raccyamind, raccyasian, raccymult, hiscyhisp, agecygt15, agecygt25, hhdcy, dwlcy, inccypcap, inccymedhh, inccyavedd, unecyrate', "", 'json', '?');
                    $.getJSON(url, function(data) {
                        
                        if (data.total_rows > 0) {
                            url = pointOverlay(selectedAddress.x_coordinate, selectedAddress.y_coordinate, 2264, 'census_blockgroup_2016_projection', 'poppy, poppyfam, poppynfm, agepymed, racpywhite, racpyblack, racpyamind, racpyasian, racpymult, hispyhisp, agepygt15, agepygt25, hhdpy, dwlpy, incpypcap, incpymedhh, incpyavedd, unepyrate', "", 'json', '?');
                            $.getJSON(url, function(data2) {
                                                   
                                $("#demographics table tbody").tableGenerator({'returnType': 'rowsv', 'fields': [
                                    'POPULATION', 'settings.data.rows[0].row.popcy.commafy()', 'settings.data2.rows[0].row.poppy.commafy()',
                                    'IN FAMILY HOUSEHOLDS', 'settings.data.rows[0].row.popcyfam.commafy()', 'settings.data2.rows[0].row.poppyfam.commafy()',
                                    'IN NON-FAMILY HOUSEHOLDS', 'settings.data.rows[0].row.popcynfm.commafy()', 'settings.data2.rows[0].row.poppynfm.commafy()',
                                    'MEDIAN AGE', 'settings.data.rows[0].row.agecymed.commafy()', 'settings.data2.rows[0].row.agepymed.commafy()',
                                    'WHITE', 'settings.data.rows[0].row.raccywhite.commafy()', 'settings.data2.rows[0].row.racpywhite.commafy()',
                                    'BLACK', 'settings.data.rows[0].row.raccyblack.commafy()', 'settings.data2.rows[0].row.racpyblack.commafy()',
                                    'AMERICAN INDIAN', 'settings.data.rows[0].row.raccyamind.commafy()', 'settings.data2.rows[0].row.racpyamind.commafy()',
                                    'ASIAN OR PACIFIC ISLANDER', 'settings.data.rows[0].row.raccyasian.commafy()', 'settings.data2.rows[0].row.racpyasian.commafy()',
                                    'MULTI-RACE', 'settings.data.rows[0].row.raccymult.commafy()', 'settings.data2.rows[0].row.racpymult.commafy()',
                                    'HISPANIC', 'settings.data.rows[0].row.hiscyhisp.commafy()', 'settings.data2.rows[0].row.hispyhisp.commafy()',
                                    'AGE 15+', 'settings.data.rows[0].row.agecygt15.commafy()', 'settings.data2.rows[0].row.agepygt15.commafy()',
                                    'AGE 25+', 'settings.data.rows[0].row.agecygt25.commafy()', 'settings.data2.rows[0].row.agepygt25.commafy()',
                                    'HOUSEHOLDS', 'settings.data.rows[0].row.hhdcy.commafy()', 'settings.data2.rows[0].row.hhdpy.commafy()',
                                    'HOUSING UNITS', 'settings.data.rows[0].row.dwlcy.commafy()', 'settings.data2.rows[0].row.hhdpy.commafy()',
                                    'PER CAPITA INCOME', 'settings.data.rows[0].row.inccypcap.moneyfy()', 'settings.data2.rows[0].row.incpypcap.moneyfy()',
                                    'MEDIAN HOUSEHOLD INCOME', 'settings.data.rows[0].row.inccymedhh.moneyfy()', 'settings.data2.rows[0].row.incpymedhh.moneyfy()',
                                    'AVERAGE DISPOSABLE INCOME', 'settings.data.rows[0].row.inccyavedd.moneyfy()', 'settings.data2.rows[0].row.incpyavedd.moneyfy()',
                                    'UNEMPLOYMENT RATE', 'settings.data.rows[0].row.unecyrate.commafy()', 'settings.data2.rows[0].row.unepyrate.commafy()'
                                ], 'data': data, 'data2': data2 });
                            
                            });
                        }
                    });
                    
                }
            break;
        
            case "ENVIRONMENT":
                autoDataVisibility("Environmental Layers");
                if ($('#environment_general').html().length === 0) {

                    //Impervious Surface
                    url = wsbase + "v1/ws_geo_attributequery.php?geotable=impervious_surface_area&fields=sum(sum_of_area) as sum_of_area,subtheme&parameters=commonpid='" + selectedAddress.parcelid + "' group by subtheme&format=json&callback=?";
                    $.getJSON(url, function(data) {
                        if (data.total_rows > 0) {
                            total_imperv = 0;
                            subthemes = "";
                            $.each(data.rows, function(i, item){
                                total_imperv += parseInt(item.row.sum_of_area, 10);
                                subthemes += item.row.subtheme + ":" + item.row.sum_of_area.commafy() + "ft<sup>2</sup><br />";
                            });
                            impbuffer = "This parcel contains <b>" + total_imperv + " square feet</b> of impervious surface area. <br />" + subthemes;
                            
                            // Get date updated
                            url = wsbase + "v1/ws_geo_attributequery.php?geotable=impervious_surface_update&fields=type,last_update&parameters=&format=json&callback=?";
                            $.getJSON(url, function(data) {
                                if (data.total_rows > 0 ) {
                                    $.each(data.rows, function(i, item){
                                        $('#environment_critical').append("<li class='environment-water'>" + impbuffer + " " + item.row.type + " impervious information was last updated on " + item.row.last_update + ".</li>");
                                    });
                                }
                            });
                        }
                        else $('#environment_general').append('<li class="environment-water">No impervious surface area was found on this parcel.</li>');
                    });
                    
                    //Floodplain
                    url = featureOverlay("tax_parcels", "view_regulated_floodplains", "t.gid", "f.pid = '" + selectedAddress.groundparcel + "' limit 1", "json", "?");
                    $.getJSON(url, function(data) {
                        if (data.total_rows > 0) {
                            $('#environment_critical').append('<li class="environment-water">This property <b>is in a regulated floodplain</b>. <a target="_blank" href="http://mapserver.mecklenburgcountync.gov/3dfz/index.html?matid=' + selectedAddress.objectid + '">Special restrictions may apply</a>. For more information, please call 704.336.3728.</li>');
                        }
                        else $('#environment_general').append('<li class="environment-water">This property <b>is not in a regulated floodplain</b>.</li>');
                    });
                    
                    // Land Classification
                    url = wsbase + "v1/ws_geo_rasterfeatureoverlay.php?format=json&from_geotable=tax_parcels&to_raster=land_classification_2008&parameters=pid='" + selectedAddress.groundparcel + "'&callback=?";
                    $.getJSON(url, function(data) { 
                        if (data.total_rows > 0) {
                            landbuffer = "This property contains the following land classifications: ";
                            $.each(data.rows, function(i, item){
                                landbuffer += '<br />' + landClass(item.row.value) + ': ' + item.row.area.commafy() + 'ft<sup>2</sup> (' + Math.round(item.row.pct * 1000)/10 + '%)';
                            });
                            $("#environment_general").append("<li class='environment-land'>"+ landbuffer + "</li>");
                        }
                        else $("#environment_general").append('<li class="environment-land">No land classification information was found on this parcel.</li>');
                    });
                    
                    //Water quality buffer
                    url = featureOverlay("tax_parcels", "water_quality_buffers", "distinct type,label", "f.pid = '" + selectedAddress.groundparcel + "'", "json", "?");
                    $.getJSON(url, function(data) { 
                        if (data.total_rows > 0) {
                            wqbuffer = 'This property <b>includes water quality buffers</b>:';
                            
                            $.each(data.rows, function(i, item){
                                wqbuffer += '<br />' + item.row.label + ' ' + item.row.type;
                            });
                            $("#environment_critical").append('<li class="environment-water">' + wqbuffer + '<br /><a target="_blank" href="ftp://ftp1.co.mecklenburg.nc.us/WaterQuality/WQ%20Buffers/WaterQualityBufferImplementationGuidelines.pdf">Special restrictions may apply</a>. For more information, please call 704.336.5456 for existing single-family lots and those projects not needing a grading permit or call 704.432.5570 for other projects.</li>');
                        }
                        else $("#environment_general").append('<li class="environment-water">This property <b>does not include water quality buffers</b>.</li>');
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
                            $.each(data.rows, function(i, item){
                                soilbuffer += '<br />' + item.row.name + ' (' + item.row.description + ', hydrologic group ' + item.row.hydrologic_group + ')';
                            });
                            $("#environment_general").append("<li class='environment-land'>" + soilbuffer + "</li>");
                        }
                        else $("#environment_general").append('<li class="environment-land">Unable to determine soil types.</li>');
                    });
                    
                    // Solar
                    url = featureOverlay("tax_parcels", "buildings", "sum(ST_Area(t.the_geom)) as thearea", "f.pid = '" + selectedAddress.groundparcel + "'", "json", "?");
                    $.getJSON(url, function(data) {
                        if (data.total_rows > 0 && data.rows[0].row.thearea.length > 0) $("#environment_general").append('<li class="environment-green">This property has <strong>' + data.rows[0].row.thearea.commafy() + '</strong>sqft of roof area. Using 10% of your roof with an unobstructed view to the south for photovoltaic energy, you have <strong>' + parseInt(data.rows[0].row.thearea * .1 * 103.9) + '</strong>  kWh of estimated annual AC energy output for an annual savings of <strong>' + (data.rows[0].row.thearea * .1 * 8.84).toString().moneyfy() + '</strong>.</li>');
                        else $("#environment_general").append('<li class="environment-green">No solar power information found.</li>');
                    });
                    
                    // Critical Protection Areas
                    url = featureOverlay("tax_parcels", "conservation_protection_areas", "t.gid", "f.pid = '" + selectedAddress.groundparcel + "' limit 1", "json", "?");
                    $.getJSON(url, function(data) {
                        if (data.total_rows > 0) {
                            $('#environment_general').append('<li class="environment-green">This property <b>overlaps a critical protection area</b>.</li>');
                        }
                        else $('#environment_general').append('<li class="environment-green">This property <b>does not overlap a critical protection area</b>.</li>');
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
                        }
                        else $("#environment_general").append('<li class="environment-water">No watershed records found.</li>');
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






/******************************************************************************/

/**
 * Generic Functions
 * @author      Tobin Bradley
 * @license     MIT
 */

/**
 * Takes a string a URL encodes or decodes it
 * @param {string} str
 */
function urlencode(str) {
    str = escape(str);
    str = str.replace('+', '%2B');
    str = str.replace('%20', '+');
    str = str.replace('*', '%2A');
    str = str.replace('/', '%2F');
    str = str.replace('@', '%40');
    return str;
}
function urldecode(str) {
    str = str.replace('+', ' ');
    str = unescape(str);
    return str;
}


/**
 * Return whether a string is a number or not
 */
function isNumber (o) {
  return ! isNaN (o-0);
}


/**
 * Add commas to numeric values
 */
String.prototype.commafy = function() {
  return parseInt(this).toString().replace(/(.)(?=(.{3})+$)/g,"$1,")
}

/**
 * Make nice money
 */
String.prototype.moneyfy = function() {
  return "$" + this.commafy()
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

/**
 * Read a page's GET URL variables and return them as an associative array.
 */
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


/**
 * Find locations
 * @param {string} findType  The type of find to perform
 * @param {string} findTable  The table to search on
 * @param {string} findField  The field to search in
 * @param {string} findID  The value to search for
 */
function locationFinder(findType, findTable, findField, findID, findLabel, findValue) {
    switch (findType) {
        case "Address": case "PID": case "API":
            url = wsbase + 'v2/ws_mat_addressnum.php?format=json&callback=?&jsonp=?&addressnum=' + findID;
            $.getJSON(url, function(data) {                   
                if (data.total_rows > 0) {
                    
                    $.each(data.rows, function(i, item){
                        // Create selectedLocation links
                        selectedLocation = item.row.address;
                        selectedLocation += '<br /><span class="smallfont">[ <a href="javascript:void(0)" onclick="zoomToLonLat(' + item.row.longitude +', ' + item.row.latitude + ', 16);">Zoom To</a>';
                        selectedLocation += ' | <a href="#' + item.row.objectid + '">Permalink</a> ]</span>';
                        $('.selectedLocation').html(selectedLocation);
                        $('.selected-data-clear, .datatable tbody').empty();
                        $('.selected-data').show();
                        addMarker(item.row.longitude, item.row.latitude, 0, "<h5>Selected Property</h5><p>" + item.row.address + "</p>");
                        selectedAddress = {
                            "objectid": item.row.objectid,
                            "x_coordinate": item.row.x_coordinate,
                            "y_coordinate": item.row.y_coordinate,
                            "parcelid": item.row.parcel_id,
                            "groundparcel": item.row.ground_pid,
                            "address": item.row.address,
                            "postal_city": item.row.postal_city,
                            "lon": item.row.longitude,
                            "lat": item.row.latitude
                        };
                        // Set window hash
                        window.location.hash = selectedAddress.objectid; 
                        // Call data accordion change function if open so results are refreshed
                        processAccordionDataChange($("#accordion-data h3").eq($('#accordion-data').accordion('option', 'active')).attr("id"));
                    });
                }
            });
            break; 
        case "Library": case "Park": case "School": case "GeoName": case "CATS": 
            // Set list of fields to retrieve from POI Layers
            poiFields = {
                "libraries" : "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || name || '</h5><p>' || address || '</p>' AS label",
                "schools_1011" : "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || coalesce(schlname,'') || '</h5><p>' || coalesce(type,'') || ' School</p><p>' || coalesce(address,'') || '</p>' AS label",
                "parks" : "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || prkname || '</h5><p>Type: ' || prktype || '</p><p>' || prkaddr || '</p>' AS label",
                "geonames" : "longitude as lon, latitude as lat, '<h5>' || name || '</h5>'  as label",
                "cats_light_rail_stations" : "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || name || '</h5><p></p>' as label",
                "cats_park_and_ride" : "x(transform(the_geom, 4326)) as lon, y(transform(the_geom, 4326)) as lat, '<h5>' || name || '</h5><p>Routes ' || routes || '</p><p>' || address || '</p>' AS label"
            };
            url = wsbase + "v1/ws_geo_attributequery.php?format=json&geotable=" + findTable + "&parameters=" + urlencode(findField + " = " + findID) + "&fields=" + urlencode(poiFields[findTable]) + '&callback=?';
            $.getJSON(url, function(data) {                   
                $.each(data.rows, function(i, item){
                    addMarker(item.row.lon, item.row.lat, 1, item.row.label);
                });
            });
            break;
        case "Road": 
            url = wsbase + "v1/ws_geo_getcentroid.php?format=json&geotable=" + findTable + "&parameters=streetname='" + findValue + "' order by ll_add limit 1&forceonsurface=true&srid=4326&callback=?";
            $.getJSON(url, function(data) {                   
                $.each(data.rows, function(i, item){
                    addMarker(item.row.x, item.row.y, 1, "<h5>Road</h5><p>" + findValue + "</p>");
                });
            });
            
            break;
        case "Intersection": 
            url = wsbase + "v1/ws_geo_centerlineintersection.php?format=json&callback=?";
            streetnameArray = findID.split("&");
            args = "&srid=4326&streetname1=" + urlencode(jQuery.trim(streetnameArray[0])) + "&streetname2=" + urlencode(jQuery.trim(streetnameArray[1]));
            $.getJSON(url + args, function(data) {
                if (data.total_rows > 0 ) {                       
                    $.each(data.rows, function(i, item){
                        addMarker(item.row.xcoord, item.row.ycoord, 1, "<h5>Intersection</h5><p>" + findID + "</p>");
                    });
                }
            });
            break;
    }
}


/**
 * Create URL to Google Maps for routing
 * @param {string} fromAddress
 * @param {string} toAddress
 */
function googleRoute (fromAddress, toAddress) {
    url = "http://maps.google.com/maps?hl=en";
    url += "&saddr=" + urlencode(fromAddress);
    url += "&daddr=" + urlencode(toAddress);
    return url;
}

/**
 * Web service handler for point buffer operation
 * @param {float} x
 * @param {float} y
 * @param {integer} srid
 * @param {string} geotable
 * @param {string} fields
 * @param {string} parameters
 * @param {float} distance
 * @param {string} format
 * @param {string} jsonp_callback
 */
function pointBuffer (x, y, srid, geotable, fields, parameters, distance, order, limit, format, jsonp_callback) {
    url = wsbase;
    url += "v2/ws_geo_bufferpoint.php";
    url += "?x=" + x;
    url += "&y=" + y;
    url += "&srid=" + srid;
    url += "&geotable=" + geotable;
    url += "&fields=" + urlencode(fields);
    url += "&parameters=" + urlencode(parameters);
    url += "&distance=" + distance;
    url += "&order=" + urlencode(order);
    url += "&limit=" + urlencode(limit);
    url += "&format=" + format;
    url += "&callback=" + jsonp_callback;
    return url;
}

/**
 * Web sevrice handler for point overlay operation
 * @param {float} x
 * @param {float} y
 * @param {integer} srid
 * @param {string} geotable
 * @param {string} fields
 * @param {string} parameters
 * @param {string} format
 * @param {string} jsonp_callback
 */
function pointOverlay (x, y, srid, geotable, fields, parameters, format, jsonp_callback) {
    url = wsbase;
    url += "v1/ws_geo_pointoverlay.php";
    url += "?x=" + x;
    url += "&y=" + y;
    url += "&srid=" + srid;
    url += "&geotable=" + geotable;
    url += "&fields=" + urlencode(fields);
    url += "&parameters=" + urlencode(parameters);
    url += "&format=" + format;
    url += "&callback=" + jsonp_callback;
    return url;
}

/**
 * Web service handler for feature overlay operation
 * @param {string} from_geotable
 * @param {string} to_geotable
 * @param {string} fields
 * @param {string} parameters
 * @param {string} format
 * @param {string} jsonp_callback
 */
function featureOverlay (from_geotable, to_geotable, fields, parameters, format, jsonp_callback) {
    url = wsbase;
    url += "v1/ws_geo_featureoverlay.php";
    url += "?from_geotable=" + from_geotable;
    url += "&to_geotable=" + to_geotable;
    url += "&fields=" + urlencode(fields);
    url += "&parameters=" + urlencode(parameters);
    url += "&format=" + format;
    url += "&callback=" + jsonp_callback;
    return url;
}

/**
 * Web service handler for feature buffer operation
 * @param {string} from_geotable
 * @param {string} to_geotable
 * @param {string} fields
 * @param {string} parameters
 * @param {float} distance
 * @param {string} format
 * @param {string} jsonp_callback
 */
function featureBuffer (from_geotable, to_geotable, fields, parameters, distance, format, jsonp_callback) {
    url = wsbase;
    url += "v1/ws_geo_bufferfeature.php";
    url += "?from_geotable=" + from_geotable;
    url += "&to_geotable=" + to_geotable;
    url += "&fields=" + urlencode(fields);
    url += "&parameters=" + urlencode(parameters);
    url += "&distance=" + urlencode(distance);
    url += "&format=" + format;
    url += "&callback=" + jsonp_callback;
    return url;
}