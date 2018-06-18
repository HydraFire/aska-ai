const fs = require('fs');
const { QuestPart2 } = require('./commands/Quest/QuestPart2');
const { QuestPart3 } = require('./commands/Quest/QuestPart3');
const { LifeCirclesNapominanie } = require('./commands/LifeCircles/askForCircle');
const { sendNotification, getNotificationID } = require('./notification/pushNotification');
// //////////////////////////////////////
// //////////////////////////////////////
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
        // QuestPart3(ws, v);
        break;
      case 'QuestPart2':
        QuestPart2(ws, v);
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
  console.log('rfr это')
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

const mainTimeCircle = function mainTimeCircle() {
  // первая часть это нашы задания
  console.log('Start');
  const timeNow = Date.parse(new Date());
  let arrQuests = readFile();
  arrQuests = arrQuests.filter(v => timeNow >= v.startDate);
  console.log(arrQuests);
  // Запускаем пуш уведомление
  if (arrQuests != '') {
    const id = getNotificationID();
    sendNotification(id, arrQuests[0].quest);
  }
  // Здесь мы разделим чтоб и LifeCircles работали
};
module.exports.mainTimeCircle = mainTimeCircle;
