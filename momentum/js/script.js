import {library} from './playList.js';
import {playList} from './playList.js';

const time = document.querySelector('.time');
const dateLook = document.querySelector('.date');
const optionsDate = {weekday: 'long', month: 'long', day: 'numeric'};
const nameGreting = document.querySelector('.name');
const greeting = document.querySelector('.greeting');
const languageEn = document.querySelector('.language-en');
const languageRu = document.querySelector('.language-ru');
const languageSwitch = document.querySelector('.language-switch');
const nameSettingLanguage = document.querySelector('.name-setting-language');
const sourceImageText = document.querySelector('.source-image-text');
const hideBlockText = document.querySelector('.hide-block-text');
const hideTime = document.querySelector('.hide-time');
const hideDate = document.querySelector('.hide-date');
const hideGreeting = document.querySelector('.hide-greeting');
const hideQuote = document.querySelector('.hide-quote');
const hideWheather = document.querySelector('.hide-wheather');
const hidePlayer = document.querySelector('.hide-player');
const hideTodolist = document.querySelector('.hide-todolist');
const tagChange = document.querySelector('.tag-change');
const tagLabel = document.querySelector('.tag-label');

let languageSelected = 'en';

function addText() {
    nameSettingLanguage.textContent = library.nameSettingLanguage[languageSelected];
    sourceImageText.textContent = library.sourceImageText[languageSelected];
    hideBlockText.textContent = library.hideBlockText[languageSelected];
    hideTime.textContent = library.hideTime[languageSelected];
    hideDate.textContent = library.hideDate[languageSelected];
    hideGreeting.textContent = library.hideGreeting[languageSelected];
    hideQuote.textContent = library.hideQuote[languageSelected];
    hideWheather.textContent = library.hideWheather[languageSelected];
    hidePlayer.textContent = library.hidePlayer[languageSelected];
    hideTodolist.textContent = library.hideTodolist[languageSelected];
    tagChange.textContent = library.tagChange[languageSelected];
    tagLabel.textContent =  library.tagLabel[languageSelected];
}

addText()

// -------------------date, greeting------------------------------

function showDate () {
    const date = new Date();
    dateLook.textContent = languageSelected === 'ru' ? date.toLocaleDateString('ru-RU', optionsDate): date.toLocaleDateString('en-US', optionsDate);
}

function getTimeOfDayEn() {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 6) {
        return 'night'
    } else  if (hours < 12) {
        return 'morning'
    } else if (hours < 18) {
        return 'afternoon'
    } else if (hours < 24) {
        return 'evening'
    }
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 6) {
        return library.night[languageSelected]
    } else  if (hours < 12) {
        return library.morning[languageSelected]
    } else if (hours < 18) {
        return library.afternoon[languageSelected]
    } else if (hours < 24) {
        return library.evening[languageSelected]
    }
}

function showGreeting() {
    const timeOfDay = getTimeOfDay();
    nameGreting.placeholder = `${library.greetingPlace[languageSelected]}`;
    greeting.textContent = `${library.greeting[languageSelected]}${timeOfDay}`;
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
    localStorage.setItem(key, JSON.stringify(value));
}

window.addEventListener('beforeunload', () => setLocalStorage('name', nameGreting.value));

