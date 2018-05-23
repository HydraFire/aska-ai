let serverTag = null;
let clientTag = null;
const dlina = 35;

function start() {
  serverTag = document.querySelector('.serverLog');
  clientTag = document.querySelector('.clientLog');
}
function logS(str) {
  if (serverTag.childNodes.length > dlina) {
    serverTag.childNodes[0].remove();
  }

  const p = document.createElement('p');
  p.innerHTML = str;
  serverTag.appendChild(p);
}
function logC(str) {
  if (clientTag.childNodes.length > dlina) {
    clientTag.childNodes[0].remove();
  }
  const p = document.createElement('p');
  if (typeof str !== 'string') {
    str = JSON.stringify(str);
  }
  p.innerHTML = str;
  clientTag.appendChild(p);
}
function logCE(str) {
  if (clientTag.childNodes.length > dlina) {
    clientTag.childNodes[0].remove();
  }
  const p = document.createElement('p');
  if (typeof str !== 'string') {
    str = JSON.stringify(str);
  }
  p.innerHTML = str;
  p.style.color = '#f33';
  clientTag.appendChild(p);
}

export default {
  start, logS, logC, logCE
};
