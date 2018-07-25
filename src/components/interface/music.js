import React from 'react';
import socket from '../webSocketClient';
import iconsole from './iconsole';
import '../../css/music.css';


function init(){
    function FileSelectHandler(file){
     //e.preventDefault()
     socket.send({type:'uploadName', data:file.name }, 'music');
     socket.send(file,'upload');
    }
    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files; // FileList object.
      // files is a FileList of File objects. List some properties.

      var output = [];
      for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate.toLocaleDateString(), '</li>');
        FileSelectHandler(f)
      }
      socket.send({ type:'uploadEnd'}, 'music');
      iconsole.logC('<ul>' + output.join('') + '</ul>');
    }

    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
  }

class Music extends React.Component {
  constructor() {
    super();
    this.state = {
      pause: 'true',
      playingTrack: {
        name: '',
        tag: [],
        allTag: []
      }
    };
  }
  componentDidMount() {
    init();
  }
  addTag = (t, s) => {
    const obj = this.state.playingTrack;
    obj.tag.push(t);
    obj.allTag = s;
    this.setState({
      playingTrack: obj
    });
  }
  endedTrack = () => {
    socket.send({ type:'ended', track: this.state.playingTrack }, 'music');
  }

  play = (obj) => {
    const audio = document.getElementById('audio');
    if (audio.paused) {
      audio.src = `./music/${obj.name}`;
      audio.play();
      audio.addEventListener('ended', this.endedTrack, {once : true});
    } else {
      audio.src = `./music/${obj.name}`;
      audio.load();
      audio.oncanplay = function() {
        audio.play();
      }
    }
    this.setState({
      pause: false,
      playingTrack: obj
    });
  }
// /////////////////////////////////////////////////////////////////////////////
  allTagButton = (e) => {
    const tag = e.target.getAttribute('alt');
    const obj = this.state.playingTrack;
    obj.tag.push(tag);
    this.setState({
      playingTrack: obj
    });
  }

  tagButton = (e) => {
    const tag = e.target.getAttribute('alt');
    const obj = this.state.playingTrack;
    obj.tag = obj.tag.filter(v => v !== tag);
    this.setState({
      playingTrack: obj
    });
  }
// /////////////////////////////////////////////////////////////////////////////
  pause = (n) => {
    const audio = document.getElementById('audio');
    if (this.state.pause){
      audio.play();
      // audio.addEventListener('ended', this.endedTrack, {once : true});
      this.setState({
        pause: false
      });
    } else {
      audio.pause();
      audio.removeEventListener('ended', this.endedTrack, {once : true});
      this.setState({
        pause: true
      });
    }
  }
  volume = (n) => {
    const audio = document.getElementById('audio');
    let volume = audio.volume;
    volume += n;
    volume < 0.1 ? volume = 0.1 : '';
    volume > 1 ? volume = 1 : '';
    audio.volume = volume;
  }
  alltagRender = () => {
    return this.state.playingTrack.allTag.map(v => <button key={v} alt={v} onClick={this.allTagButton} className="tag_button">{v}</button>);
  }
  tagRender = () => {
    return this.state.playingTrack.tag.map(v => <button key={v} alt={v} onClick={this.tagButton} className="tag_button">{v}</button>);
  }
  render() {
    return (
      <div className="music_main">
        <div className="music_first">
          <div className="music_name">
            {this.state.playingTrack.name}
          </div>
          <div className="tag">
            {this.tagRender()}
          </div>
          <div className="alltag">
            {this.alltagRender()}
          </div>
        </div>
        <div className="music_buttons">
          <button className="music_button">⏮</button>
          <button onClick={this.pause} className="music_button">▷◾</button>
          <button className="music_button">⏭</button>
          <div id="drop_zone">Drop files here</div>
        </div>
      </div>
    );
  }
}


export default Music;
