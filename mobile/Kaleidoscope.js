import analyserGetReady from './components/audioAnalyser';

function Kaleidoscope() {
  const analyser = analyserGetReady();
  const canvas = document.querySelector('#draw');
  const ctx = canvas.getContext('2d');


  let offsetX = 0.0;
  let offsetY = 0.0;
  let offsetRotation = 0.0;

  let f;
  let fLow;
  let fHigh;
  let fBass;
  let times = 0;
  let volumeCoo = (parseFloat(localStorage.audioVolume) / 2) + 0.65;
  setInterval(() => {
    volumeCoo = (parseFloat(localStorage.audioVolume) / 2) + 0.65;
  }, 2000);

  const HALF_PI = Math.PI / 2;
  const TWO_PI = Math.PI * 2;


  const offsetScale = 1;
  const zoom = 1;

  let radius = canvas.width / 2;
  const slice = 32;

  const step = TWO_PI / slice;
  const cx = canvas.width / 2;

  const scale = zoom * (radius / Math.min(canvas.width, canvas.height));
  console.log(scale);


  setInterval(() => {
    times += 1;
    f = analyser.frequencies();
    // fBass = ((f[10] + f[23] + f[36] + f[49] + f[51] + f[64] + f[77] + f[80]) / (80 * 16) / volumeCoo);
    // fLow = ((f[200] + f[210] + f[220] + f[230] + f[240] + f[250] + f[260] + f[270]) / (80 * 4) / volumeCoo);
    let ll = 0;
    for (let i = 25; i < 225; i += 1) {
      let zo = 0;
      if (f[i] > 150) {
        zo = f[i];
      } else if (f[i] > 120) {
        zo = (f[i] / 10);
      } else {
        zo = (f[i] / 200);
      }
      ll += zo;
    }
    fLow = ll / 400 / volumeCoo;
    // BASS
    let bb = 0;
    for (let i = 3; i < 13; i += 1) {
      let zo = 0;
      f[i] > 170 ? zo = f[i] : zo = (f[i] / 10);
      bb += zo;
    }
    fBass = bb / 200 / volumeCoo;

    // fHigh
    let hh = 0;
    for (let i = 500; i < 800; i += 3) {
      let zo = 0;
      f[i] > 170 ? zo = f[i] : zo = (f[i] / 50);
      hh += zo;
    }
    fHigh = hh / 100000 / volumeCoo;

    offsetRotation -= fHigh;
    offsetX -= fLow;
    offsetY -= fBass;


    if (((fBass / 2) + fLow + fHigh) > ((volumeCoo * 2) + 4) && times > 650) {
      times = 0;
      reImage()
    }
  }, 20);

  const draw = function draw(img) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.globalCompositeOperation = 'normal';
    ctx.fillStyle = ctx.createPattern(img, 'repeat');
    for (let i = 0; i <= slice; i += 1) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(i * step);
      ctx.beginPath();
      ctx.moveTo(-0.5, -0.5);
      ctx.arc(0, 0, radius, step * -0.51, step * 0.51);
      ctx.lineTo(0.5, 0.5);
      ctx.closePath();
      ctx.rotate(HALF_PI);
      ctx.scale(scale, scale);
      ctx.scale([-1, 1][i % 2], 1);

      ctx.translate(offsetX - cx, offsetY);
      ctx.rotate(offsetRotation);
      ctx.scale(offsetScale, offsetScale);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'soft-light';
    // ctx.globalCompositeOperation = 'exclusion';
    ctx.font = '120px serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('ASKA', canvas.width / 2, 160);
  };

  let imagesArray = new Array(50);
  imagesArray.fill('lol');
  imagesArray = imagesArray.map((v, i) => `image/${i}.jpg`);
  /*
  const hh = new Image();
  hh.src = imagesArray[0];
  hh.onload = function() {
      return draw(hh);
    }
    */

  let zzz = new Image();
  zzz.src = imagesArray[Math.random() * imagesArray.length | 0];
  zzz.onload = function onload() {
    return draw(zzz);
  };

  function reImage() {
    const i = Math.random() * imagesArray.length | 0;
    console.log(`img = ${i}`);
    zzz = new Image();
    zzz.src = imagesArray[i];
    zzz.onload = function onload() {
      offsetX = 0;
      offsetY = 0;
    };
  }

  /*
  let i = -260;
  setInterval(() => {
    kaleidoscope.offsetX = i--;
    kaleidoscope.offsetY = i
    kaleidoscope.offsetRotation = i / 100;
    i <- 260 ? i = 260 : '';
  }, 25);
*/
  const update = function update(img) {
    draw(img);
  };

  setInterval(() => {
    update(zzz);
  }, 1000 / 60);

  function resize(e) {
    if (e) {
      canvas.width = e.currentTarget.innerWidth;
      canvas.height = e.currentTarget.innerHeight;
      radius = (canvas.height / 2) + 50;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      radius = (canvas.height / 2) + 50;
    }
  }
  resize();
  window.addEventListener('resize', resize);
}
export default Kaleidoscope;
