import analyserGetReady from '../audioAnalyser';

function shader(shaderString, option) {
  let canvas;
  let gl;
  let vertexPositionLocation;
  let timeLocation;
  let time;
  let resolutionLocation;
  let resolution;
  let iAudioLocation;
  let iAudio = 0;
  const analyser = analyserGetReady();

  let mouseControl;
  const iMouse = [720, 300, 1];
  const iMCenter = { x: 620, y: 250 };

  let startTime;
  const vertices = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,

    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0
  ];
  // Мышка двигает
  function iMCenterHendler(x, y) {
    iMouse[0] = iMCenter.x + (x / 10);
    iMouse[1] = iMCenter.y + (y / 10);
  }
  function mouseHendler() {
    window.addEventListener('mousemove', (e) => {
      iMCenterHendler(e.pageX, e.pageY);
    });
  }
  function resize(e) {
    if (e) {
      canvas.width = e.currentTarget.innerWidth;
      canvas.height = (e.currentTarget.innerHeight / 100) * 57 | 0;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = (window.innerHeight / 100) * 57 | 0;
    }
    // console.log(`${canvas.width} ${canvas.height}`);
    const cw = canvas.width / 2;
    const ch = canvas.height / 2;
    iMCenter.x = cw - (cw / 10);
    iMCenter.y = ch - (ch / 10);
    iMCenterHendler(cw, ch);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  //
  // Компиляция шейдера
  //
  function compileShader(shaderSource, shaderType) {
    const shaderx = gl.createShader(shaderType);
    gl.shaderSource(shaderx, shaderSource);
    gl.compileShader(shaderx);
    // Check for any compilation error
    if (!gl.getShaderParameter(shaderx, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shaderx));
      return null;
    }
    return shaderx;
  }

  function getShaderA() {
    let str = shaderString;
    str = compileShader(str, gl.FRAGMENT_SHADER);
    return str;
  }
  function getShaderB() {
    let str = `attribute vec3 aVertexPosition;

        void main() {

            gl_Position = vec4(aVertexPosition, 1.0);

        }`;
    str = compileShader(str, gl.VERTEX_SHADER);
    return str;
  }

  function drawScene() {
    gl.uniform1f(timeLocation, time);
    gl.uniform1f(iAudioLocation, iAudio);
    if (option === 2) {
      gl.uniform2f(mouseControl, iMouse[0], iMouse[1]);
    } else {
      gl.uniform3fv(mouseControl, iMouse);
    }
    gl.uniform2fv(resolutionLocation, resolution);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /* eslint-disable */
  function render() {
    requestAnimationFrame(render);
    resolution = [
      canvas.width,
      canvas.height
    ];

    const m = analyser.frequencies();
    startTime -= m[100] * 1.7;
    time = (Date.now() - startTime) / 1000;
    iAudio = m[50];
    drawScene();
  }
  /* eslint-enable */

  function bootstrap() {
    canvas = document.getElementById('draw');
    gl = canvas.getContext('experimental-webgl');

    resize();

    window.addEventListener('resize', resize);
    //mouseHendler();


    const fragmentShader = getShaderA();
    const vertexShader = getShaderB();

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    gl.useProgram(shaderProgram);

    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);

    resolutionLocation = gl.getUniformLocation(shaderProgram, 'iResolution');
    mouseControl = gl.getUniformLocation(shaderProgram, 'iMouse');
    timeLocation = gl.getUniformLocation(shaderProgram, 'iTime');
    iAudioLocation = gl.getUniformLocation(shaderProgram, 'iAudio');

    vertexPositionLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);

    startTime = Date.now();
    render();
  }
  bootstrap();
// END
}

export default shader;
