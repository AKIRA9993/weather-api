//storage variable
//variable and not an array cause the api return is an object variable that contains ALL the api weather data
var allWeather={};


//calling the input weather location name
var weatherLocation = document.getElementById('location');
var searchBtn = document.querySelector('.search-btn');
var weatherCards = document.querySelectorAll('.weather-card');

//load default city on page load
getWeather('cairo');


// function to send the api request & receive the response & call the display function &format and save data

function getWeather(city) {

//assigning the XMLhttpRequest to a variable so we can keep reusing it in the code
//the myHttp variable now has all XMLHttpRequest methods&properties
//1-store in var
var myHttp = new XMLHttpRequest();

//open method opens communication between this code and the backend api
//we put the city parameter in a template literal inside the url

//2-detail what u want the request to get
myHttp.open('GET' , `https://api.weatherapi.com/v1/forecast.json?key=c9e8e5bdb80a497f901112038252810&q=${city}&days=3&aqi=no`);

//send method to send the request to the backend

//3-send the request with the details
myHttp.send();
//get response when readystate has finished it
    myHttp.addEventListener('load', function(e){
            //converting the received data from string'{location:{...},current:{.....},etc} to an object
            allWeather =JSON.parse(myHttp.response);
            console.log(allWeather);

            //save to local storage
            localStorage.setItem('lastWeather', JSON.stringify(allWeather));

            //calling display function
            displayWeather();

            //calling clear inputs function
            clearInput();
            
    })

    //error event listener to fire if theres an issue in the response

    myHttp.addEventListener('error', function(e){
        console.log('readystate error');
        alert('Network error occurred!');
    });
}
//display function
function displayWeather(){
    //.current has the temp in the api response
    //.location has the name and country data
    //forecast.forecastday has the date and day temp details
    //[0] to get the first day only data
    
    //shortcut vars
    var today=allWeather.current;
    var location = allWeather.location;
    var todayForecast = allWeather.forecast.forecastday[0];



    //Update first card with todays weather
    var todayCard = weatherCards[0];


    //gets todays date from the api data
    var apiDate = new Date(location.localtime);
    

    //update day name from API from grabbing the day-name class and updating it
    //.tolocaldate is a method that converts a date object into a readable data string
    todayCard.querySelector('.day-name').textContent = apiDate.toLocaleDateString('en-US', {weekday: 'long'});


    //update date from api
    todayCard.querySelector('.date').textContent =apiDate.toLocaleDateString('en-US', {day:'numeric', month:'long'});


    //update city name
    todayCard.querySelector('.city-name').textContent=location.name;
    
    //update city temp
    todayCard.querySelector('.temp').textContent=today.temp_c+'°C';

    //update weather icon
    todayCard.querySelector('.weather-icon').src='https:'+today.condition.icon;
    todayCard.querySelector('.condition').textContent=today.condition.text;


    // Update extra info
    todayCard.querySelector('.extra-info').innerHTML = `
        <span><i class="fa-solid fa-umbrella"></i> ${todayForecast.day.daily_chance_of_rain}%</span>
        <span><i class="fa-solid fa-wind"></i> ${today.wind_kph}km/h</span>
        <span><i class="fa-solid fa-compass"></i> ${today.wind_dir}</span>
    `;


    // FORECAST DAYS (Second and third cards)
    for(var i = 1; i <= 2; i++) {
        var forecast = allWeather.forecast.forecastday[i];
        var card = weatherCards[i];
        
        //  Use forecast date from API
        var forecastDate = new Date(forecast.date);
        
        card.querySelector('.day-name').textContent = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
        card.querySelector('.weather-icon').src = 'https:' + forecast.day.condition.icon;
        card.querySelector('.temp-max').textContent = forecast.day.maxtemp_c + '°C';
        card.querySelector('.temp-min').textContent = forecast.day.mintemp_c + '°C';
        card.querySelector('.condition').textContent = forecast.day.condition.text;
    }
}



function validateInput() {
    var city = weatherLocation.value.trim();
    
    if (city === '') {
        alert('Please enter a city name!');
        return false;
    }
    
    var cityPattern = /^[a-zA-Z\s]{2,}$/;
    if (!cityPattern.test(city)) {
        alert('Please enter a valid city name!');
        return false;
    }
    
    return true;
}

    
//clear inputs function
function clearInput(){
     weatherLocation.value='';
}
//search button click event
searchBtn.addEventListener('click', function(e) {
    if (validateInput()) {
        var city = weatherLocation.value.trim();
        getWeather(city);
    }
});

//Enter key press event
weatherLocation.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        if (validateInput()) {
            var city = weatherLocation.value.trim();
            getWeather(city);
        }
    }
});