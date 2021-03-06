const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { questSimple } = require('./QuestSimple');
const { searchDate, searchTime } = require('../../textToTime');
const { saveResult, closedSimpleQuest, postponeSimpleQuest } = require('./QuestInstrument');
const { questSpecial } = require('./QuestSpecial');
// ///////////////////////////////
// ///////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
function note(ws, day, time, options) {
  function defaultFunction(string) {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x4')));
  };

  function first() {
      saveResult(day, time, ws.ClientSay, options);
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
  };

  function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: [''],
        whatever: true,
        end: true
      }
    ], defaultFunction);
  };
  let sayParameter = options;
  sayParameter === '5' ? sayParameter = '2' : '';
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, `x${sayParameter}`)), packaging);
}

// ////////////////////////////////////////////////////////////////////////////
function questHard(ws, options, parameters) {
  ws.NNListen = false;
  let skazanoe = '';
  let x = false;
  let xString = false;
  let y = false;
  let yString = false;
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
      if (!y) {
        yString = searchTime(ws.ClientSay);
        if (yString) {
          y = true;
        } else if (question) {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f1')));
          question = false;
        }
      }
      if (!z) {
        //console.log(`parameters ${parameters}***`);
        if (parameters != '') {
          z = true;
        } else if (question) {
          note(ws, xString, yString, options);
          clearInterval(int);
        }
      }
      if (x && y && z) {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
        parameters = parameters.join(' ');
        saveResult(xString, yString, parameters, options);
        clearInterval(int);
        ws.NNListen = true;
      }
    }
  //  }
  }, 1000);
}
// /////////////////////////////////////////////////////////////////////////////
function Quest(ws, option, parameters) {
  switch (option) {
    case '1':
      questHard(ws, option, parameters);
      break;
    case '2':
      questHard(ws, option, parameters);
      break;
    case '3':
      questSimple(ws, parameters);
      break;
    case '4':
      questSpecial(ws);
      break;
    case '5':
      questHard(ws, option, parameters);
      break;
    case '6':
      closedSimpleQuest(ws, parameters);
      break;
    case '7':
      postponeSimpleQuest(ws, parameters);
      break;
    default:
      console.log('error option');
  }
}
module.exports.Quest = Quest;
