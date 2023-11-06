var searchForm = document.getElementById("searchForm"); // the form for searches
var userInput = document.getElementById("formInput"); // get the input user typed
var buttonList = document.getElementById("searchHistory"); // get the container for the search history

var APIKEY = "b3712b4761003710bde48a0606fe6822"; //API key for Open Weather Map

function getWeather(lat, lon){

    // Now that we have Coordinates, find the weather dude!
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;

    fetch(weatherUrl) // send out request and fetch should return an object
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {  
        console.log(data);
    });
    
    
}

function findCity(city){
    // creat URL using city name and API key
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city +" &limit=1&appid=" + APIKEY;
    
    //First get coordinates
    fetch(geoCodeUrl) // send out request and fetch should return an object
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {  
            // once we have coordinates we can find the weather
            if(data == ""){ // means nothing was found in API database
                // create error message
                if(!document.getElementById("warningCheck")){ // if the warning check already exists
                    // if it's already there I don't want to create more
                    var warning = document.createElement("p");
                    warning.id = "warningCheck";
                    warning.textContent = "City not found. Please try again."
                    warning.classList.add("alert");
                    warning.classList.add("alert-danger");
                    warning.style.marginTop = "10px";
                    searchForm.appendChild(warning);
                }
            }
            else { // if something is found we are good
                if(document.getElementById("warningCheck")){ // if warning is already there get rid of it
                    var warning = document.getElementById("warningCheck");
                    warning.remove();
                }
                addSearchHistory(city); // add city for search history
                getWeather(data[0].lat, data[0].lon); // get the weather
            }
        });
}

function handleForm(event){ // handles form submissions

    event.preventDefault(); // prevent page reload

    if(userInput.value != ""){ // make sure text is there
        // send that input to API function
        findCity(userInput.value);
        userInput.value = ""; // set value to empty
    }
}

function addSearchHistory(city){ // saves search to local storage and adds a button to list

    // add search history to local storage
    var cities = [];

    var storedCities = JSON.parse(localStorage.getItem("cities")); // get old cities

    if (storedCities !== null) { // if there is something in local storage
        cities = storedCities; // set my variable to that
    }

    // check to see if city is in storage already (I don't want to add more cities if not necessary)
    // also if user clicks button of what they just searched, when I call function again it will add to local storage once more (which I don't want)
    if(!cities.includes(city)){ // means city is not in array so add to it
        cities.push(city); // add to array

        localStorage.setItem("cities", JSON.stringify(cities)); // add back to local storage
    
        // create new button for said city and create click event
        var button = document.createElement("button");
        button.textContent = city;
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.id = "historyButton";
        buttonList.appendChild(button);
        button.addEventListener("click", handleButton);
    } 
}

function showSearchHistory(){ //displays and creates buttons using what's in local storage
    var storedCities = JSON.parse(localStorage.getItem("cities")); // get old cities from local storage

    if (storedCities !== null) { // if there is something in local storage
        for (var i = 0; i < storedCities.length; i++){ // loop and create each button 
            var button = document.createElement("button");
            button.textContent = storedCities[i]; // text content is what city name is in local storage
            button.classList.add("btn");
            button.classList.add("btn-info");
            button.id = "historyButton" + i;
            buttonList.appendChild(button); // add to container
            button.addEventListener("click", handleButton); // add event listener
        }
    }
}

function handleButton(){ // basically on click send button text content (the city) to the function for display
    findCity(this.textContent); 
}

searchForm.addEventListener("submit", handleForm); // handle form submit event
showSearchHistory(); // on load create buttons from using local storage 