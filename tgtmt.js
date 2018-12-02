$(document).ready(function() { 
////////////////////////////////////
//              PROVIDERS         //
////////////////////////////////////
//generates information from api providers
var pBox = document.getElementById('providerBox');
pBox.length = 0;
//creates a default option for the drop down. 
var defaultOption = document.createElement('option');
defaultOption.text = 'Select a Provider';
//Then adds the default option
pBox.add(defaultOption);
pBox.selectedIndex = 0;
//creates constant for the providers url
const pUrl = 'http://svc.metrotransit.org/nextrip/Providers?format=json';
//using a fetch request to pull data from the api
fetch(pUrl)  
  .then(  
    function(response) {  //error handling if code returned is not 200
      if (response.status !== 200) {  
        alert('Looks like there was a problem. Status Code: ' + 
          response.status);  
        return;  
      }
      response.json().then(function(data) {  
        var option;
    
    	for (var i = 0; i < data.length; i++) {
          option = document.createElement('option');
      	  option.text = data[i].Text; //Api values from providers page
      	  option.value = data[i].Value; // Api values from providers page
      	  pBox.add(option);
    	}    
      });  
    }  
  )  
  .catch(function(err) {  
    alert('Fetch Error -', err);  
  });
////////////////////////////////////
//              ROUTES            //
////////////////////////////////////
  //generates information from api Routes
  var rBox = document.getElementById('routeBox');
  rBox.length = 0;
  //creates default option
  var defaultOption = document.createElement('option');
  defaultOption.text = 'Select a Route';
  //adds default option to route dropdown
  rBox.add(defaultOption);
  rBox.selectedIndex = 0;
  
  const rUrl = 'http://svc.metrotransit.org/nextrip/Routes?format=json';
  //add information into option box
  fetch(rUrl)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          alert('Looks like there was a problem. Status Code: ' + 
            response.status);  
          return;  
        }
        response.json().then(function(data) {  
          var option;
      
          for (var i = 0; i < data.length; i++) {
            option = document.createElement('option');
              option.text = data[i].Description;
              option.value = data[i].ProviderID;
              rBox.add(option);
          }    
        });  
      }  
    )  
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });  
});

//makes the route box dependent on the selected provider
$('#routeBox').val([]);
$('#routeBox option').hide();

$('#providerBox').on("change", function() {
    $('#routeBox option')
        .hide() //hides all options
        .filter('[value="' + $(this).val() + '"]') //finds available options
        .show(); //displays available options

    $('#routeBox').val([]);
})
////////////////////////////////////
//              DIRECTIONS        //
////////////////////////////////////
    //create a function to generate directions data (requires route perameter)
function generateDirectionBox(route_num) {
    var dBox = document.getElementById('directionBox');
    dBox.length = 0;
        
    var defaultOption = document.createElement('option');
    defaultOption.text = 'Select a Direction';
        
    dBox.add(defaultOption);
    dBox.selectedIndex = 0;
    //creates a variable for the route number     
    var route = route_num;
    const dUrl = `http://svc.metrotransit.org/NexTrip/Directions/${route}?format=json`;
    //add information into option box
    fetch(dUrl)  
        .then(  
        function(response) {  
            if (response.status !== 200) {  
                alert('Looks like there was a problem. Status Code: ' + 
                  response.status);  
                return;  
              }
        
              // Examine the text in the response  
              response.json().then(function(data) {  
                var option;
            
                for (var i = 0; i < data.length; i++) {
                  option = document.createElement('option');
                    option.text = data[i].Text;
                    option.value = data[i].Value;
                    dBox.add(option);
                }    
              });  
            }  
          )  
          .catch(function(err) {  
            console.error('Fetch Error -', err);  
          });  
        }//end of function 

////////////////////////////////////
//              STOPS             //
////////////////////////////////////        
function generateStopBox() {
    var sBox = document.getElementById('stopBox');
    sBox.length = 0;
            
    var defaultOption = document.createElement('option');
    defaultOption.text = 'Select a Stop';
            
    sBox.add(defaultOption);
    sBox.selectedIndex = 0;
    //creates a new variable for the route box selection
    var allRoutes = document.getElementById('routeBox');
    var route_num = allRoutes.options[allRoutes.selectedIndex].value;
    //creates a new variable for the direction box selection
    var allDirections = document.getElementById('directionBox');
    var direction_num = allDirections.options[allDirections.selectedIndex].value;
    const sUrl = `http://svc.metrotransit.org/NexTrip/Stops/${route_num}/${direction_num}?format=json`;
    //add information into option box
        fetch(sUrl)  
            .then(  
            function(response) {  
                if (response.status !== 200) {  
                    alert('Looks like there was a problem. Status Code: ' + 
                      response.status);  
                    return;  
                }
                response.json().then(function(data) {  
                var option;
                
                for (var i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.text = data[i].Text;
                    option.value = data[i].Value;
                    sBox.add(option);
                }    
                });//end of inner then 
                } //end of response 
            )//end of outer then  
        .catch(function(err) {  
            alert.error('Fetch Error -', err);  
        });  
    }//end of function  

//gets data from provider box
function getProviderBox() {
    var providers = document.getElementById("providerBox");
    providers.options[providers.selectedIndex].value;
}
//gets data from route box
function getRouteBox() {
    var routes = document.getElementById("routeBox");
    routes.options[routes.selectedIndex].value;
}
//gets data from direction box
function getDirectionBox() {
    var directions = document.getElementById("directionBox");
    directions.options[directions.selectedIndex].value;
} 
//gets data from stop box
function getStopBox() {
    var stops = document.getElementById("stopBox");
    stops.options[stops.selectedIndex].value;
}
//puts a jquery onClick function around the search button        
$(document).on('click', '#displaySearchButton', function () {
    //grabs final value from route box
    var allRoutes = document.getElementById('routeBox');
    var route_num = allRoutes.options[allRoutes.selectedIndex].value;
    //grabs final value from direction box
    var allDirections = document.getElementById('directionBox');
    var direction_num = allDirections.options[allDirections.selectedIndex].value;
    //grabs final value from stop box
    var allStops = document.getElementById('stopBox');
    var stop_num = allStops.options[allStops.selectedIndex].value;
    //compiles values into final url
    const finalUrl = `http://svc.metrotransit.org/NexTrip/${route_num}/${direction_num}/${stop_num}?format=json`;

    fetch(finalUrl)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          alert('Looks like there was a problem. Status Code: ' + 
            response.status);  
          return;  
        }
        response.json().then(function(data) {  
          
          var p;
                    for (var i = 0; i < data.length; i++) {
                        p = $('<p/>');
                        p.append("<p>" + data[i].DepartureText + "</p>");
                        $('#results').append(p);
                    }//end of loop

        });  
      }  
    )//end of then  
    .catch(function(err) {  
      alert('Fetch Error -', err);  
    });//end of catch  

});//end of function