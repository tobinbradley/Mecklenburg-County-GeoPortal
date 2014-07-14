// Overlay layers
function overlayLayer(q) {

    // remove layer if it exists and the question has changed
    if (overlay.q && overlay.q !== q) {
        map.removeLayer(overlay.layer);
    }

    // Apply any overlays for the question if an overlay doesn't exist or it has changed
    if (!overlay.q || (overlay.q && overlay.q !== q)) {
        overlay.q = q;
        switch (q) {
        case "env-water":
            overlay.layer = L.tileLayer.wms("http://maps.co.mecklenburg.nc.us/geoserver/wms", {
                layers: 'postgis:view_regulated_floodplains,postgis:water_quality_buffers',
                format: 'image/png',
                transparent: true,
                opacity: 0.7
            }).addTo(map).bringToFront();
            break;
        case "env-air":
            overlay.layer = L.tileLayer.wms("http://maps.co.mecklenburg.nc.us/geoserver/wms", {
                layers: 'postgis:air_pollution_facilities',
                format: 'image/png',
                transparent: true,
                opacity: 0.7
            }).addTo(map).bringToFront();
            break;
        case "env-land":
            overlay.layer = L.tileLayer.wms("http://maps.co.mecklenburg.nc.us/geoserver/wms", {
                layers: 'postgis:landfills,postgis:mpl_sites',
                format: 'image/png',
                transparent: true,
                opacity: 0.7
            }).addTo(map).bringToFront();
            break;
        case "impervious":
            overlay.layer = L.tileLayer.wms("http://maps.co.mecklenburg.nc.us/geoserver/wms", {
                layers: 'impervious_surface',
                format: 'image/png',
                transparent: true,
                opacity: 0.5
            }).addTo(map).bringToFront();
            break;
        default:
            overlay = {};
            break;
        }
    }
}

