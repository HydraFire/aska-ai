
function getIp() {
  let promise = new Promise((resolve, reject) => {
    window.myconsole.log('start', 'err');
    let i = 0;
    let int = setInterval(() => {
      i += 1;
      window.myconsole.log(i, 'err');
      if (i > 30) {
        clearInterval(int);
        resolve(true);
      }
    }, 100);
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then((obj) => {
        if (obj.ip == '159.224.183.122'){
          clearInterval(int);
          resolve(false);
        } else {
          clearInterval(int);
          resolve(true);
        }
      })
      .catch((err) => {
        clearInterval(int);
        window.myconsole.log('ip promise fetch = ' + err, 'err');
      });
  });
  return promise;
}
module.exports.getIp = getIp;
