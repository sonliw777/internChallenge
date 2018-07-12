/*
  Team VI Intern Summer Challenge
  map.js
  Summer 2017
  LeafLet (Map) Logic 
  */

var overlays = {};
var markers = []
var markerToName = {};

var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
   mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var light = L.tileLayer(mbUrl, { id: 'mapbox.light', attribution: mbAttr }),
    streets = L.tileLayer(mbUrl, { id: 'mapbox.streets', attribution: mbAttr }),
    dark = L.tileLayer(mbUrl, { id: 'mapbox.dark', attribution: mbAttr }),
    satellite = L.tileLayer(mbUrl, { id: 'mapbox.satellite', attribution: mbAttr });

var maxBounds = L.latLngBounds(
    L.latLng(51.705247, -63.186332),
    L.latLng(20.270443, -131.389446)
    )

var mymap = L.map('mapid', {
    center: [39.8283, -97.287889],
    layers: [streets],
    zoom: 4,
    maxZoom: 9,
    minZoom: 4,
    'maxBounds': maxBounds,
    maxBoundsViscosity: 1.0

}).fitBounds(maxBounds);

var baseLayers = {
    "Street": streets,
    "Satellite": satellite
};

var stateLayer;
var info;
var stateColor;
var geojson;

/* map characteristics */

function initMap() {
    putMarkers();
    layerControl = L.control.layers(baseLayers, {}, { position: 'bottomright' });
    layerControl.addTo(mymap);
    stateLayer = L.geoJson(statesData).addTo(mymap);
    info = L.control();
    info.onAdd = function (mymap) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    }

    info.update = function (props) {

        this._div.innerHTML = '<h4><b>TS PDP Locations</b></h4>';

        if (props) {
            var num_loc = stateCount[abbrState(props.name, 'abbr')];
            var loc_str = num_loc + " Location" + (num_loc > 1 ? "s" : " ");
            
            this._div.innerHTML += '<div id="infomegs"><b>' + props.name + 
                '</b><br /><br />' + '<i>' + loc_str + '</i></div>';  
        } else {
            this._div.innerHTML += '<div id="infomegs"><i>Hover Over a State</i></div>';
        }
    }

    info.addTo(mymap);
    stateColor = L.geoJson(statesData, { style: style }).addTo(mymap);

    geojson = L.geoJson(statesData, {
        style: style, onEachFeature: onEachFeature
    }).addTo(mymap);
	
    mymap.on('zoomend', onZoomend);
    }


function putMarkers() {
    /* create layer groups, overlay and popup for the cities*/
    for (var i = 0; i < listOfLocations.length; i++) {
        var state = listOfLocations[i].state;
        if (!(state in overlays)) {
            stateCount[state] = 1;
            overlays[state] = L.layerGroup();
        } else {
            stateCount[state]++;
        }

        var loc = listOfLocations[i].locationName + ", " + listOfLocations[i].state;
        var pop = listOfLocations[i].population;
        var col = listOfLocations[i].costOfLiving;
        var avgcom = listOfLocations[i].averageCommute;
        var marker;
        var ngIcon = L.icon({
            iconUrl: 'https://oursites.myngc.com/ENT/PDPOnline/TechnicalServices/Interns/Team%20VI%20Files/css/images/ng_icon.png',
            ShadowUrl: 'https://oursites.myngc.com/ENT/PDPOnline/TechnicalServices/Interns/Team%20VI%Files/css/images/marker-shadow.png',
            iconSize: [19, 30]   
        })



        var message =
          '<div class="ms-font-xl">' + loc + '</div><hr>' +
          '<table class="ms-Table"><tbody> <tr><td>Population:</td><td>' + pop +
          '</td></tr> <tr><td>Cost of Living:</td><td>' + col +
          '</td></tr> <tr><td>Average Commute:</td><td>' + avgcom +
          '</td></tr> <tbody></table><hr><div class="ms-u-textAlignCenter"><button type="button" class="ms-Button ms-Button--primary" onclick="launchDialog('
          + listOfLocations[i].id + ')"><span class="ms-Button-label">More Info</span></button></div>';

        marker = L.marker([listOfLocations[i].latitude, listOfLocations[i].longitude], { icon: ngIcon }).
          bindPopup(message).addTo(overlays[state]);
        marker.title = loc;

        markerToName[marker] = loc;
        markers.push(marker);

        marker.on('mouseover', function (e) {
            document.getElementById("infomegs").innerHTML = this.title;
        });
    }
}

var ngLogo = L.control({ position: 'bottomleft' });

ngLogo.onAdd = function (mymap) {
    var div = L.DomUtil.create('a', 'ngLogo');

    div.innerHTML += '<a href = "https://ts.myngc.com" target = "_blank"><img src = "https://oursites.myngc.com/ENT/PDPOnline/TechnicalServices/Interns/Team%20VI%20Files/css/images/ng_logo.png" width = "212" height = "34"></a>';
    return div;

};

ngLogo.addTo(mymap);
//showMarkers();

function getColor(d) { return d > 0 ? '#0B2161' : '#A9BCF5'; }

function style(feature) {

    var color = getColor(stateCount[abbrState(feature.properties.name, 'abbr')]);

    return {
        color: "#edebea",
        fillColor: color,
        weight: 1,
        fillOpacity: color == '#0B2161' ? 0.3 : 0
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        fillColor: "#97c6fc",
        fillOpacity: 0.3
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds(), {});
}

function onEachFeature(feature, layer) {
    if ((stateCount[abbrState(feature.properties.name, 'abbr')] > 0)) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            }); 
    }
}

function showMarkers() {
    for (i in markers) {
        mymap.addLayer(markers[i]);
    }
}

function hideMarkers() {
    for (i in markers) {
        mymap.removeLayer(markers[i]);
    }
}

function onZoomend() {
    var zoom = mymap.getZoom();
	
    if (zoom < 5) {
        hideMarkers();
    } else {
        showMarkers();
    }
}

function resetMap() {
    mymap.setZoom(4);
    comparisons = [];

    if(mymap.hasLayer(satellite)) {
        mymap.removeLayer(satellite);
        mymap.addLayer(streets);
    }
}

