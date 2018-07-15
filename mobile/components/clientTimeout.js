import { aska } from './speechSynthesizer';

function clientTimeout(arr) {
  arr = JSON.parse(arr);
  console.log('lol')
  const audio = document.getElementById('audio');
  let r = 0;
  audio.src =`${process.env.FILESERVER}22Hz.mp3`;
  audio.addEventListener('ended',()=>{
    audio.play();
  })
  audio.play();
  const int = setInterval(() => {

    if (r === 0) {

    }

    if (r >= (parseFloat(arr[1]) * 6)) {
      audio.removeEventListener('ended',()=>{
        audio.play();
      })
      aska(arr[0]);
      clearInterval(int);
    } else {
      r += 1;
    }
  }, 10000);
}
export default clientTimeout;