function getLocalStorage(key) {
    if(localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
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
let tegBg = getTimeOfDayEn();
let bgWay = 'GitHub';

async function setBg() {
    let tegBgGit = getTimeOfDayEn();
    let bgNum = String(randomNum).padStart(2, '0');
    const img = new Image();
    let urlBg = {
        GitHub: `https://github.com/MarinaStepanchuk/stage1-tasks/blob/assets/images/${tegBgGit}/${bgNum}.jpg?raw=true`,
        UnsplashAPI : getLinkToImageUnsplash(),
        FlickrAPI : getLinkToImageFlickr()
    }
    let imgWay = await urlBg[bgWay];
    img.src = `${imgWay}` 
    img.onload = () => {      
        document.body.style.backgroundImage = `url('${imgWay}')`
    }; 
};

setBg()

// ----------------------picture Unsplash API --------------------

async function getLinkToImageUnsplash() {
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tegBg}&client_id=dCF9B8H54pt-i5Y5zUfsA0Z9-uE0AYLY6ls575BknRo`;
    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    return data.urls.regular 
}

// ----------------------picture Flickr API --------------------

async function getLinkToImageFlickr() {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c3525b99a86813c9dbacf77485c8641d&tags=${tegBg}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    let bgNum = getRandomNum(0, (data.photos.photo.length-1));
    if(data.photos.photo[bgNum].url_l) {
        return data.photos.photo[bgNum].url_l 
    } else {
        getLinkToImageFlickr()
    }
}

// ---------------weather-------------------

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error')

async function getWeather() {
    const url = languageSelected === 'en' ? `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=6482b58158f95b17d9dce830a81efd17&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=6482b58158f95b17d9dce830a81efd17&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    city.placeholder = `${library.cityPlace[languageSelected]}`;
    if (data.cod === '404' || data.cod === '400') {
        weatherIcon.className = 'weather-icon owf'
        weatherError.textContent = `${library.errorWeather[languageSelected]}'${city.value}'!`;
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
    } else {
        weatherIcon.className = 'weather-icon owf'
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${library.wind[languageSelected]}: ${Math.floor(data.wind.speed)} ${library.windUnits[languageSelected]}`;
        humidity.textContent = `${library.humidity[languageSelected]}: ${data.main.humidity}%`;
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
let numberQuote;

async function getQuotes(change) {
    const quotes = languageSelected === 'en' ? 'js/data.json' : 'js/dataRu.json';
    const res = await fetch(quotes);
    const data = await res.json(); 
    if(change) {
        numberQuote = getRandomNum(0, data.length);
        if (numberQuote === rep) { 
            if (numberQuote < data.length-1) {
                numberQuote += 1;
            } else {
                numberQuote -= 1;
            }
        }
    }
    quote.textContent = `"${data[numberQuote].text}"`;
    author.textContent = data[numberQuote].author;
    rep = numberQuote;
}

getQuotes(true);

changeQuote.addEventListener('click', () => getQuotes(true))


//---------------------audio player------------------

const play = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const soundTrack = document.querySelector('.sound-track')
const duration = document.querySelector('.duration');
const volumeSlider = document.querySelector(".sound-volume");
const timeline = document.querySelector('.timeline');
const buttonVolume = document.querySelector('.button-volume')

playList.forEach(element => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = `${element.title}`;
    playListContainer.append(li);
});

const playItem = document.querySelectorAll('.play-item');

const audio = new Audio();
let isPlay = false;

let playNum = 0;
soundTrack.textContent = `${playList[0].title}`;
duration.textContent = `${playList[0].duration}`;
audio.volume = 0.75;
volumeSlider.value = Number(audio.volume);

volumeSlider.addEventListener('click', e => {
    volumeSlider.value === '0' ? buttonVolume.classList.add('button-volume-off') :  buttonVolume.classList.remove('button-volume-off');
    audio.volume = volumeSlider.value
})

function playAudio() {
    let stopPoint = audio.currentTime
    audio.src = playList[playNum].src;
    if(isPlay) {
        audio.currentTime = stopPoint;
        audio.pause()
     } else {
        audio.currentTime = stopPoint;
        audio.play();
     } 
    isPlay = !isPlay
    play.classList.toggle('pause');
    playItem[playNum].classList.toggle('item-active');
    playItem[playNum].classList.add('item-active-play');
    soundTrack.textContent = `${playList[playNum].title}`;
    duration.textContent = `${playList[playNum].duration}`;
};

function playSwitch() {
    audio.src = playList[playNum].src;
    audio.play();
    isPlay = true;
    play.classList.add('pause');
    playItem[playNum].classList.add('item-active');
    playItem[playNum].classList.add('item-active-play');
    soundTrack.textContent = `${playList[playNum].title}`;
    duration.textContent = `${playList[playNum].duration}`;
};

function playNextAudio() {
    playItem[playNum].classList.remove('item-active')
    playItem[playNum].classList.remove('item-active-play')
    if (playNum < playList.length-1) {
        playNum += 1;
    } else {playNum = 0};
    playSwitch();
}

function playPrevAudio() {
    playItem[playNum].classList.remove('item-active')
    playItem[playNum].classList.remove('item-active-play')
    if (playNum > 0) {
        playNum -= 1;
    } else {playNum = playList.length-1};
    playSwitch();
}

let pointVolume;

play.addEventListener('click', playAudio);
playPrev.addEventListener('click', playPrevAudio);
playNext.addEventListener('click', playNextAudio);
audio.addEventListener('ended', playNextAudio);
buttonVolume.addEventListener('click', () => {
    if(audio.volume > 0) {
        pointVolume = audio.volume;
        volumeSlider.value = '0';
        audio.volume = Number(volumeSlider.value);
        buttonVolume.classList.add('button-volume-off');
    } else {
        buttonVolume.classList.remove('button-volume-off');
        volumeSlider.value = pointVolume;
        audio.volume = volumeSlider.value;
    }
})

playListContainer.addEventListener('click', (event,index) => {
    if (event.target.className === 'play-item') {
        playItem[playNum].classList.remove('item-active');
        playItem[playNum].classList.remove('item-active-play');
        playList.forEach((elem, index) => {
            if(event.target.textContent === elem.title)
            playNum = index;
        })
        playSwitch();
    } else if(event.target.className === 'play-item item-active-play' || 'play-item item-active item-active-play') {
        if(isPlay) {
            audio.pause();
            play.classList.toggle('pause');
            playItem[playNum].classList.remove('item-active');
            soundTrack.textContent = `${playList[playNum].title}`;
            duration.textContent = `${playList[playNum].duration}`;
            isPlay = false;
        } else {
            audio.play();
            play.classList.toggle('pause');
            playItem[playNum].classList.add('item-active');
            soundTrack.textContent = `${playList[playNum].title}`;
            duration.textContent = `${playList[playNum].duration}`;
            isPlay = true;
        }
    }
});

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
}

function getSecond(dur) {
    let second = Number(dur.substr(0,1))*10*60+Number(dur.substr(1,1))*60+Number(dur.substr(3,1))*10+Number(dur.substr(4,1))
    return second;
}

timeline.addEventListener('click', e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const durSound = getSecond(playList[playNum].duration)
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * durSound;
    audio.currentTime = timeToSeek;
});

setInterval(() => {
    const progressBar = document.querySelector('.duration-sound');
    const durSound = getSecond(playList[playNum].duration)
    progressBar.style.width = audio.currentTime / durSound * 100 + "%";
    const timerPlay = document.querySelector('.timer-play');
    timerPlay.textContent = getTimeCodeFromNum(
      audio.currentTime
    );
}, 500);

// --------------- settings ----------------------

// ---------- change language --------------------



languageEn.addEventListener('click', () => {
    languageSelected = 'en';
    languageSwitch.value = '0'
    getWeather();
    getQuotes();
    addText();
});

languageRu.addEventListener('click', () => {
    languageSelected = 'ru';
    languageSwitch.value = '1'
    getWeather();
    getQuotes();
    addText();
});

languageSwitch.addEventListener('click', () => {
    languageSwitch.value === '1' ? languageSelected = 'ru' : languageSelected = 'en';
    getWeather();
    getQuotes();
    addText();
});

//----------------Image source---------------------

const sourceGitHub = document.getElementById('GitHub');
const sourceUnsplashAPI = document.getElementById('UnsplashAPI');
const sourceFlickrAPI = document.getElementById('FlickrAPI');
const tagInput = document.querySelector('.tag-input');

tagInput.setAttribute("disabled", "true");

sourceGitHub.addEventListener('click', () =>{
    bgWay = 'GitHub';
    tagInput.setAttribute("disabled", "true");
    setBg();
});

sourceUnsplashAPI.addEventListener('click', () =>{
    bgWay = 'UnsplashAPI';
    tagInput.removeAttribute("disabled");
    setBg();
});

sourceFlickrAPI.addEventListener('click', () =>{
    bgWay = 'FlickrAPI';
    tagInput.removeAttribute("disabled");
    setBg();
});

tagChange.addEventListener('click', () => {
    tegBg = tagInput.value;
    setBg();
});

// -------------------Hide blocks--------------------

const blockHide = document.querySelector('.blocks-hide');
const player = document.querySelector('.player');
const greetingContainer = document.querySelector('.greeting-container');
const footerQuote = document.querySelector('.footer-quote');
const weatherContainer = document.querySelector('.weather');
//==============
const todolistContainer = document.querySelector('todolist-container')
//==============

blockHide.addEventListener('click' , event => {
    switch (event.target.id) {
        case 'time':
            if(document.querySelector(`#time`).checked){
                time.classList.add('hide-block');
            } else {
                time.classList.remove('hide-block'); 
            }
            break;
        case 'date':
            if(document.querySelector(`#date`).checked){
                dateLook.classList.add('hide-block');
            } else {
                dateLook.classList.remove('hide-block');
            }
            break;
        case 'greeting':
            if(document.querySelector(`#greeting`).checked){
                greetingContainer.classList.add('hide-block');
            } else {
                greetingContainer.classList.remove('hide-block');
            }
            break;
        case 'quote':
            if(document.querySelector(`#quote`).checked){
                footerQuote.classList.add('hide-block');
            } else {
                footerQuote.classList.remove('hide-block');
            }
            break;
        case 'wheather':
            if(document.querySelector(`#wheather`).checked){
                weatherContainer.classList.add('hide-block');
            } else {
                weatherContainer.classList.remove('hide-block');
            }
            break;
        case 'player':
            if(document.querySelector(`#player`).checked){
                player.classList.add('hide-block');
            } else {
                player.classList.remove('hide-block');
            }
            break;
        case 'todolist':
            if(document.querySelector(`#player`).checked) {
                todolistContainer.classList.add('hide-block');
            } else {
                todolistContainer.classList.remove('hide-block');
            }
            break;
    }
});

