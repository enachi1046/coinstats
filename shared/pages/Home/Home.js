import React, { Component } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import HomePageLayout from 'layouts/HomePage';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import storage from 'utils/storage';
import AuthModal from 'components/AuthModal';
import DarkLightSwitch from 'components/darkLightSwitch/DarkLightSwitch';
import { auth as authActions, ui as uiActions } from 'store/actions';
import { isServer } from 'utils/env';
import SubscribeModal from 'components/SubscribeModal';
import { Col, Row } from 'reactstrap';

import ImgIMacDark from 'assets/images/home/imac-dark.png';
import ImgIPhoneAlerts from 'assets/images/home/iphone-alerts.png';
import ImgIPhoneBot from 'assets/images/home/iphone-bot.png';
import ImgIPhoneNews from 'assets/images/home/iphone-news.png';
import ImgIPhonePrices from 'assets/images/home/iphone-prices.png';
import ImgIPhoneWallet from 'assets/images/home/iphone-wallet.png';

import ImgAppStore from 'assets/images/stores/app-store.svg';
import ImgPlayStore from 'assets/images/stores/google-play.svg';
import ImgMacStore from 'assets/images/stores/mac-store.svg';

import ImgExchangesBinance from 'assets/images/home/exchanges/binance.png';
import ImgExchangesBitfinex from 'assets/images/home/exchanges/bitfinex.png';
import ImgExchangesBitstamp from 'assets/images/home/exchanges/bitstamp.png';
import ImgExchangesBittrex from 'assets/images/home/exchanges/bittrex.png';
import ImgExchangesCoinbase from 'assets/images/home/exchanges/coinbase.png';
import ImgExchangesCryptopia from 'assets/images/home/exchanges/cryptopia.png';
import ImgExchangesGdax from 'assets/images/home/exchanges/gdax.png';
import ImgExchangesGemini from 'assets/images/home/exchanges/gemini.png';
import ImgExchangesHitbtc from 'assets/images/home/exchanges/hitbtc.png';
import ImgExchangesHuobi from 'assets/images/home/exchanges/huobi.png';
import ImgExchangesKraken from 'assets/images/home/exchanges/kraken.png';
import ImgExchangesKuCoin from 'assets/images/home/exchanges/kucoin.png';
import ImgExchangesLiqui from 'assets/images/home/exchanges/liqui.png';
import ImgExchangesPoloniex from 'assets/images/home/exchanges/poloniex.png';

import ImgIconChart from 'assets/images/home/chart.svg';
import ImgIconNews from 'assets/images/home/news.svg';
import ImgIconPortfolio from 'assets/images/home/portfolio.svg';
import ImgIconRing from 'assets/images/home/ring.svg';

import ImgIconCoinStats from 'assets/images/icons/coin-stats.png';
import ImgIconInfo from 'assets/images/icons/icon-info.png';

