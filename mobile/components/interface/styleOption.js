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
  getAllVideo = () => {
    let arr = [];
    let i = 0;
    let video = document.createElement('img');

    const int = setInterval(() => {
      video.src = `${process.env.FILESERVER}img${i}.png`;
      arr.push(`${process.env.FILESERVER}img${i}.png`);
      i += 1;
    }, 100);
    video.addEventListener('error',() => {
      clearInterval(int);
      arr.splice(arr.length -1, 1);
      this.setState({
         videoArr: arr
      });
    });

  }
  getAllMusic = () => {
   let arr = [];
   let i = 0;
   let video = document.createElement('audio');
   const int = setInterval(() => {
     video.src = `${process.env.FILESERVER}audio${i}.mp3`;
     arr.push(`${process.env.FILESERVER}audio${i}.mp3`);
     i += 1;
   }, 250);
   video.addEventListener('error',() => {
     clearInterval(int);
     arr.splice(arr.length -1, 1);
     this.setState({
       music: arr
     });
    })
    this.setState({
      music: arr
    });
  }
  // ///////////////////////////////////////////////////////////////////////////
  clickVideoHendler = (e) => {
    let videoIndex = e.target.getAttribute('alt').substring(process.env.FILESERVER.length + 3, e.target.getAttribute('alt').length);
    videoIndex = videoIndex.split('.')[0];
    const obj = this.state[this.state.chooseInterval];
    obj['video'] = `${process.env.FILESERVER}video${videoIndex}.mp4`;
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
    return this.state.videoArr.map((v, i) => {
      return <img alt={v} onClick={this.clickVideoHendler} className="videoImg" key={v} src={v} />
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
        </div>
        </Fragment>
      )
    }
  }
  render() {
    return (
      <div className="scrollfix2">
        {this.myRender()}
      </div>
    );
  }
}

export default StyleOption;
