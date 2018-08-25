import socket from './webSocketClient';
import { animeteLoadAudio, animetePlayAudio, animeteUltraSound } from './interface/animation';
// import { startStopRec } from './speechRecognition';
/* eslint-disable */
let audio
let audio2
let errorCount = 0;
let aska_mute = false;
// //////////////////////////////////////////////////////////////////////////
function psevdo() {
  animeteUltraSound(true);
  socket.send('speech_start','AUDIO');
  setTimeout(()=>{
    socket.send('speech_end','AUDIO');
    animeteUltraSound(false);
  }, 1500);
}

function handleMediaError() {
  errorCount += 1;
  if (errorCount > 1) {
    window.myconsole.log('aska_mute', 'err');
    aska_mute = true;
    psevdo();
  }
}

function delquestionMark(str) {
  return str.replace(/[?]/gi, '@');
}

function initAudio() {
  audio = document.getElementById('audio');
  audio2 = document.getElementById('audio2');
  audio.addEventListener('error', handleMediaError);
}
function stopAska() {
  audio.pause();
  audio2.pause();
  socket.send('speech_end','AUDIO');
}
// /////////////////////////////////////////////////////////////////////////////
function trueAska(text) {
  function choseAudioTag(text, audioTag, num) {
    function playAudio(text) {
      let url
      if (text.substring(0, 1) == '#') {
        text.includes('?') ? text = delquestionMark(text) : '';
        url = `http://localhost:8080/sample/${text.substring(1, text.length)}.mp3`;
      } else {
        animeteLoadAudio(true);
        url = 'https://tts.voicetech.yandex.net/generate?'+
            'key=222499e2-1e45-4b6d-aaaa-70b53b87c2ec'+
            '&text='+encodeURI(text)+
            '&format=mp3'+
            '&lang=ru-RU'+
            '&topic=queries'+
            '&speaker=oksana'+
            '&speed=1'+
            '&robot=1'+
            '&emotion=evil';
      }
      if (text == '20Hz') {
        url = 'http://localhost:8080/coub/20Hz.mp3';
      }
      audioTag.src = url;
      audioTag.onloadeddata = function onloadeddata() {
        // iconsole.logC('audioTag.play()');
        // console.log(audioTag.volume)
        if (text.substring(0, 1) != '#') {
          animeteLoadAudio(false);
        }
        audioTag.play();
        socket.send('speech_start','AUDIO');
        animetePlayAudio(true);
      }
    };
    function splitOnParts(text){
      let part = text.slice(0,1000);
      let m = [...part].reverse().join('').indexOf('.');
      let chankStart = part.slice(0,1000-m);
      let chankEnd = text.slice(1000-m);
      return [chankStart,chankEnd]
    };
    function splitAndPlay(text){
      let playText = '';
      [playText,text] = splitOnParts(text);
      playAudio(playText);
      if(text.length == 0){
        audioTag.addEventListener('pause',()=>{
          // console.log('SHUT_UP')
          socket.send('speech_end','AUDIO');
          animetePlayAudio(false);
          // startStopRec();
        },{once:true})
      }
      return text
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
// /////////////////////////////////////////////////////////////////////////////
function aska(text) {
  if (!aska_mute || text.substring(0, 1) == '#') {
    trueAska(text);
  } else {
    psevdo(text);
  }
  window.myconsole.log(text, 'aska');
}

export { aska, initAudio, stopAska };
