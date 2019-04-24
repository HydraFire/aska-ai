const fs = require('fs');
const { textToTime, normalizeTimeZone } = require('../../textToTime');
const mainTimeCircle = require('../../mainTimeCircle');
const { checkURL } = require('../../saveAska');


const filepath = './data/QuestData.json';
const fileVictorypath = './data/QuestVictoryData.json';

function saveResult(day, time, text, options) {
  if (options === '1') {
    options = 'HARD';
  } else if (options === '2') {
    options = 'LITE';
  } else if (options === '5') {
    options = 'LITE_Infinity';
  } else {
    options = 'SIMPLE';
  }
  const str = day + time;
  const normalDate = Date.parse(new Date(str));
  if (options === 'LITE_Infinity') {
    text = checkURL(text);
  }
  const obj = {
    startDate: normalizeTimeZone(normalDate),
    endDate: 9999999999999,
    quest: text,
    type: options
  };
  const arr = JSON.parse(fs.readFileSync(filepath));
  arr.push(obj);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');
  mainTimeCircle.reloadFileQuest();
}
module.exports.saveResult = saveResult;
// /////////////////////////////////////////////////////////////////////////////
function saveObjtoFile(obj) {
  delete obj.startWith;
  const arr = JSON.parse(fs.readFileSync(filepath));
  const arrIndex = arr.findIndex(v => v.quest === obj.quest);
  arr.splice(arrIndex, 1, obj);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');
  mainTimeCircle.reloadFileQuest();
}
module.exports.saveObjtoFile = saveObjtoFile;
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
  mainTimeCircle.reloadFileQuest();
  let arr2 = [];
  try {
    arr2 = JSON.parse(fs.readFileSync(fileVictorypath));
  } catch (err) {
    console.log('NewFile');
  }
  arr2.push(obj);

  arr2.sort((a, b) => {
    if (a.info > b.info) {
      return 1;
    }
    if (a.info < b.info) {
      return -1;
    }
    return 0;
  });

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
  const normalDate = Date.parse(new Date(str));
  obj.startDate = normalizeTimeZone(normalDate);
  obj.endDate = 9999999999999;
  saveObjtoFile(obj);
};
module.exports.saveTimeStart = saveTimeStart;
// /////////////////////////////////////////////////////////////////////////////
const saveVictory = function saveVictory(obj) {
  const arr = JSON.parse(fs.readFileSync(filepath));
  const arrIndex = arr.findIndex(v => v.quest === obj.quest);
  arr.splice(arrIndex, 1);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');
  mainTimeCircle.reloadFileQuest();
};
module.exports.saveVictory = saveVictory;
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
function saveSpecialResult(dateNum, tag, text) {
  const obj = {
    startDate: dateNum,
    endDate: 9999999999999,
    quest: text,
    type: 'SIMPLE',
    special: tag
  };
  const arr = JSON.parse(fs.readFileSync(filepath));
  arr.push(obj);
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');
  mainTimeCircle.reloadFileQuest();
}
// ////////////////////////////////////////////////////////////////////////////////
function approximatelyUniformDistributionRandom(arr, range) {
  //console.log('Math.floor((range / (arr.length + 1)) / 3.14) = '+ Math.floor((range / arr.length) / 3.14));
  let y = Math.floor((range / arr.length) / 3.14);
  let x = (Math.random()*range | 0) + 1;
  if (arr.every(v => {
    //console.log(`(${v} + ${y}) < ${x} = ${(v + y) < x} || (${v} - ${y}) > ${x} = ${(v - y) > x}`);
    return ((v + y) < x || (v - y) > x);
  })) {
    return x;
  }
  return approximatelyUniformDistributionRandom(arr, range);
}
// /////////////////////////////////////////////////////////////////////////////////
function nowDate() {
  const r = new Date();
  let month = r.getMonth() + 1;
  month < 10 ? month = `0${month}` : '';
  let day = r.getDate();
  day < 10 ? day = `0${day}` : '';
  return normalizeTimeZone(Date.parse(new Date(`${r.getFullYear()}-${month}-${day}T04:00:00.000Z`)));
}

function convertDateToNumber(dateNum) {
  return ((dateNum - nowDate()) / 86400000);
}

function convertNumberToDate(num) {
  return (nowDate() + (num * 86400000));
}

function searchSpecialQuest(word, range) {
  return JSON.parse(fs.readFileSync(filepath))
    .filter(v => v.special === word)
    .filter(v => v.startDate <= convertNumberToDate(range))
    .map(v => convertDateToNumber(v.startDate));
}

function numToText(num) {
  if (num === 7) {
    return `одну неделю`;
  } else if (num === 14) {
    return `две недели`;
  } else if (num === 21) {
    return `три недели`;
  } else if (num === 28){
    return `целый месяц`;
  } else {
    num += '';
    let d = num[num.length-1]
    let dd = num[num.length-2]
    if(dd == 1){num +=' дней'}else
      if(d == 0){num +=' дней'}else
        if(d == 1){num +=' день'}else
          if(d > 1&&d < 5){num +=' дня'}else
            if(d >= 5){num +=' дней'}
    return num;
  }
}

function addSayDate(obj, newDateInNum, newText) {
  if (newText.includes('value') != -1) {
    newDateInNum += (obj.incident.length - 1) + obj.startIncident;
    newText = newText.replace(', value', ` ${numToText(newDateInNum)}`);
    return newText;
  }
  return newText;
}
// /////////////////////////////////////////////////////////////////////////////
const convertAllDataToSimpleQuest = function(ws, obj, range, newText) {
  //console.log(`${obj.words[0]} ${range} ${newText}`);
  let arr = searchSpecialQuest(obj.words[0], range);
  //console.log(arr);
  let newDateInNum = approximatelyUniformDistributionRandom(arr, range);
  //console.log(newDateInNum);
  let text = addSayDate(obj, newDateInNum, newText);
  newDateInNum = convertNumberToDate(newDateInNum);
  saveSpecialResult(newDateInNum, obj.words[0], text);
}





module.exports.convertAllDataToSimpleQuest = convertAllDataToSimpleQuest;
