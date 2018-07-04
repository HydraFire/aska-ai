const fs = require('fs');

function chartLoad() {
  // JSON.parse(fs.readFileSync('./data/QuestVictoryData.json'));
  return {
    datasets: [{
      label: 'Bar Dataset',
      data: [10, 20, 30, 40]
    }, {
      label: 'Line Dataset',
      data: [50, 50, 50, 50],

      // Changes this dataset to become a line
      type: 'line'
    }],
    labels: ['January', 'February', 'March', 'April']
  };
}

module.exports.chartLoad = chartLoad;
