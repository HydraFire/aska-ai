const Scraper = require ('images-scraper')
  , google = new Scraper.Google();
const socket = require('./webSocketOnMessage');


function getImgs(ws) {
  google.list({
      keyword: 'ANIME',
      num: 200,
      detail: false,
      nightmare: {
          show: false
      }
  })
  .then(function (res) {
      res = res.filter(v => v.height > 750)
      .map(v => v.url)
      console.log( res);
      socket.send(ws, 'getImgsKaleidos', res);
  }).catch(function(err) {
      console.log('err', err);
  });
}
module.exports.getImgs = getImgs;