// Fetch data for reports
function question(q) {
    // if not a print then empty .report
    if (pageType !== "PRINT") { $(".report").empty(); }
    if (activeRecord.gid) {
        if (markers[0]) { markers[0].openPopup(); }
        switch (q) {
        case "parks":
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_geo_nearest.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'parks_all',
                    'geometryfield': 'geom',
                    'fields': 'name as label, address, city, x(transform(geom, 4326)) as lng, y(transform(geom, 4326)) as lat',
                    'limit': '5'
                },
                success: function (data) {
                    report("parks", data, "");
                }
            });
            break;
        case "libraries":
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_geo_nearest.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'libraries',
                    'fields': 'name as label, address, city, x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat',
                    'limit': '5'
                },
                success: function (data) {
                    report("libraries", data, "");
                }
            });
            break;

        case "trash":
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'solid_waste',
                    'fields': 'thetext as label, jurisdiction',
                    'order': 'label desc'
                },
                success: function (data) {
                    report("trash", data, "");
                }
            });
            break;

        case "fire":
            $('.report').append('<div class="fire_stations"></div><div class="fire_district"></div>');
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_geo_nearest.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'fire_stations',
                    'fields': 'name as label, address, station_ty as type, x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat',
                    'limit': '3'
                },
                success: function (data) {
                    report("fire_nearest", data, '.fire_stations');
                }
            });
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/php-cgi/ws_cama_legal.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'pid': activeRecord.pid,
                    'pidtype': 'tax',
                    'format': 'json'
                },
                success: function (data) {
                    report("fire_district", data.rows[0], '.fire_district');
                }
            });
            break;

        case "police":
            $('.report').append('<div class="police_stations"></div><div class="police_stats"></div>');
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_geo_nearest.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'police_stations',
                    'fields': 'name as label, address, x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat',
                    'limit': '3'
                },
                success: function (data) {
                    report("police_nearest", data, ".police_stations");
                }
            });
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'view_neighborhoods',
                    'fields': 'property_crime, violent_crime',
                    'geometryfield': 'geom'
                },
                success: function (data) {
                    report("police_stats", data, '.police_stats');
                }
            });
            break;

        case "schools-home":
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_bufferpoint.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'distance': 150,
                    'table': 'school_districts',
                    'fields': "type,schlname as label,address,city,x as lng, y as lat, round(ST_Distance(ST_Transform(ST_GeomFromText('POINT(" + activeRecord.lng + " " + activeRecord.lat + ")',4326), 2264),ST_transform(ST_GeomFromText('POINT(' || x || ' ' || y || ')',4326), 2264))) as dist"
                },
                success: function (data) {
                    report("schools-home", data, "");
                }
            });
            break;

        case "schools-magnet":
            $('.report').append('<div class="schools-magnet"></div><div class="schools-zone"></div>');
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_attributequery.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'table': 'view_schools_magnet',
                    'fields': "schlname as label, schl, address,ST_Distance(the_geom,ST_Transform(GeomFromText('POINT(" + activeRecord.lng + " " + activeRecord.lat + ")',4326), 2264)) as distance, x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat",
                    'order': 'distance'
                },
                success: function (data) {
                    report("schools_magnet", data, ".schools-magnet");
                }
            });
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_bufferpoint.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'distance': 150,
                    'geometryfield': 'geom',
                    'table': 'magnet_school_transportation_zones',
                    'fields': "choicezn"
                },
                success: function (data) {
                    report("schools-zone", data, ".schools-zone");
                }
            });
            break;

        case "voting":
            $('.report').append('<div class="voting-poll"></div><div class="voting-nats"></div><div class="voting-natc"></div><div class="voting-senate"></div><div class="voting-house"></div><div class="voting-cc"></div><div class="voting-sb"></div><div class="voting-city"></div>');
            // polling location
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'polling_locations,voting_precincts',
                    'fields': "polling_locations.name as label,polling_locations.address,a.precno as precinct,x(transform(polling_locations.the_geom, 4326)) as lng, y(transform(polling_locations.the_geom, 4326)) as lat, ST_Distance(polling_locations.the_geom,ST_Transform(GeomFromText('POINT(" + activeRecord.lng + " " + activeRecord.lat + ")',4326), 2264)) as distance",
                    'parameters': 'a.precno = polling_locations.precno'
                },
                success: function (data) {
                    report("voting-poll", data, ".voting-poll");
                }
            });

            // national senate
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_boe_officials.php?format=json&district_type=national_senate&district=',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'format': 'json',
                    'district_type': 'national_senate',
                    'district': ''
                },
                success: function (data) {
                    report("voting-natsenate", data.rows, '.voting-nats');
                }
            });
            // National Congressional
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'elected_officials,national_congressional',
                    'fields': "elected_officials.district, elected_officials.representative",
                    'parameters': "elected_officials.district_type = 'national_congressional' and (elected_officials.district = 'At-Large' or elected_officials.district = cast(a.district as varchar(5)))"
                },
                success: function (data) {
                    report("voting-natc", data, ".voting-natc");
                }
            });
            // state senate
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'elected_officials,state_senate',
                    'fields': "elected_officials.district,elected_officials.representative",
                    'parameters': "elected_officials.district_type = 'state_senate' and elected_officials.district = cast(a.senate as varchar(5))"
                },
                success: function (data) {
                    report("voting-state-senate", data, ".voting-senate");
                }
            });
            // state house
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'elected_officials,state_house',
                    'fields': "elected_officials.district,elected_officials.representative",
                    'parameters': "elected_officials.district_type = 'state_house' and elected_officials.district = cast(a.house as varchar(5))"
                },
                success: function (data) {
                    report("voting-house", data, ".voting-house");
                }
            });
            // County commissioners
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'elected_officials,voting_precincts',
                    'fields': "elected_officials.district,elected_officials.representative,elected_officials.district",
                    'parameters': "elected_officials.district_type = 'county_commission' and (elected_officials.district = cast(a.cc as varchar(5)) or elected_officials.district = 'At-Large')"
                },
                success: function (data) {
                    report("voting-cc", data, ".voting-cc");
                }
            });
            // school board
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'elected_officials,voting_precincts',
                    'fields': "elected_officials.district,elected_officials.representative,elected_officials.district",
                    'parameters': "elected_officials.district_type = 'board_of_education' and (elected_officials.district = cast(a.school as varchar(5)) or elected_officials.district = 'At-Large')"
                },
                success: function (data) {
                    report("voting-sb", data, ".voting-sb");
                }
            });
            // city council
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'elected_officials,city_council',
                    'fields': "elected_officials.district,elected_officials.representative,elected_officials.district",
                    'parameters': "elected_officials.district_type = 'charlotte_city_council' and (elected_officials.district = cast(a.citydist as varchar(5)) or elected_officials.district = 'At-Large')",
                    'debug': 'true'
                },
                success: function (data) {
                    report("voting-city", data, ".voting-city");
                }
            });
            break;

        case "econ":
            $('.report').append('<div class="econ-zoning"></div><div class="econ_parcel_permits"></div><div class="econ_neighborhood_permits"></div>');
            // zoning
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'view_zoning',
                    'fields': "zone_des, zone_class",
                    'parameters': "zone_des <> 'sm_towns'"
                },
                success: function (data) {
                    report("econ-zoning", data, ".econ-zoning");
                }
            });
            // parcel building permits
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_featureoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'from_table': 'tax_parcels',
                    'to_table': 'building_permits',
                    'fields': "extract(year from t.date_completed_co_process) as theyear, t.project_name,t.square_footage,t.construction_cost",
                    'parameters': "f.pid = '" + activeRecord.pid + "' and t.job_status = 'COMPL'",
                    'order': 't.date_completed_co_process desc',
                    'limit': 10
                },
                success: function (data) {
                    report("econ_parcel_permits", data, ".econ_parcel_permits");
                }
            });
            // neighborhood building permits
            themonth = (Math.ceil((new Date().getMonth() + 1) / 3) - 1) * 3 + 1;
            theyear = new Date().getFullYear();
            todate = theyear + '-' + themonth + '-01';
            fromdate = (theyear - 2) + '-' + themonth + '-01';
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_featureoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'from_table': 'neighborhoods',
                    'to_table': 'building_permits',
                    'fields': "extract(quarter from t.date_completed_co_process) as thequarter, extract(year from t.date_completed_co_process) as theyear,count(t.*) as thecount,sum(t.square_footage) as square_footage, sum(t.construction_cost) as construction_cost",
                    'parameters': "ST_Contains(f.the_geom,ST_transform(ST_GeometryFromText('POINT(" + activeRecord.lng + " " + activeRecord.lat + " )', 4326), 2264)) and t.job_status = 'COMPL' and t.date_completed_co_process >= '" + fromdate + "' and t.date_completed_co_process < '" + todate + "' group by thequarter, theyear",
                    'order': 'theyear, thequarter'
                },
                success: function (data) {
                    report("econ_neighborhood_permits", data, ".econ_neighborhood_permits");
                }
            });
            break;

        case "photos":
            // house photo
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_misc_house_photos.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'pid': activeRecord.pid
                },
                success: function (data) {
                    report("photos", data.rows, "");
                }
            });
            break;

        case "property":
            $('.report').append('<div class="property-ownership"></div><div class="property-appraisal"></div><div class="property-sales"></div><div class="property-landuse"></div><div class="property-building"></div>');
            // ownership
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/php-cgi/ws_cama_ownership.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'pid': activeRecord.pid,
                    'pidtype': 'tax',
                    'format': 'json'
                },
                success: function (data) {
                    report("property-ownership", data.rows, ".property-ownership");
                }
            });
            // appraisal
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/php-cgi/ws_cama_appraisal.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'pid': activeRecord.pid,
                    'pidtype': 'tax',
                    'format': 'json'
                },
                success: function (data) {
                    report("property-appraisal", data.rows, ".property-appraisal");
                }
            });
            // sales history
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/php-cgi/ws_cama_saleshistory.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'pid': activeRecord.pid,
                    'pidtype': 'tax',
                    'format': 'json'
                },
                success: function (data) {
                    report("property-sales", data.rows, ".property-sales");
                }
            });
            // land use
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/php-cgi/ws_cama_landuse.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'pid': activeRecord.pid,
                    'pidtype': 'tax',
                    'format': 'json'
                },
                success: function (data) {
                    report("property-landuse", data.rows, ".property-landuse");
                }
            });
            // building
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/php-cgi/ws_cama_building.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'pid': activeRecord.pid,
                    'pidtype': 'tax',
                    'format': 'json'
                },
                success: function (data) {
                    report("property-building", data.rows, ".property-building");
                }
            });
            break;
        case "impervious":
            // impervious surface
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_attributequery.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'table': 'impervious_surface_area',
                    'fields': "sum(sum_of_area) as area, subtheme",
                    'parameters': "commonpid='" + activeRecord.pid + "' group by subtheme",
                    'order': 'subtheme'
                },
                success: function (data) {
                    report("impervious", data, "");
                }
            });
            break;
        case "env-air":
            // environment - air
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_bufferpoint.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'distance': 2640,
                    'table': 'air_pollution_facilities',
                    'fields': "name, x(transform(the_geom, 4326)) as lng, y(transform(the_geom, 4326)) as lat, round(ST_Distance(ST_Transform(ST_GeomFromText('POINT(" + activeRecord.lng + " " + activeRecord.lat + ")',4326), 2264),ST_transform(the_geom, 2264))) as dist",
                    'order': 'dist'
                },
                success: function (data) {
                    report("env-air-apf", data, "");
                }
            });
            break;
        case "env-land":
            // environment - land
            $('.report').append('<div class="env-land-contamination"></div><div class="env-land-soil"></div><div class="env-land-landuse"></div>');
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v3/ws_geo_bufferpoint.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'distance': 1500,
                    'table': 'mpl_sites',
                    'fields': "mpl_number, x(st_transform(st_centroid(the_geom), 4326)) as lng, y(st_transform(st_centroid(the_geom), 4326)) as lat, round(ST_Distance(ST_Transform(ST_GeomFromText('POINT(" + activeRecord.lng + " " + activeRecord.lat + ")',4326), 2264),ST_transform(the_geom, 2264))) as dist",
                    'order': 'dist'
                },
                success: function (data) {
                    report("env-land-contamination", data, ".env-land-contamination");
                }
            });
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_featureoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'from_table': 'tax_parcels',
                    'to_table': 'soil',
                    'fields': "distinct name,description,hydrologic_group",
                    'parameters': "f.pid = '" + activeRecord.pid + "'",
                    'order': 't.name'
                },
                success: function (data) {
                    report("env-land-soil", data, ".env-land-soil");
                }
            });
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v1/ws_geo_rasterfeatureoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'format': 'json',
                    'from_geotable': 'tax_parcels',
                    'to_raster': 'land_classification_2008',
                    'to_table': 'soil',
                    'parameters': "pid = '" + activeRecord.pid + "'"
                },
                success: function (data) {
                    report("env-land-landuse", data.rows, ".env-land-landuse");
                }
            });
            break;
        case "qol":
            // quality of life
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'view_neighborhoods',
                    'geometryfield': 'geom',
                    'fields': "id, population, median_age, developed_land, residential_density, singlefamily_property_value,gas_consumption, commute_time, dropout_rate, unexcused_absences, foreclosures,  water_consumption, tree_canopy, bicycle_friendly, near_public_outdoor_recreation, sidewalks, rent"
                },
                success: function (data) {
                    report("qol", data, "");
                }
            });
            break;
        case "env-water":
            // Environment - Water
            $('.report').append('<div class="env-water-floodplain"></div><div class="env-water-wqbuffers"></div><div class="env-water-watershed"></div><div class="env-water-postconstruction"></div>');
            // Floodplain
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_featureoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'from_table': 'tax_parcels',
                    'to_table': 'view_regulated_floodplains',
                    'fields': "t.gid",
                    'parameters': "f.pid = '" + activeRecord.pid + "'"
                },
                success: function (data) {
                    report("env-water-floodplain", data, ".env-water-floodplain");
                }
            });
            // Water Quality Buffers
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_featureoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'from_table': 'tax_parcels',
                    'to_table': 'water_quality_buffers',
                    'fields': "distinct type,label",
                    'parameters': "f.pid = '" + activeRecord.pid + "'"
                },
                success: function (data) {
                    report("env-water-wqbuffers", data, ".env-water-wqbuffers");
                }
            });
            // Critical Projection Area/Watershed
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_pointoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'x': activeRecord.lng,
                    'y': activeRecord.lat,
                    'srid': 4326,
                    'table': 'watersheds',
                    'fields': "name,protected_watershed,subarea,webpage",
                    'limit': 1
                },
                success: function (data) {
                    report("env-water-watershed", data, ".env-water-watershed");
                }
            });
            // Post construction district, transit station area, business district
            $.ajax({
                url: 'http://maps.co.mecklenburg.nc.us/rest/v2/ws_geo_featureoverlay.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    'from_table': 'tax_parcels',
                    'to_table': 'post_construction_layers',
                    'fields': "type, name",
                    'parameters': "f.pid = '" + activeRecord.pid + "'"
                },
                success: function (data) {
                    report("env-water-postconstruction", data, ".env-water-postconstruction");
                }
            });
            break;
        }

    }
}
