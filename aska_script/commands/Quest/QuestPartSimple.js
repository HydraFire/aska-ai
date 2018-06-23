const asyncAsk = require('../../asyncAsk');
const { saveVictory } = require('./QuestInstrument');
// ///////////////////////////////////////
// //////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
function QuestPartSimple(ws, obj) {
  const packaging = function packaging() {
    saveVictory(obj);
  };
  asyncAsk.readEndWait(ws, obj.quest, packaging);
}
module.exports.QuestPartSimple = QuestPartSimple;
