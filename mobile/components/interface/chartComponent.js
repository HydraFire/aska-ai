import React, { Fragment } from 'react';
import RC2 from 'react-chartjs2';
import socket from '../webSocketClient';
import '../../css/chartComponent.css';

const chartOptions = {};


class ChartCom extends React.Component {
  constructor() {
    super();
    this.state = {
      loadbutton: true,
      chartData: null,
      chartOptions: null
    };
  }
  getChart = () => {
    socket.send('load', 'chart');
  }
  loadChart = (data) => {
    data = JSON.parse(data);
    this.setState({
      loadbutton: false,
      chartData : data
    });
  }
  myRender = () => {
    if (this.state.loadbutton) {
      return <div onClick={this.getChart} className="loadButton">LOAD</div>
    } else {
      return (
        <Fragment>
        <RC2 data={this.state.chartData} options={chartOptions} type="bar" />
        <div className="buttons">
          <button className="buttonSection">{'<<<'}</button>
          <button className="buttonSection">{'>>>'}</button>
          <button className="buttonSection">{'<<<'}</button>
          <button className="buttonSection">{'>>>'}</button>
        </div>
        </Fragment>
      );
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

export default ChartCom;
