// import iconsole from './interface/iconsole';
import socket from './webSocketClient';
import DisplayWordsClass from './interface/displayWordsClass';
// Cтатус розпознавания речи, включено true, выключено false
let statusRec = false;
/* eslint-disable */
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'ru-RU';
/* eslint-enable */

function recStart() {
  // iconsole.logC('recognition.start()');
  console.log('recognition.start()');
  recognition.start();
  statusRec = true;
  recognition.addEventListener('end', recognition.start);
}
function startStopRec() {
  // if (statusRec) {
  // iconsole.logC('recognition.stop()');
  //  recognition.removeEventListener('end', recognition.start);
  recognition.start();
//    statusRec = false;
//  } else {
//    recStart();
//  }
}
module.exports.startStopRec = startStopRec;


function speechRec() {
  // Обявляем нужные нам елементы
  const display = new DisplayWordsClass();
  let waitForSend = false;
  let waitInterval = false;
  let i = 0;
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
  /*
  function repeatСheck(text) {
    if (display.getWordsByNum(1)) {
      const text2 = display.getWordsByNum(1);
      const arr = text.split(' ');
      const arr2 = text2.split(' ');
      const result = arr.filter(e => !arr2.includes(e));
      return result.join(' ');
    }
    return text;
  }
  */
  function sendWordsFinal() {
    waitInterval = true;
    waitForSend = false;
    const text = display.getWordsByNum(0);
    console.log(text);
    // text = repeatСheck(text);
    display.displayWordsFinal('🎤');
    // Отправляем сокеты.
    socket.send(text);
  }
  function waiting() {
    i = 0;
    if (!waitForSend) {
      waitForSend = true;
      waitInterval = false;
      const m = setInterval(() => {
        i += 1;
        if (i > 2) {
          // iconsole.logC('sendWordsFinal()');
          sendWordsFinal();
        }
        if (waitInterval) {
          clearInterval(m);
        }
      }, 500);
    }
  }

  // Запуск Разпознавания.
  // recStart();
  display.displayMicrophone();
  // Результаты разпознавания.
  recognition.addEventListener('result', (e) => {
    const text = transcriptText(e.results);
    display.displayWords(text);
    waiting();
    // Финальное значение разпознавания
    if (e.results[0].isFinal) {
      sendWordsFinal();
    }
  });
}
export { speechRec, startStopRec };
