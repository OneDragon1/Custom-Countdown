const countdownForm = document.getElementById('countdownForm');
const inputContainer = document.getElementById('input-container');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min & Value with Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

function toggleVisibility(element, show) {
    element.hidden = !show;
    console.log(`${element.id} visibility set to ${show}`);
}

function updateElementText(elements, values) {
    elements.forEach((element, index) => {
        element.textContent = values[index];
    });
}

function calculateTimeRemaining(endTime) {
    const now = new Date().getTime();
    const distance = endTime - now;
    return {
        distance,
        days: Math.floor(distance / day),
        hours: Math.floor((distance % day) / hour),
        minutes: Math.floor((distance % hour) / minute),
        seconds: Math.floor((distance % minute) / second),
    };
}

function updateDOM() {
    countdownActive = setInterval(() => {
        const { distance, days, hours, minutes, seconds } = calculateTimeRemaining(countdownValue);
        console.log(`distance: ${distance}, days: ${days}, hours: ${hours}, minutes: ${minutes}, seconds: ${seconds}`);
        if (distance < 0) {
            toggleVisibility(countdownEl, false);
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            toggleVisibility(completeEl, true);
        } else {
            countdownElTitle.textContent = countdownTitle;
            updateElementText(timeElements, [days, hours, minutes, seconds]);
            toggleVisibility(completeEl, false);
            toggleVisibility(countdownEl, true);
        }
    }, second);
}

function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    if (!countdownDate) {
        alert('Please select a date for the countdown.');
        return;
    }
    countdownValue = new Date(countdownDate).getTime();
    localStorage.setItem('countdown', JSON.stringify({ title: countdownTitle, date: countdownDate }));
    toggleVisibility(inputContainer, false);
    updateDOM();
}

function reset() {
    toggleVisibility(countdownEl, false);
    toggleVisibility(completeEl, false);
    toggleVisibility(inputContainer, true);
    clearInterval(countdownActive);
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    const savedCountdown = localStorage.getItem('countdown');
    if (savedCountdown) {
        const { title, date } = JSON.parse(savedCountdown);
        countdownTitle = title;
        countdownDate = date;
        countdownValue = new Date(countdownDate).getTime();
        toggleVisibility(inputContainer, false);
        updateDOM();
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check localStorage
restorePreviousCountdown();
