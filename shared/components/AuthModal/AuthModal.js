import React, { Component } from 'react';
import Parse from 'parse';
import { withRouter } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { auth as authActions, coins as coinActions } from 'store/actions';
import { isClient } from 'utils/env';
import { childOf } from 'utils/dom';
import { APP_URL } from 'const/api';
import MiniLoader from 'addons/MiniLoader';

import SignUpForm from './components/SignUp';
import SignInForm from './components/SignIn';
import ForgotPasswordForm from './components/ForgotPassword';

class AuthModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registered: false,
      forgotPassword: false,
      showDropdown: false,
    };
    if (isClient() && Parse.User.current()) {
      props.setUser(Parse.User.current());
    }

    this.toggle = this.toggle.bind(this);
  }

  screenClick(event) {
    if (!childOf(event.target, document.getElementById('heroDrop'))) {
      this.setState({
        showDropdown: false,
      });
    }
  }

  componentDidMount() {
    if (isClient()) {
      document.addEventListener('click', this.screenClick.bind(this));
    }
  }

  _initTwitter() {
    window.twitterLogin = (data) => {
      this.props.logInTW(data).then(({ error }) => {
        if (!error) {
          this.toggle();
        } else {
          console.error(error);
        }
      });
    };
  }

  _initFacebook() {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '116525922286255',
        cookie: true,
        xfbml: true,
        version: 'v2.8',
      });
    };

    /* eslint-disable */
    (function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
    /* eslint-enable */
  }

  _twitterLogin() {
    window.open('/oauth/twitter/request', 'Coin Stats - Twitter Login');
  }

  _logInFB() {
    this.props.logInFB().then(({ error }) => {
      if (!error) {
        this.toggle();
      }
    });
  }

  toggle() {
    if (this.props.isOpen) {
      this.setState({
        registered: false,
        forgotPassword: false,
        showDropdown: false,
      });
    }
    this.props.toggleModal(!this.props.isOpen);
  }

  _signIn(login, password) {
    return this.props.logIn(login, password).then(({ error }) => {
      if (!error) {
        this.toggle();
      }
    });
  }

  _signUp(email, password, passwordConfirmation) {
    return this.props
      .signUp(email, password, passwordConfirmation)
      .then(({ error }) => {
        if (!error) {
          this.toggle();
        } else {
          this.setState({ error });
        }
      });
  }

  _onLogOutClick() {
    this.props.cleanOldUserPortfolios();
    this.props.logOut();
    this.props.history.push('/signin');
  }

  _onProUserClick() {
    this.props.toggleSubscriptionModal();
  }

  get logOutPlaceHolder() {
    return (
      <div className="drop-head" onClick={this._onUserNameClick.bind(this)}>
        <p>{this.props.user.displayName || this.props.user.username}</p>
      </div>
    );
  }

  get openButton() {
    // if (!isClient() && !this.props.user) {
    //   return (
    //     <MiniLoader
    //       key="loader"
    //       style={{ height: '20px', width: '20px', margin: '10px' }}
    //     />
    //   );
    // }
    if (this.props.children) {
      return (
        <a className="d-flex" href="javascript:;" onClick={this.toggle}>
          {this.props.children}
        </a>
      );
    }
    return (
      <a
        href="javascript:;"
        className="cs-btn"
        style={{ opacity: 'unset' }}
        onClick={() => this.props.history.push('/signin')}
      >
        {this.props.btnText || 'Sign In'}
      </a>
    );
  }

  componentWillUpdate(prevProps, prevState) {
    if (this.props._onClick) {
      if (prevState.showDropdown !== this.state.showDropdown) {
        this.props._onClick(true);
      } else if (!this.props.user) {
        this.props._onClick(false);
      }
    }
  }

  _onUserNameClick() {
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  }

  forgotPasswordBack() {
    this.setState({ forgotPassword: false });
    this.props.setResetPasswordMessage();
  }

  render() {
    if (this.props.user) {
      return (
        <div
          id="heroDrop"
          className={`hero-drop drop ${
            this.state.showDropdown ? 'active' : ''
          }`}
        >
          {this.logOutPlaceHolder}
          {this.state.showDropdown && (
            <div className="drop-body">
              <ul>
                <li onClick={this._onProUserClick.bind(this)}>
                  <span>Become</span>
                  <span className="icon-pro" />
                </li>
                <li onClick={this._onLogOutClick.bind(this)}>Log Out</li>
              </ul>
            </div>
          )}
        </div>
      );
    }

    let Form = (
      <SignUpForm
        onAlreadyRegistered={() => this.setState({ registered: true })}
        onSignUp={this._signUp.bind(this)}
        onFBLogin={this._logInFB.bind(this)}
        onTWLogin={this._twitterLogin.bind(this)}
      />
    );
    if (this.state.forgotPassword) {
      Form = <ForgotPasswordForm onBack={this.forgotPasswordBack.bind(this)} />;
    } else if (this.state.registered) {
      Form = (
        <SignInForm
          onLogin={this._signIn.bind(this)}
          onSignUp={this._signUp.bind(this)}
          onFBLogin={this._logInFB.bind(this)}
          onTWLogin={this._twitterLogin.bind(this)}
          onBack={() => this.setState({ registered: false })}
          onForgotPassword={() => this.setState({ forgotPassword: true })}
        />
      );
    } else if (this.props.isLoading) {
      Form = (
        <ModalBody>
          <div className="mini-loader" key={0} />
          <h3 className="text-center mt-2">Loggin in...</h3>
        </ModalBody>
      );
    }

    return (
      <div className="sing-in-div">
        {this.openButton}
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.toggle}
          className={`${this.props.className} auth-modal`}
          backdrop={this.props.isLoading ? 'static' : true}
        >
          {Form}
        </Modal>
      </div>
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
    signUp(username, password, repeatPassword) {
      return dispatch(authActions.signUp(username, password, repeatPassword));
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
)(withRouter(AuthModal));
