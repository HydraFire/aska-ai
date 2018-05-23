const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
// ///////////////////////////////
// ///////////////////////////////
const filepath = './data/LogBook.json';
const fileOption = './aska_script/commands/Logbook/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// //////////////////////////////////////////////////////////////////////////////
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
  console.log(array[array.length - 1]);
}
// /////////////////////////////////////////////////////////////////////////////
function oneIteration(ws, text) {
  let newText = '';
  const defaultFunction = function defaultFunction(string) {
    newText += `${string}, `;
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 't3'));
  };
  const saveOfPart = function saveOfPart() {
    if (newText !== '') {
      saveToFile(newText);
      socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 't0'));
    } else {
      socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 't2'));
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
    asyncAsk.readEndWait(ws, asyncAsk.whatToSay(AskaSC, 't1'), x);
  };
  asyncAsk.readEndWait(ws, text, n);
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
        asyncAsk.waitForNNListen(ws, socket.send, [ws, 'aska', asyncAsk.whatToSay(AskaSC, 't4')]);
      }
    }
    ws.closeAllInterval ? clearInterval(int) : '';
    socket.send(ws, 'console', `Logbook Interval ${intervalTimer}s`);
  }, 500);
}
module.exports.Logbook = Logbook;
