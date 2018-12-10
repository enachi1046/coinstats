import React from 'react';
import { connect } from 'react-redux';
import { coins as coinsActions } from 'store/actions';
import axios from 'axios';
import BaseAsyncRoute from '../_BaseAsyncRoute';
import Unsubscribe from '../../components/unsubscribe/Unsubscribe';

class UnsubscribeRoute extends BaseAsyncRoute {
  _onUnsubscribe(email) {
    return axios.post('/unsubscribe', {
      email,
    });
  }

  render() {
    return (
      <Unsubscribe onUnsubscribe={this._onUnsubscribe.bind(this)} />
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCoins: () => {
      return dispatch(coinsActions.loadAll());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnsubscribeRoute);
