import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { numberFormat, priceBtcFormat } from 'utils/formating';
import { home as homeActions } from 'store/actions';

class Coins extends Component {
  constructor(props) {
    super(props);
    this.theadArr = [
      {
        key: 'position',
        value: '#',
        className: 'number fit',
      },
      {
        key: 'name',
        value: 'Name',
        className: 'name-c',
      },
      {
        key: 'percentChange24h',
        value: 'Change(24h)',
        className: 'data-cell',
      },
      {
        key: 'price',
        value: 'Price',
        className: 'data-cell',
      },
      {
        key: 'bitcoinPrice',
        value: 'Price in BTC',
        className: 'data-cell',
      },
      {
        key: 'marketCap',
        value: 'Market Cap',
        className: 'data-cell',
      },
      {
        key: 'volume24h',
        value: 'Volume (24h)',
        className: 'data-cell',
      },
    ];
  }

  componentDidMount() {
    this.props.setActiveNavBar({ link: 'liveprices', active: false });
  }

  redirectToCoin(coin) {
    this.props.history.push(`/liveprices/${coin.id}`);
  }

  get head() {
    return (
      <thead>
        <tr>
          {this.theadArr.map((thead, ind) => {
            return (
              <th
                key={ind}
                className={`cursor_pointer ${thead.key} ${thead.className}`}
              >
                <p
                  className={this.props.activeClass[thead.key]}
                  onClick={() => this.props.onOrderChange(thead.key)}
                >
                  {thead.value}
                </p>
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }

  get body() {
    return (
      <tbody>
        {this.props.orderedCoins.map((coin, ind) => {
          let change24 = 'text-up';
          if (coin.percentChange24h < 0) {
            change24 = 'text-down';
          }
          return (
            <tr key={coin.id} className="cursor-pointer table_row" onClick={() => this.redirectToCoin(coin)}>
              <td className="number fit">
                <Link to={`/liveprices/${coin.id}`}>{coin.rank}</Link>
              </td>
              <td className="name-c">
                <Link to={`/liveprices/${coin.id}`}>
                  <div className="name-content">
                    <img
                      key={coin.id}
                      alt={`${coin.name}, ${coin.symbol}`}
                      src={coin.iconUrl}
                    />
                    <p>
                      {` ${coin.name} `}{' '}
                      <span className="desktop-show">({coin.symbol})</span>
                    </p>
                  </div>
                </Link>
              </td>
              <td className={`${change24} data-cell`}>
                <Link to={`/liveprices/${coin.id}`}>
                  {coin.percentChange24h.toFixed(2)}%
                </Link>
              </td>
              <td className="data-cell">
                <Link to={`/liveprices/${coin.id}`}>
                  ${numberFormat(coin.price)}
                </Link>
              </td>
              <td className="data-cell">
                <Link to={`/liveprices/${coin.id}`}>
                  {priceBtcFormat(coin.bitcoinPrice)}
                </Link>
              </td>
              <td className="data-cell">
                <Link to={`/liveprices/${coin.id}`}>
                  ${numberFormat(coin.marketCap)}
                </Link>
              </td>
              <td className="data-cell">
                <Link to={`/liveprices/${coin.id}`}>
                  ${numberFormat(coin.volume24h)}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  render() {
    return (
      <table id="CoinsTable" className="reg-table">
        {this.head}
        {this.body}
      </table>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveNavBar: activeBar =>
      dispatch(homeActions.setActiveNavBar(activeBar)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Coins));
