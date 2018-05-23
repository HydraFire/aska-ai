import analyserGetReady from '../../audioAnalyser';

function canvasStart() {
  const analyser = analyserGetReady();
  const canvas = document.querySelector('#draw');
  const ctx = canvas.getContext('2d');
  let effectLength = 0;
  window.color_aska = 205;
  window.color_aska_h = 100;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(12, 12, 12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const f = analyser.frequencies();
    let w = analyser.waveform();
    w = w.reduce((a, b, i) => {
      if (i < (canvas.width / 3 | 0)) {
        return a.concat([b * 3, (b + b + w[i + 1]), (b + w[i + 1] + w[i + 1])]);
      }
      return a;
    }, []);
    //w = w.filter((v,i) => i%2)
    //console.log(w[0]+' '+w[1]+' '+w[2]+' '+w[3]+' '+w[4]+' '+w[5]+' '+w[6])
    let calcHue;
    const arrFre = [];
    f.forEach(v => arrFre.push(v));
    arrFre.reverse();
    f.forEach(v => arrFre.push(v));
    for (let i = 0; i < 1024 - (canvas.width / 2); i += 1) {
      arrFre.splice(0, 1);
    }
    for (let i = 0; i < canvas.width; i += 1) {
      calcHue = window.color_aska - (arrFre[i] / 8);
      ctx.fillStyle = `hsl(${calcHue},${window.color_aska_h}%,55%)`;
      let o = i;
      /*
      if (o >= canvas.width / 2) {
        o = i % (canvas.width / 2);
        o = (canvas.width / 2) - 1 - o;
      }
      */
      if (o >= w.length) {
        o = i % w.length;
        o = w.length - 1 - o;
      }
      ctx.fillRect(i, 0, 1, w[o] + effectLength);
    }
    requestAnimationFrame(draw);
  }
  // Запуск анимации
  requestAnimationFrame(draw);
  // Функция изменения размера
  function resize(e) {
    if (e) {
      canvas.width = e.currentTarget.innerWidth;
      canvas.height = (e.currentTarget.innerHeight / 100) * 57 | 0;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = (window.innerHeight / 100) * 57 | 0;
    }
    effectLength = (canvas.height - 382) - 140;
  }
  resize();
  window.addEventListener('resize', resize);
}

export default canvasStart;
