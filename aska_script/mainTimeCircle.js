const fs = require('fs');
const socket = require('./webSocketOnMessage');
const { QuestPart2 } = require('./commands/Quest/QuestPart2');
const { QuestPart3 } = require('./commands/Quest/QuestPart3');
const { QuestPartSimple } = require('./commands/Quest/QuestPartSimple');
const { LifeCirclesNapominanie } = require('./commands/LifeCircles/askForCircle');
// const { sendNotification, getNotificationID } = require('./notification/pushNotification');
// //////////////////////////////////////
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
    }
  }
}
// //////////////////////////////////////////////////////////////////////////////
const shortInterval = function shortInterval(ws, arrQuests) {
  // короткий интервал обслуживает запуст нескольких заданий поряд
  let [first] = arrQuests.splice(0, 1);
  switchFunc(ws, first);
  //
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
};
// //////////////////////////////////////////////////////////////////////////////
const checkQuests = function checkQuests(ws) {
  // Текущее время
  let timeNow = 0;
  timeNow = Date.parse(new Date());
  // Прогрузка файлов
  let finalArray = [];
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
  // проверка наличия лайф циклов

  arrLifeCircle = arrLifeCircle.filter(v => timeNow >= v.remind)
    .reduce((a, b) => {
      a.words += `${b.words[0]}, `;
      return a;
    }, {
      startWith: 'LifeCircle',
      words: ''
    });
  //  .map(v => Object.assign(v, { startWith: 'LifeCircle' }));
  // сливаем всё в один масив
  finalArray = finalArray.concat(arrEndQuests, arrQuests, arrLifeCircle);
  console.log(finalArray);
  // интервал который всё это дело будет по очереди запускать
  shortInterval(ws, finalArray);
};
// //////////////////////////////////////////////////////////////////////////////
// Функция которая работает при подключении клиента
// //////////////////////////////////////////////////////////////////////////////
const checkAssignments = function checkAssignments(ws) {
  // Запускаем проверку актуальных заданий
  checkQuests(ws);
  // и интервал ипроверки
  /*
  const checkInterval = 5; // min
  const int = setInterval(() => {
    if (ws.NNListen) {
      checkQuests(ws);
    }
    ws.closeTimeInterval ? clearInterval(int) : '';
  }, 60000 * checkInterval);
  */
};
module.exports.checkAssignments = checkAssignments;

// /////////////////////////////////////////////////////////////////////////////
// Функция запуска уведомлений
// /////////////////////////////////////////////////////////////////////////////

const mainTimeCircle = function mainTimeCircle(ws) {
  // первая часть это нашы задания
  const morning = 6;
  const midday = 12;
  const evening = 21;
  const zazor = 1;
  const houersNow = new Date().getHours();
  let howLong = 0;
  if (morning > houersNow || houersNow >= evening) {
    console.log('morning');
    howLong = morning + zazor;
  } else if (midday > houersNow) {
    console.log('midday');
    howLong = midday + zazor;
  } else if (evening > houersNow) {
    console.log('evening');
    howLong = evening + zazor;
  }
  const x = new Date();
  x.setHours(howLong);
  x.setMinutes(0);
  howLong < houersNow ? x.setDate(x.getDate() + 1) : '';
  const timeTest = Date.parse(x);
  // console.log(`howLong = ${howLong}`);
  // console.log(`houersNow = ${houersNow}`);
  // console.log(`timeTest = ${timeTest}`);
  // console.log(`timeTest = ${new Date(timeTest)}`);

  let arrQuests = readFile();
  arrQuests = arrQuests.filter(v => Date.now() < v.startDate && v.type !== 'SIMPLE');
  arrQuests = arrQuests.filter(v => timeTest >= v.startDate && v.type !== 'SIMPLE');
  console.log(arrQuests);
  if (arrQuests.length > 0) {
    arrQuests = arrQuests.map((v) => {
      if (v.type === 'HARD') {
        v.say = AskaSC.hard;
      } else {
        v.say = AskaSC.simple;
      }
      return v;
    });
    socket.send(ws, 'quest', arrQuests);
  }
};

module.exports.mainTimeCircle = mainTimeCircle;
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////// Евент регестрирующий Sleep mode ////////////////
// /////////////////////////////////////////////////////////////////////////////
const idleInterval = function idleInterval(ws) {
  console.log('/// START FUNCTION idleInterval()')
  let pastTime = Date.now();
  let symtime = 0;
  // let onetime = true;
  ws.idleInterval = setInterval(() => {
    let now = Date.now();
    pastTime += 1500;
    // console.log(`pastTime = ${pastTime} now = ${now}`);
    if (pastTime < now) {
      symtime += now - pastTime;
      console.log('наш пациэнт '+(now - pastTime));
      if (symtime > 1111000) {
        console.log('Отправил запрос на ультра звук');
        // onetime = false;
        checkAssignments(ws)
        socket.send(ws, 'clientTimeout', JSON.stringify(['опа опа', 15]));
      }
      // mainTimeCircle(ws);
      // checkAssignments(ws);
      pastTime = now;
    } else {
      pastTime = now;
    }
  }, 1000);
};
module.exports.idleInterval = idleInterval;
