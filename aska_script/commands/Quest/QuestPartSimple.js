const asyncAsk = require('../../asyncAsk');
const { saveVictory } = require('./QuestInstrument');
const mainTimeCircle = require('../../mainTimeCircle');
// ///////////////////////////////////////
// //////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
function QuestPartSimple(ws, obj) {
  const packaging = function packaging() {
    saveVictory(obj);
    mainTimeCircle.shortInterval(ws);
  };
  asyncAsk.readEndWait(ws, obj.quest, packaging);
}
module.exports.QuestPartSimple = QuestPartSimple;
