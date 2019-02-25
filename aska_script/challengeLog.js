const fs = require('fs');

function challengeLogLoad() {
  let arr = JSON.parse(fs.readFileSync('./data/actions.json')).map(v => ({
    quest: v.name,
    info: v.timeLastCheck,
    color: true
  }));
  return arr.concat(JSON.parse(fs.readFileSync('./data/QuestVictoryData.json')));
}
module.exports.challengeLogLoad = challengeLogLoad;
