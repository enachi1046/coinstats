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
  home as homeActions,
} from 'store/actions';
import Error404 from '../Error404';
import BaseAsyncRoute from '../_BaseAsyncRoute';

class CoinInfoRoute extends BaseAsyncRoute {
  constructor(props) {
    super(props);
    this._loadMoreNews = this._loadMoreNews.bind(this);
    this.state = {
      activeTab: this.props.match.params.tab,
    };
  }

  bootstrap() {
    this.props.setActiveNavBar({ link: this.props.actviveNavBar.link, active: true });
    return Promise.all([
      this.props.fetchCoins(),
      this.props.fetchCoin(this.coinName),
      this.props.fetchPortfolios(),
    ]);
  }

  componentDidMount() {
    this.props.setActiveNavBar({ link: this.props.actviveNavBar.link, active: true });
    if (this.props.cookies.get('mode') === 'light') {
      this.props.setDarkMode(false);
    } else {
      this.props.setDarkMode(true);
    }
    let coinsFetched = Promise.resolve();
    if (!this.props.coins.length) {
      coinsFetched = this.props.fetchCoins();
    }
    coinsFetched.then(() => {
      const promises = [
        this._loadTabData(),
      ];
      if (this.coin && !this.props.isCurrentCoinLoading) {
        if (this.props.user) {
          promises.push(this.props.fetchPortfolios());
        }
      }
      // if (!this.props.coin || this.props.coin.id !== this.coinName) {
      //   promises.push(this.props.fetchCoin(this.coinName));
      // }
      Promise.all(promises);
    });
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.activeTab !== this.state.activeTab) {
      this._loadTabData();
    }
  }

  _loadMoreNews() {
    if (this.props.isNewsByCoinLoading) {
      return;
    }
    const params = {};
    params.lastFeedDate = (
      this.props.news[this.props.news.length - 1] || {}
    ).feedDate;
    params.limit = 20;
    params.keyWords = this.coinName;
    this.props.fetchMoreNewsFeedById('', params);
  }

  _loadTabData() {
    switch (this.state.activeTab) {
      case 'news':
        this.props.fetchNewsByCoin(this.coinName);
        break;
      case 'markets':
        this.props.fetchMarkets(this.coinName);
        break;
      case 'holdings':
        if (this.props.user) {
          this.props.fetchSingleCoinTransactions(this.coinName);
        }
        break;
      default:
        break;
    }
  }

  get coinName() {
    return this.props.match.params.coinName;
  }

  get coin() {
    return this.props.coinsById[this.coinName];
  }

  render() {
    if (!this.coin) {
      if (this.props.isCurrentCoinLoading) {
        return <Loader />;
      }
      return <Error404 />;
    }
    const req = queryString.parse(this.props.location.search);
    const limit = 20;
    const id = req.coinName;
    return (
      <CoinInfo
        id={id}
        limit={limit}
        coin={this.props.coinsById[this.props.match.params.coinName]}
        _loadMoreNews={this._loadMoreNews}
        onTabChange={activeTab => this.setState({ activeTab })}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    actviveNavBar: state.home.actviveNavBar,
    isNewsByCoinLoading: state.news.isNewsByCoinLoading,
    news: state.news.newsByCoin,
    isLoading: state.markets.isMarketsLoading,
    isCurrentCoinLoading: state.coins.isLoading.fetchCoin,
    market: state.markets.markets,
    coinsById: state.coins.coinsById,
    coins: Object.values(state.coins.coinsById).filter(c => !c.fiat),
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveNavBar: activeBar => dispatch(homeActions.setActiveNavBar(activeBar)),
    setDarkMode: (isDark) => {
      return dispatch(uiActions.setDarkMode(isDark));
    },
    fetchMoreNewsFeedById: (action, params) => {
      return dispatch(newsActions.fetchMoreFeedById(action, params));
    },
    fetchCoins: () => {
      return dispatch(coinsActions.loadAll());
    },
    fetchCoin: (name) => {
      return dispatch(coinsActions.fetchCoin(name));
    },
    fetchMarkets: (name) => {
      return dispatch(marketsActions.fetchMarkets(name));
    },
    fetchNewsByCoin: (name) => {
      return dispatch(newsActions.fetchNewsByCoin(name));
    },
    fetchSingleCoinTransactions: (id) => {
      return dispatch(portfolioActions.loadSingleCoinTranscations(id));
    },
    fetchPortfolios: () => {
      return dispatch(portfolioActions.loadPortfolios());
    },
    loadCoinChart(coin, type) {
      return dispatch(coinsActions.loadCoinChart(coin, type));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(CoinInfoRoute));
