var city = "Minneapolis";

var getTransitName = function(locationNumber, stopNumber) {
    var requestUrl = ('https://svc.metrotransit.org/NexTrip/StopID/' + stopNumber + '?format=json');
  
    fetch(requestUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.querySelector("#l"+locationNumber).textContent =(data.StopLabel);
    })
}

// location number references the location's button number in the HTML. Direction number references the second HTML page. 0 for the left list of times and 1 for right list of times. Stop number is the stop ID in the API
var getTransitApi = function(locationNumber, directionNumber, stopNumber) {
    var requestUrl = ('https://svc.metrotransit.org/NexTrip/' + stopNumber + '?format=json');
  
    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var routeInfo = function() {
            for(let i = 0; i < Math.min(3,data.length); i++) {
                var ApFunction = function() {
                    if ((i == 0 && data[i].DepartureText.includes("Min") ) || (i == 1 && data[i].DepartureText.includes("Min") && data[i-1].DepartureText.includes("Min"))) { 
                        document.querySelector("#time-of-arrival-"+(i+(directionNumber*3)+((locationNumber-1)*6))).textContent =(data[i].DepartureText);
                    }
                    else  {
                        var epocheArrival = data[i].DepartureTime.slice(6,data[i].DepartureTime.length-7);
                        var CSTArrival = new Date(epocheArrival *1).toLocaleString('en-US', {hour: "2-digit", minute: "2-digit"});
                        document.querySelector("#time-of-arrival-"+(i+(directionNumber*3)+((locationNumber-1)*6))).textContent =(CSTArrival);
                    }
                    
                }
                ApFunction();
            }
        }
        routeInfo();
    })
}

var consolidateTransit = function(locationNumber, stopNumber1, stopNumber2) {
    getTransitName(locationNumber,stopNumber1);
    getTransitApi(locationNumber,0,stopNumber1);
    getTransitApi(locationNumber,1,stopNumber2);
}


// Find the city
function findCity(city) {
    var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=48b311c4f19922ba7960ce06e7fd7ee4`;
    
    fetch(locationUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if(data.length){
                    // Pull weather info using the latitude and longitude here
                    checkWeather(data[0].lat, data[0].lon);
                } else {
                    alert("The city location is unknown: " + city);
                }
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to Open Weather. - " + error);
    });
}

// Pull the weather info
function checkWeather (latitude, longitude) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&limit=5&appid=48b311c4f19922ba7960ce06e7fd7ee4`;
                                                                                                                                                                                
    fetch(weatherUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var now = new Date(data.current.dt * 1000).toLocaleString("en-US",{month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"});
                const icon = data.current.weather[0].icon;
                const wicon = `https://openweathermap.org/img/w/${icon}.png`;

                // Populate our weather information
                document.querySelector("#weather-image").src = wicon;
                document.querySelector("#weather-image").setAttribute("width", "50%");
                document.querySelector(".weather-temperature").textContent = data.current.temp + " \xB0F";
                document.querySelector(".weather-windchill").textContent = "Wind Chill: " + data.current.feels_like + " \xB0F";
                document.querySelector(".weather-precipitation").textContent = "Chance of Precipitation: " + data.hourly[0].pop + " %";
                document.querySelector(".weather-time").textContent = now;
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to connect to Open Weather. - " + error);
    });
}

    // click event for hiding and un-hiding location info
var locationButton = $(".location-button");
var backButton = $(".back-button");

var getButtonPosition = function(buttonData) {
    // returns ID tag for info related to button
    return $("#info-" + buttonData);
}

// hiding other buttons and displaying thisButtonInfo
locationButton.on("click", function(){
    $(".location-button").hide();
    $(this).show();
    // Removing Bulma classes to display full screen upon click
    $(".remClassTop").removeClass("level container column is-four-fifths").addClass("column is-full is-offset-one-half level");
    $(".remClassBottom").removeClass("columns is-full is-offset-two-fifth").addClass("column is-full is-offset-one-half level");

    var buttonData = $(this).attr('id');
    var thisButtonInfo = getButtonPosition(buttonData);
    $(thisButtonInfo).show();
});
// returning you to the 4 button home page
backButton.on("click", function() {
    $(".location-button").show();
    $(".location-info").hide();
        // Removing Bulma classes to original orientation upon click
    $(".remClassTop").removeClass("column is-full is-offset-one-half level").addClass("level container column is-four-fifths");
    $(".remClassBottom").removeClass("column is-full is-offset-one-half level").addClass("columns is-full is-offset-two-fifth");
})

findCity("Minneapolis");
consolidateTransit(1,56043,56001);
consolidateTransit(2,56042,56002);
consolidateTransit(3,56041,56003);
consolidateTransit(4,56040,56004);