import Footer from './components/Footer';
import uiReducer from '../../store/reducers/ui';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  toggleColor() {
    this.props.toggleDarkMode();
  }

  onSignInClick() {
    this.props.toggleModal(!this.props.isOpen);
  }

  get singUp() {
    if (!this.props.user) {
      return (
        <div className="sign-up-btn-home d-block" onClick={this.onSignInClick.bind(this)}>
          Sign Up
        </div>
      );
    }
    return '';
  }

  _toggleHeader() {
    document.getElementById('burger').classList.toggle('is-active');
    document.getElementById('main-menu').classList.toggle('show');
  }

  render() {
    let subscribeModal;
    if (!isServer()) {
      subscribeModal = <SubscribeModal />;
    }
    const exchangeImgStyle = {
      height: '61px',
      objectFit: 'contain',
      width: 'auto',
    };
    return (
      <HomePageLayout id="home" {...this.props}>
        <Helmet>
          <title>{config('htmlPage.title.home')}</title>
          <meta
            name="description"
            content={config('htmlPage.description.home')}
          />
          <meta
            name="keywords"
            content={config('htmlPage.keywords.home')}
          />
        </Helmet>

        <div className="pattern" />
        <header id="landing-header">
          <button
            id="burger"
            className="hamburger hamburger--slider"
            type="button"
            onClick={this._toggleHeader.bind(this)}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner hamburger-lines" />
            </span>
          </button>
          <div id="main-menu">
            <ul>
              <li className="routers">
                <a href="https://coinstats.app/direct">Direct</a>
              </li>
              <li className="routers">
                <Link to="/liveprices">live prices</Link>
              </li>
              <li className="routers">
                <Link to="/news">news</Link>
              </li>
              <li className="routers">
                <Link to="/portfolio">portfolio</Link>
              </li>
              <li className="routers">
                <AuthModal user={this.props.user} />
              </li>
            </ul>
          </div>
          {subscribeModal}
          <div className="clearfix" />
          <div className="row">
            <div className="col-md-5">
              <div id="contentLeft" className="text-center">
                <img src={ImgIconCoinStats} className="header-logo" />
                <h1 id="mainTitle" className="animated fadeInRight">
                  Cryptocurrency research and portfolio tracker
                </h1>
                {this.singUp}
                <span />
                <div className="help-center">
                  <img src={ImgIconInfo} />
                  <a href="http://help.coin-stats.com/">Help Center</a>
                </div>
              </div>
              <span>
                <Row className="dowload-imgs">
                  <Col className="col-auto">
                    <a
                      href="https://itunes.apple.com/us/app/coin-stats-crypto-portfolio/id1387758574?mt=12"
                      target="_blank"
                    >
                      <img src={ImgMacStore} className="mac-store" />
                    </a>
                  </Col>
                  <Col className="col-auto">
                    <a
                      href="https://itunes.apple.com/us/app/coin-stats-btc-eth-xrp-prices-and-altfolio/id1247849330?mt=8"
                      target="_blank"
                    >
                      <img src={ImgAppStore} className="app-store" />
                    </a>
                  </Col>
                  <Col className="col-auto">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.coinstats.crypto.portfolio"
                      target="_blank"
                    >
                      <img src={ImgPlayStore} className="google-play" />
                    </a>
                  </Col>
                </Row>
              </span>
            </div>
            <div className="col-md-7 d-sm-none d-none d-md-block">
              <div id="contentRight">
                <img src={ImgIMacDark} className="imac-dark img-fluid animated zoomIn" />
              </div>
            </div>
          </div>
        </header>

        <div id="main-content" className="container">
          <div className="features_part">
            <div className="title_header text-center">features</div>
            <div className="clearfix" />
            <div className="row align-items-center phone_part">
              <div className="col col-auto phone-dark order-sm-first order-last">
                <img src={ImgIPhonePrices} className="" />
              </div>
              <div className="col-12 col-sm-6 col-md-7 col-lg-8">
                <div className="text">
                  <div className="row align-items-center features_header">
                    <div className="image col col-auto">
                      <img src={ImgIconChart} />
                    </div>
                    <span className="col">Track prices of over 1800 cryptocurrencies</span>
                  </div>
                  <div className="features_content">
                    Live prices from over 80 exchanges in one place with extensive filtering and sorting options
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center phone_part">
              <div className="col-12 col-sm-6 col-md-7 col-lg-8">
                <div className="text_left">
                  <div className="row align-items-center features_header">
                    <div className="image col col-auto">
                      <img src={ImgIconRing} />
                    </div>
                    <span className="col">Set customized Alerts</span>
                  </div>
                  <div className="features_content">
                    Set price limits volume and market cap alerts to never lose an opportunity
                  </div>
                </div>
              </div>
              <div className="col col-auto phone-dark">
                <img src={ImgIPhoneAlerts} className="" />
              </div>
            </div>

            <div className="clearfix" />
            <div className="row align-items-center phone_part">
              <div className="col col-auto phone-dark order-sm-first order-last">
                <img src={ImgIPhoneNews} className="" />
              </div>
              <div className="col-12 col-sm-6 col-md-7 col-lg-8">
                <div className="text">
                  <div className="row align-items-center features_header">
                    <div className="image col col-auto">
                      <img src={ImgIconNews} />
                    </div>
                    <span className="col">Follow the latest news</span>
                  </div>
                  <div className="features_content">Latest crypto news from 40 sources and search options</div>
                </div>
              </div>
            </div>

            <div className="clearfix" />
            <div className="row align-items-center phone_part">
              <div className="col-12 col-sm-6 col-md-7 col-lg-8">
                <div className="text_left">
                  <div className="row align-items-center features_header">
                    <div className="image col col-auto">
                      <img src={ImgIconPortfolio} />
                    </div>
                    <span className="col">
                      Sync your portfolio with your exchange accounts and wallets
                    </span>
                  </div>
                  <div className="features_content">
                    Connect your account to more than 30 exchanges and wallets to sync your portfolio automatically.
                  </div>
                  <div className="features_content row">
                    <div className="col-sm-6 col-md-3 col-4 ">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesBinance}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesBitfinex}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesBitstamp}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesBittrex}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesCoinbase}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesCryptopia}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesGdax}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesGemini}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesHitbtc}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesHuobi}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesKraken}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesKuCoin}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesLiqui}
                      />
                    </div>
                    <div className="col-sm-6 col-md-3 col-4">
                      <img
                        className="img-fluid m-1"
                        style={exchangeImgStyle}
                        src={ImgExchangesPoloniex}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto col phone-dark">
                <img src={ImgIPhoneWallet} />
              </div>
            </div>
          </div>
          <div>
            <div className="clearfix" />
            <div id="bot-part">
              <div className="title_header text-center">coin stats bot</div>

              <div className="clearfix" />
              <div className="phone_part row align-items-center">
                <div className="col col-auto phone-dark">
                  <img src={ImgIPhoneBot} className="" />
                </div>
                <div className="text col">
                  <div className="features_content">
                    Try Coin Stats Telegram Bot to get latest prices and charts.
                  </div>
                  <a href="http://t.me/coinstatsappbot" target="_blank">
                    <div className="try-now-btn">Try Now</div>
                  </a>
                </div>
              </div>
            </div>

            <div id="tastimonials">
              <div className="title_header text-center testimonials-header">testimonials</div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="testimonials">
                    The best portfolio tracker app I’ve ever used. Very easy to sync with your wallet and exchange
                    accounts. Also like the daily notifications, which help to get on top of the market.
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="testimonials">
                    I use Coin Stats not only for tracking price change but it’s very easy way to read crypto news.
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="testimonials">
                    I like the free API integration available in iOS and supports both iPad and iPhone. The periodic tips
                    from the market are really helpful, I’ve used two of those tips in my trading within one week of using
                    the app and it worked out well.
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="testimonials">
                    I loved this app before I discovered a bunch of features I didn’t realize were there. This does almost
                    everything you could want in a crypto portfolio app.
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a
                href="https://itunes.apple.com/us/app/coin-stats-crypto-portfolio/id1387758574?mt=12"
                target="_blank"
                className=" "
              >
                <img src={ImgMacStore} className="mac-store" />
              </a>
              <a
                href="https://itunes.apple.com/us/app/coin-stats-btc-eth-xrp-prices-and-altfolio/id1247849330?mt=8"
                target="_blank"
                className="ml-4"
              >
                <img src={ImgAppStore} className="app-store" />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.coinstats.crypto.portfolio"
                target="_blank"
                className="ml-4"
              >
                <img src={ImgPlayStore} className="google-play" />
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </HomePageLayout>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isOpen: state.auth.isModalOpen,
    isLoading: state.auth.isLoading,
    user: ownProps.user || state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDarkMode: () => {
      return dispatch(uiActions.toggleDarkMode());
    },
    toggleModal: (v) => {
      return dispatch(authActions.toggleModal(v));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Home));
