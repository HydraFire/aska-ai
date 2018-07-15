import { aska } from './speechSynthesizer';

function clientTimeout(arr) {
  arr = JSON.parse(arr);
  console.log('lol')
  const audio = document.getElementById('audio');
  let r = 0;
  const int = setInterval(() => {

    if (r === 0) {
      audio.src =`${process.env.FILESERVER}22Hz.mp3`;
    }

    if (r >= (parseFloat(arr[1]) * 6)) {
      aska(arr[0]);
      clearInterval(int);
    } else {
      r += 1;
       aska('ой');
    }
  }, 20000);
}
export default clientTimeout;
