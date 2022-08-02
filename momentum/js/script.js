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

function setLocalStorage() {
    localStorage.setItem('name', nameGreting.value);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        nameGreting.value = localStorage.getItem('name');
    }
};
window.addEventListener('load', getLocalStorage);

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
    const bgNum = String(randomNum).padStart(2, '0');
    const img = new Image();
    img.src = `https://github.com/MarinaStepanchuk/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true` 
    img.onload = () => {      
        document.body.style.backgroundImage = `url('https://github.com/MarinaStepanchuk/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true')`
    }; 
};

setBg();



