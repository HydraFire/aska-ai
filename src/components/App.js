import React from 'react';
// Компоненты UI елементы страници
import Header from './interface/header';
import Logotype from './interface/logotype';
import InputCommandLine from './interface/inputCommandLine';
import SliderAudioVolume from './interface/sliderAudioVolume';
import IconsoleUI from './interface/iconsoleUI';
import iconsole from './interface/iconsole';
// Style Main Page
import '../css/app.css';
// OpenGL or Canvas animation
import graphicsStart from './graphics/graphicsStart';
// WebSocket Connect
import socket from './webSocketClient';
// Speech Recognition
import { speechRec } from './speechRecognition';
// Временая функция для проверки графики, включаем музыку
function music() {
  function play(num) {
    const a = document.getElementById('audio');
    a.src = `./image/audio${num}.mp3`;
    a.play();
  }
  const m = document.getElementById('imgMusik');
  const m2 = document.getElementById('imgMusik2');
  const m3 = document.getElementById('imgMusik3');
  const m4 = document.getElementById('imgMusik4');
  m.addEventListener('click', () => play(''));
  m2.addEventListener('click', () => play('2'));
  m3.addEventListener('click', () => play('3'));
  m4.addEventListener('click', () => read('4'));
}
// Main Page HTML
class App extends React.Component {
  componentDidMount() {
    iconsole.start();
    graphicsStart();
    socket.start(process.env.ALTHOSTNAME);
    speechRec();
    music();
  }
  render() {
    return (
      <div>
        <Header />
        <div className="underCanvas">
          <Logotype />
          <SliderAudioVolume />
          <IconsoleUI logType="serverLog" />
          <IconsoleUI logType="clientLog" />
        </div>
        <canvas id="draw" />
        <InputCommandLine />
        <div className="info">
          <div className="block_help">
            <div id="contact"><h1>Какая завтра будет погода?</h1></div>
            <img id="imgMusik" className="float_left" src="./image/weather.ico" alt="" />
            <div>
              <h3>эта команда берет информацию о погоде из интернета</h3>
              <h3>эта команда берет информацию о погоде из интернета</h3>
              <h3>эта команда берет информацию о погоде из интернета</h3>
            </div>
          </div>
          <div className="block_help">
            <div id="contact"><h1>Какая завтра будет погода?</h1></div>
            <img id="imgMusik2" className="float_left" src="./image/sun.png" alt="" />
            <div>
              <h3>эта команда берет информацию о погоде из интернета</h3>
              <h3>эта команда берет информацию о погоде из интернета</h3>
              <h3>эта команда берет информацию о погоде из интернета</h3>
            </div>
          </div>
          <div className="block_help">
            <div id="contact"><h1>Какая завтра будет погода?</h1></div>
            <img id="imgMusik3" className="float_left" src="./image/sun.png" alt="" />
            <div>
              <h3>эта команда берет информацию о погоде из интернета</h3>
              <h3>эта команда берет информацию о погоде из интернета</h3>
              <h3>эта команда берет информацию о погоде из интернета</h3>
            </div>
          </div>
          <div className="block_help">
            <div id="contact"><h1>Включи музыку!</h1></div>
            <img id="imgMusik4" className="float_left" src="./image/sun.png" alt="" />
            <h3>эта команда берет информацию о погоде из интернета</h3>
            <h3>эта команда берет информацию о погоде из интернета</h3>
            <h3>эта команда берет информацию о погоде из интернета</h3>
            <div id="drop_zone">Drop files here</div>
          </div>
          <output id="list" />
        </div>

        <canvas id="myChart" width="600" height="200" />

        <audio src="" id="audio" />
        <audio src="" id="audio2" />
      </div>
    );
  }
}


export default App;
