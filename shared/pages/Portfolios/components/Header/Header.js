import React, { Component } from 'react';
import { Nav, Input } from 'reactstrap';
import { connect } from 'react-redux';

import { switchMainPair, toggleSubscriptionModal } from 'store/actions';
import storage from 'utils/storage';

import HeaderDropdown from './HeaderDropdown';
import ImgCoinStatsLogo from '../../../public/img/coin-stats-logo.png';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  switchMainPair(e) {
    storage.setItem('currency', e.target.value);
    this.props.switchMainPair(e.target.value);
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  render() {
    const subscribeModal = '';
    return (
      <header className="topbar">
        <nav className="navbar top-navbar navbar-expand-md">
          <div className="navbar-header">
            <img className="mr-2" height="36px" src={ImgCoinStatsLogo} alt="Coin Stats" />
            <b className="coin-stats-logo-text">Coin Stats</b>
          </div>
          <Nav className="ml-auto nav-custom-width p-right15" navbar>
            {subscribeModal}
            <li className="change-main-pair">
              <Input
                type="select"
                onChange={this.switchMainPair.bind(this)}
                value={this.props.globalMainPair.symbol}
                className="main-pair-select form-control-sm"
                style={{
                  height: '28px',
                }}
              >
                <option value="USD">USD</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                {this.props.fiats.map((currency, ind) => (
                  <option value={currency.symbol} key={currency.symbol}>
                    {currency.symbol}
                  </option>
                ))}
              </Input>
            </li>
            <HeaderDropdown />
          </Nav>
        </nav>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    globalMainPair: state.coins.globalMainPair,
    fiats: Object.values(state.coins.coinsById).filter(c => c.fiat && c.symbol !== 'USD'),
    hasUnlimited: state.auth.hasUnlimited,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchMainPair(v) {
      return dispatch(switchMainPair(v));
    },
    toggleSubscriptionModal(a) {
      return dispatch(toggleSubscriptionModal(a));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
