const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { searchDate } = require('../../textToTime');
const { saveResult } = require('./QuestInstrument');
const { checkURL } = require('../../saveAska');
// ///////////////////////////////
// ///////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
function note(ws, day, time) {
  //
  let newText = '';
  //
  const defaultFunction = function defaultFunction(string) {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x5')));
    newText += `${string}, `;
  };

  const first = function attentionCheck() {
    if (newText !== '') {
      saveResult(day, time, newText, '3');
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
    } else {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x4')));
    }
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: AskaSC.x6,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'x3')), packaging);
}

// ////////////////////////////////////////////////////////////////////////////

function questSimple(ws, parameters) {
  //  const a = parameters.join(' ');
  ws.NNListen = false;
  let skazanoe = '';
  let x = false;
  let xString = false;
  let z = false;

  const int = setInterval(() => {
    if (skazanoe !== ws.ClientSay) {
      skazanoe = ws.ClientSay;
      let question = true;
      //  if (skazanoe !== ws.ClientSay) {
      if (!x) {
        xString = searchDate(ws.ClientSay);
        if (xString) {
          x = true;
        } else {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x0')));
          question = false;
        }
      }
      if (!z) {
        console.log(`parameters: "${parameters}"`);
        if (parameters != '') {
          z = true;
        } else if (question) {
          note(ws, xString, '04:00:00.000Z');
          clearInterval(int);
        }
      }
      if (x && z) {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
        parameters = parameters.join(' ');
        saveResult(xString, '04:00:00.000Z', parameters, '3');
        clearInterval(int);
        ws.NNListen = true;
      }
    }
  //  }
  }, 1000);
}
module.exports.questSimple = questSimple;
