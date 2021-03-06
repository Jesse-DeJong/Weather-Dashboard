// DOM selection for content injection
var historyINJ = document.getElementById('history');
var searchCall = document.getElementById('searchBtn');
var userQuery = document.getElementById('userLocQuery');
var todayINJ = document.getElementById('today');
var forecastINJ = document.getElementById('forecast');

// One Call API - Open Weather
var apiKey = "83eafbf0136fddba078f207e73c99163";
var weatherUrl1 = "https://api.openweathermap.org/data/2.5/onecall?lat=";
var weatherUrl2 = "&lon=";
var weatherUrl3 = "&units=metric&appid=" + apiKey;
var weatherIconUrl1 = "http://openweathermap.org/img/wn/";
var weatherIconUrl2 = "@2x.png";

// Nominatim Reverse Geosearch
var nominatimUrl = "https://nominatim.openstreetmap.org/search?format=json&city=";

// History Functionality - would be cleaner/more compact as an object
    if (localStorage.getItem("historyCity") == null) {                  // Check for locally stored history data
        var historyCity = [];                                           // IF none is found create the variable as an empty array
    } else { var historyCity = localStorage.getItem("historyCity")      // IF history is found then fetch the data and store it in the array
    .split(",") ; }                                                     // Split the returned string by the "," into an array

    if (localStorage.getItem("historyLAT") == null) {
        var historyLAT = [];
    } else { var historyLAT = localStorage.getItem("historyLAT")
    .split(",") ; }

    if (localStorage.getItem("historyLON") == null) {
        var historyLON = [];
    } else { var historyLON = localStorage.getItem("historyLON")
    .split(",") ; }

function weatherDisplay (data) {
    todayINJ.innerHTML = "";    // Clear any data already displayed
    
    // Create DOM for Weather Image
    var url = weatherIconUrl1 + data.current.weather[0].icon + weatherIconUrl2; // Construct the URL for the source image
    var iconNode = document.createElement("img");                               // Create a new <IMG> element to host the weather image
    iconNode.setAttribute('src', url);                                          // Populate the img source with the url
    
    // Create DOM for Searched Name
    var node = document.createElement("h2");
    var textnode = document.createTextNode(data.timezone + " (" + window.value + ") ");
    node.setAttribute('class', 'countryCity'); // Add a class for CSS targeting
    node.appendChild(textnode);     // Append the City/Date text
    node.appendChild(iconNode);     // Append the Image
    todayINJ.appendChild(node);     // Append the <h2> to the DOM

    // Create <ul> on the DOM
    var node = document.createElement("ul");

    // Create <li> for TEMP
    var subnode = document.createElement("li");
    var textnode = document.createTextNode("Temp: " + data.current.temp + '??C');
    subnode.appendChild(textnode);
    node.appendChild(subnode);

    // Create <li> for WIND
    var subnode = document.createElement("li");
    var textnode = document.createTextNode("Wind: " + data.current.wind_speed + ' Km/h');
    subnode.appendChild(textnode);
    node.appendChild(subnode);

    // Create <li> for Humidity
    var subnode = document.createElement("li");
    var textnode = document.createTextNode("Humidity: " + data.current.humidity + ' %');
    subnode.appendChild(textnode);
    node.appendChild(subnode);

    // Create <li> for UV Index
    var subnode = document.createElement("li");
    var textnode = document.createTextNode(data.current.uvi);

    // Append a class for CSS targeting based on UV level
    if (data.current.uvi < 3) {
        subnode.setAttribute('class', 'uv uvLOW');
    } else if (data.current.uvi < 6) {
        subnode.setAttribute('class', 'uv uvMOD');
    } else if (data.current.uvi < 8) {
        subnode.setAttribute('class', 'uv uvHIGH');
    } else if (data.current.uvi < 11) {
        subnode.setAttribute('class', 'uv uvVERYHIGH');
    } else {
        subnode.setAttribute('class', 'uvEXTREME');
    }

    subnode.appendChild(textnode);
    node.appendChild(subnode);

    // Append <ul> to the DOM
    todayINJ.appendChild(node);
}

