// import iconsole from './interface/iconsole';
import socket from './webSocketClient';
import { newMessage } from './interface/displayCanvasMessage';
import { animeteMic } from './interface/animation';
// Cтатус розпознавания речи, включено true, выключено false
/* eslint-disable */
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'ru-RU';
/* eslint-enable */

export const startStopRec = () => {
  recognition.start();
  animeteMic(true);
};

export const speechRec = () => {
  // Дополнительные функции
  function transcriptText(text) {
    /* eslint-disable */
    text = Array.from(text)
      .map(v => v[0])
      .map(v => v.transcript)
      .join('');
    /* eslint-enable */
    return text;
  }

  recognition.addEventListener('result', (e) => {
    const text = transcriptText(e.results);
    // Финальное значение разпознавания
    if (e.results[0].isFinal) {
      window.myconsole.log(text, 'chat');
      animeteMic(false);
      socket.send(text);
    }
  });
  recognition.addEventListener('end', () => {
    animeteMic(false);
  });
  recognition.addEventListener('error', () => {
    animeteMic(false);
  });
};
