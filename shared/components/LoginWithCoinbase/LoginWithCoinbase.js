import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { auth as authActions } from 'store/actions';
import { isClient } from 'utils/env';
import axiox from 'axios';
import Coinbase from './utils/Coinbase';

class LoginWithCoinbase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailSent: false,
    };
  }

  _coinBaseOAuth() {
    Coinbase.oauth.authorize({
      clientId: '3a6c3e755466f55a2aa033ae9bf6bbca9975b1187fc0695a3937cadfaa3b9e87',
      scopes: 'wallet:accounts:read,wallet:transactions:read,wallet:deposits:read,wallet:withdrawals:read',
      success: (result) => {
        return axiox
          .post('/oauth/coinbase/wallet', {
            code: result.code,
          })
          .then((data) => {
            return this.props.onAuth(data);
          });
      },
    });
  }

  render() {
    return (
      <Button className={`mx-auto mt-3 ${this.props.class}`} onClick={this._coinBaseOAuth.bind(this)}>
        {this.props.text || 'Login with Coinbase'}
      </Button>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    loginWithCoinbase(code) {
      return dispatch(authActions.loginWithCoinbase(code));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginWithCoinbase);
