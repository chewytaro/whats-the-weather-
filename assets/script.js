//API

var APIkey = "629a3c5d9bb017b7d5d0726e3e74cdbb";
var part = 'alerts,minutely';


var searchBar = function (event) {
    event.preventDefault();
    var selectCity = document.querySelector('#select-city').value.trim();

    if (selectCity === '') {
        alert('Search Field is Blank!');

    } else {

        var selectCityObj = { city: selectCity };
        arrayOfCities.push(selectCityObj);
        localStorage.setItem('city', JSON.stringify(arrayOfCities));

        fetchFunction(selectCity)

        saveSearch();
    }
};


var fetchFunction = function (cityname) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(function (response) {
            var lat = response.coord.lat;
            var lon = response.coord.lon
            callLocation(lat, lon, cityname)
        })

        .catch(err => alert("404 Not Found"))
};


var callLocation = function (lat, lon, cityname) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIkey}&units=imperial`

    fetch(apiUrl)
        .then(response => response.json())
        .then(function (response) {


            currentWeather(response, cityname);


            fiveDayForecast(response);

        });
};

document.querySelector('#city-search').addEventListener('submit', searchBar)   

//Last Searched

var btnVal = function (value) {
  var btnValue = value.innerHTML;
  fetchFunction(btnValue);
};


var buttonCreation = function (content) {
  var currentCityBtn = document.createElement('button');
  currentCityBtn.textContent = content;
  currentCityBtn.onclick = function () { btnVal(this); };
  return currentCityBtn
};



// Local Storage

var arrayOfCities = [];
var previousCities = document.querySelector('#recent-searches');


var saveSearch = function () {
    var getLocalStorage = JSON.parse(localStorage.getItem('city'));

    if (getLocalStorage) {
        previousCities.textContent = ''
        for (let i = 0; i < getLocalStorage.length; i++) {
            var makeButton = buttonCreation(getLocalStorage[i].city);

          

            makeButton.setAttribute('class', 'btn btn-secondary m-2 city-button')
            previousCities.appendChild(makeButton);
        }
    } else {
        previousCities.innerHTML = "Your recent searches will show here!"
    }
};



var loadStorage = function () {
    if (localStorage.getItem('city')) {
        var getLocalStorage = JSON.parse(localStorage.getItem('city'));

        for (let i = 0; i < getLocalStorage.length; i++) {
            var cityCaptureObj = {
                city: getLocalStorage[i].city
            };

            arrayOfCities.push(cityCaptureObj);
        }
        saveSearch();

      
        
    } else {
        previousCities.innerHTML = "Your recent searches will show here!"
    }
};

loadStorage();
fetchFunction('Seattle');


//Forecast

var imageCards = function (WeatherConditions) {
  var WeatherImage = document.createElement('img');
  if (199 < WeatherConditions && WeatherConditions < 233) {
      WeatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/11d@2x.png')
  } else if (299 < WeatherConditions && WeatherConditions < 322) {
      WeatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/09d@2x.png')
  } else if (499 < WeatherConditions && WeatherConditions < 532) {
      WeatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/10d@2x.png')
  } else if (599 < WeatherConditions && WeatherConditions < 623) {
      WeatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/13d@2x.png')
  } else if (700 < WeatherConditions && WeatherConditions < 782) {
      WeatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/50d@2x.png')
  } else if (WeatherConditions == 800) {
      WeatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/01d@2x.png')
  } else {
      WeatherImage.setAttribute('src', 'http://openweathermap.org/img/wn/02d@2x.png')
  }
  return WeatherImage;
};

var fiveDayForecast = function (weather) {


  var daily = weather.daily


  var fiveDay = document.querySelector('#five-day-forecast')

  fiveDay.innerHTML = ''

  for (let i = 0; i < daily.length - 3; i++) {
      //formating for the next five dates
      var dateHead = formatFuture(i);
      var weather = daily[i].weather[0].id;
      var temp = daily[i].temp.day;
      var wind = daily[i].wind_speed;
      var hummidity = daily[i].humidity;

      var showDay = document.createElement('div');
      var dateHeading = document.createElement('h3');
      var ulEl = document.createElement('ul');
      var tempElLi = document.createElement('li');
      var windLiEl = document.createElement('li');
      var hummidityiLi = document.createElement('li');

      var weatherIcon = imageCards(weather);

      showDay.setAttribute('class', 'card col-auto bg-info m-2 border border-dark');
      dateHeading.setAttribute('class', 'card-text');
      tempElLi.setAttribute('class', 'card-text text-white');
      windLiEl.setAttribute('class', 'card-text text-white');
      hummidityiLi.setAttribute('class', 'card-text text-white');
      weatherIcon.setAttribute('class', 'card-img-top')

      dateHeading.textContent = dateHead;
      tempElLi.textContent = `Temperature: ${temp} \u00B0F`;
      windLiEl.textContent = `Wind: ${wind} MPH`;
      hummidityiLi.textContent = `Humidity: ${hummidity} %`;

      showDay.appendChild(dateHeading);
      showDay.appendChild(weatherIcon);
      showDay.appendChild(ulEl)
      ulEl.appendChild(tempElLi);
      ulEl.appendChild(windLiEl);
      ulEl.appendChild(hummidityiLi);
      fiveDay.appendChild(showDay);
  };
};

var checkUVlight = function (uvlight, uvEl) {
  if (uvlight < 3) {
      uvEl.setAttribute('class', 'bg-success')
  } else if (3 < uvlight && uvlight < 6) {
      uvEl.setAttribute('class', 'bg-warning')
  } else {
      uvEl.setAttribute('class', 'bg-danger')
  }
  return uvEl
};

//setup for dates
var date = new Date()
var day = date.getDate()
var month = date.getMonth() + 1;
var year = date.getFullYear();

var formatTime = function () {
  //formats date
  var currentDate = `(${month}/${day}/${year})`
  return currentDate;
};

var formatFuture = function (i) {
  var futureDay = day + i + 1
  var futureDate = `(${month}/${futureDay}/${year})`
  return futureDate;
}


//Local Weather

var currentWeather = function (weather, cityname) {
  var live = weather.current;
  var headEl = document.querySelector('#location');
  headEl.textContent = cityname + " " + formatTime();


  var temperature = live.temp;
  var windy = live.wind_speed;
  var humidity = live.humidity;
  var uvIndex = live.uvi;

  var uvEl = document.createElement('li')
  uvEl.textContent = `UV Index: ${uvIndex}` 
  var currentConditions = document.querySelector('#conditions')

  currentConditions.innerHTML = `
  <li> Temperature: ${temperature} \u00B0F  </li>
  <li> Wind: ${windy} MPH </li>
  <li> Humidity: ${humidity} %</li>
  `
  currentConditions.appendChild(uvEl)
  checkUVlight(uvIndex, uvEl)
};