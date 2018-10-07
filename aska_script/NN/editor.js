const fs = require('fs');

function noSystem(value) {
  if (value != 'System') {
    return JSON.parse(fs.readFileSync(`./data/commands/${value}/description.json`))
  }
  return [];
}

function editorLoad() {
  const obj = {};
  const list = fs.readdirSync('./data/commands');
  list.forEach((v) => {
    const x = JSON.parse(fs.readFileSync(`./data/commands/${v}/option.json`));
    obj[v] = {
      description: noSystem(v)
    };
    obj[v] = Object.assign(obj[v], x);
  });
  return obj;
}

module.exports.editorLoad = editorLoad;
// /////////////////////////////////////////////////////////////////////////////
/*
function createDiff() {
  const obj = {};
  const list = fs.readdirSync('./data/commands');
  list.forEach((v) => {
    obj[v] = {
      description: fs.readFileSync(`./data/commands/${v}/description.json`).length,
      option: fs.readFileSync(`./data/commands/${v}/option.json`).length
    };
  });
  return obj;
}


function createDifffromClient(data) {
  return Object.keys(data).reduce((a, b) => {
    return Object.assign(a, { [b]: JSON.stringify(data[b].description).length });
  }, {});
}
*/
function editorSave(data) {
  Object.keys(data).forEach((v) => {
    const obj = data[v];
    if (v != 'System') {
      fs.writeFileSync(`./data/commands/${v}/description.json`, JSON.stringify(obj.description), 'utf8');
    }
    delete obj.description;
    fs.writeFileSync(`./data/commands/${v}/option.json`, JSON.stringify(obj), 'utf8');
  });
  return 'done';
}


module.exports.editorSave = editorSave;
