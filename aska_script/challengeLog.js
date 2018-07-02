const fs = require('fs');

function challengeLogLoad() {
  return JSON.parse(fs.readFileSync('./data/QuestVictoryData.json'));
}

module.exports.challengeLogLoad = challengeLogLoad;
