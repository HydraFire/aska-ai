const fs = require('fs');
const asyncAsk = require('../../asyncAsk');
const socket = require('../../webSocketOnMessage');
const { checkURL } = require('../../saveAska');
const { saveVictory, saveObjtoFile } = require('./QuestInstrument');
const mainTimeCircle = require('../../mainTimeCircle');
// ///////////////////////////////////////
// //////////////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// ////////////////////////////////////////////////////////////////////////////
function prepairQuest(obj, num) {
  obj.TimeInterval = num;
  obj.startDate += ((num * 3600000) - 300000);
  saveObjtoFile(obj);
}

function setQuestInterval(ws, obj) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          socket.send(ws, 'aska', checkURL(`${asyncAsk.whatToSay(AskaSC, 'setQuestIntervalDone')} ${ws.ClientSay}`));
          prepairQuest(obj, parseFloat(ws.ClientSay));
        },
        words: [''],
        isNumber: true,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'setQuestIntervalerr')));
    });
  });
}

function questInfinityAsk(ws, obj) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          if (obj.TimeInterval) {
            socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'qIAyesAnswer')));
            prepairQuest(obj, obj.TimeInterval);
          } else {
            setQuestInterval(ws, obj);
          }
        },
        words: AskaSC.qIAyes,
        end: true
      },
      {
        func: () => {
          asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'qIAnoAnswer')), mainTimeCircle.shortInterval);
          saveVictory(obj);
        },
        words: AskaSC.qIAno,
        end: true
      },
      {
        func: () => {
          setQuestInterval(ws, obj);
        },
        words: AskaSC.qIAchange,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'qIAdef')));
    });
  });
}

function QuestPartSimple(ws, obj) {
  function packaging() {
    saveVictory(obj);
    mainTimeCircle.shortInterval(ws);
  };
  if (obj.type === 'LITE_Infinity') {
    asyncAsk.readEndWait(ws, obj.quest, questInfinityAsk, obj);
  } else {
    asyncAsk.readEndWait(ws, obj.quest, packaging);
  }
}
module.exports.QuestPartSimple = QuestPartSimple;
