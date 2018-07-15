import { aska } from './speechSynthesizer';

function clientTimeout(arr) {
  arr = JSON.parse(arr);

  const audio = document.getElementById('audio');

  audio.src = `${process.env.FILESERVER}20Hz.mp3`;
  audio.load()
  function lol() {
    audio.play();
  }
  audio.addEventListener('ended', lol, false);
  audio.play();

  let r = 1;
  const int = setInterval(() => {
    if (r >= (parseFloat(arr[1]) * 10)) {
      audio.removeEventListener('ended', lol, false);
      aska(arr[0]);
      clearInterval(int);
    } else {
      r += 1;
      aska(`${r}`);
    }
  }, 10000);
}
export default clientTimeout;
