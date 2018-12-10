import React, { Component } from 'react';
import { numberFormat } from 'utils/formating';
import { portfolioItemsResource } from '../../../../../../api/resources';

class PortfolioTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfit: false,
    };
  }

  priceToProfit() {
    this.setState({ showProfit: !this.state.showProfit });
  }

  profit(portfolio) {
    if (portfolio.profit.USD < 0) {
      return (
        <p className="text-down">
          -${numberFormat(-portfolio.profit.USD)}
          ({portfolio.profitPercent.USD.toFixed(2)}%)
        </p>
      );
    }
    return (
      <p className="text-up">
        ${numberFormat(portfolio.profit.USD)}
        ({portfolio.profitPercent.USD.toFixed(2)}%)
      </p>
    );
  }

  render() {
    return (
      <div className="portfolio-table">
        {this.props.items.map((item) => {
          if (item.coinIsFake) {
            item.coinName = '';
            item.coinImgUrl = `https://s3-us-west-2.amazonaws.com/coin-stats-icons/${item.coinSymbol
              .slice(0, 3)
              .toLowerCase()}.png`;
          }
          return (
            <div key={item.coinId} className="coin-row">
              <div>
                <img width="30px" style={{ marginLeft: '25px', marginTop: '10px' }} className="image mr-2" alt={`${item.coinName}, ${item.coinSymbol}`} src={item.coinImgUrl} />
              </div>
              <div
                title={` ${item.coinName} (${item.coinSymbol}) `}
                className="coin-text portfolio-coin-name cursor-pointer"
                onClick={() => this.props.redirectToCoin(item.coinId)}
              >
                {` ${item.coinName} (${item.coinSymbol}) `}
              </div>
              <div className="coin-text percent cursor-pointer" onClick={this.priceToProfit.bind(this)}>
                {this.state.showProfit
                  ? this.profit(item)
                  : <p>${numberFormat(item.price.USD * item.count)}</p>
                }
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default PortfolioTable;
