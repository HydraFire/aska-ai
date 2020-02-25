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
function searchGpsCoords(string) {
  let arr = string.split(' ');
  let pickCoords = false
  let arrCoords = [{
    words: AskaSC.gpsHome,
    x: 50.435256,
    y: 30.620723
  },{
    words: AskaSC.gpsWork,
    x: 50.441858,
    y: 30.520930
  },{
    words: AskaSC.gpsNovus0,
    x: 50.437989,
    y: 30.621579
  },{
    words: AskaSC.gpsNovus1,
    x: 50.447592,
    y: 30.602243
  }]
  for (let i = 0; i < arrCoords.length; i++) {
    if (arr.filter(f => arrCoords[i].words.some(s=> s == f) ).length > 0) {
      pickCoords = [arrCoords[i].x, arrCoords[i].y]
    }
  }
  return pickCoords
}
// /////////////////////////////////////////////////////////////////////////////
function note(ws, day, time, gpsCoord) {
  function defaultFunction(string) {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x5')));
  };

  function attentionCheck() {
      saveResult(day, time, ws.ClientSay, '3', gpsCoord);
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: attentionCheck,
        words: [''],
        whatever: true,
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
  let gps = false;
  let gpsCoord = false;

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
      if (!gps) {
        gpsCoord = searchGpsCoords(ws.ClientSay);
        console.log('gpsCoord');
        console.log(gpsCoord);
        if (gpsCoord) {
          gps = true;
        } else {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'g0')));
          question = false;
        }
      }
      if (!z) {
        console.log(`parameters: "${parameters}"`);
        if (parameters != '') {
          z = true;
        } else if (question) {
          note(ws, xString, '04:00:00.000Z', gpsCoord);
          clearInterval(int);
        }
      }
      if (x && z && gps) {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
        parameters = parameters.join(' ');
        saveResult(xString, '04:00:00.000Z', parameters, '3', gpsCoord);
        clearInterval(int);
        ws.NNListen = true;
      }
    }
  //  }
  }, 1000);
}
module.exports.questSimple = questSimple;
