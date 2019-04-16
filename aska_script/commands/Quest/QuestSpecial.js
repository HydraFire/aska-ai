const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { paramTest } = require('../LifeCircles/LifeCircles');
const { convertAllDataToSimpleQuest } = require('./QuestInstrument');

const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// ////////////////////////////////////////////////////////////////////////////
const filepathLifeCircles = './data/LifeCirclesData.json';
// ////////////////////////////////////////////////////////////////////////////

function readFile(path) {
  try {
    return JSON.parse(fs.readFileSync(path));
  } catch (err) {
    console.log(err);
    return [];
  }
}

function thirdQuestion(ws, obj, range) {
  let newText = '';
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'thirdQuestion')), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'tQ0')));
          convertAllDataToSimpleQuest(ws, obj, range, newText);
        },
        words: AskaSC.tQ2,
        end: true
      }, {
        func: () => {
          newText = '';
        },
        words: AskaSC.tQ3,
        end: false
      }, {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'fq2')));
        },
        words: AskaSC.fa,
        end: true
      }
    ], (string) => {
      newText += `${string}, `;
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'tQ1')));
    });
  });
}

function secondQuestion(ws, obj) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'secondQuestion')), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'sq0')));
          thirdQuestion(ws, obj, parseFloat(ws.ClientSay));
        },
        words: [''],
        isNumber: true,
        end: true
      }, {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'fq2')));
        },
        words: AskaSC.fa,
        end: true
      }
    ], (string) => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'sq1')));
    });
  });
}

module.exports.questSpecial = (ws) => {
  const arr = readFile(filepathLifeCircles);
  let i;
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'firstQuestion')), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'fq0')), secondQuestion, arr[i]);
        },
        words: ['found'],
        end: true
      }, {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'fq2')));
        },
        words: AskaSC.fa,
        end: true
      }
    ], (string) => {
      i = paramTest(arr, string);
      if (i !== -1) {
        ws.ClientSay = 'found';
      } else {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'fq1')));
      }
    });
  });
}
