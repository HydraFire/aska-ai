const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// ////////////////////////////////////////////////////////////
const bufferPath = './data/commands/DynamicMemory/buffer.json';
// ////////////////////////////////////////////////////////////
function findIntObj( arr, type, string) {
  return arr.filter(f => f[type].some(s => s == string))
}

function createId(arr) {
  let newId = Math.random()*100000|0;
  if (arr.some(s => s.id == newId)){
    return createId(arr)
  } else {
    return newId
  }
}

function margeIO(objST, objRE, arr) {
  objST.stimulus = objST.stimulus.concat(objRE.stimulus)
  objST.reaction = objST.reaction.concat(objRE.reaction)
  arr.splice(arr.findIndex(v=> v.id == objRE.id), 1)
}
// ///////////////////////////////////////////////////////////
function saveRegularity(nowSay, prevSay) {
  console.log(`nowSay=${nowSay} prevSay=${prevSay}`);

  let fileArray = JSON.parse(fs.readFileSync(bufferPath));

  let arrSameStimulus = findIntObj(fileArray, 'stimulus', prevSay) // reaction
  let arrSameReaction = findIntObj(fileArray, 'reaction', nowSay) // reaction

  if (       arrSameStimulus.length == 1 && arrSameReaction == 0) {
    arrSameStimulus[0].reaction.push(nowSay)
  } else if (arrSameStimulus.length == 0 && arrSameReaction == 1) {
    arrSameReaction[0].stimulus.push(nowSay)
  } else if (arrSameStimulus.length == 1 && arrSameReaction == 1) {
    arrSameStimulus[0].id != arrSameReaction[0].id ? margeIO(arrSameStimulus[0], arrSameReaction[0], fileArray):'';
  } else {
    fileArray.push({
      id: createId(fileArray),
      stimulus:[prevSay],
      reaction:[nowSay]
    })
  }
  console.log(fileArray);
  fs.writeFileSync(bufferPath, JSON.stringify(fileArray), 'utf8');
}

function deleteRegularity(prevSay, askaAnswer) {
  console.log(`nowSay=${prevSay} askaAnswer=${askaAnswer}`);
  let fileArray = JSON.parse(fs.readFileSync(bufferPath));
  let obj = fileArray.filter(f => f.reaction.some(s => s == askaAnswer))
  if (obj.reaction.length > 1) {
    obj.reaction.splice(obj.reaction.findIndex(v => v == askaAnswer), 1)
  } else {
    fileArray.splice(fileArray.findIndex(v=> v.id == obj.id), 1)
  }
  fs.writeFileSync(bufferPath, JSON.stringify(fileArray), 'utf8');
}

module.exports.saveRegularity = saveRegularity
module.exports.deleteRegularity = deleteRegularity
