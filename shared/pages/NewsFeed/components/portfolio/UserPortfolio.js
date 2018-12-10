import React, { Component } from 'react';
import { connect } from 'react-redux';
import { numberFormat } from 'utils/formating';

import PortfolioTable from './components/PortfolioTable';

class UserPortfolio extends Component {
  constructor(props) {
    super(props);
  }

  profit() {
    if (this.props.portfolios[0]) {
      if (this.props.portfolios[0].profit.USD < 0) {
        return (
          <p className="text-down">
            -${numberFormat(-this.props.portfolios[0].profit.USD)}
            ({this.props.portfolios[0].profitPercent.USD.toFixed(2)}%)
          </p>
        );
      }
      return (
        <p className="text-up">
          ${numberFormat(this.props.portfolios[0].profit.USD)}
          ({this.props.portfolios[0].profitPercent.USD.toFixed(2)}%)
        </p>
      );
    }
  }

  get orderedItems() {
    const items = this.props.portfolios[0].portfolioItems;
    items.sort((a, b) => {
      if (a.price.USD * a.count < b.price.USD * b.count) {
        return 1;
      }
      if (a.price.USD * a.count > b.price.USD * b.count) {
        return -1;
      }
      return 0;
    });
    return items;
  }

  component() {
    let price;
    if (this.props.portfolios[0]) {
      price = this.props.portfolios[0].price.USD;
    }
    const topValue = `${this.props.topValue}px`;
    const calcValue = `calc(100vh - ${Number(this.props.topValue) + 10}px)`;
    return (
      <div className="user-portfolio" style={{ top: topValue, height: calcValue }}>
        <p className="total-row">
          <p style={{ margin: '0' }}>Total {numberFormat(price)}</p>
          <p>{this.profit()}</p>
        </p>
        <PortfolioTable items={this.orderedItems} redirectToCoin={this.props.redirectToCoin} />
      </div>
    );
  }

  render() {
    return this.props.portfolios[0] ? this.component() : this.props.children;
  }
}
function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {
    portfolios: state.coins.portfolios,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPortfolio);
