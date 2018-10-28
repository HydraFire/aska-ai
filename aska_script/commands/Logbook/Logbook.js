const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL, checkLargeURL, configOn } = require('../../saveAska');
// ///////////////////////////////
// ///////////////////////////////
const filepath = './data/LogBook.json';
const fileOption = './data/commands/Logbook/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
const fileOptionEXP = './data/commands/Logbook/exp.json';
const AskaEXP = JSON.parse(fs.readFileSync(fileOptionEXP));

let allmostSay = '';
// //////////////////////////////////////////////////////////////////////////////
function writeResultEXP(ws, index) {
  if (allmostSay != ws.ClientSay) {
    let objExp = JSON.parse(fs.readFileSync(fileOptionEXP));
    objExp.nn[index].push(ws.ClientSay);
    allmostSay = ws.ClientSay;
    fs.writeFileSync(fileOptionEXP, JSON.stringify(objExp), 'utf8');
    configOn(true,'logbooknntrain');
  }
}
module.exports.writeResultEXP = writeResultEXP;
// /////////////////////////////////////////////////////////////////////////////
function readFile(p) {
  try {
    return JSON.parse(fs.readFileSync(p));
  } catch (err) {
    const obj = [{
      date: Date.parse(new Date()),
      part0: 'test'
    }];
    fs.writeFileSync(p, JSON.stringify(obj), 'utf8');
    return obj;
  }
}
// /////////////////////////////////////////////////////////////////////////////
function saveToFile(newText) {
  const array = readFile(filepath);
  const obj = array[array.length - 1];
  const lastDate = new Date(obj.date);
  const nowDate = new Date();

  if (lastDate.getFullYear() === nowDate.getFullYear() &&
      lastDate.getMonth() === nowDate.getMonth() &&
      lastDate.getDate() === nowDate.getDate()) {
    const m = Object.keys(obj).length - 1;
    obj[`part${m}`] = newText;
    array.splice(array.length - 1, 1, obj);
  } else {
    array.push({
      date: Date.parse(new Date()),
      part0: newText
    });
  }
  fs.writeFileSync(filepath, JSON.stringify(array), 'utf8');
  checkLargeURL(newText);
}
// /////////////////////////////////////////////////////////////////////////////
function oneIteration(ws, text) {
  let newText = '';
  const defaultFunction = function defaultFunction(string) {
    newText += `${string}, `;
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 't3')));
    // let x = asyncAsk.whatToSayEXP(string);
    // const commandSelect = Object.keys(x).sort((a, b) => x[b] - x[a])[0];
    // let choicenArr = AskaEXP[`say${commandSelect}`];
    // choicenArr = choicenArr[Math.random() * choicenArr.length | 0];
    // let arrButtons = Object.keys(x).map(v => ({ name: AskaEXP[`say${v}`][0], value: (x[v].toFixed(2) * 100 | 0) }));
    // socket.send(ws, 'aska', checkURL(choicenArr), arrButtons);
  };
  const saveOfPart = function saveOfPart() {
    if (newText !== '') {
      saveToFile(newText);
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 't0')));
    } else {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 't2')));
    }
  };
  const newPart = function newPart() {
    saveToFile(newText);
    newText = '';
  };
  const x = function x() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: saveOfPart,
        words: AskaSC.s0,
        end: true
      }, {
        func: newPart,
        words: AskaSC.s1,
        end: false
      }
    ], defaultFunction);
  };
  const n = function n() {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 't1')), x);
  };
  asyncAsk.readEndWait(ws, `#${text}`, n);
}
// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
function Logbook(ws) {
  const packaging = function packaging(ms, text) {
    oneIteration(ms, text);
  };
  const array = readFile(filepath);
  const obj = array[array.length - 1];

  let intervalTimer = 0;
  let arrayAllParts = Object.keys(obj);
  let functionAlReadyStart = false;

  const int = setInterval(() => {
    intervalTimer += 0.5;
    if (ws.NNListen) {
      functionAlReadyStart = false;
      arrayAllParts = arrayAllParts.filter((v) => {
        if (v === 'date') {
          return false;
        }
        if (!functionAlReadyStart) {
          functionAlReadyStart = true;
          asyncAsk.onlyWait(ws, packaging, obj[v]);
          return false;
        }
        return true;
      });
      if (arrayAllParts.length === 0) {
        clearInterval(int);
        asyncAsk.waitForNNListen(ws, socket.send, [ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 't4'))]);
      }
    }
    ws.closeAllInterval ? clearInterval(int) : '';
    // socket.send(ws, 'console', `Logbook Interval ${intervalTimer}s`);
  }, 500);
}
module.exports.Logbook = Logbook;
