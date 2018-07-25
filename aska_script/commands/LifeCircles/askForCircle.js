const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const lifeCircles = require('./LifeCircles');
const { calcNow, countToText, dateToText } = require('./calcTime');
// /////////////////////////////////////
// /////////////////////////////////////
const fileOption = './data/commands/LifeCircles/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// РЕКОМЕНДОВАНО К ВЫПОЛНЕНИЮ
// /////////////////////////////////////////////////////////////////////////////
function LifeCirclesNapominanie(ws, obj) {
  const x = function x() {
    socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'z0')}, ${obj.words}`);
  };
  if (obj.words != '') {
    asyncAsk.onlyWait(ws, x, ws);
  }
}
module.exports.LifeCirclesNapominanie = LifeCirclesNapominanie;
// /////////////////////////////////////////////////////////////////////////////
function saveChenges(arr, i, word) {
  arr[i].words.push(word);
  return arr;
}
// /////////////////////////////////////////////////////////////////////////////
function ok(ws, arr, i, value) {
  let time = calcNow(arr, i);
  time = dateToText(time);
  let n = arr[i].incident.length + arr[i].startIncident;
  n = countToText(n);
  socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'm0')}, ${value} ${asyncAsk.whatToSay(AskaSC, 'm1')} ${n},
  ${asyncAsk.whatToSay(AskaSC, 'm2')} ${time}`);
}
module.exports.ok = ok;
// ////////////////////////////////////////////////////////////////////////////
function askForStartCount(ws, arr, value) {
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'k2'));
  };

  const positive = function positive() {
    const startIncident = parseFloat(ws.ClientSay);
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'k3'));
    lifeCircles.saveIncidentFirstTime(arr, value, startIncident);
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: AskaSC.k1,
        end: true,
        include: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, asyncAsk.whatToSay(AskaSC, 'k0'), packaging);
}
// ////////////////////////////////////////////////////////////////////////////
function askForNew(ws, arr, value) {
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 's4')} ${value}`);
  };

  const positive = function positive() {
    askForStartCount(ws, arr, value);
  };
  const negative = function negative() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 's3'));
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: AskaSC.s1,
        end: true
      }, {
        func: negative,
        words: AskaSC.s2,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, `${asyncAsk.whatToSay(AskaSC, 's0')} ${value}?`, packaging);
}
module.exports.askForNew = askForNew;
// ////////////////////////////////////////////////////////////////////////////
function when(ws, arr, i, value) {
  let time = calcNow(arr, i);
  time = dateToText(time);
  socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'q0')} ${value}, ${time} назад`);
}
module.exports.when = when;
// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
function go(ws, arr, value, allWordsArray, option) {
  let positivAnswer = false;

  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 's4'));
  };
  const positive = function positive() {
    positivAnswer = true;
    arr = saveChenges(arr, allWordsArray[0].index, value);
    lifeCircles.switchOption(ws, arr, allWordsArray[0].index, value, option);
  };
  const negative = function negative() {
    allWordsArray.splice(0, 1);
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: AskaSC.n1,
        end: true
      }, {
        func: negative,
        words: AskaSC.n2,
        end: true
      }
    ], defaultFunction);
  };

  const int = setInterval(() => {
    if (!positivAnswer) {
      if (ws.NNListen) {
        if (allWordsArray.length !== 0) {
          ws.ClientSay = 'none';
          asyncAsk.readEndWait(ws, `${asyncAsk.whatToSay(AskaSC, 'n0')} ${allWordsArray[0].name}`, packaging);
        } else {
          lifeCircles.newIncident(ws, arr, value);
          clearInterval(int);
        }
      }
    } else {
      clearInterval(int);
    }
    ws.closeAllInterval ? clearInterval(int) : '';
    console.log(allWordsArray);
  }, 1000);
}
module.exports.go = go;
// /////////////////////////////////////////////////////////////////////////////
function clientTimeout(ws, arr, i) {
  if (arr[i].timeOut > 0) {
    socket.send(ws, 'clientTimeout', JSON.stringify([asyncAsk.whatToSay(AskaSC, 'z1'), arr[i].timeOut]));
  }
}
module.exports.clientTimeout = clientTimeout;
// ////////////////////////////////////////////////////////////////////////////
function setTimer(ws, i) {
  socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'z2')} ${i} минут`);
}
module.exports.setTimer = setTimer;
function setTimeIntervalSay(ws, i) {
  socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'z5')} ${i}`);
}
module.exports.setTimeIntervalSay = setTimeIntervalSay;
function noTimeIntervalSay(ws, i) {
  socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'z6')} ${i}`);
}
module.exports.noTimeIntervalSay = noTimeIntervalSay;
function noTimeInt(ws) {
  socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'z3'));
}
module.exports.noTimeInt = noTimeInt;
// /////////////////////////////////////////////////////////////////////////////
function special(ws, arr, i, key) {
  const sss = ws.ClientSay.split(' ').filter((v) => {
    return !arr[i].words.some((w) => {
      if (w.split(' ').length === 1) {
        return v === w;
      }
      return w.split(' ').some(y => v === y);
    }) && !AskaSC[key].some(w => v === w);
  });
  return sss.join(' ');
}
module.exports.special = special;
// /////////////////////////////////////////////////////////////////////////////
function setNotRemind(ws, word) {
  socket.send(ws, 'aska', `${word}, ${asyncAsk.whatToSay(AskaSC, 'z4')}`);
}
module.exports.setNotRemind = setNotRemind;
