import React, { Fragment } from 'react';

import '../../css/styleOption.css';




class StyleOption extends React.Component {
  constructor() {
    super();

    let obj = {};
    try {
      obj = JSON.parse(localStorage.styleOption);
    } catch(err) {
      obj = {
        int0: {},
        int1: {},
        int2: {}
      };
    }

    this.state = {
      loadbutton: true,
      videoArr: [],
      videoImg: {},
      music: [],
      int0: obj.int0,
      int1: obj.int1,
      int2: obj.int2,
      chooseInterval: "int0"
    };
  }
  getOption = () => {
    this.setState({
      loadbutton: false
    });
    this.getAllVideo();
    this.getAllMusic();
  }
  chooseInterval = (e) => {
    this.setState({
      chooseInterval: e.target.getAttribute('alt')
    });
  }
  // ///////////////////////////////////////////////////////////////////////////
  saveOption = () => {
    const obj = {
      int0: this.state.int0,
      int1: this.state.int1,
      int2: this.state.int2
    }
    localStorage.styleOption = JSON.stringify(obj);
  }
  playMusic = (musicIndex) => {
    const audio = document.querySelector('#audio2');
    audio.src = this.state.music[musicIndex];
    audio.oncanplaythrough = () => {
      audio.play();
      let i = 10000;
      let startVol = audio.volume;
      let endVol = audio.volume;
      let speed = 1000;
      let volSpeed = ((i / speed)/1000).toFixed(2);
      console.log(endVol+' '+volSpeed)
      const int = setInterval(() => {
          i -= speed;
          startVol -= 0.01;
          audio.volume = startVol;
          if (i <= 0) {
            clearInterval(int);
            audio.pause();
            audio.volume = endVol;
          }
      }, speed);
    }
  }
  // ///////////////////////////////////////////////////////////////////////////
  snapImage = (url, i) => {
    let video = document.createElement('video');
    video.src = url;
    video.onloadeddata = () => {
    let canvas = document.createElement('canvas');
    canvas.width = 106;//video.videoWidth / 12 | 0;
    canvas.height = 60;//video.videoHeight / 12 |0;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image = canvas.toDataURL();
    const videoImg = this.state.videoImg;
    videoImg[`img${i}`] = image;
    this.setState({
      videoImg
    });
    }
  };
  hotCodeVideoRender = () => {
    this.state.videoArr.map((v, i) => {
      this.snapImage(v, i);
    });
  }
  getAllVideo = () => {
    let arr = [
      `${process.env.FILESERVER}video0.mp4`
    ];
    this.setState({
       videoArr: arr
    });
    setTimeout(() => {
      this.hotCodeVideoRender();
    },1000)

    /*
    let arr = [];
    let i = 0;
    let video = document.createElement('video');

    const int = setInterval(() => {
      video.src = `${process.env.FILESERVER}video${i}.mp4`;
      arr.push(`${process.env.FILESERVER}video${i}.mp4`);
      i += 1;
    }, 1000);
    video.addEventListener('error',() => {
      clearInterval(int);
      arr.splice(arr.length -1, 1);
      this.setState({
         videoArr: arr
      });
      this.hotCodeVideoRender();
    });
    */
  }
  getAllMusic = () => {
   let arr = [
     `${process.env.FILESERVER}audio0.mp3`,
     `${process.env.FILESERVER}audio1.mp3`,
     `${process.env.FILESERVER}audio2.mp3`,
     `${process.env.FILESERVER}audio3.mp3`,
     `${process.env.FILESERVER}audio4.mp3`,
     `${process.env.FILESERVER}audio5.mp3`
   ];
   /*
   let i = 0;
   let video = document.createElement('video');

   const int = setInterval(() => {
     video.src = `${process.env.FILESERVER}audio${i}.mp3`;
     arr.push(`${process.env.FILESERVER}audio${i}.mp3`);
     i += 1;
   }, 1000);
   video.addEventListener('error',() => {
     clearInterval(int);
     arr.splice(arr.length -1, 1);
     this.setState({
       music: arr
     });
    })
    */
    this.setState({
      music: arr
    });
  }
  // ///////////////////////////////////////////////////////////////////////////
  clickVideoHendler = (e) => {
    let videoIndex = e.target.getAttribute('alt');
    videoIndex = parseFloat(videoIndex.substring(3,videoIndex.length));
    const obj = this.state[this.state.chooseInterval];
    obj['video'] = this.state.videoArr[videoIndex];
    this.setState({
      [this.state.chooseInterval]: obj
    });
    this.saveOption();
  }
  clickMusicHendler = (e) => {
    let musicIndex = e.target.getAttribute('alt');
    const obj = this.state[this.state.chooseInterval];
    obj['music'] = this.state.music[musicIndex];
    this.setState({
      [this.state.chooseInterval]: obj
    });
    this.saveOption();
    this.playMusic(musicIndex);
  }
  // ///////////////////////////////////////////////////////////////////////////

  videoRender = () => {
    return Object.keys(this.state.videoImg).map((v, i) => {
      return <img alt={v} onClick={this.clickVideoHendler} className="videoImg" key={v} src={this.state.videoImg[v]} />
    });
  }

  musicRender = () => {
    return this.state.music.map((v, i) => {
      return <span alt={i} onClick={this.clickMusicHendler} className="musicImg" key={i}>{v}</span>
    });
  }

  buttonRender = () => {
    const arr = ['int0','int1','int2'];
    const arr2 = ['утро','день','вечер'];
    return arr.map((v, i) => {
      let nclassName = 'time_buttons';
      if (this.state.chooseInterval === v) {
        nclassName = 'time_buttons_active';
      }
      return <button key={v} alt={v} onClick={this.chooseInterval} className={nclassName}>{arr2[i]}</button>;
    });
  }
  myRender = () => {
    if (this.state.loadbutton) {
      return <div onClick={this.getOption} className="loadButton">LOAD</div>
    } else {
      return (
        <Fragment>
        <div className="div_buttons">
          {this.buttonRender()}
        </div>
        <div className="div_video">
          {this.videoRender()}
        </div>
        <div className="div_music">
          {this.musicRender()}
        </div>
        <div>
         настройка когда меняеться по времени
        </div>
        <div>
          <button id="unsubscribe">unsubscribe</button>
          <button id="subscribe">subscribe</button>
        </div>
        </Fragment>
      )
    }
  }
  render() {
    return (
      <div className="scrollfix">
        {this.myRender()}
      </div>
    );
  }
}

export default StyleOption;
