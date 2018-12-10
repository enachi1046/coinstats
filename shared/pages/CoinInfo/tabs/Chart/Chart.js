import React, { Component } from 'react';
import { connect } from 'react-redux';
import { numberFormat } from 'utils/formating';
import { isClient } from 'utils/env/index';
import { coins as coinsActions } from 'store/actions';
import ReactHighcharts from 'react-highcharts';
import Loader from 'addons/Loader';

const timeIntervalObj = [
  { key: 'Today', value: '24h' },
  { key: '1W', value: '1w' },
  { key: '1M', value: '1m' },
  { key: '3M', value: '3m' },
  { key: '6M', value: '6m' },
  { key: '1Y', value: '1y' },
  { key: 'All', value: 'all' },
];

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeInterval: '24h',
    };
  }

  componentDidMount() {
    this.props.loadCoinChart(this.props.coin.id, '24h');
    if (isClient()) {
      const href = window.location.href.split('/');
      const tab = href[href.length - 1];
      if (tab === 'chart') {
        this.props.onTitleChange(
          `${this.props.coin.name} (${
            this.props.coin.symbol
          }/USD) Price Chart | Coin Stats`,
        );
        this.props.onDescriptionChange(
          `Find ${
            this.props.coin.name
          } live price chart as well as price charts for 1 week, 1 month, 3 months, 6 months, 1 year. Coin Stats provides everything you need to know about cryptocurrency.`,
        );
        this.props.onKeyWordsChange(
          `${
            this.props.coin.name
          } price chart, ${this.props.coin.symbol.toLowerCase()} usd chart, ${this.props.coin.symbol.toLowerCase()} exchange rate, buy ${this.props.coin.symbol.toLowerCase()}, ${this.props.coin.symbol.toLowerCase()} price usd, ${this.props.coin.symbol.toLowerCase()} price, ${this.props.coin.symbol.toLowerCase()} to usd, ${this.props.coin.name.toLowerCase()}, cryptocurrency, crypto coin, ${this.props.coin.name.toLowerCase()} chart, ${
            this.props.coin.symbol
          } chart, ${this.props.coin.symbol.toLowerCase()} market cap, ${this.props.coin.symbol.toLowerCase()} market chart`,
        );
      }
    }
  }

  toggleTiming(coinName, value) {
    this.setState({
      timeInterval: value,
    });
    this.props.loadCoinChart(coinName, value);
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

  getDate(inputDate) {
    const hour = new Date(inputDate).getHours();
    let time = `${hour < 10 ? `0${hour}` : hour}:00`;
    if (this.state.timeInterval !== '24h') {
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      time = `${day} ${this.monthName(month)} ${year} ${time}`;
      if (this.state.timeInterval !== '1w') {
        time = `${day} ${this.monthName(month)} ${year}`;
      }
    }
    return time;
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (this.state.timeInterval !== prevState.timeInterval) {
      return false;
    }
    return true;
  }

  render() {
    if (
      !this.props.coinChartInfoUSD ||
      this.props.coinChartInfoUSD.length === 0
    ) {
      return (
        <Loader
          text=""
          style={{
            paddingBottom: '100px',
            paddingTop: '100px',
            position: 'unset',
            background: 'unset',
          }}
        />
      );
    }
    const symbol = this.props.globalMainPair.sign || '';
    const dates = this.props.coinChartInfoDates;
    let chartBg = '#1d1c1c';
    let chartTextColor = '#fff';
    const linesColor = '#7c7f82';
    const pointsColor = '#fea856';
    let areaColorFrom = 'rgba(255, 255, 255, 0.07)';
    let areaColorTo = 'rgba(255, 255, 255, 0)';
    if (!this.props.darkMode) {
      areaColorFrom = '#ffffff';
      areaColorTo = '#EFEFEF';
      chartBg = '#fff';
      chartTextColor = '#222';
    }
    let max = this.props.coinChartInfoUSD[0];
    let min = this.props.coinChartInfoUSD[0];
    this.props.coinChartInfoUSD.map((value) => {
      if (min > value) {
        min = value;
      }
      if (max < value) {
        max = value;
      }
    });
    let minValue = min - ((max - min) * 9) / 10;
    if (minValue < 0) {
      minValue = 0;
    }
    const self = this;
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
        gridLineColor: 'transparent',
      },
      yAxis: {
        gridLineColor: 'transparent',
        title: '',
        min: minValue,
        labels: {
          formatter() {
            return `<span class="coin-chart-price">
              ${symbol + numberFormat(this.value)}
            </span>`;
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
          data: this.props.coinChartInfoUSD,
        },
      ],
      credits: {
        enabled: false,
      },
      tooltip: {
        formatter() {
          return `<div><span>${symbol}${numberFormat(
            this.y,
          )}</span><br/><span>${self.getDate(dates[this.x])}</span></div>`;
        },
      },
    };

    const chartDays = (
      <div className="chart-period-switcher">
        {timeIntervalObj.map((obj, ind) => {
          let activeClass = '';
          if (this.state.timeInterval === obj.value) {
            activeClass = 'active';
          }
          return (
            <span
              key={ind}
              onClick={() => this.toggleTiming(this.props.coin.id, obj.value)}
              className={`${activeClass}`}
            >
              {obj.key}
            </span>
          );
        })}
      </div>
    );

    return (
      <div className="coin-info-chart">
        <ReactHighcharts config={config} />
        {chartDays}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    darkMode: state.ui.darkMode,
    globalMainPair: state.coins.globalMainPair,
    coinChartInfoDates: state.coins.coinChartInfoDates,
    coinChartInfoUSD: state.coins.coinChartInfoUSD,
    coinChartInfoBTC: state.coins.coinChartInfoBTC,
    coinChartInfoETH: state.coins.coinChartInfoETH,
    isCoinChartLoading: state.coins.isCoinChartLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCoinChart(coin, type) {
      return dispatch(coinsActions.loadCoinChart(coin, type));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
