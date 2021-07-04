// DOM selection for content injection
var history = document.getElementById('history');
var searchCall = document.getElementById('searchBtn');
var userQuery = document.getElementById('userLocQuery');

// One Call API - Open Weather
var apiKey = "83eafbf0136fddba078f207e73c99163";
var weatherUrl1 = "https://api.openweathermap.org/data/2.5/onecall?lat=";
var weatherUrl2 = "&lon=";
var weatherUrl3 = "&appid=" + apiKey;

// Nominatim Reverse Geosearch
var nominatimUrl = "https://nominatim.openstreetmap.org/search?format=json&city=";

// History Functionality - would be cleaner/more compact as an object
    if (localStorage.getItem("historyCity") == null) {                  // Check for locally stored history data
        var historyCity = [];                                           // IF none is found create the variable as an empty array
    } else { var historyCity = localStorage.getItem("historyCity"); }   // IF history is found then fetch the data and store it in the array

    if (localStorage.getItem("historyLAT") == null) {
        var historyLAT = [];
    } else { var historyLAT = localStorage.getItem("historyLAT"); }

    if (localStorage.getItem("historyLON") == null) {
        var historyLON = [];
    } else { var historyLON = localStorage.getItem("historyLON"); }

function weatherLookup (lat, lon) {
    fetch(weatherUrl1 + lat + weatherUrl2 + lon + weatherUrl3) // Combine API call with lat and lon data from previous geosearch
    .then(function (response) { return response.json() } )
    .then(function (data) {
        console.log(data);
    })
}

function historyUpdate (lat, lon) {

    historyCity.push(userQuery.value);                  // Add the user searched location to the current array index
    historyLAT.push(lat);                               // Add the resolved Latitude to the array for the current index
    historyLON.push(lon);                               // Add the resolved Longitude to the array for the current index

    localStorage.setItem("historyCity", historyCity);   // Update Cities array in local storage
    localStorage.setItem("historyLAT", historyLAT);     // Update Latitude array in local storage
    localStorage.setItem("historyLON", historyLON);     // Update Longitude array in local storage
}

// Resolve Lat&Lon for User input Location
function locationLookup () {
    fetch(nominatimUrl + userQuery.value)
    .then(function (response) { return response.json() } )
    .then(function (data) {
        var lat = data[0].lat;                              // Extract Latitudinal data for user_search
        var lon = data[0].lon;                              // Extract Longitudinal data for user_search

        historyUpdate(lat, lon);                            // Parse lat & lon into the localStorage update call
        weatherLookup(lat, lon);                            // Parse lat & lon into weather API
    })
}

// New Search Call
searchCall.addEventListener("click", function(event) {
    event.preventDefault();

    locationLookup();
})