// -------------------date, greeting------------------------------

const time = document.querySelector('.time');
const dateLook = document.querySelector('.date');
const optionsDate = {weekday: 'long', month: 'long', day: 'numeric'};
const nameGreting = document.querySelector('.name');
const greeting = document.querySelector('.greeting');

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

//-----------------------slider---------------------------

const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

let randomNum = getRandomNum(1, 21);

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
    const bgNum = String(randomNum).padStart(2, '0');
    const img = new Image();
    img.src = `https://github.com/MarinaStepanchuk/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true` 
    img.onload = () => {      
        document.body.style.backgroundImage = `url('https://github.com/MarinaStepanchuk/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true')`
    }; 
};

setBg();

// ---------------weather-------------------

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
    if (data.cod === '404' || data.cod === '400') {
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

// ------------quotes--------------

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
let rep;

async function getQuotes() {  
    const quotes = 'js/data.json';
    const res = await fetch(quotes);
    const data = await res.json(); 
    let numberQuote = getRandomNum(0, data.length);
    if (numberQuote === rep) { 
        if (numberQuote < data.length-1) {
            numberQuote += 1;
        } else {
            numberQuote -= 1;
        }
    }
    quote.textContent = `"${data[numberQuote].text}"`;
    author.textContent = data[numberQuote].author;
    rep = numberQuote;
}

getQuotes();

changeQuote.addEventListener('click', getQuotes)


//---------------------audio player------------------

import {playList} from './playList.js';

const play = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next')

const audio = new Audio();
let isPlay = false;

let playNum = 0;

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    isPlay ? audio.pause() : audio.play();
    isPlay = !isPlay
    play.classList.toggle('pause')
  };
  
  function playSwitch() {
      audio.src = playList[playNum].src;
      audio.currentTime = 0;
      audio.play();
      isPlay = true;
      play.classList.add('pause')
  };

function playNextAudio() {
    if (playNum < playList.length-1) {
        playNum += 1;
    } else {playNum = 0}
    playSwitch()
}

function playPrevAudio() {
    if (playNum > 0) {
        playNum -= 1;
    } else {playNum = playList.length-1}
    playSwitch()
}



play.addEventListener('click', playAudio)
playPrev.addEventListener('click', playPrevAudio);
playNext.addEventListener('click', playNextAudio);








// cityWeath.value = localStorage.getItem('city') ? localStorage.getItem('city') : 'Minsk';