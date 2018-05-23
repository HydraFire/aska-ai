import React from 'react';
import { startStopRec } from '../speechRecognition';
// CSS Style
import '../../css/logotype.css';
// Стейт кнопки отключения микрофона
let microphoneOFF = false;
// Основные функции
function hendler() {
  const logo = document.getElementById('projectName');
  logo.addEventListener('click', (e) => {
    if (microphoneOFF) {
      e.target.style.textDecoration = 'none';
      microphoneOFF = false;
      startStopRec();
    } else {
      e.target.style.textDecoration = 'line-through';
      microphoneOFF = true;
      startStopRec();
    }
  });
}
// ///////////////////////////////////////////////////////////////////////////
class Logotype extends React.Component {
  componentDidMount() {
    hendler();
  }
  render() {
    return (
      <div id="main_container">
        <div id="projectName">ASKA</div>
        <div className="words" />
      </div>
    );
  }
}

export default Logotype;
