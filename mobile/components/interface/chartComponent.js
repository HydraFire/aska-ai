import React, { Fragment } from 'react';
import RC2 from 'react-chartjs2';
import socket from '../webSocketClient';
import '../../css/chartComponent.css';

let mainData = [];

function loadChartTryButtons() {
  let arr = [];
  try {
    arr = JSON.parse(localStorage.chartButtons);
  } catch(err) {
    console.log(err);
  }
  return arr;
}


class ChartCom extends React.Component {
  constructor() {
    super();
    this.state = {
      loadbutton: true,
      rewindSpeed: parseFloat(localStorage.rewindSpeed) || 3,
      chartButtons:  loadChartTryButtons(),
      chartData: null,
      chartOptions: {
        animation: false,
        legend: {
            display: false,
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              parser: 'MM/DD/YYYY HH:mm',
              max: '7/6/2018 00:00',
              min: '5/1/2018 00:00',
              tooltipFormat: 'll HH:mm'
            }
          }]
          }
        }
      };
    };
  // ///////////////////////////////////////////////////////////////////////////
  enabledButtonsColorChart = (chartButtons) => {
    const arr = this.state.chartData;
    arr['datasets'] = arr.datasets.map((v) => {
      let i = false;
      chartButtons.forEach((value) => {
        if (v.label === value.name) {
          i = value.borderColor;
        }
      })
      if (i) {
        v.borderColor ? v.borderColor = i : '';
        v.backgroundColor ? v.backgroundColor = i : '';
        // v.backgroundColor = i;
         return v;
       } else {
         return v;
       }
    })
    localStorage.chartButtons = JSON.stringify(chartButtons);
    this.setState({
       chartButtons,
       chartData: arr
     })
  }

  changeColor = (e) => {
    const name = e.target.getAttribute('alt');
    const chartButtons = this.state.chartButtons.map((v) => {
      if (v.name === name) {
        v.borderColor = `rgb(${Math.random()*256|0},${Math.random()*256|0},${Math.random()*256|0})`;
        return v;
      } else {
        return v;
      }
    });
    this.enabledButtonsColorChart(chartButtons);
  }

  enabledButtonsEnableChart = (chartButtons) => {
    let chartData = {};
    chartData['datasets'] = mainData.filter((v) => {
      let i = 0;
      chartButtons.forEach((value) => {
        if (v.label === value.name && value.enabled) {
          i += 1;
        }
      })
      if (i === 1) { return true };
    })
    localStorage.chartButtons = JSON.stringify(chartButtons);
    this.setState({
       chartButtons,
       chartData
     })
  }

  enabledButtons = (e) => {
    const name = e.target.getAttribute('alt');
    const chartButtons = this.state.chartButtons.map((v) => {
      if (v.name === name) {
        v.enabled = !v.enabled;
        return v;
      } else {
        return v;
      }
    });
    this.enabledButtonsEnableChart(chartButtons);
  }
  // ///////////////////////////////////////////////////////////////////////////
  checkColor = (chartButtons) => {
    this.state.chartButtons.forEach((v) => {
      chartButtons = chartButtons.map((w) => {
        if (v.name === w.name) {
          return w.borderColor = v.borderColor;
        }
      })
    })
    return chartButtons;
  }
  createChartButtons = (data) => {
    if (data.length !== this.state.chartButtons.length) {
      let chartButtons = data.map((v) => {
        return { name: v.label, enabled: true, borderColor: v.borderColor };
      });
      chartButtons = this.checkColor(chartButtons);
      // this.setState({ chartButtons })
      localStorage.chartButtons = JSON.stringify(chartButtons);
      return chartButtons;
    } else {
      return JSON.parse(localStorage.chartButtons);
    }
  }
  // ///////////////////////////////////////////////////////////////////////////
  getChart = () => {
    socket.send('load', 'chart');
  }
  loadChart = (data) => {
    data = JSON.parse(data);
    mainData = data.datasets;
    const chartButtons = this.createChartButtons(data.datasets);
    this.enabledButtonsEnableChart(chartButtons);
    this.enabledButtonsColorChart(chartButtons);
    // data.datasets[0].borderColor = 'rgb(100, 7, 7)';

    this.setState({
      loadbutton: false
    });
  }
  // ///////////////////////////////////////////////////////////////////////////
  buttonSpeedHandler = (e) => {
    const s = parseFloat(e.target.innerHTML);
    localStorage.rewindSpeed = s;
    this.setState({ rewindSpeed: s})
  }
  recalc(d, naSkolko, znak) {
    const arr = d.split('/');
    let a = new Date();
    let y = Date.UTC(parseFloat(arr[2]), parseFloat(arr[0]), parseFloat(arr[1]), 0, 0, 0) + a.getTimezoneOffset() * 60000;
    znak === 'plus' ? y = y + (24 * 60 * 60000 * naSkolko) : y = y - (24 * 60 * 60000 *naSkolko);
    const x = new Date(y);
    return `${x.getUTCMonth()}/${x.getUTCDate()}/${x.getFullYear()} 00:00`;
  }
  buttonRewindHandler = (e) => {
    const code = e.target.getAttribute('code');
    const part = e.target.getAttribute('part');
    const stateCopy = this.state.chartOptions;
     const min = stateCopy.scales.xAxes[0].time[code].split(' ');
     stateCopy.scales.xAxes[0].time[code] = this.recalc(min[0], this.state.rewindSpeed, part);
     this.setState({ chartOptions: stateCopy})
  }
  buttonFullHandler = () => {

  }
  // ///////////////////////////////////////////////////////////////////////////
  oneMoreRender = () => {
    return this.state.chartButtons.map((v) => {
      let color = { background:v.borderColor };
      return (
        <div key={v.name} className="panel">
          <div className="text">{v.name}</div>
          <div className="text">
            <button alt={v.name} onClick={this.enabledButtons} className="buttonEnabled">{ v.enabled ? 'Enabled' : 'disabled'}</button>
            <button alt={v.name} onClick={this.changeColor} style={color} className="buttonColor">{'Color'}</button>
            <button className="buttonEnabled">{'GO'}</button>
            <button className="buttonEnabled">{'X'}</button>
          </div>
        </div>
      )
    });
  }
  myRender = () => {
    if (this.state.loadbutton) {
      return <div onClick={this.getChart} className="loadButton">LOAD</div>
    } else {
      return (
        <Fragment>
        <RC2 data={this.state.chartData} options={this.state.chartOptions} type="bar" />
        <div className="buttons">
          <button part="minus" code="min" onClick={this.buttonRewindHandler} className="buttonRewind">{'<<<'}</button>
          <button part="plus" code="min" onClick={this.buttonRewindHandler} className="buttonRewind">{'>>>'}</button>
          <button onClick={this.buttonSpeedHandler} className="buttonSpeed">{'4x'}</button>
          <button onClick={this.buttonSpeedHandler} className="buttonSpeed">{'7x'}</button>
          <button onClick={this.buttonSpeedHandler} className="buttonSpeed">{'30x'}</button>
          <button onClick={this.buttonFullHandler} className="buttonFull">{'full'}</button>
          <button part="minus" code="max" onClick={this.buttonRewindHandler} className="buttonRewind">{'<<<'}</button>
          <button part="plus" code="max" onClick={this.buttonRewindHandler} className="buttonRewind">{'>>>'}</button>
        </div>
        <span className="razdel">---------------------------------------------</span>
        <div>
          {this.oneMoreRender()}
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
