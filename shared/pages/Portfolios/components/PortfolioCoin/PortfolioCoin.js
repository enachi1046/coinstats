import React, { Component } from 'react';
import { connect } from 'react-redux';

import { numberFormat } from 'utils/formating';

class PortfolioCoin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { coin } = this.props;
    if (!coin) {
      return false;
    }
    if (this.props.hideUnidentified && coin.coinIsFake) {
      return false;
    }
    const globalMainPair = this.props.globalMainPair;
    let profit = 0;
    let profitPercent = 0;
    if (coin.profit) {
      profit = coin.profit[this.props.globalMainPair.symbol];
      if (!profit) {
        profit = coin.profit.USD / this.props.globalMainPair.usdValue;
      }
    }
    let TdProfitLoss;
    if (coin.profitPercent) {
      profitPercent = coin.profitPercent[globalMainPair.symbol] || coin.profitPercent[globalMainPair.id];
      if (!profitPercent) {
        profitPercent = coin.profitPercent.USD || 0;
      }
    }
    if (profit < 0) {
      TdProfitLoss = (
        <td className="pr-4 text-right text-danger">
          -{this.props.globalMainPair.sign}
          {numberFormat(-profit)}
          ({profitPercent.toFixed(2)}%)
          <small>
            <i className="ti-angle-down text-danger" />
          </small>
        </td>
      );
    } else {
      TdProfitLoss = (
        <td className="pr-4 text-right text-success">
          {this.props.globalMainPair.sign}
          {numberFormat(profit)}
          ({profitPercent.toFixed(2)}%)
          <small>
            <i className="ti-angle-up text-success" />
          </small>
        </td>
      );
    }
    let coinIcon = <img width="20px" className="image mr-2" alt={`${coin.coinName}, ${coin.coinSymbol}`} src={coin.coinImgUrl} />;
    if (!coin.coinImgUrl) {
      coinIcon = (
        <div className="fake-icon">
          <span>{coin.coinName.substring(0, 3)}</span>
        </div>
      );
    }
    let price = 0;
    if (coin.price) {
      price = coin.price[this.props.globalMainPair.symbol];
      if (!price) {
        price = coin.price.USD / this.props.globalMainPair.usdValue;
      }
    }
    return (
      <tr
        className="cursor-pointer portfolio-table-row"
        onClick={() => {
          if (coin.coinIsFake || coin.coinIsCustom || coin.coinIsIco || coin.coinIsFiat || !coin.coinId) return false;
          return this.props.onCoinClick(coin.coinId);
        }}
      >
        <td className="pl-4">
          {coinIcon}
          {coin.coinName}
        </td>
        <td className="right font-weight-500">{numberFormat(coin.count, 0, coin.coinName)}</td>
        <td className="right font-weight-500">
          {this.props.globalMainPair.sign}
          {numberFormat(price)}
        </td>
        <td className="right text-right">
          {this.props.globalMainPair.sign}
          {numberFormat(price * coin.count)}
        </td>
        {TdProfitLoss}
      </tr>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state, props) {
  return {
    hideUnidentified: state.ui.hideUnidentified,
    globalMainPair: state.coins.globalMainPair,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PortfolioCoin);
