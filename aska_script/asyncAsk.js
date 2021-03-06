const socket = require('./webSocketOnMessage');
const { askaChoice } = require('./NN/LogbookPluginNN');
// Стандартная функция выбора ответа
function whatToSay(arr, key) {
  return arr[key][Math.random() * arr[key].length | 0];
}
module.exports.whatToSay = whatToSay;
/*
function whatToSayEXP(text, obj, key) {
  let choice = askaChoice(text);
  console.log(choice);
  // let choicenArr = obj[`${key}${choice}`];
  return choice;// choicenArr[Math.random() * choicenArr.length | 0];
}
module.exports.whatToSayEXP = whatToSayEXP;
*/
// ////////////////////////////////////////////////////////////////////////////

function selectFunctionFromWords(ws, options, defaultFunction) {
  ws.NNListen = false;
  ws.ClientSay = 'none';
  let skazanoe = ws.ClientSay;
  let flag = 0;
  const int = setInterval(() => {
    if (skazanoe !== ws.ClientSay) {
      flag = 0;
      skazanoe = ws.ClientSay;
      options.forEach((v) => {
        v.words.forEach((word) => {
          let includeStatus;
          if (v.include) {
            includeStatus = ws.ClientSay.includes(word);
          } else if (v.isNumber) {
            includeStatus = !isNaN(parseFloat(ws.ClientSay));
          } else {
            includeStatus = ws.ClientSay === word;
          }

          if (v.whatever) {
            if (ws.ClientSay.length > 2) {
              includeStatus = true;
            }
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
    }
    ws.closeAllInterval ? clearInterval(int) : '';
  }, 100);
}
module.exports.selectFunctionFromWords = selectFunctionFromWords;
// /////////////////////////////////////////////////////////////////////////////
function readEndWait(ws, text, nextFun, param, arrButtons) {
  if (text != '' && text != undefined) {
    ws.NNListen = false;
    const int3 = setInterval(() => {
      if (ws.audio === 'speech_end' && ws.readEndWaitIntervalArrey.indexOf(int3) === 0) {
        clearInterval(int3);
        socket.send(ws, 'aska', text, arrButtons);
        const int = setInterval(() => {
          if (ws.audio === 'speech_start') {
            clearInterval(int);
            const int2 = setInterval(() => {
              if (ws.audio === 'speech_end') {
                clearInterval(int2);
                ws.NNListen = true;
                nextFun ? nextFun(ws, param) : '';
                ws.readEndWaitIntervalArrey.splice(ws.readEndWaitIntervalArrey.indexOf(int3), 1);
              }
              ws.closeAllInterval ? clearInterval(int2) : '';
            }, 100);
          }
          ws.closeAllInterval ? clearInterval(int) : '';
        }, 100);
      }
      ws.closeAllInterval ? clearInterval(int3) : '';
    }, 100);
    ws.readEndWaitIntervalArrey.push(int3);
  } else {
    console.log('readEndWait input Text === "" or undefined');
  }
}
module.exports.readEndWait = readEndWait;
// /////////////////////////////////////////////////////////////////////////////
