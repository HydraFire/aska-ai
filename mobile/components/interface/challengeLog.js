import React from 'react';
import socket from '../webSocketClient';
import '../../css/challengeLog.css';

class ChallengeLog extends React.Component {
  constructor() {
    super();
    this.state = {
      loadbutton: true,
      data: null
    };
  }
  loadState = (data) => {
    data = JSON.parse(data);
    data.reverse();
    this.setState({
      loadbutton: false,
      data
    });
  }
  getData = () => {
    socket.send('load','challengeLog');
  }
  myRender = () => {
    if (this.state.data != null) {
      return this.state.data.map((v) => {
        let x = new Date(v.info);
        let d = x.getDate();
        if (d < 10) { d = `0${d}`};
        let m = x.getMonth() + 1;
        if (m < 10) { m = `0${m}`};
        let y = x.getFullYear();
        let str = `${d}.${m}.${y}`;
        return (
          <div key={v.info} className="block">
            <div className="date">{str}</div>
            <div className="challenge_info">
                {v.quest}<br/>{v.excuse}
            </div>
          </div>
        )
      });
    };
  }
  myRenderAll = () => {
    if (this.state.loadbutton) {
      return 'Load';
    } else {
      return `Всего достижений : ${this.state.data.length}`;
    }
  }
  render() {
    return (
      <div>
        <div onClick={this.getData} className="challenge_all">
          {this.myRenderAll()}
        </div>
        <div className="main_block">
          {this.myRender()}
        </div>
      </div>
    );
  }
}


export default ChallengeLog;
