/* eslint-disable */
const levenshtein = require('js-levenshtein');

function go(text0, text1) {
  //console.log(`text0 = ${text0}, text1 = ${text1}`);
  //console.log(levenshtein(text0, text1))
  let sym = ((text0.length + text1.length) / 2) - levenshtein(text0, text1);
  //console.log('       '+sym+'%')
  return 34 + sym;
}
/*
function go(text0, text1) {
  let procent0 = 0;
  let procent1 = 0;

  function procentString(a, b) {
    let num = 0;
    if (a.length < b.length) {
      const c = a;
      a = b;
      b = c;
    }
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] === b[i]) {
        num += 1;
      }
    }
    num = (100 / b.length) * num;
    num = num.toFixed(2)
    return num
  }
  procent0 = procentString(text0,text1)
  procent0 = parseFloat(procent0)

  function includes_test(a, b) {

    if (a.length < b.length) {
      let c = a
      a = b
      b = c
    }
    let iter = a.length + 1;
    let num = 0
    for(i=0;i<iter;i++){

      let t = b.search(a[0])
      // let s = a.search(a[0])
      if(t == -1){
        a = a.substring(1,a.length)
        //console.log('t= '+t)
        //console.log('a= '+a)
      }else{

        //console.log('a= '+a+' '+t)
        let s = a.substring(0,t)
        //console.log('s= '+s)
        a = a.substring(1,a.length)


        //console.log('a= '+a+' '+t)
        //console.log('b= '+b)
        let z = b.substring(0,t)
        b = b.substring(t+1,b.length)
        b = z+b
        num+=1
        //console.log('b= '+b)
      }

    }
    num = (100/iter)*num
    num = num.toFixed(2)
    return num
  }
  procent1 = includes_test(text0,text1)
  procent1 = parseFloat(procent1)
  // console.log('/////////////'+procent0+'  '+procent1)

  let sym = (procent0+procent1+procent1)/3
  return sym
};
*/
module.exports.go = go;
