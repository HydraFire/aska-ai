const socket = require('./webSocketOnMessage');
/*
function ask(ws, funTrue, funFalse) {
  ws.NNListen = false;
  const skazanoe = ws.ClientSay;
  const int = setInterval(() => {
    if (skazanoe !== ws.ClientSay) {
      if (ws.ClientSay === 'да') {
        clearInterval(int);
        ws.NNListen = true;
        funTrue();
      } else if (ws.ClientSay === 'нет') {
        clearInterval(int);
        ws.NNListen = true;
        funFalse();
      }
    }
    ws.closeAllInterval ? clearInterval(int) : '';
  }, 250);
}
module.exports.ask = ask;
*/
// Стандартная функция выбора ответа
function whatToSay(arr, key) {
  return arr[key][Math.random() * arr[key].length | 0];
}
module.exports.whatToSay = whatToSay;
// ////////////////////////////////////////////////////////////////////////////

function selectFunctionFromWords(ws, options, defaultFunction) {
  ws.NNListen = false;
  let skazanoe = 'none';
  ws.ClientSay = '';
  let flag = 0;
  const int = setInterval(() => {
    if (skazanoe !== ws.ClientSay) {
      flag = 0;
      options.forEach((v) => {
        v.words.forEach((word) => {
          let includeStatus;
          if (v.include) {
            includeStatus = ws.ClientSay.includes(word);
          } else {
            includeStatus = ws.ClientSay === word;
          }
          if (includeStatus) {
            if (v.end) {
              clearInterval(int);
              ws.NNListen = true;
            }
            flag = 1;
            v.func();
          }
        });
      });
      if (flag === 0) {
        defaultFunction(ws.ClientSay);
      }
      skazanoe = ws.ClientSay;
    }
    ws.closeAllInterval ? clearInterval(int) : '';
  }, 250);
}
module.exports.selectFunctionFromWords = selectFunctionFromWords;
// /////////////////////////////////////////////////////////////////////////////
function readEndWait(ws, text, nextFun, param) {
  ws.NNListen = false;
  const int3 = setInterval(() => {
    if (ws.audio === 'speech_end') {
      clearInterval(int3);
      socket.send(ws, 'aska', text);
      const int = setInterval(() => {
        if (ws.audio === 'speech_start') {
          clearInterval(int);
          const int2 = setInterval(() => {
            if (ws.audio === 'speech_end') {
              clearInterval(int2);
              ws.NNListen = true;
              nextFun(ws, param);
            }
            ws.closeAllInterval ? clearInterval(int2) : '';
          }, 500);
        }
        ws.closeAllInterval ? clearInterval(int) : '';
      }, 500);
    }
    ws.closeAllInterval ? clearInterval(int3) : '';
  }, 500);
}
module.exports.readEndWait = readEndWait;
// /////////////////////////////////////////////////////////////////////////////
function onlyWait(ws, nextFun, params) {
  ws.NNListen = false;
  let i = 0;
  const int = setInterval(() => {
    i += 0.25;
    if (ws.audio === 'speech_end') {
      clearInterval(int);
      ws.NNListen = true;
      nextFun(ws, params);
    }
    ws.closeAllInterval ? clearInterval(int) : '';
    socket.send(ws, 'console', `onlyWait ${i}s`);
  }, 250);
}
module.exports.onlyWait = onlyWait;
// /////////////////////////////////////////////////////////////////////////////
function waitForNNListen(ws, nextFun, params) {
  let i = 0;
  const int = setInterval(() => {
    i += 1.25;
    if (ws.NNListen) {
      if (ws.audio === 'speech_end') {
        clearInterval(int);
        nextFun(...params);
      }
    }
    ws.closeAllInterval ? clearInterval(int) : '';
    socket.send(ws, 'console', `onlyWait ${i}s`);
  }, 2000);
}
module.exports.waitForNNListen = waitForNNListen;
