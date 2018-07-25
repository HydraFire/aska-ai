import aska from '../speechSynthesizer';
/* eslint-disable */
const read = function read() {
  let extensionId = 'jaolhkfjhkkakocggfihkelgobjbclol';
  chrome.runtime.sendMessage(
    extensionId,
    { method: 'getClipboard' },
    function(response) {
      aska(response);
    }
  );
}
// /////////////////////////////////////////////////////////////////////////////
const translate = function translate() {
  let extensionId = 'jaolhkfjhkkakocggfihkelgobjbclol';
  chrome.runtime.sendMessage(
    extensionId,
    { method: 'getClipboard' },
    function(response) {
      let x = new XMLHttpRequest();
      x.open("GET", 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q='+encodeURI(response), true);
      x.onload = function () {
        let n = JSON.parse(x.responseText)[0].map(v=>v[0]).join(',');
        aska(n)
      }
      x.send(null);
    }
  );
}
export { translate, read }
