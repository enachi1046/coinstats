import React, { Component } from 'react';
import { numberFormat } from 'utils/formating';

import Pagination from './components/Pagination';
// import NavBar from './components/NavBar';

class Exchanges extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const coinsByExchange = this.props.coinsByExchange;
    const exchangesList = this.props.exchangesList;
    const coinsToShow = this.props.coinsToShow;

    const head = ['Name/Exchange'];
    Object.keys(exchangesList).map((ex) => {
      if (exchangesList[ex]) {
        head.push(ex);
      }
    });
    const coins = [];
    Object.keys(coinsByExchange).map((coin) => {
      const singeCoin = [];
      coinsToShow.forEach((coinToShow) => {
        if (coin === coinToShow.id) {
          singeCoin.push({
            id: coinToShow.id,
            name: coinToShow.name,
            iconUrl: coinToShow.iconUrl,
            symbol: coinToShow.symbol,
          });
        }
      });
      Object.keys(coinsByExchange[coin]).map((exchange) => {
        let price = 'N/A';
        coinsByExchange[coin][exchange].forEach((element) => {
          if (element.currency === 'USD' || element.currency === 'USDT') {
            price = element.price;
          }
        });
        singeCoin.push(price);
      });
      coins.push(singeCoin);
    });

    const renderLine = coin =>
      Object.keys(coin).map((element, i) => {
        if (i > 0) {
          let price = '';
          if (coin[element] !== 'N/A') {
            price = `$${numberFormat(coin[element])}`;
          } else {
            price = numberFormat(coin[element]);
          }
          return <td key={i}>{price}</td>;
        }
        return (
          <td key={i}>
            <a href={`/currency/${coin[element].id}`} className="coin_name">
              <img width="20px" className="image" alt="" src={coin[element].iconUrl} />
              {` ${coin[element].name} `}
              ({coin[element].symbol})
            </a>
          </td>
        );
      });

    const renderBody = () => coins.map((coin, ind) => <tr key={ind}>{renderLine(coin)}</tr>);

    return (
      <div>
        <div className="base_div">
          <div className="checkBox_col">
            <div className="checkBox_div">
              {Object.keys(exchangesList).map((item, i) => (
                <div key={i}>
                  <label key={i}>
                    <input
                      type="checkbox"
                      defaultChecked={exchangesList[item]}
                      key={i}
                      id={item}
                      className="checkboxes"
                    />
                    {item}
                  </label>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button id="checkBoxSubmitButton" className="cursor_pointer btn btn-default m-bot15">
                Submit
              </button>
              <br />
              <a href="/exchanges">
                <button className="cursor_pointer btn btn-default m-left15">Unselect</button>
              </a>
              <a href="/exchanges/?ex=all">
                <button className="cursor_pointer btn btn-default m-left15">Select All</button>
              </a>
            </div>
          </div>
          <div className="coin_exchange_div">
            <Pagination currentPage={this.props.currentPage} url={this.props.url} />
            <div className="coin_exchange_table">
              <table className="table table-bordered">
                <thead>
                  <tr>{head.map((value, ind) => <th key={ind}>{value}</th>)}</tr>
                </thead>
                <tbody>{renderBody()}</tbody>
              </table>
            </div>
            <Pagination currentPage={this.props.currentPage} url={this.props.url} />
          </div>
        </div>
      </div>
    );
  }
}

export default Exchanges;
