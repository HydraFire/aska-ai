import React from 'react';
import { aska, stopAska } from '../speechSynthesizer';
import '../../css/chartwindow.css';



class chartWindow extends React.Component {
  playAska = (e) => {
    let i = e.target.getAttribute('index');
    if (i >= 0) {
      aska(this.props.data[`part${i}`]);
    }
  }
  stopAska = () => {
    stopAska();
  }
  myRender = () => {
    let arr = Object.keys(this.props.data).map((v) => {
      if (v == 'date') {
        let x = new Date(this.props.data[v]);
        return `${x.getDate()}.${x.getMonth() + 1}.${x.getFullYear()}`;
      } else {
        let str = this.props.data[v].slice(0,30);
        return str+'...';
      }
    })
    return arr.map((v, i) => {
      return (
        <div key={v}  onClick={this.playAska} className="text_window">
          <span index={i-1}>{v}</span>
        </div>
      );
    })
  }
  render() {
    return (
      <div className="input_bg">
        <div className="main_window">
        {this.myRender()}
          <button onClick={this.stopAska} className="button_input">Stop</button>
          <button onClick={this.props.chartwindowClose} className="button_input">Close</button>
        </div>
      </div>
    );
  }
}

export default chartWindow;
