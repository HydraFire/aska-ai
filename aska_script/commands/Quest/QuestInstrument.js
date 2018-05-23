const { textToTime, normalizeTimeZone } = require('../../textToTime');
const fs = require('fs');

const filepath = './data/QuestData.json';
const fileVictorypath = './data/QuestVictoryData.json';

function saveResult(day, time, text) {
  const str = day + time;
  const normalDate = Date.parse(new Date(str));
  const obj = {
    startDate: normalizeTimeZone(normalDate),
    endDate: 9999999999999,
    quest: text
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
  delete obj.endDate;

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
// /////////////////////////////////////////////////////////////////////////////

const saveTimeEnd = function saveTimeEnd(obj, text) {
  obj.endDate = textToTime(text);
  obj.startDate = 9999999999999;
  saveObjtoFile(obj);
};
module.exports.saveTimeEnd = saveTimeEnd;
// /////////////////////////////////////////////////////////////////////////////
const saveExcuse = function saveExcuse(obj, text) {
  obj.excuse = text;
  saveObjtoFile(obj);
};
module.exports.saveExcuse = saveExcuse;
// /////////////////////////////////////////////////////////////////////////////
const saveTimeStart = function saveTimeStart(obj, text) {
  obj.startDate = textToTime(text);
  saveObjtoFile(obj);
};
module.exports.saveTimeStart = saveTimeStart;
// /////////////////////////////////////////////////////////////////////////////
const saveVictory = function saveVictory(obj, text) {
  obj.victory = text;
  copyToVictoryFile(obj);
};
module.exports.saveVictory = saveVictory;
