import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';

import { numberFormat } from 'utils/formating';
import { connect } from 'react-redux';
import { portfolios as portfoliosActions } from 'store/actions';

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadChart(this.props.portfolio.identifier);
  }

  monthName(number) {
    switch (number) {
      case 1:
        return 'JAN';
      case 2:
        return 'FEB';
      case 3:
        return 'MAR';
      case 4:
        return 'APR';
      case 5:
        return 'MAY';
      case 6:
        return 'JUNE';
      case 7:
        return 'JULY';
      case 8:
        return 'AUG';
      case 9:
        return 'SEPT';
      case 10:
        return 'OCT';
      case 11:
        return 'NOV';
      case 12:
        return 'DEC';
      default:
        return '';
    }
  }

  getChartDate(inputDate) {
    const hour = new Date(inputDate).getHours();
    let time = `${hour < 10 ? `0${hour}` : hour}:00`;
    if (this.props.timeInterval !== '24h') {
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      time = `${day} ${this.monthName(month)} ${year} ${time}`;
      if (this.props.timeInterval !== '1week') {
        time = `${day} ${this.monthName(month)} ${year}`;
      }
    }
    return time;
  }

  render() {
    const configChartLoading = {
      title: ' ',
      chart: {
        events: {
          load() {
            this.showLoading('Loading Chart');
          },
        },
        backgroundColor: '#fff',
      },
    };
    let lineChartData = <ReactHighcharts config={configChartLoading} />;
    const labels = [];
    const dataContent = [];
    const dates = [];
    if (this.props.lineChartData) {
      this.props.lineChartData.forEach((arr) => {
        dates.push(arr[0]);
        if (this.props.globalMainPair.symbol === 'BTC') {
          dataContent.push(arr[2]);
        } else if (this.props.globalMainPair.symbol === 'ETH') {
          dataContent.push(arr[3]);
        } else {
          const arrValueByCurrency =
            arr[1] / this.props.globalMainPair.usdValue;
          dataContent.push(arrValueByCurrency);
        }
      });
    } else if (
      (this.props.lineChartData && this.props.lineChartData.length === 0) ||
      !this.props.lineChartData
    ) {
      labels.push('now');
      let total = this.props.portfolio.total;
      if (total) {
        total = total.toFixed(2);
      }
      dataContent.push(parseFloat(total));
    }
    const self = this;
    const symbol = this.props.globalMainPair.sign || '';
    let chartBg = '#1d1c1c';
    let chartTextColor = '#fff';
    const linesColor = '#7c7f82';
    const pointsColor = '#fea856';
    let areaColorFrom = '#2C2B2B';
    let areaColorTo = '#1c1b1b';
    if (!this.props.darkMode) {
      areaColorFrom = '#ffffff';
      areaColorTo = '#EFEFEF';
      chartBg = '#fff';
      chartTextColor = '#222';
    }
    let minValue = 0;
    if (this.props.lineChartData) {
      let max;
      let min;
      if (this.props.lineChartData[0]) {
        max = this.props.lineChartData[0][1];
        min = this.props.lineChartData[0][1];
      }
      this.props.lineChartData.map((value) => {
        if (min > value[1]) {
          min = value[1];
        }
        if (max < value[1]) {
          max = value[1];
        }
      });
      minValue = min - ((max - min) * 9 / 10);
      if (minValue < 0) {
        minValue = 0;
      }
    }
    minValue /= this.props.globalMainPair.usdValue;
    const config = {
      title: '',
      chart: {
        backgroundColor: chartBg,
      },
      plotOptions: {
        series: {
          marker: {
            fillColor: 'transparent',
          },
        },
        area: {
          fillColor: {
            linearGradient: {
              y0: 0,
              y1: 1,
              x0: 0,
              x1: 1,
            },
            stops: [[0, areaColorTo], [1, areaColorFrom]],
          },
          threshold: null,
          color: pointsColor,
        },
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        gridLineColor: linesColor,
        title: '',
        min: minValue,
        labels: {
          formatter() {
            return symbol + numberFormat(this.value);
          },
          style: {
            color: chartTextColor,
          },
        },
      },
      series: [
        {
          type: 'area',
          title: '',
          showInLegend: false,
          name: this.props.portfolio.name,
          data: dataContent,
        },
      ],
      credits: {
        enabled: false,
      },
      tooltip: {
        formatter() {
          return `<div><span>${symbol}${
            numberFormat(this.y)}</span><br/><span>${
            self.getChartDate(dates[this.x])}</span></div>`;
        },
      },
    };

    lineChartData = <ReactHighcharts config={config} />;

    if (!this.props.showChartText || !this.props.orderedCoinsLength) {
      lineChartData = null;
    }
    return (
      <div>{lineChartData}</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    darkMode: state.ui.darkMode,
    showChartText: state.coins.showChart,
    lineChartData: state.coins.chartInfo,
    globalMainPair: state.coins.globalMainPair,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadChart(id, type) {
      return dispatch(portfoliosActions.loadChart(id, type));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