function weatherDisplayForecast (data) {
    document.getElementById('forecast').innerHTML = "";   // Clear any data already displayed

    // Create DOM for Searched Name
    var node = document.createElement("h2");
    var textnode = document.createTextNode("5-Day Forecast:");
    node.appendChild(textnode);
    document.getElementById('forecast').appendChild(node);

    // Create an additional <DIV> for Proper Flex display
    var node = document.createElement("div");
    node.setAttribute('class', 'forecastDIV');
    document.getElementById('forecast').appendChild(node);

    // Repeat 5x for the 5-day Forecast
    for ( i = 1; i < 6; i++ ) { // As i is used in the moment calc it needs to recur 5 times (days) and start from 1 (one day)
   
    // Create <ul> on the DOM
    var node = document.createElement("ul");
    node.setAttribute('class', 'forecastUL');

    // Add the Date
    var date = moment().add(i, 'days').format("D/M/YYYY");
    var subnode = document.createElement("li");
    var textnode = document.createTextNode(date);
    subnode.appendChild(textnode);
    node.appendChild(subnode);

    // Extract Weather Icon
    // Create DOM for Weather Image
    var url = weatherIconUrl1 + data.daily[i].weather[0].icon + weatherIconUrl2;    // Construct the URL for the source image
    var iconNode = document.createElement("img");                                   // Create a new <IMG> element to host the weather image
    iconNode.setAttribute('src', url);                                              // Populate the img source with the url
    node.appendChild(iconNode);                                                     // Append image to the UL

    // Extract MIN Temp
    // Create an <li> for the data 
    var subnode = document.createElement("li");
    // Create the text for the <li>
    var textnode = document.createTextNode("Min Temp: " + data.daily[i].temp.min + '??C');
    // Attach the text to the <li>
    subnode.appendChild(textnode);
    // Attach the <li> to the <ul>
    node.appendChild(subnode);

    // Extract MAX Temp
    var subnode = document.createElement("li");
    var textnode = document.createTextNode("Max Temp: " + data.daily[i].temp.max + '??C');
    subnode.appendChild(textnode);
    node.appendChild(subnode);
    
    // Extract Wind Speed
    var subnode = document.createElement("li");
    var textnode = document.createTextNode("Wind: " + data.daily[i].wind_speed + ' Km/h');
    subnode.appendChild(textnode);
    node.appendChild(subnode);

    // Extract Humidity
    var subnode = document.createElement("li");
    var textnode = document.createTextNode("Humidity: " + data.daily[i].humidity + '%');
    subnode.appendChild(textnode);
    node.appendChild(subnode);
    
    // Append <ul> to the DOM
    document.getElementById('forecast').childNodes[1].appendChild(node);
  }
}

function weatherLookup (lat, lon) {
    fetch(weatherUrl1 + lat + weatherUrl2 + lon + weatherUrl3) // Combine API call with lat and lon data from previous geosearch
    .then(function (response) { return response.json() } )
    .then(function (data) {
        console.log(data);
        weatherDisplay(data);                                  // Parse the returned API data into the display function
        weatherDisplayForecast(data);                          // Parse the returned API data into the 5 day forecast function
    })
}

function historyDisplay () {
    historyINJ.innerHTML = "";                                      // Reset the <ul> to clear the currently displayed list so that overlaps do not occur

    for ( i = 0; i < historyCity.length; i++ ) {                    // For all entries retrieved from localStorage for cities
        var node = document.createElement("li");                    // Create an <li>
        var textnode = document.createTextNode(historyCity[i]);     // Create a textnode of each <i>ndex of the cities list 
        node.appendChild(textnode);                                 // Attach the text to the <li>
        node.setAttribute('class', 'historyList');                  // Add a class to the <li> elements for CSS targeting
        node.setAttribute('data-index', historyCity[i]);            // Add a <data-index> value of the current city
        historyINJ.appendChild(node);                               // Attach the <li> to the DOM
        var br = document.createElement("br");                      // Create a line break between entries
        historyINJ.appendChild(br);                                 // Attach the line break to each <li>
    }
}

function historyUpdate (lat, lon) {

    if (!historyCity.includes(userQuery.value) && historyCity.length < 10) {       // IF the user search city is not already in the history array AND there are less than 10 stored cities >then> add it

    historyCity.push(userQuery.value);                  // Add the user searched location to the current array index
    historyLAT.push(lat);                               // Add the resolved Latitude to the array for the current index
    historyLON.push(lon);                               // Add the resolved Longitude to the array for the current index

    localStorage.setItem("historyCity", historyCity);   // Update Cities array in local storage
    localStorage.setItem("historyLAT", historyLAT);     // Update Latitude array in local storage
    localStorage.setItem("historyLON", historyLON);     // Update Longitude array in local storage
  }
  historyDisplay();
}

// Resolve Lat&Lon for User input Location
function locationLookup (url, city) {
    console.log(city);
    console.log(url+city);
    fetch(url + city)
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

    locationLookup(nominatimUrl, userQuery.value);
})

// History Search Call
historyINJ.addEventListener("click", function(event) {
    event.preventDefault();

    var call = event.target.dataset.index;
    console.log(call);
    locationLookup(nominatimUrl, call);
})

// Date Set - Moment.js
function getDate() {
    var currentDate = moment().format("D/M/YYYY");
    window.value = currentDate;
} 

// Initialisation calls
function init () {
    historyDisplay();
    getDate();
}

init();