const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL, checkLargeURL, configOn } = require('../../saveAska');
// ///////////////////////////////
// ///////////////////////////////
const filepath = './data/LogBook.json';
const fileOption = './data/commands/Logbook/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
/*
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
*/
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
function Logbook(ws) {
  function oneIteration(key) {
    let newText = '';
    asyncAsk.readEndWait(ws, `#${obj[key]}`, () => {
      asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 't1')), () => {
        asyncAsk.selectFunctionFromWords(ws, [
          {
            func: () => {
              if (newText !== '') {
                saveToFile(newText);
                asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 't0')), arrayIterations)
              } else {
                asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 't2')), arrayIterations);
              }
            },
            words: AskaSC.s0,
            end: true
          }, {
            func: () => {
              saveToFile(newText);
              newText = '';
            },
            words: AskaSC.s1,
            end: false
          }
        ], (string) => {
          newText += `${string}, `;
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 't3')));
        });
      });
    });
  }
  function arrayIterations() {
    if (arrKeys.length === 0) {
      ws.lifeCirclesResponse = 'done';
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 't4')));
    } else {
      oneIteration(...arrKeys.splice(0, 1));
    }
  }
  const array = readFile(filepath);
  const obj = array[array.length - 1];
  let arrKeys = Object.keys(obj).filter(v => v !== 'date');
  arrayIterations();
}
module.exports.Logbook = Logbook;
