var searchForm = document.getElementById("searchForm"); // the form for searches
var userInput = document.getElementById("formInput"); // get the input user typed
var buttonList = document.getElementById("searchHistory"); // get the container for the search history
var infoText = document.getElementById("infoText");
var todayWeather = document.getElementById("todayWeather");
var fiveDayForecast = document.getElementById("fiveDayForecast");

var APIKEY = "b3712b4761003710bde48a0606fe6822"; //API key for Open Weather Map

function displayTodaysWeather(cityWeather){ // display the weather from said city
    infoText.remove(); // remove information text

    // remove any information that may be there (so I don't display multiple entries)
    if(document.getElementById("todaysInfo")){ 
        document.getElementById("todaysInfo").remove();
    }

    // create elements and get information
    var todayInformation = document.createElement("section"); // created section so I can remove later
    todayInformation.id = "todaysInfo";
    var cityNamePlusDate = document.createElement("h2"); // city name and date
    var today = dayjs();
    var weekDay = dayjs(today, "M-D-YYYY").format("dddd"); // get the day of the week
    cityNamePlusDate.textContent = cityWeather.name + " (" + weekDay + " " + today.format("MMMM DD, YYYY" + ")"); // set name
    cityNamePlusDate.style.display = "inline"; // prevent icon from going to next line

    todayInformation.append(cityNamePlusDate);

    // get icon
    var iconNum = cityWeather.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + iconNum + "@2x.png";
    var iconImg = document.createElement("img");
    iconImg.setAttribute("src", iconUrl);
    todayInformation.append(iconImg);

    var temp = document.createElement("h3");
    temp.textContent = "Temp: " + cityWeather.main.temp + " \u00B0F";
    todayInformation.append(temp);

    var wind = document.createElement("h3");
    wind.textContent = "Wind: " + cityWeather.wind.speed + " MPH";
    todayInformation.append(wind);

    var humidity = document.createElement("h3");
    humidity.textContent = "Humidity: " + cityWeather.main.humidity + " %";
    todayInformation.append(humidity);

    todayWeather.append(todayInformation);
}

function displayFiveDayForecast(cityWeatherFiveDay){ // display the five day forcast of selected city

    // remove any information that may be there (so I don't display multiple entries)
    if(document.getElementById("fiveDayInfo")){ 
        document.getElementById("fiveDayInfo").remove();
    }

    var fiveDayInfo = document.createElement("section");
    fiveDayInfo.id = "fiveDayInfo";
    fiveDayInfo.classList.add("row"); // make it a row, so I can add the five days as columns

    
    for(var i = 0; i < cityWeatherFiveDay.list.length; i += 8){

        var dayColumnCard = document.createElement("section"); // make it a column
        dayColumnCard.classList.add("col");
        dayColumnCard.classList.add("border");
        dayColumnCard.classList.add("border-dark");
        dayColumnCard.classList.add("border-2");
        dayColumnCard.style.margin = "5px";
        dayColumnCard.style.textAlign = "center";


        // First get date from data
        var fullDate = cityWeatherFiveDay.list[i].dt_txt;
        var month = fullDate.slice(5, 7);
        var day = fullDate.slice(8,10);
        var year = fullDate.slice(0, 4);
        
        var dateDisplay = document.createElement("h4");
        dateDisplay.textContent = month + "/" + day + "/" + year;

        dayColumnCard.append(dateDisplay);

        // get icon
        var iconNum = cityWeatherFiveDay.list[i].weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + iconNum + "@2x.png";
        var iconImg = document.createElement("img");
        iconImg.setAttribute("src", iconUrl);
        dayColumnCard.append(iconImg);

        // get temp, wind, and humidity
        var temp = document.createElement("p");
        temp.textContent = "Temp: " + cityWeatherFiveDay.list[i].main.temp + " \u00B0F";
        dayColumnCard.append(temp);
    
        var wind = document.createElement("p");
        wind.textContent = "Wind: " + cityWeatherFiveDay.list[i].wind.speed + " MPH";
        dayColumnCard.append(wind);
    
        var humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + cityWeatherFiveDay.list[i].main.humidity + " %";
        dayColumnCard.append(humidity);
    
        // append column card to section
        fiveDayInfo.append(dayColumnCard);
    }

    fiveDayForecast.append(fiveDayInfo);
}

function getWeather(lat, lon){ // Get weather data from API
    // Now that we have Coordinates, find the weather dude!

    var weatherUrlToday = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY + "&units=imperial";

    // get todays weather
    fetch(weatherUrlToday) // send out request and fetch should return an object
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {  
        displayTodaysWeather(data);
    });

    // get the five day forecast
    var weatherUrlFiveDay = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY + "&units=imperial";

    fetch(weatherUrlFiveDay) // send out request and fetch should return an object
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {  
        displayFiveDayForecast(data);
    });
}

function findCity(city){ // get city data from API
    // creat URL using city name and API key
    var geoCodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city +"&appid=" + APIKEY;
    
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