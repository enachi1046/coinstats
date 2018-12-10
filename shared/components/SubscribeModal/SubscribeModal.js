import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  Col, Row, Modal, ModalBody, ModalFooter, Input,
} from 'reactstrap';

import storage from 'utils/storage';
import { auth as authActions } from 'store/actions';
import { APP_URL_V2, SHAPESHIFT_URL } from 'const/api';
import config from 'config';
import { isClient } from 'utils/env';

import ImgAppStore from 'assets/images/stores/app-store.svg';
import ImgPlayStore from 'assets/images/stores/google-play.svg';
import ImgMacStore from 'assets/images/stores/mac-store.svg';
import Img35Off from 'assets/images/35off.png';


class SubscribeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promoCode: '',
      coupon: null,
      error: '',
    };
    this.plan = 'coin_stats_pro_monthly';
    const url = `${APP_URL_V2}subscriptions`;
    if (isClient()) {
      this.handler = window.StripeCheckout.configure({
        key: config('stripe.apiKey'),
        image: '//coinstats.app/imgs/favicon.png',
        locale: 'auto',
        token: (token) => {
          axios.post(
            url,
            {
              stripeEmail: token.email,
              stripeToken: token.id,
              stripePlan: this.plan,
              promoCode: this.state.promoCode,
            },
            {
              headers: {
                token: this.props.token,
              },
            },
          ).then((res) => {
            if (res.data.success) {
              this.handler.close();
              storage.setItem('HAS_UNLIMITED', true);
              this.props.toggleSubscriptionModal(false);
              location.reload();
            }
          }).catch((err, d) => {
            this.setState({
              error: err.response.data.error.message,
            });
          });
        },
      });
    }
    this.checkPromoCodeTimeout = null;

    this.clickBtn = this.clickBtn.bind(this);
    this.checkPromoCode = this.checkPromoCode.bind(this);
    this._onPromoCodeChange = this._onPromoCodeChange.bind(this);
  }

  clickBtn(plan) {
    this.plan = plan;
    this.handler.open({
      name: 'Coin Stats, Inc.',
      description: '2 widgets',
    });
  }

  payWithAltcoin(e) {
    e.preventDefault();
    const windowConfs =
      'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0';
    window.open(SHAPESHIFT_URL.replace('{amount}', this.lifetimePrice), '1418115287605', windowConfs);
    return false;
  }

  checkPromoCode() {
    axios.get(`${APP_URL_V2}/subscriptions/promo_code/${this.state.promoCode}`, {
      headers: {
        token: this.props.token,
      },
    }).then((res) => {
      this.setState({
        coupon: res.data.coupon,
      });
    }).catch(() => {
      this.setState({
        coupon: null,
      });
    });
  }

  _onPromoCodeChange(e) {
    this.setState({
      promoCode: e.target.value,
    });
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.promoCode !== this.state.promoCode) {
      if (this.checkPromoCodeTimeout) {
        clearTimeout(this.checkPromoCodeTimeout);
      }
      this.checkPromoCodeTimeout = setTimeout(this.checkPromoCode, 500);
    }
  }

  applyCoupon(price) {
    const { coupon } = this.state;
    if (coupon) {
      if (coupon.percent_off) {
        price -= (price * coupon.percent_off / 100);
      }
      if (coupon.amount_off) {
        price -= coupon.amount_off;
      }
    }
    return price;
  }

  get monthlyPrice() {
    return Number(this.applyCoupon(5).toFixed(2));
  }

  get yearlyPrice() {
    return Number(this.applyCoupon(39.99).toFixed(2));
  }

  get lifetimePrice() {
    return Number(this.applyCoupon(0.015).toFixed(3));
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggleSubscriptionModal}
        className={`${this.props.className} modal-custom`}
      >
        <div className="modal-header border0 pb-0">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => this.props.toggleSubscriptionModal(false)}
          >
            <span aria-hidden="true">
              {' '}
              <img src="/img/close.png" alt="" />{' '}
            </span>
          </button>
        </div>
        <ModalBody className="subscribe-modal-body">
          <div className="text-center">
            <div className="subscription-header">Coin Stats Pro</div>
            <div className="subscription-content">Unlimited access with Coin Stats Pro</div>
          </div>
          <div className="subscription-text">
            <div className="pro_privilege">
              <img src="/img/checked.svg" />
              <span>Portfolio Pro</span> - Track more than 2 exchanges or wallets
            </div>
            <div className="pro_privilege">
              <img src="/img/checked.svg" />
              <span>Export portfolio</span> - Ability to export your portfolio for tax purposes
            </div>
            <div className="pro_privilege">
              <img src="/img/checked.svg" />
              <span>Pro access</span> on <span>Coin Stats iOS</span> and <span>Android app</span>
            </div>
          </div>
          <Row className="text-center download-app-div">
            <Col className="col-auto">
              <a
                href="https://itunes.apple.com/us/app/coin-stats-btc-eth-xrp-prices-and-altfolio/id1247849330?mt=8"
                target="_blank"
              >
                <img src={ImgAppStore} className="app-store mt-4" />
              </a>
            </Col>
            <Col className="col-auto">
              <a
                href="https://play.google.com/store/apps/details?id=com.coinstats.crypto.portfolio"
                target="_blank"
              >
                <img src={ImgPlayStore} className="google-play mt-4" />
              </a>
            </Col>
          </Row>
          <Row>
            <Input
              className="mx-auto"
              style={{ maxWidth: '400px' }}
              onChange={this._onPromoCodeChange}
              value={this.state.promoCode}
              placeholder="Promo Code"
            />
          </Row>
          <Row className="subscribe-variants mt-3">
            <Col className="col-4 subscribe-variant" onClick={() => this.clickBtn('coin_stats_pro_monthly')}>
              ${this.monthlyPrice}
              <div className="variant">monthly</div>
            </Col>
            <Col className="col-4 subscribe-variant" onClick={() => this.clickBtn('coin_stats_pro_yearly')}>
              ${this.yearlyPrice}
              <div className="variant">
                yearly <img src={Img35Off} />
              </div>
            </Col>
            <Col className="col-4 subscribe-variant" onClick={this.payWithAltcoin.bind(this)}>
              {this.lifetimePrice} ฿
              <div className="variant">lifetime</div>
            </Col>
          </Row>
          <div className="m-top15">
            <h4 className="text-center m-top15 text-danger"> {this.state.error}</h4>
          </div>
        </ModalBody>
        <ModalFooter className="subscribe-modal-footer ">
          <span>Terms of Use</span> and <span>Privacy Policy</span>
        </ModalFooter>
      </Modal>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    isOpen: state.subscription.isModalOpen,
    token: state.auth.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSubscriptionModal() {
      return dispatch(authActions.toggleSubscriptionModal());
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubscribeModal);
