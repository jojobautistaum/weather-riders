var getTransitApi = function() {
    var requestUrl = 'https://svc.metrotransit.org/NexTrip/11167?format=json';
  
    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //console.log(data);
        var routeInfo = function(arrayPosition) {
            console.log("Location: "+data[arrayPosition].Description);
            console.log("Route: "+data[arrayPosition].Route);
            console.log("Direction: "+data[arrayPosition].RouteDirection);
            for(let i = arrayPosition; i < data.length; i+=3) {
                console.log("Time Remaining: "+data[i].DepartureText);
            }
        }
        routeInfo(0);
        routeInfo(1);
        routeInfo(2);
    })
}
getTransitApi();

