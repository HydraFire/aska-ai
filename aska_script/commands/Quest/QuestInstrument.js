const { textToTime, normalizeTimeZone } = require('../../textToTime');
const fs = require('fs');

const filepath = './data/QuestData.json';
const fileVictorypath = './data/QuestVictoryData.json';

function saveResult(day, time, text, options) {
  if (options === '1') {
    options = 'HARD';
  } else if (options === '2') {
    options = 'LITE';
  } else {
    options = 'SIMPLE';
  }
  const str = day + time;
  const normalDate = Date.parse(new Date(str));
  const obj = {
    startDate: normalizeTimeZone(normalDate),
    endDate: 9999999999999,
    quest: text,
    type: options
  };
  const arr = JSON.parse(fs.readFileSync(filepath));
  arr.push(obj);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');
}
module.exports.saveResult = saveResult;
// /////////////////////////////////////////////////////////////////////////////
function saveObjtoFile(obj) {
  delete obj.startWith;
  const arr = JSON.parse(fs.readFileSync(filepath));
  const arrIndex = arr.findIndex(v => v.quest === obj.quest);
  arr.splice(arrIndex, 1, obj);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');
}
// /////////////////////////////////////////////////////////////////////////////
function copyToVictoryFile(obj) {
  delete obj.startWith;
  delete obj.startDate;
  delete obj.endDate;
  delete obj.type;

  const arr = JSON.parse(fs.readFileSync(filepath));
  const arrIndex = arr.findIndex(v => v.quest === obj.quest);
  arr.splice(arrIndex, 1);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');

  let arr2 = [];
  try {
    arr2 = JSON.parse(fs.readFileSync(fileVictorypath));
  } catch (err) {
    console.log('NewFile');
  }
  arr2.push(obj);
  fs.writeFileSync(fileVictorypath, JSON.stringify(arr2), 'utf8');
}
module.exports.copyToVictoryFile = copyToVictoryFile;
// /////////////////////////////////////////////////////////////////////////////
function randomaizeTime() {
  return Date.parse(new Date()) + (Math.random() * 600000000 | 0);
}
// /////////////////////////////////////////////////////////////////////////////
const saveTimeEnd = function saveTimeEnd(obj) {
  obj.endDate = randomaizeTime();
  obj.info = obj.startDate;
  obj.startDate = 9999999999999;
  saveObjtoFile(obj);
};
module.exports.saveTimeEnd = saveTimeEnd;
// /////////////////////////////////////////////////////////////////////////////
const saveExcuse = function saveExcuse(obj, text) {
  if (obj.excuse) {
    obj.excuse = `${obj.excuse}, ${text}`;
  } else {
    obj.excuse = text;
  }
  saveObjtoFile(obj);
};
module.exports.saveExcuse = saveExcuse;
// /////////////////////////////////////////////////////////////////////////////
const saveTimeStart = function saveTimeStart(obj, day, time) {
  const str = day + time;
  obj.startDate = Date.parse(new Date(str));
  saveObjtoFile(obj);
};
module.exports.saveTimeStart = saveTimeStart;
// /////////////////////////////////////////////////////////////////////////////
const saveVictory = function saveVictory(obj) {
  const arr = JSON.parse(fs.readFileSync(filepath));
  const arrIndex = arr.findIndex(v => v.quest === obj.quest);
  arr.splice(arrIndex, 1);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');
};
module.exports.saveVictory = saveVictory;
