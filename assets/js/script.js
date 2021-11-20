var city = "Bloomington MN";


var getTransitName = function(locationNumber, stopNumber) {
    var requestUrl = ('https://svc.metrotransit.org/NexTrip/StopID/' + stopNumber + '?format=json');
  
    fetch(requestUrl).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.querySelector("#l"+locationNumber).textContent =(data.StopLabel);
    })
}
var getTransitApi = function(locationNumber, stopNumber) {
    var requestUrl = ('https://svc.metrotransit.org/NexTrip/' + stopNumber + '?format=json');
  
    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //console.log(data);
        var routeInfo = function() {
            document.querySelector(".route").textContent =(data[0].Route);
            for(let i = 0; i < math.Min(3, data.length); i++) {
                document.querySelector(".time-of-arrival-"+i).textContent =(data[i].DepartureText);
            }
        }
        routeInfo();
    })
}




// Find the city
function findCity(city) {
    var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=b7609117c1b58fc397022fe7414e5f44`;
    
    fetch(locationUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if(data.length){
                    console.log("Latitude: " + data[0].lat);
                    console.log("Longitude: " + data[0].lon);
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
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&limit=5&appid=b7609117c1b58fc397022fe7414e5f44`;
    
    fetch(weatherUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var now = new Date(data.current.dt * 1000).toLocaleString("en-US",{month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"});
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
    console.log("clicked");
    $(".location-button").hide();
    $(this).show();

    var buttonData = $(this).attr('id');
    var thisButtonInfo = getButtonPosition(buttonData);
    $(thisButtonInfo).show();
});
// returning you to the 4 button home page
backButton.on("click", function() {
    $(".location-button").show();
    $(".location-info").hide();

})


getTransitName(1,56001);
getTransitApi(1,1,56001);
getTransitApi(1,256043);

getTransitName(2,56002);
getTransitApi(2,1,56002);
getTransitApi(2,2,56042);

getTransitName(3,56003);
getTransitApi(3,1,56003);
getTransitApi(3,2,56041);

getTransitName(4,56004);
getTransitApi(4,1,56004);
getTransitApi(4,2,56040);

findCity("Minneapolis");
