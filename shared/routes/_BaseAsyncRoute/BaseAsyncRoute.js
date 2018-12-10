import React, { Component } from 'react';
import Helmet from 'react-helmet';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import CoinInfo from 'pages/CoinInfo';
import Loader from 'addons/Loader';
import { isServer } from 'utils/env';
import {
  coins as coinsActions,
  markets as marketsActions,
  news as newsActions,
  portfolios as portfolioActions,
  ui as uiActions,
} from 'store/actions';
import { parseCookies } from 'utils/storage/cookies';

class BaseAsyncRoute extends Component {
  constructor(props) {
    super(props);
  }

  get propsFromCookies() {
    let result = { user: null, theme: null };
    if (isServer()) {
      result = parseCookies(this.props.browserCookies);
    }
    return result;
  }
}

export default BaseAsyncRoute;
