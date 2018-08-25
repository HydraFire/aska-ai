import analyserGetReady from '../audioAnalyser';

let analyser;
let int;


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

function animete() {
  document.querySelector('#c2').id = 'cSpeed';
}
function animeteLoadAudio(boolean) {
  if (boolean) {

  } else {
    //clearInterval(int);
    //document.querySelectorAll('.circle').forEach(v => v.style.transform = 'scale(0.1)');
  }
}
function animeteMic(boolean) {
  if (boolean) {
    document.querySelector('#c10').id = 'cSpeed';
  } else {
    document.querySelector('#cSpeed').id = 'c10';
  }
}
function animeteUltraSound(boolean) {
  if (boolean) {
    document.querySelector('#c8').id = 'cSpeed';
  } else {
    document.querySelector('#cSpeed').id = 'c8';
  }
}

function getStarted() {
  const arr = new Array(10);
  for (let i = 0; i < 10; i += 1) {
    arr[i] = i + 1;
  }
  arr.forEach((v) => {
    document.querySelector(`#c${v}`).style.animationName = 'none';
  });
}
function getFinished() {
  const arr = new Array(10);
  for (let i = 0; i < 10; i += 1) {
    arr[i] = i + 1;
  }
  arr.forEach((v) => {
    document.querySelector(`#c${v}`).style.animationName = 'anim';
  });
}

function animetePlayAudio(boolean) {
  const arr = new Array(10);
  const arrW = [0, 10, 20, 50, 100, 150, 200, 250, 500, 55];
  for (let i = 0; i < 10; i += 1) {
    arr[i] = i + 1;
  }
  if (boolean) {
    getStarted();
    let i = 0;
    int = setInterval(() => {
      i += 10;
      let w = analyser.frequencies();
      arr.forEach((v, index) => {
        document.querySelector(`#c${v}`).style.transform = `scale(${w[arrW[index]] / 128}) rotate(${i / v}deg)`;
      });
    }, 20);
  } else {
    clearInterval(int);
    getFinished();
  }
}

export { init, animetePlayAudio, animeteLoadAudio };
