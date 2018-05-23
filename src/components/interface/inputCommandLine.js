import React from 'react';
import socket from '../webSocketClient';
import DisplayWordsClass from './displayWordsClass';
import '../../css/inputCommandLine.css';

function hendler() {
  // Число определяюшие глубину возврашение в памяти консоли
  const display = new DisplayWordsClass();
  const commandLine = document.querySelector('.inputCommandLine');
  // Число определяюшие глубину возврашение в памяти консоли
  let i = 0;
  function control() {
    i > 4 ? i = 4 : '';
    i < 0 ? i = 0 : '';
  }
  // EventListener нажатия клавишь
  commandLine.onkeydown = function onkeydown(e) {
    if (e.keyCode === 13) {
      if (this.value !== '') {
        display.displayWords(this.value);
        display.displayWordsFinal('🎤');
        socket.send(this.value);
        this.value = '';
        i = 0;
      }
    }
    if (e.keyCode === 38) {
      i += 1;
      control();
      if (display.getWordsByNum(i)) {
        this.value = display.getWordsByNum(i);
      } else {
        i === 1 ? this.value = localStorage.inputMemory : '';
        i -= 1;
      }
    }
    if (e.keyCode === 40) {
      i -= 1;
      control();
      i > 0 ? this.value = display.getWordsByNum(i) : this.value = '';
    }
  };
}

class InputCommandLine extends React.Component {
  componentDidMount() {
    hendler();
  }
  render() {
    return (
      <div className="inputConteiner">
        <div className="inputTab">CommandLine :</div>
        <input className="inputCommandLine" autoFocus type="text" placeholder="" />
        <div className="inputTab">Press Enter ⏎</div>
      </div>
    );
  }
}

export default InputCommandLine;
