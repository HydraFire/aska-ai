const fs = require('fs');
const asyncAsk = require('../../asyncAsk');
const socket = require('../../webSocketOnMessage');
const { checkURL } = require('../../saveAska');
const { saveVictory, saveObjtoFile } = require('./QuestInstrument');
//const { normalizeTimeZone } = require('../../textToTime');
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
function notThisDayFunc(obj) {
  obj.startDate = getSameMinutes(obj.TimeInterval * 3600000, getMinutes(obj));
  if (obj.notThisDay) {
    obj.notThisDay.push(new Date().getDay());
  } else {
    obj.notThisDay = [new Date().getDay()];
  }
  saveObjtoFile(obj);
}

function prepairQuest(obj, num) {
  obj.TimeInterval = num;
  //obj.startDate = normalizeTimeZone(getSameMinutes(num * 3600000, getMinutes(obj)));
  obj.startDate = getSameMinutes(num * 3600000, getMinutes(obj));
  saveObjtoFile(obj);
}
module.exports.prepairQuest = prepairQuest;

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
          asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'notThisDayAnswer')), mainTimeCircle.shortInterval);
          notThisDayFunc(obj); //    <-------------
        },
        words: AskaSC.notThisDay,
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

function questButtons(text) {
  const buttons = [
    {
      mainType: 'typeSimpleQuest',
      type: 'negative',
      value: text,
      name: 'перенеси на выходные',
      chartData: false
    },
    {
      mainType: 'typeSimpleQuest',
      type: 'default',
      value: text,
      name: '...'
    },
    {
      mainType: 'typeSimpleQuest',
      type: 'positive',
      value: text,
      name: 'Ясно'
    }
  ];

  return {
    content: { type:'video', data: 'test'},
    buttons
  };
}
function QuestPartSimple(ws, obj) {
  function packaging() {
    saveVictory(obj);
    mainTimeCircle.shortInterval(ws);
  };
  /*
  function noAskToRetry() {
    prepairQuest(obj, obj.TimeInterval);
    mainTimeCircle.shortInterval(ws);
  }
  */
  if (obj.type === 'LITE_Infinity') {
    if (obj.noAsk) {
      asyncAsk.readEndWait(ws, obj.quest, () => {
        prepairQuest(obj, obj.TimeInterval);
        mainTimeCircle.shortInterval(ws);
      });
    } else {
      asyncAsk.readEndWait(ws, obj.quest, questInfinityAsk, obj);
    }
  } else if (obj.type === 'SIMPLE') {
    socket.send(ws, 'aska', checkURL(`${obj.quest}`), questButtons(obj.quest));
  } else {
    asyncAsk.readEndWait(ws, obj.quest, packaging); // SIMPLE_SPECIAL and LITE
  }
}
module.exports.QuestPartSimple = QuestPartSimple;
