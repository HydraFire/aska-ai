const fs = require('fs');
const socket = require('./webSocketOnMessage');
const { QuestPart2 } = require('./commands/Quest/QuestPart2');
const { QuestPart3 } = require('./commands/Quest/QuestPart3');
const { QuestPartSimple, prepairQuest } = require('./commands/Quest/QuestPartSimple');
const  askForCircle = require('./commands/LifeCircles/askForCircle');
const LifeCircles = require('./commands/LifeCircles/LifeCircles');
const { sayAction } =require('./commands/WebScraping/WebScraping');
const { checkArray } = require('./saveAska');
const { checkDate, sayWhatYouNeed } = require('./commands/System/systemNotification');

// ///////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
const filepath = './data/QuestData.json';
const filepathLifeCircle = './data/LifeCirclesData.json';
const filepathActions = './data/actions.json';
// ///////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////
let displayOn = false;
let lastTime = 0;
let arrShortIntervalBuffer = [];
let optimazeReadFileLifeCircle = [];
reloadFileLifeCircle();
let optimazeReadFileQuest = [];
reloadFileQuest();
let optimazeReadFileActions = [];
readFileActions();
// //////////////////////////////////////
function readFileActions() {
  try {
    optimazeReadFileActions = JSON.parse(fs.readFileSync(filepathActions));
  } catch (err) {
    console.log(err);
  }
}
module.exports.readFileActions = readFileActions;
function reloadFileLifeCircle() {
  try {
    optimazeReadFileLifeCircle =  JSON.parse(fs.readFileSync(filepathLifeCircle));
  } catch (err) {
    console.log(err);
  }
}
module.exports.reloadFileLifeCircle = reloadFileLifeCircle;
// /////////////////////////////////////////////////////////////////////////////
function reloadFileQuest() {
  try {
    optimazeReadFileQuest = JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    const obj = [{
      startDate: Date.parse(new Date()),
      quest: 'test'
    }];
    fs.writeFileSync(filepath, JSON.stringify(obj), 'utf8');
    optimazeReadFileQuest = obj;
  }
}
module.exports.reloadFileQuest = reloadFileQuest;
function switchFunc(ws, v) {
  if (v) {
    switch (v.startWith) {
      case 'QuestPart3':
        QuestPart3(ws, v);
        break;
      case 'QuestPart2':
        if (v.type === 'HARD') {
          QuestPart2(ws, v);
        } else {
          QuestPartSimple(ws, v);
        }
        break;
      case 'LifeCircle':
        askForCircle.LifeCirclesNapominanie(ws, v);
        break;
      case 'WebScraping':
        sayAction(ws, v);
        break;
      case 'System':
        sayWhatYouNeed(ws, v);
        break;
    }
  }
}
// //////////////////////////////////////////////////////////////////////////////
const shortInterval = function shortInterval(ws) {
  // короткий интервал обслуживает запуст нескольких заданий поряд
  if (arrShortIntervalBuffer.length != 0) {
    let [first] = arrShortIntervalBuffer.splice(0, 1);
    if (Object.keys(first).length == 0) {
      [first] = arrShortIntervalBuffer.splice(0, 1);
    }
    switchFunc(ws, first);
  }
  // console.log(arrShortIntervalBuffer);
  /*
  const int = setInterval(() => {
    if (ws.NNListen) {
      if (arrQuests.length !== 0) {
        [first] = arrQuests.splice(0, 1);
        switchFunc(ws, first);
      } else {
        clearInterval(int);
      }
    }
    ws.closeAllInterval ? clearInterval(int) : '';
  }, 5000);
  */
};
module.exports.shortInterval = shortInterval;
// //////////////////////////////////////////////////////////////////////////////
const checkQuests = function checkQuests(ws, gps) {
  // Текущее время
  let timeNow = Date.now();
  // Прогрузка файлов
  let finalArray = [];
  // проверка наличия окончания задания
  let arrEndQuests = optimazeReadFileQuest.filter(v => timeNow >= v.endDate)
    .map(v => Object.assign(v, { startWith: 'QuestPart3' }));
  // проверка наличия заданий и запуск короткого интервала если заданий больше одного
  let arrQuests = optimazeReadFileQuest.filter(v => {
      if (timeNow >= v.startDate) {
        if (v.notThisDay) {
          if (v.notThisDay.some( day => day == new Date().getDay())) {
            prepairQuest(v, v.TimeInterval);
            return false;
          }
        }
        return true;
      }
      return false;
    })
    .filter(v => {
      if (v.gps) {
        console.log(`${v.gps[0]} == ${gps[0]} && ${v.gps[1]} == ${gps[1]}`);
        if (v.gps[0] == gps[0] && v.gps[1] == gps[1]) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    })
    .map(v => Object.assign(v, { startWith: 'QuestPart2' }));
  //
  let arrActions = optimazeReadFileActions.filter(v => v.readyToSay)
    .map(v => Object.assign(v, { startWith: 'WebScraping' }));
  // проверка утрений разговор
  let systemNotif = checkDate();
  // проверка наличия лайф циклов

  let arrLifeCircle = optimazeReadFileLifeCircle.filter(v => timeNow >= v.remind)
    .map(v => ({ startWith: 'LifeCircle', words: v.words[0], data: v.incident }));

  // сливаем всё в один масив
  finalArray = finalArray.concat(systemNotif, arrEndQuests, arrQuests, arrActions, arrLifeCircle);
  //console.log(finalArray);
  // интервал который всё это дело будет по очереди запускать
  if (finalArray.length != 0) {
    arrShortIntervalBuffer = finalArray;
    shortInterval(ws);
  }
};
// //////////////////////////////////////////////////////////////////////////////
// Функция которая работает при подключении клиента
// //////////////////////////////////////////////////////////////////////////////
const checkAssignments = function checkAssignments(ws, gps) {
  // Запускаем проверку актуальных заданий
  if (Date.now() > lastTime && !LifeCircles.statusOfInterval()) {
    lastTime = Date.now() + 60000;
    displayOn = true;
    checkQuests(ws, gps);
  }
};
module.exports.checkAssignments = checkAssignments;
// /////////////////////////////////////////////////////////////////////////////
// Функция запуска уведомлений
// /////////////////////////////////////////////////////////////////////////////
const mainTimeCircle = function mainTimeCircle(ws) {
  const timeTest = Date.now() + (10 * 60 * 1000);
  // x.setHours(howLong);
  // x.setMinutes(0);
  // howLong < houersNow ? x.setDate(x.getDate() + 1) : '';
  // const timeTest = Date.parse(x);
  // console.log(`howLong = ${howLong}`);
  // console.log(`houersNow = ${houersNow}`);
  // console.log(`timeTest = ${timeTest}`);
  // console.log(`timeTest = ${new Date(timeTest)}`);
  let arrActions = optimazeReadFileActions.filter(f => f.readyToSay && f.prioritySay === 'high')
  .map(v => {
    v.startDate = Date.now();
    v.quest = v.name;
    v.type = 'WEB';
    return v;
  });
  let arrQuests = optimazeReadFileQuest.filter(v => Date.now() < v.startDate && v.type !== 'SIMPLE' && v.type !== 'SIMPLE_SPECIAL')
    .filter(v => timeTest >= v.startDate && v.type !== 'SIMPLE' && v.type !== 'SIMPLE_SPECIAL')
    .filter(v => {
      if (v.notThisDay) {
        return !v.notThisDay.some( day => day == new Date().getDay())
      } else {
        return true;
      }
    })
    .concat(arrActions);
  if (arrQuests.length > 0) {
    //console.log(arrQuests);
    arrQuests = arrQuests.map((v) => {
      if (v.type === 'HARD') {
        v.say = checkArray(AskaSC.hard);
      } else {
        v.say = checkArray(AskaSC.simple);
      }
      return v;
    });
    socket.send(ws, 'aska', '20Hz');
    socket.send(ws, 'quest', arrQuests);
  }
};

module.exports.mainTimeCircle = mainTimeCircle;
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////// Эвент регестрирующий Sleep mode ////////////////
// /////////////////////////////////////////////////////////////////////////////
const idleInterval = function idleInterval(ws) {
  console.log('/// START FUNCTION idleInterval()');
  let pastTime = Date.now();
  // let sumtime = 0;
  // let onetime = true;
  ws.idleInterval = setInterval(() => {
    const now = Date.now();
    pastTime += 10500;
    // console.log(`pastTime = ${pastTime} now = ${now}`);
    if (pastTime < now) {
      // sumtime += now - pastTime;
      /*
      const sum = (now - pastTime) / 1000 | 0;
      const min = sum / 60 | 0;
      const sec = sum % 60;
      if (min == 0) {
        console.log(`${sec}s`);
      } else {
        console.log(`${min}m ${sec}s`);
      }
      */
      if (displayOn) {
        displayOn = false;
        console.log('chargeImpulse');
        socket.send(ws, 'chargeImpulse', 'chargeImpulse');
      }
      mainTimeCircle(ws);
      pastTime = now;
    } else {
      pastTime = now;
    }
    // mainTimeCircle(ws);
  }, 1000);
};
module.exports.idleInterval = idleInterval;
