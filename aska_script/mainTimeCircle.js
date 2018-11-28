const fs = require('fs');
const socket = require('./webSocketOnMessage');
const { QuestPart2 } = require('./commands/Quest/QuestPart2');
const { QuestPart3 } = require('./commands/Quest/QuestPart3');
const { QuestPartSimple } = require('./commands/Quest/QuestPartSimple');
const { LifeCirclesNapominanie } = require('./commands/LifeCircles/askForCircle');
const { checkArray } = require('./saveAska');
const { checkDate, sayWhatYouNeed } = require('./commands/System/systemNotification');
// const { sendNotification, getNotificationID } = require('./notification/pushNotification');
// //////////////////////////////////////
let displayOn = false;
let lastTime = 0;
let arrShortIntervalBuffer = [];
// //////////////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
const filepath = './data/QuestData.json';
const filepathLifeCircle = './data/LifeCirclesData.json';
// ///////////////////////////////////////////////////////////////////////////
function readFileLifeCircle() {
  try {
    return JSON.parse(fs.readFileSync(filepathLifeCircle));
  } catch (err) {
    return [];
  }
}
// /////////////////////////////////////////////////////////////////////////////
function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    const obj = [{
      startDate: Date.parse(new Date()),
      quest: 'test'
    }];
    fs.writeFileSync(filepath, JSON.stringify(obj), 'utf8');
    return obj;
  }
}

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
        LifeCirclesNapominanie(ws, v);
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
const checkQuests = function checkQuests(ws) {
  // Текущее время
  let timeNow = 0;
  timeNow = Date.parse(new Date());
  // Прогрузка файлов
  let finalArray = [];
  let systemNotif = '';
  let arrQuests = readFile();
  let arrEndQuests = JSON.parse(JSON.stringify(arrQuests));
  let arrLifeCircle = readFileLifeCircle();
  //

  // проверка наличия окончания задания
  //
  arrEndQuests = arrEndQuests.filter(v => timeNow >= v.endDate)
    .map(v => Object.assign(v, { startWith: 'QuestPart3' }));
  // проверка наличия заданий и запуск короткого интервала если заданий больше одного
  arrQuests = arrQuests.filter(v => timeNow >= v.startDate)
    .map(v => Object.assign(v, { startWith: 'QuestPart2' }));
  // проверка утрений разговор
  systemNotif = checkDate();
  // проверка наличия лайф циклов
  arrLifeCircle = arrLifeCircle.filter(v => timeNow >= v.remind)
    .map(v => ({ startWith: 'LifeCircle', words: v.words[0] }));
  /*
    arrLifeCircle = arrLifeCircle.filter(v => timeNow >= v.remind)
      .reduce((a, b) => {
        a.words += `${b.words[0]}, `;
        return a;
      }, {
        startWith: 'LifeCircle',
        words: ''
      });
  */
  //  .map(v => Object.assign(v, { startWith: 'LifeCircle' }));
  // сливаем всё в один масив
  finalArray = finalArray.concat(systemNotif, arrEndQuests, arrQuests, arrLifeCircle);
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
const checkAssignments = function checkAssignments(ws) {
  // Запускаем проверку актуальных заданий
  if (Date.now() > lastTime) {
    lastTime = Date.now() + 60000;
    displayOn = true;
    checkQuests(ws);
  }
};
module.exports.checkAssignments = checkAssignments;

function lifeCircleSound(ws) {
  let arrQuests = JSON.parse(fs.readFileSync(filepathLifeCircle));
  arrQuests = arrQuests.filter(v => Date.now() > v.remind);
  if (arrQuests.length > 0) {
    console.log(arrQuests);
    socket.send(ws, 'aska', '50Hz');
  }
}
// /////////////////////////////////////////////////////////////////////////////
// Функция запуска уведомлений
// /////////////////////////////////////////////////////////////////////////////
const mainTimeCircle = function mainTimeCircle(ws) {
  const timeTest = Date.now() + (30 * 60 * 1000);
  // x.setHours(howLong);
  // x.setMinutes(0);
  // howLong < houersNow ? x.setDate(x.getDate() + 1) : '';
  // const timeTest = Date.parse(x);
  // console.log(`howLong = ${howLong}`);
  // console.log(`houersNow = ${houersNow}`);
  // console.log(`timeTest = ${timeTest}`);
  // console.log(`timeTest = ${new Date(timeTest)}`);

  let arrQuests = readFile();
  arrQuests = arrQuests.filter(v => Date.now() < v.startDate && v.type !== 'SIMPLE');
  arrQuests = arrQuests.filter(v => timeTest >= v.startDate && v.type !== 'SIMPLE');
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
  lifeCircleSound(ws);
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
      const sum = (now - pastTime) / 1000 | 0;
      const min = sum / 60 | 0;
      const sec = sum % 60;
      if (min == 0) {
        console.log(`${sec}s`);
      } else {
        console.log(`${min}m ${sec}s`);
      }

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
