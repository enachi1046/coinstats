import React, { Component } from 'react';
import Parse from 'parse';
import Dropdown from 'react-dropdown';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { auth as authActions, logInModal as logInActions } from 'store/actions';
import { isClient } from 'utils/env';

class SignInModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      login: '',
      password: '',
      showLink: props.showLink !== undefined ? props.showLink : true,
    };
    if (isClient() && Parse.User.current()) {
      props.setUser(Parse.User.current());
    }

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this._initTwitter();
    this._initFacebook();
  }

  toggle() {
    this.props.setIsOpen(!this.props.isOpen);
  }

  _initTwitter() {
    const hash = window.location.search.substr(1);
    if (hash.indexOf('twitter') !== -1) {
      const data = JSON.parse(decodeURIComponent(hash.split('=')[1]));
      this.props.logInTW(data).then(({ error }) => {
        if (!error) {
          this.props.history.push('/portfolios');
        } else {
          console.error(error);
        }
      });
    }
  }

  _initFacebook() {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '116525922286255',
        cookie: true,
        xfbml: true,
        version: 'v2.8',
      });
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  _handleLoginChange(e) {
    this.setState({
      login: e.target.value,
    });
  }

  _handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  _handleSubmit(e) {
    e.preventDefault();
    return this.props.logIn(this.state.login, this.state.password).then(({ error }) => {
      if (!error) {
        // this.props.history.push('/portfolios');
        this.toggle();
      }
    });
  }

  onLogOutClick() {
    this.props.logOut();
  }

  get logOutPlaceHolder() {
    return <p className="log-out-place-holder">{this.props.user.displayName}</p>;
  }

  render() {
    if (this.props.user && this.state.showLink) {
      return (
        <a href="javascript:;" className="nav-link log-out-dropdown">
          <Dropdown
            options={[
              {
                value: 'logout',
                label: 'Log Out',
              },
            ]}
            onChange={this.onLogOutClick.bind(this)}
            placeholder={this.logOutPlaceHolder}
          />
        </a>
      );
    }

    let OpenButton = '';
    if (this.props.children) {
      OpenButton = (
        <a className="d-flex" href="javascript:;" onClick={this.toggle}>
          {this.props.children}
        </a>
      );
    } else if (this.state.showLink) {
      OpenButton = (
        <a href="javascript:;" className="nav-link highlighted" onClick={this.toggle}>
          {this.props.btnText || 'Sign In'}
        </a>
      );
    }

    return (
      <div>
        {OpenButton}
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.toggle}
          className={this.props.className}
          backdrop={this.props.isLoading ? 'static' : true}
        >
          <ModalHeader toggle={this.toggle} />
          <ModalBody className="text-center">
            <form id="loginForm" onSubmit={this._handleSubmit.bind(this)} method="POST">
              <h3 className="mb-5">SIGN IN</h3>
              <div className="sign-div">
                <input
                  type="text"
                  placeholder="Email"
                  className="email input-in-modal"
                  onChange={this._handleLoginChange.bind(this)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="password input-in-modal"
                  onChange={this._handlePasswordChange.bind(this)}
                  required
                />
                <div className="already-have-div">
                  <a href="#" className="already-have">
                    Forgot Password?
                  </a>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="justify-center">
            <div>
              <Button
                className="btn-highlighted text-white p-0"
                type="submit"
                form="loginForm"
                disabled={this.props.isLoading}
              >
                {this.props.isLoading ? <i className="fas fa-spinner fa-spin" /> : 'Sign In'}
              </Button>
              <div className="sign-up-fb mb-2 cursor-pointer" onClick={() => this.props.logInFB()}>
                Continue with Facebook
              </div>
              <div className="sign-up-tw mb-2 cursor-pointer" onClick={() => this.props.logInTW()}>
                Continue with Twitter
              </div>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.logInModal.isOpen,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setIsOpen: value => dispatch(logInActions.setIsOpen(value)),
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
)(SignInModal);
