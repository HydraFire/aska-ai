function Creative(ws, option, parameters) {
  function test() {
  console.log('//////////////////////////////////////////');
/*
let a = [{id: 1, int: 300}, {id: 333, int: 1000}, {id: 672, int: 5000}];

let sum = 0;
for (let i = 0; i < a.length; i++) {
  sum += a[i].int;
}

let rand = Math.floor(Math.random() * sum);

let i = 0;
for (let s = a[0].int; s <= rand; s += a[i].int) {
  i++;
}

console.log(a[i].id);
*/
  const choices = ['small','meddium','big'];

  const arrA = {
    small: ['s0','s1','s2','s3','s4','s5'],
    meddium: ['mmm0','mmm1','mmm2','mmm3','mmm4','mmm5'],
    big: ['bbbbbb0','bbbbbb1','bbbbbb2','bbbbbb3','bbbbbb4','bbbbbb5']
  }
  const settings = {
    small: 4,
    meddium: 2,
    big: 1
  }

  function anotherOneRecurse(arr, choice) {
    let r = arrA[choice][Math.random()*arrA[choice].length|0];
    if (arr.some(v => v == r)) {
      r = anotherOneRecurse(arr, choice);
    }
    return r;
  }



  function randomRecurse(arr) {
    let choice = choices[Math.random()*choices.length|0];
    if (settings[choice] != 0) {
      arr.push(anotherOneRecurse(arr, choice));
      settings[choice] -= 1;
    }

    if (settings.small == 0 && settings.meddium == 0 && settings.big == 0) {

    } else {
      arr = randomRecurse(arr);
    }
    return arr;
  }


  let arr = [];
  arr = randomRecurse(arr);
  console.log(arr);
}
export { test };

}
module.exports.Creative = Creative;
