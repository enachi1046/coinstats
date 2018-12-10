import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import config from 'config';
import Home from 'pages/Home';
import { isServer } from 'utils/env';
import { coins as coinsActions, ui as uiActions } from 'store/actions';
import { withCookies } from 'react-cookie';
import { auth as authActions } from 'store/actions';
import BaseAsyncRoute from '../_BaseAsyncRoute';

class HomeRoute extends BaseAsyncRoute {
  constructor(props) {
    super(props);
  }

  render() {
    return <Home {...this.propsFromCookies} />;
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setDarkMode: isDark => dispatch(uiActions.setDarkMode(isDark)),
    setUser: (user) => {
      return dispatch(authActions.setUser({ user }));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(HomeRoute));
