// DOM selection for content injection
var history = document.getElementById('history');
var searchCall = document.getElementById('searchBtn');
var userQuery = document.getElementById('userLocQuery');

// One Call API - Open Weather
apiKey = "83eafbf0136fddba078f207e73c99163";
weatherUrl1 = "https://api.openweathermap.org/data/2.5/onecall?lat=";
weatherUrl2 = "&lon=";
weatherUrl3 = "&appid=" + apiKey;

// Nominatim Reverse Geosearch
nominatimUrl = "https://nominatim.openstreetmap.org/search?format=json&city="

// History Functionality

function weatherLookup (lat, lon) {
    fetch(weatherUrl1 + lat + weatherUrl2 + lon + weatherUrl3) // Combine API call with lat and lon data from previous geosearch
    .then(function (response) { return response.json() } )
    .then(function (data) {
        console.log(data);
    })
}

// Resolve Lat&Lon for User input Location
function locationLookup () {
    fetch(nominatimUrl + userQuery.value)
    .then(function (response) { return response.json() } )
    .then(function (data) {
        var lat = data[0].lat;                              // Extract Latitudinal data for user_search
        var lon = data[0].lon;                              // Extract Longitudinal data for user_search

        weatherLookup(lat, lon);                            // Parse lat & lon into weather API
    })
}

// New Search Call
searchCall.addEventListener("click", function(event) {
    event.preventDefault();

    locationLookup();
})