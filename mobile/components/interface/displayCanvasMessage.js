
const arrMessage = [{ left: true, text: ' ' }];

function getMessageArr() {
  return arrMessage;
}
module.exports.getMessageArr = getMessageArr;

const zzz = function zzz(b) {
  const num = 30;
  let trueArr = [];
  const ass = function ass(array) {
    let y = '';
    let m = '';
    for (let i = 0; i < array.length; i += 1) {
      if (y.length < num) {
        y += array[i]+' ';
      } else {
        m += array[i]+' ';
      }
    }
    y = y.slice(0,y.length-1)
    m = m.slice(0,m.length-1)
    return [y, m];
  }
  const rec = function rec(b) {
    if (b != '') {
      if (b.length > num ) {
        let array = b.split(' ');
        let g = ass(array);
        trueArr.push(g[0]);
        rec(g[1]);
      } else {
        trueArr.push(b);
      }
    }
  }
  rec(b);
  return trueArr;
};


function newMessage(text, arg) {
  let arr = text.split(',');
  arr = arr.reduce((a, b) => {
    return a.concat(zzz(b));
  }, []);
  // arr = arr.map(v => `${v},`);
  if (arrMessage[arrMessage.length - 1].left) {
    arr.push(' ');
  }
  arr.reverse();
  arr.forEach(v => arrMessage.push({ left: arg, text: v }));

  const int = setInterval(() => {
    if (arrMessage.length > 38) {
      arrMessage.splice(0, 1);
    } else {
      clearInterval(int);
    }
  }, 1000);
}
module.exports.newMessage = newMessage;
