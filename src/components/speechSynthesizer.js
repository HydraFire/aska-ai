import md5 from 'blueimp-md5';
import iconsole from './interface/iconsole';
import socket from './webSocketClient';
import { recStop, recStart } from './speechRecognition';

let aska_yandex_id = process.env.YANDEX_ID;

function getServerUrl() {
  if (localStorage.aska_ip) {
    return `https://${localStorage.aska_ip.split('//')[1]}/sample/`;
  }
  return `https://${process.env.HOSTNAME.split('//')[1]}/sample/`;
}
/* eslint-disable */
function aska(text) {


  const audio = document.getElementById('audio');
  const audio2 = document.getElementById('audio2');
  // iconsole.logC(text);

  function choseAudioTag(text, audioTag, num) {
    let par = false;
    function createURL(text) {
      if (text == '20Hz') {
        return false;
      } else if (text.substring(0, 1) == '#' || par) {
        console.log(text);
        return `${getServerUrl()}${md5(text.substring(1, text.length))}.mp3`;
      } else {
        return 'https://tts.voicetech.yandex.net/generate?'+
            'key='+aska_yandex_id+
            '&text='+encodeURI(text)+
            '&format=mp3'+
            '&lang=ru-RU'+
            '&topic=queries'+
            '&speaker=oksana'+
            '&speed=1'+
            '&robot=1'+
            '&emotion=evil';
      }
    }
    function playAudio(text) {
      audioTag.src = createURL(text);
      audioTag.onloadeddata = function onloadeddata() {
        iconsole.logC('audioTag.play()');
        audioTag.play();
        socket.send('speech_start','AUDIO');
        recStop();
      }
    };
    function splitOnParts(text){
      if (text.length > 1000) {
        if (text.substring(0, 1) == '#') {
          if (!par) {
            par = true;
          }
          text = text.substring(1, text.length);
        }
        let part = text.slice(0, 1000);
        let m = [...part].reverse().join('');
        let dot = m.indexOf('.');
        let coma = m.indexOf(',');
        if (dot != -1) {
          dot > coma ? m = coma : m = dot;
        } else {
          m = coma;
        }
        let chankStart = part.slice(0, 1000 - m);
        let chankEnd = text.slice(1000 - m);
        par ? chankStart = `#${chankStart}` : '';
        par ? chankEnd = `#${chankEnd}` : '';
        return [chankStart, chankEnd];
      }
      if (text.includes('@*@')) {
        let chankStart = text.slice(0, text.indexOf('@*@'));
        let chankEnd = text.slice(text.indexOf('@*@')+3);
        return [chankStart, chankEnd];
      }
      return [text, ''];
    };
    function splitAndPlay(text){
      let playText = '';
      [playText,text] = splitOnParts(text);
      playAudio(playText);
      if(text.length == 0){
        audioTag.addEventListener('pause',()=>{
          socket.send('speech_end','AUDIO');
          recStart();
        },{ once: true });
      }
      return text;
    }

    text = splitAndPlay(text)

    if (text.length > 0) {
      const p = new Promise((resolve) => {
        audioTag.addEventListener('ended', () => text.length > 0 ? text = splitAndPlay(text):resolve('d'));
      });
      p.then((data) => {
        audioTag.removeEventListener('ended',() => text.length > 0 ? text=splitAndPlay(text):resolve('d'));
      });
    }
  }
  if (text.length > 0) {
    audio.paused ? choseAudioTag(text, audio, 1) : choseAudioTag(text, audio2, 2);
  }
}

export default aska;
