import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import {
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  Card,
  Button,
} from 'reactstrap';
import { auth as authActions, coins as coinActions } from 'store/actions';

import Layout from 'layouts/Blank';
import { isServer } from 'utils/env';
import storage from 'utils/storage';
import config from 'config';
import { isClient } from 'utils/env';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SocialLogin from './components/SocialLogin';
import ForgotPassword from './components/ForgotPassword';

const AUTH_SECTIONS = ['recovery', 'signin', 'signup', 'social'];

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 'social',
    };
  }

  componentDidMount() {
    document.getElementsByTagName('body')[0].className +=
      ' slides chain fast noPreload animated firstSlide stage-1';
  }

  getSectionState(name) {
    const { activePage } = this.state;
    let state;
    if (name === activePage) {
      state = 'active';
    } else {
      state =
        AUTH_SECTIONS.indexOf(name) > AUTH_SECTIONS.indexOf(activePage)
          ? 'after'
          : 'before';
    }
    return state;
  }

  _onAuth() {
    this.props.history.push('/portfolio');
  }

  _onSignIn() {
    return this._onAuth();
  }

  _onSignUp() {
    return this._onAuth();
  }

  render() {
    return (
      <Layout id="auth" {...this.props}>
        <Helmet>
          <title>{config('htmlPage.title.portfolio')}</title>
          <meta
            name="description"
            content={config('htmlPage.description.portfolio')}
          />
          <meta
            name="keywords"
            content={config('htmlPage.keywords.portfolio')}
          />
        </Helmet>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
          <symbol id="facebook2" viewBox="0 0 512 512">
            <path d="M288 176v-64c0-17.664 14.336-32 32-32h32v-80h-64c-53.024 0-96 42.976-96 96v80h-64v80h64v256h96v-256h64l32-80h-96z" />
          </symbol>
          <symbol id="twitter" viewBox="0 1 24 23">
            <path d="M21.5 7.6v.6c0 6.6-5 14.1-14 14.1-2.8 0-5.4-.8-7.6-2.2l1.2.1c2.3 0 4.4-.8 6.1-2.1-2.2 0-4-1.5-4.6-3.4.3.1.6.1.9.1.5 0 .9-.1 1.3-.2-2.1-.6-3.8-2.6-3.8-5 .7.4 1.4.6 2.2.6-1.3-.9-2.2-2.4-2.2-4.1 0-.9.2-1.8.7-2.5 2.4 3 6.1 5 10.2 5.2-.1-.4-.1-.7-.1-1.1 0-2.7 2.2-5 4.9-5 1.4 0 2.7.6 3.6 1.6 1-.3 2.1-.7 3-1.3-.4 1.2-1.1 2.1-2.2 2.7 1-.1 1.9-.4 2.8-.8-.6 1.1-1.4 2-2.4 2.7z" />
          </symbol>
        </svg>
        <ForgotPassword
          state={this.getSectionState('recovery')}
          onSectionChange={activePage => this.setState({ activePage })}
        />
        <SignIn
          state={this.getSectionState('signin')}
          onSectionChange={activePage => this.setState({ activePage })}
          onSignIn={this._onSignIn.bind(this)}
        />
        <SignUp
          state={this.getSectionState('signup')}
          onSectionChange={activePage => this.setState({ activePage })}
          onSignIn={this._onSignIn.bind(this)}
          onSignUp={this._onSignUp.bind(this)}
        />
        <SocialLogin
          state={this.getSectionState('social')}
          onSectionChange={activePage => this.setState({ activePage })}
          onSignIn={this._onSignIn.bind(this)}
        />
      </Layout>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    hasUnlimited: state.auth.hasUnlimited,
    isOpen: state.auth.isModalOpen,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    user: state.auth.user || ownProps.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setResetPasswordMessage() {
      return dispatch(authActions.setResetPasswordMessage());
    },
    toggleSubscriptionModal() {
      return dispatch(authActions.toggleSubscriptionModal());
    },
    cleanOldUserPortfolios: () => {
      return dispatch(coinActions.cleanOldUserPortfolios());
    },
    toggleModal: (v) => {
      return dispatch(authActions.toggleModal(v));
    },
    logIn(username, password) {
      return dispatch(authActions.logIn(username, password));
    },
    logInFB() {
      return dispatch(authActions.logInFB());
    },
    logInTW(data) {
      return dispatch(authActions.logInTW(data));
    },
    logOut() {
      return dispatch(authActions.logOut());
    },
    setUser(user) {
      return dispatch(
        authActions.setUser({
          user,
        }),
      );
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Auth));
