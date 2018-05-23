const fs = require('fs');

function getParameters(data, select) {
  const obj = JSON.parse(fs.readFileSync(`./aska_script/commands/${select}/option.json`));
  const parameters = data.split(' ').filter((v) => {
    return !obj.ignor.some((t, i) => {
      if (t === 'number') {
        if (Number.isInteger(parseFloat(v))) {
          return true;
        }
      }
      if (v === t) {
        obj.ignor.splice(i, 1);
        return true;
      }
      return false;
    });
  });
  return parameters;
}
module.exports.getParameters = getParameters;
