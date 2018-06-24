import analyserGetReady from '../components/audioAnalyser';
import printText from './printText';

function Coub() {
  const canvas = document.querySelector('#draw');
  const video = document.querySelector('#video');
  const audio2 = document.querySelector('#audio2');
  audio2.src = 'coub/audio.mp3';
  audio2.volume = 0.1;
  const ctx = canvas.getContext('2d');
  canvas.width = 360;
  canvas.height = 720;
  let imgW = 0;
  let imgC = 0;
  const draw = function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'normal';
    // ctx.fillStyle = ctx.createPattern(video, 'repeat');
    ctx.drawImage(video, imgW, 0, video.videoWidth * imgC, video.videoHeight * imgC);
    printText(ctx);
  };
  // //////////////////////////////////////////////////////////////////////////

  // //////////////////////////////////////////////////////////////////////////

  // //////////////////////////////////////////////////////////////////////////


  video.addEventListener('play', () => {
    imgC = 720 / video.videoHeight;
    imgW = 180 - ((video.videoWidth * imgC) / 2);
    // audio2.play();
    setInterval(() => {
      draw();
    }, 1000 / 30);
  });
}
export default Coub;
