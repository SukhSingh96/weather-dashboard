// global variables
let apiKey = '8759761d84377f84368d911d3a0cc7b9';
let cityName = document.querySelector('.city-name');
let date = document.querySelector('.date');
let icon = document.querySelector('.icon');
let temp = document.querySelector('.temp');
let wind = document.querySelector('.wind');
let humidity = document.querySelector('.humidity');
let forecastContainer = document.querySelector('.forecast-container');
let searchBtn = document.querySelector('.search-btn');
let cities = JSON.parse(localStorage.getItem('cities')) || [];
let cityBtns = document.querySelector('.city-btns');

// user search input
function getCityName(event) {
    event.preventDefault();
    let citySearch = document.querySelector('.city-search').value;
    document.getElementById("citySearch").value = "";
    getWeather(citySearch);
    saveCitySearch(citySearch);
}

// saves city name in local storage
function saveCitySearch(citySearch) {
    if (!cities.includes(citySearch)) {
        cities.push(citySearch);
    }
    localStorage.setItem('cities', JSON.stringify(cities));
    saveCities();
    console.log(cities);
}

// lists previous cities searched from local storage as clickable buttons
function init() {
    let citiesStorage = localStorage.getItem('cities');
    if (citiesStorage) {
        cities = JSON.parse(citiesStorage);
        console.log(cities);
        saveCities();
    };
}

// sets past city searches as buttons
function saveCities() {
    cityBtns.textContent = '';
    cities = cities.slice(Math.max(cities.length - 5, 0));
    cities.forEach(city => {
        let btn = document.createElement('button');
        cityBtns.prepend(btn);
        btn.setAttribute('class', 'btn btn-outline-secondary btn-block');
        btn.setAttribute('data-city', city);
        btn.innerHTML = city;
    })
}

// gets current weather for searched city
function getWeather(citySearch) {
    let city = citySearch.target || citySearch;
    city = citySearch.target ?
        city.getAttribute('data-city') : citySearch;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let nameValue = data['name'];
            let dateValue = new Date(data.dt * 1000);
            let options = { date };
            let weatherIcon = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
            let tempValue = data['main']['temp'];
            let windValue = data['wind']['speed'];
            let humidityValue = data['main']['humidity'];
            cityName.innerHTML = nameValue;
            date.innerHTML = new Intl.DateTimeFormat('en-US', options).format(dateValue);
            icon.innerHTML = weatherIcon;
            temp.innerHTML = `Temperature: ${tempValue}°`;
            wind.innerHTML = `Wind: ${windValue} mph`;
            humidity.innerHTML = `Humidity: ${humidityValue}%`;
            icon.setAttribute('src', weatherIcon);
            getCoord(city);
        })
};

// gets lat and lon coordinates needed for forecast information
function getCoord(citySearch) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            getFiveDay(lat, lon);
        })
};

// gets five day weather forecast
function getFiveDay(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            forecastContainer.innerHTML = "";
            data.daily.forEach((day, index) => {
                if (index === 0 || index > 5) {
                    return;
                };
                let forecastDate = new Date(day.dt * 1000);
                let options = { date };
                let forecastIcon = 'https://openweathermap.org/img/w/' + day.weather[0].icon + '.png';
                let forecastIconDesc = day.weather[0].description || weather[0].main;
                let forecastTemp = day.temp.day;
                let forecastWind = day.wind_speed;
                let forecastHumidity = day.humidity;
                let forecastCard = document.createElement('div');
                let cardDate = document.createElement('h3');
                let cardIcon = document.createElement('img');
                let cardTemp = document.createElement('p');
                let cardWind = document.createElement('p');
                let cardHumidity = document.createElement('p');
                forecastContainer.append(forecastCard);
                forecastCard.setAttribute('class', 'card');
                forecastCard.setAttribute('class', 'my-card');
                cardIcon.setAttribute('src', forecastIcon);
                cardIcon.setAttribute('alt', forecastIconDesc);
                cardIcon.setAttribute('class', 'card-icon');
                forecastCard.append(cardDate);
                forecastCard.append(cardIcon);
                forecastCard.append(cardTemp);
                forecastCard.append(cardWind);
                forecastCard.append(cardHumidity);
                cardDate.innerHTML = new Intl.DateTimeFormat('en-US', options).format(forecastDate);
                cardIcon.innerHTML = forecastIcon;
                cardTemp.innerHTML = `Temperature: ${forecastTemp}°`;
                cardWind.innerHTML = `Wind: ${forecastWind} mph`;
                cardHumidity.innerHTML = `Humidity: ${forecastHumidity}%`;
            })
        })
};

// event listeners
searchBtn.addEventListener('click', getCityName);
cityBtns.addEventListener('click', () => getWeather(event));
init();