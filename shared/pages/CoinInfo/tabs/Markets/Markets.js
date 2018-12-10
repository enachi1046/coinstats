import React, { Component } from 'react';
import { connect } from 'react-redux';

import MiniLoader from 'addons/MiniLoader';
import { numberFormat } from 'utils/formating';
import { isClient } from 'utils/env/index';

class Markets extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isClient()) {
      const href = window.location.href.split('/');
      const tab = href[href.length - 1];
      if (tab === 'markets') {
        this.props.onTitleChange(
          `${this.props.coin.name} (${
            this.props.coin.symbol
          }/USD) exchange rates and price | Coin Stats`,
        );
        this.props.onDescriptionChange(
          `List of the most trusted cryptocurrency exchanges. View ${
            this.props.coin.name
          } (${
            this.props.coin.symbol
          }) latest price, exchange rates, charts, market cap, volume and news on Coin Stats...`,
        );
        this.props.onKeyWordsChange(
          `${
            this.props.coin.name
          } price, ${this.props.coin.symbol.toLowerCase()} exchange rate, ${this.props.coin.name.toLowerCase()} rate, ${this.props.coin.name.toLowerCase()} exchange, ${this.props.coin.symbol.toLowerCase()} price usd, crypto exchange, ${this.props.coin.symbol.toLowerCase()} price, ${this.props.coin.symbol.toLowerCase()} usd, ${
            this.props.coin.name
          }, cryptocurrency, crypto coin, ${this.props.coin.name.toLowerCase()} chart, ${
            this.props.coin.symbol
          } chart, ${
            this.props.coin.symbol
          } market cap, ${this.props.coin.symbol.toLowerCase()} market`,
        );
      }
    }
  }

  onMarketClick(link) {
    if (link) {
      window.location.href = link;
    }
  }

  get body() {
    return this.props.markets.map((market, i) => {
      return (
        <tr
          key={i}
          className="table_row table-row-body"
          onClick={() => this.onMarketClick(market.link)}
        >
          <td key={i} className="text-left">{market.exchange}</td>
          <td key={i} className="text-left">{market.pair}</td>
          <td key={i} className="text-right">
            {market.volume ? `$${numberFormat(market.volume)}` : 'N/A'}
          </td>
          <td key={i} className="text-right">${numberFormat(market.price)}</td>
          <td key={i} className="td_link">
            {market.link ? (
              <a href={market.link} className="market-link" />
            ) : (
              ''
            )}
          </td>
        </tr>
      );
    });
  }

  render() {
    const head = [
      {
        val: 'Exchange',
        className: 'text-left',
      },
      {
        val: 'Pair',
        className: 'text-left',
      },
      {
        val: 'Volume(24)',
        className: 'text-right',
      },
      {
        val: 'Price',
        className: 'text-right',
      },
    ];

    if (this.props.isLoading && !this.props.markets.length) {
      return (
        <MiniLoader
          style={{ width: '100%', margin: '20px auto', height: '50px' }}
        />
      );
    }

    return (
      <div className="table-responsive text-center market-table-container">
        <table className="table markets-table">
          <thead>
            <tr>
              {head.map((h) => {
                return <th key={h.val} className={h.className}>{h.val}</th>;
              })}
              <th className="link" />
            </tr>
          </thead>
          <tbody>{this.body}</tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    markets: state.markets.markets || [],
    isLoading: state.markets.isMarketsLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Markets);