//-------------------show Menu Settings ---------------

const settingsMenu = document.querySelector('.settings-menu');
const closeMenu = document.querySelector('.close-menu');

closeMenu.addEventListener('click', () => {
    settingsMenu.classList.remove('menu-show');
});

document.addEventListener('click', event => {
	if (!event.composedPath().includes(settingsMenu)) {
        if(event.target.className === 'settings') {
            settingsMenu.classList.add('menu-show');   
        } else {
            settingsMenu.classList.remove('menu-show');
        }
	}
});

//-------------------save settings-------------------

window.addEventListener('beforeunload', () => setLocalStorage('language', {label: languageSelected, code: languageSwitch.value}));

window.addEventListener('load', () => {
    languageSelected = getLocalStorage('language').label;
    languageSwitch.value = getLocalStorage('language').code;
    getWeather();
    getQuotes();
    addText();
});

window.addEventListener('beforeunload', () => setLocalStorage('bg', {source: bgWay, tag: tagInput.value}));

window.addEventListener('load', () => {
    let imgSourse = getLocalStorage('bg').source;
    document.querySelector(`#${imgSourse}`).setAttribute("checked", "true");
    bgWay = getLocalStorage('bg').source;
    tagInput.value = getLocalStorage('bg').tag
    if(tagInput.value) {
        tegBg = tagInput.value
    };
    if(bgWay !== 'GitHub') {
        tagInput.removeAttribute("disabled");
    } else {
        tagInput.value = '';
    }
    setBg()
});

window.addEventListener('beforeunload', () =>  {
    const nodeList = document.querySelectorAll('.hide-block');
    const getId = [];
    for (const node of nodeList) {
        getId.push(node.className.split(' ')[0]);
    }
    let checkboxes = document.getElementsByClassName('way-check');
    const getCheck = [];
    for (const node of checkboxes) {
        if(node.checked) {
            getCheck.push(node.id);
        }
    }
    setLocalStorage('hide',{block: getId, input: getCheck});
});

window.addEventListener('load', () => {
    let arrayClass = getLocalStorage('hide').block;
    arrayClass.forEach(elem => {
        document.querySelector(`${elem}`).classList.add('hide-block');
    });
    let arrayId =  getLocalStorage('hide').input;
    console.log(arrayId)
    arrayId.forEach(elem => {
        console.log(elem)
        document.querySelector(`#${elem}`).setAttribute("checked", "checked");
    });
});

