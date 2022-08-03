const time = document.querySelector('.time');
const dateLook = document.querySelector('.date');
const optionsDate = {weekday: 'long', month: 'long', day: 'numeric'};
const greeting = document.querySelector('.greeting');
const nameGreting = document.querySelector('.name');
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

function showDate () {
    const date = new Date();
    dateLook.textContent = date.toLocaleDateString('en-US', optionsDate);
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    if (hours <= 6) {
        return 'night'
    } else  if (hours <= 12) {
        return 'morning'
    } else if (hours <= 18) {
        return 'afternoon'
    } else if (hours <= 24) {
        return 'evening'
    }
}

function showGreeting() {
    const timeOfDay = getTimeOfDay();
    greeting.textContent = `Good ${timeOfDay}`
}

function showDateTime () {
    const date = new Date();
    time.textContent = date.toLocaleTimeString();
    showDate()
    showGreeting()
    setTimeout(showDateTime, 1000);
};

showDateTime();

function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

window.addEventListener('beforeunload', () => setLocalStorage('name', nameGreting.value));

function getLocalStorage(key) {
    if(localStorage.getItem(key)) {
        return localStorage.getItem(key);
    }
    return '';
};
window.addEventListener('load', () => nameGreting.value = getLocalStorage('name'));

function getRandomNum(toNumber) {
    return toNumber ? Number(String(Math.round(Math.random() * (21 - 1) + 1)).padStart(2, '0')) : String(Math.round(Math.random() * (21 - 1) + 1)).padStart(2, '0');
}

let randomNum = getRandomNum(true);

function getSlideNext() {
    if (randomNum < 20) {
        randomNum += 1;
    } else {randomNum = 1}
    setBg();
}

function getSlidePrev() {
    if (randomNum > 1) {
        randomNum -= 1;
    } else {randomNum = 20}
    setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

function setBg() {
    const timeOfDay = getTimeOfDay();
    const bgNum = getRandomNum();
    const img = new Image();
    img.src = `https://github.com/MarinaStepanchuk/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true` 
    img.onload = () => {      
        document.body.style.backgroundImage = `url('https://github.com/MarinaStepanchuk/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true')`
    }; 
};

setBg();

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error')

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=6482b58158f95b17d9dce830a81efd17&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod === '404') {
        weatherIcon.className = 'weather-icon owf'
        weatherError.textContent = `Error! city not found for '${city.value}'!`;
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
    } else {
        weatherIcon.className = 'weather-icon owf'
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].main;
        wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        weatherError.textContent = '';
    }
};

city.addEventListener('change',getWeather)

window.addEventListener('beforeunload', () => setLocalStorage('city', city.value));

window.addEventListener('load', () => {
    city.value = getLocalStorage('city') || 'Minsk';
    getWeather();
});

// async function getQuotes() {  
//     const quotes = 'data.json';
//     const res = await fetch(quotes);
//     const data = await res.json(); 
//     console.log(data);
//   }

// getQuotes();
