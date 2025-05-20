'use strict'

import { sleep, playSound } from "./library.js";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 3;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

let TIME_LIMIT = 0;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

let startTimer = async (time) => {
  clearInterval(timerInterval);
  timeClear();
  document.getElementById("timer").style.display = 'block';
  document.getElementById("timer").innerHTML = drawImage('start');
  document.getElementById("timer").classList.add('fadeInAnimation');
  await sleep(2000);
  document.getElementById("timer").classList.remove('fadeInAnimation');
  
  let number = parseInt(time.match(/-?\d+/g));
  if (time.includes("분")) number = number * 60;
  TIME_LIMIT = number;
  timeLeft = TIME_LIMIT;
  
  document.querySelector("#timer").innerHTML = `
   <div class="timer">
			<svg
				class="timerSvg"
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/1000/svg"
			>
				<g class="timerCircle">
					<circle
						class="timerPathElapsed"
						cx="60"
						cy="60"
						r="40"
					></circle>
					<path
						id="timerPathRemaining"
						stroke-dasharray="283"
						class="timerPathRemaining ${remainingPathColor}"
						d="
							M 50, 50
							m -45, 0
							a 45,45 0 1,0 90,0
							a 45,45 0 1,0 -90,0
						"
					></path>
				</g>
			</svg>
			<span id="timerLabel" class="timerLabel">${formatTime(timeLeft)}</span>
	 </div>
`;
  
  timerInterval = setInterval(async () => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("timerLabel").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) await onTimesUp();
    if (timeLeft < 4 && timeLeft > 0) await playSound(`${timeLeft}.ogg`);
  }, 1000);
}

let cancelTimer = async () => {
  clearInterval(timerInterval);
  timeClear();
  
  document.getElementById("timer").style.display = 'none';
}

let onTimesUp = async () => {
  clearInterval(timerInterval);
  timeClear();
  
  await playSound(`late.mp3`);
  
  document.getElementById("timer").innerHTML = drawImage('end');
  document.getElementById("timer").classList.add('fadeOutAnimation');
  await sleep(2000);
  document.getElementById("timer").classList.remove('fadeOutAnimation');
  document.getElementById("timer").style.display = 'none';
}

let timeClear = () => {
  TIME_LIMIT = 0;
  timePassed = 0;
  timeLeft = TIME_LIMIT;
}

let drawImage = (type) => {
  let imgSrc;
  if (type === "start") imgSrc = "/images/countStart.png";
  if (type === "end") imgSrc = "/images/countEnd.png";
  return `<img src="${imgSrc}" alt="${type}"/>`;
}

let formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}
    `;
  }
  return ` ${minutes}:${seconds}`;
}

let setRemainingPathColor = (timeLeft) => {
  const { alert, warning, info } = COLOR_CODES;
  
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("timerPathRemaining")
      .classList.remove(warning.color);
    document
      .getElementById("timerPathRemaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("timerPathRemaining")
      .classList.remove(info.color);
    document
      .getElementById("timerPathRemaining")
      .classList.add(warning.color);
  }
}

let calculateTimeFraction = () => {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

let setCircleDasharray = ()=> {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  
  document
    .getElementById("timerPathRemaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

export {
  startTimer,
  cancelTimer,
}