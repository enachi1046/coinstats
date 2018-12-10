import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import config from 'config';
import { isServer } from 'utils/env';
import storage from 'utils/storage';
import {
  home as homeActions,
  coins as coinsActions,
  ui as uiActions,
} from 'store/actions';
import Auth from 'pages/Auth';
import BaseAsyncRoute from '../_BaseAsyncRoute';

class AuthRoute extends BaseAsyncRoute {
  constructor(props) {
    super(props);
  }

  bootstrap() {
    this.props.setActiveNavBar({ link: 'signup', active: false });
    return Promise.all([
    ]);
  }

  componentDidMount() {
    if (this.props.cookies.get('mode') === 'light') {
      this.props.setDarkMode(false);
    } else {
      this.props.setDarkMode(true);
    }
    this.props.setActiveNavBar({ link: 'signup', active: false });
  }

  render() {
    return <Auth {...this.propsFromCookies} />;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.coins.isCoinsLoading,
    coins: Object.values(state.coins.coinsById),
    sources: state.news.sources,
    news: state.news.news,
    fiats: Object.values(state.coins.coinsById).filter((c) => {
      return c.fiat && c.symbol !== 'USD';
    }),
    nonFiatsCoins: Object.values(state.coins.coinsById).filter(c => !c.fiat),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchMainPair(v) {
      return dispatch(coinsActions.switchMainPair(v));
    },
    setDarkMode: (isDark) => {
      return dispatch(uiActions.setDarkMode(isDark));
    },
    setActiveNavBar: (activeBar) => {
      return dispatch(homeActions.setActiveNavBar(activeBar));
    },
    loadCoins: () => {
      return dispatch(coinsActions.loadAll());
    },
    loadFiats: () => {
      return dispatch(coinsActions.loadFiats());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(AuthRoute));
