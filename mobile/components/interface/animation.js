import analyserGetReady from '../audioAnalyser';

let analyser;
let int;
let w;
let arrZ = [];
let animMic;
let animUS;
let animLoad;
const arr = new Array(10);
const arrW = [5, 10, 25, 50, 100, 150, 200, 250, 350, 500];
for (let i = 0; i < 10; i += 1) {
  arr[i] = i + 1;
}
// /////////////////////////////////////////////////////////////////////////////////////
function checkOrientation() {
  if (window.orientation === 90 || window.orientation === -90) {
    document.querySelectorAll('.circle').forEach(v => v.className = 'circle-portable');
    document.querySelector('.circle-static').className = 'circle-static-portable';
  } else {
    document.querySelectorAll('.circle-portable').forEach(v => v.className = 'circle');
    document.querySelector('.circle-static-portable').className = 'circle-static';
  }
}
function init() {
  analyser = analyserGetReady();
  window.addEventListener('orientationchange', checkOrientation, false);
}
// ///////////////////////////////////////////////////////////////////////////////////

function animeteErr() {
  document.querySelector('#c2').animate([
    // keyframes
    { transform: 'rotate(0deg) scale(0.1)' },
    { transform: 'rotate(360deg) scale(3)' }
  ], {
    // timing options
    duration: 1000,
    iterations: Infinity
  });
}
function animeteLoadAudio(boolean) {
  if (boolean) {
    animLoad = document.querySelector('#c4').animate([
      // keyframes
      { transform: 'rotate(0deg) scale(1.3)' },
      { transform: 'rotate(360deg) scale(0.2)' }
    ], {
      // timing options
      duration: 1000,
      iterations: Infinity
    });
  } else {
    animLoad.cancel();
  }
}
function animeteMic(boolean) {
  if (boolean) {
    animMic = document.querySelector('#c10').animate([
      // keyframes
      { transform: 'rotate(0deg) scale(0.2)' },
      { transform: 'rotate(360deg) scale(1.3)' }
    ], {
      // timing options
      duration: 1000,
      iterations: Infinity
    });
  } else {
    animMic.cancel();
  }
}
function animeteUltraSound(boolean) {
  if (boolean) {
    animUS = document.querySelector('#c8').animate([
      // keyframes
      { transform: 'rotate(0deg) scale(0.2)' },
      { transform: 'rotate(360deg) scale(1.3)' }
    ], {
      // timing options
      duration: 1000,
      iterations: Infinity
    });
  } else {
    animUS.cancel();
  }
}
// ////////////////////////////////////////////////////////////////////////////////
function getStarted() {
  const arr = new Array(10);
  for (let i = 0; i < 10; i += 1) {
    arr[i] = i + 1;
  }
  if (arrZ.length > 0) {
    arrZ.forEach((v) => {
      v.cancel();
    });
    arrZ = [];
  } else {
    arr.forEach((v) => {
      document.querySelector(`#c${v}`).style.animationName = 'none';
    });
  }
}
function getFinished(arrM) {
  const arr = new Array(10);
  for (let i = 0; i < 10; i += 1) {
    arr[i] = i + 1;
  }
  arr.forEach((v, index) => {
    arrZ.push(document.querySelector(`#c${v}`).animate([
      // keyframes
      { transform: `rotate(0deg) scale(${w[arrM[index]] / 100})` },
      { transform: `rotate(360deg) scale(${w[arrM[index]] / 100})` }
    ], {
      // timing options
      duration: 100000 / arr[index],
      iterations: Infinity
    }));
  });
}
function ran() {
  return Math.random() * 800 | 0;
}

function animetePlayAudio(boolean) {
  if (boolean) {
    getStarted();
    let i = 0;
    int = setInterval(() => {
      i += 10;
      w = analyser.frequencies();
      arr.forEach((v, index) => {
        document.querySelector(`#c${v}`).style.transform = `scale(${w[arrW[index]] / 100}) rotate(${i / v}deg)`;
      });
    }, 20);
  } else {
    getFinished(arrW);
    clearInterval(int);
  }
}

export { init, animetePlayAudio, animeteLoadAudio, animeteMic, animeteUltraSound, animeteErr };
