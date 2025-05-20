'use strict'

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const playSound = async (sound) => {
  const audio = new Audio(sound);
  
  audio.oncanplaythrough = async () => {
    const duration = audio.duration;
    await audio.play();
    
    setTimeout(() => {
    
    }, duration * 1000);
  }
  audio.load();
}

const getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export {
  sleep,
  playSound,
  getParameterByName,
}