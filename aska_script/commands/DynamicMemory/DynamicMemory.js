const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { saveRegularity, deleteRegularity } = require('./instrument');
// ////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/DynamicMemory/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));


function addRegularity(ws) {
    // - I say                                      // addRegularity: ["как мне следует на это реагировать?"]
    //                                                 wordsBreak: ["отмена"]
    //                                                 wordsBreakSay:["ладно"]
    //                                              // dontSatThat: ["больше не буду"]
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'wordsBreakSay')));
        },
        words: AskaSC.wordsBreak,
        end: true
      },
      {
        func: () => {
          saveRegularity(ws.ClientSay, ws.ClientSayArray[2])
        },
        words: [""],
        whatever: true,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'internetPayGoOn')));
    });
  });
}

function dontSatThat(ws) {
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
  deleteRegularity(ws.ClientSayArray[1], ws.askaAnswer)
}
function sayRegularity(ws, data) {
  socket.send(ws, 'aska', asyncAsk.whatToSay(data, 'reaction'));
}
// /////////////////////////////////////////////////////////////////////////////
function DynamicMemory(ws, options, param, data) {
  switch (options) {
    case '1':
      addRegularity(ws);
      break;
    case '2':
      dontSatThat(ws);
      break;
    case '0':
      sayRegularity(ws, data);
      break;
  }
}
module.exports.DynamicMemory = DynamicMemory;
