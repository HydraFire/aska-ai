import md5 from 'blueimp-md5';
import socket from './webSocketClient';
import { getIp } from './checkIp';
import { animeteLoadAudio, animetePlayAudio, animeteUltraSound, animeteIPcheck } from './interface/animation';
import { stopRec } from './speechRecognition';
/* eslint-disable */
let audio
let audio2
let errorCount = 0;
let aska_mute = false;
let aska_hide = false;
let aska_yandex_id = process.env.YANDEX_ID;
// //////////////////////////////////////////////////////////////////////////
function switchModeOnMute(boolean) {
  window.myconsole.log('aska_hide = ' + boolean, 'chat');
  aska_hide = boolean;
}
// //////////////////////////////////////////////////////////////////////////
function askStateAskaHide() {
  return aska_hide;
}
// //////////////////////////////////////////////////////////////////////////
function askaWriteOnScreen(text, arr) {
  text = text.replace(/#/g,' ');
  text = text.replace(/@\*@/g,' ');
  //socket.send('speech_start','AUDIO');
  if (arr) {
    window.myconsole.handlerInteractWindow({ type: arr.buttons[0].mainType, text, arr: arr.buttons, filedata: arr.content });
  } else {
    window.myconsole.handlerInteractWindow({ type:'aska', text, arr:[{value:'mute'}] });//.obj.arr[0].value
  }
}
// //////////////////////////////////////////////////////////////////////////
function psevdo() {
  const audio = document.getElementById('audio');
  audio.src = 'http://localhost:8080/coub/80Hz.mp3';
  audio.onloadeddata = () => {
    audio.play();
    animeteUltraSound(true);
    socket.send('speech_start','AUDIO');
  };
  setTimeout(()=>{
    socket.send('speech_end','AUDIO');
    animeteUltraSound(false);
  }, 2500);
}
// /////////////////////////////////////////////////////////////////////////////
function handleMediaError(e) {
  errorCount += 1;
  if (errorCount > 1) {
    window.myconsole.log(JSON.stringify(e.target.error.code), 'err');
    //window.myconsole.log('aska_mute', 'err');
    //aska_mute = true;
    psevdo();
  }
}
function initAudio() {
  audio = document.getElementById('audio');
  audio2 = document.getElementById('audio2');
  audio.addEventListener('error', handleMediaError);
}
// /////////////////////////////////////////////////////////////////////////////
function checkPlaing() {
  return audio.paused;
}
// /////////////////////////////////////////////////////////////////////////////
function stopAska() {
  audio.pause();
  audio2.pause();
  socket.send('speech_end','AUDIO');
}
function setVolume(number) {
  audio.volume = number;
  audio2.volume = number;
}
// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
function trueAska(text) {
  stopRec();
  function choseAudioTag(text, audioTag, num) {
    let par = false;
    function createURL(text) {
      if (text == '50Hz') {
        return 'http://localhost:8080/coub/50Hz.mp3';
      } else if (text == '20Hz') {
        return 'http://localhost:8080/coub/20Hz.mp3';
      } else if (text.substring(0, 1) == '#' || par) {
        return `http://localhost:8080/sample/${md5(text.substring(1, text.length))}.mp3`;
      } else {
        animeteLoadAudio(true);
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
    function playAudio(text) {
      audioTag.src = createURL(text);
      audioTag.onloadeddata = function onloadeddata() {
        if (text.substring(0, 1) != '#' && text != '20Hz' && text != '50Hz') {
          animeteLoadAudio(false);
        }
        audioTag.play();
        if (text != '20Hz' && text != '50Hz') {
          //socket.send('speech_start','AUDIO');
          animetePlayAudio(true);
        }
      }
    };
    function splitAndPlay(text){
      let playText = '';
      [playText, text] = splitOnParts(text);
      playAudio(playText);
      if(text.length == 0){
        audioTag.addEventListener('pause',() => {
          socket.send('speech_end','AUDIO');
          animetePlayAudio(false);
        },{ once: true });
      }
      return text;
    }

    text = splitAndPlay(text);

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
// /////////////////////////////////////////////////////////////////////////////
function aska(text, buttons) {
  if (text == '20Hz') {
    trueAska(text);
  } else {
    if (aska_hide) {
      window.myconsole.log(`askaWriteOnScreen(${text})`, 'err');
      askaWriteOnScreen(text, buttons);
    } else {
      if (!aska_mute || text.substring(0, 1) == '#') {
        trueAska(text);
      } else {
        psevdo(text);
      }
      if (buttons) {
        askaWriteOnScreen(text, buttons);
      }
    }
  }
}
// /////////////////////////////////////////////////////////////////////////////
export { aska, initAudio, stopAska, switchModeOnMute, askStateAskaHide, setVolume, checkPlaing };
