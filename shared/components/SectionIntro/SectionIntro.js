import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthModal from 'components/AuthModal';
import ImgETHDollar1 from 'assets/images/home/media/eth_dollar-1.svg';
import ImgETHDollar2 from 'assets/images/home/media/eth_dollar-2.svg';
import ImgETHDollar3 from 'assets/images/home/media/eth_dollar-3.svg';
import ImgETHDollar4 from 'assets/images/home/media/eth_dollar-4.svg';
import ImgETHDollar5 from 'assets/images/home/media/eth_dollar-5.svg';
import ImgETHDollar6 from 'assets/images/home/media/eth_dollar-6.svg';
import Link from 'react-router-dom/Link';

class SectionIntro extends Component {
  render() {
    let BtnGetStarted = <AuthModal btnText="Get Started" />;
    if (this.props.user) {
      BtnGetStarted = (
        <Link to="/portfolio" className="cs-btn" style={{ opacity: 'unset' }}>
          Get Started
        </Link>
      );
    }
    return (
      <div className="guide np">
        <ul className="bottom-intro">
          <li>
            <h1>
              Track Your Crypto Portfolio <br /> with 1 minute setup
            </h1>
            <ul className="bottom-intro-l">
              <li>
                <div className="icon-case" />
                <p>Auto sync your exchanges and wallets</p>
              </li>
              <li>
                <div className="icon-news" />
                <p>Personalized crypto news feed</p>
              </li>
              <li>
                <div className="icon-statistics" />
                <p>
                  More than 3000 cryptocurrencies and 100 exchanges available
                </p>
              </li>
              <li>
                <div className="icon-chat" />
                <p>
                  Chat with crypto teams on <a href="#">Coin Stats Direct</a>
                </p>
              </li>
            </ul>
            <div className="btn-wrapper">
              {BtnGetStarted}
              <small>NO CREDIT CARD NEEDED</small>
            </div>
          </li>
          <li>
            <img src={ImgETHDollar1} />
            <img src={ImgETHDollar2} />
            <img src={ImgETHDollar3} />
            <img src={ImgETHDollar4} />
            <img src={ImgETHDollar5} />
            <img src={ImgETHDollar6} />
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: ownProps.user || state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionIntro);
