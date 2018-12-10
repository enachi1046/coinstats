import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MultiSelectSearchDropdown from 'addons/MultiSelectSearchDropdown';
import { home as homeActions } from 'store/actions';

class LivePricesSearch extends Component {
  get items() {
    return this.props.coins.map((coin) => {
      return {
        label: [
          <img src={coin.iconUrl} alt="" />,
          <p>{coin.name} ({coin.symbol})</p>,
        ],
        search: [coin.name, coin.symbol],
        value: `${coin.id}`,
      };
    });
  }

  onSearch(coinId) {
    this.props.setActiveNavBar({ link: 'liveprices', active: false });
    this.props.history.push(`/liveprices/${coinId}`);
  }

  render() {
    return (
      <MultiSelectSearchDropdown items={this.items} onChange={this.onSearch.bind(this)} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveNavBar: activeBar => dispatch(homeActions.setActiveNavBar(activeBar)),
  };
}

function mapStateToProps(state) {
  return {
    coins: Object.values(state.coins.coinsById),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(LivePricesSearch));
