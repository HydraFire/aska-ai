const fs = require('fs');
const asyncAsk = require('../../asyncAsk');
const socket = require('../../webSocketOnMessage');
const { checkURL } = require('../../saveAska');
const { saveVictory, saveObjtoFile } = require('./QuestInstrument');
const { normalizeTimeZone } = require('../../textToTime');
const mainTimeCircle = require('../../mainTimeCircle');
// ///////////////////////////////////////
// //////////////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// ////////////////////////////////////////////////////////////////////////////
function getMinutes(obj) {
  let lastTime = new Date(obj.startDate);
  return [lastTime.getHours(), lastTime.getMinutes()];
}
function getSameMinutes(timePlus, hm) {
  let r = new Date(Date.now() + timePlus).setHours(hm[0]);
  return new Date(r).setMinutes(hm[1]);
}
// obj.skipToday когда спрашивает можно сказать "пропускай этот день недели";

function prepairQuest(obj, num) {
  obj.TimeInterval = num;
  obj.startDate = normalizeTimeZone(getSameMinutes(num * 3600000, getMinutes(obj)));
  console.log(new Date(obj.startDate));
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
            //console.log(`obj.TimeInterval = ${obj.TimeInterval}`);
            //console.log(obj)
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
