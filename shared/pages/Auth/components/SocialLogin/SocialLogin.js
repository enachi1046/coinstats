import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parse from 'parse';
import { auth as authActions, coins as coinActions } from 'store/actions';
import { isClient } from 'utils/env';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: false,
    };
    if (isClient() && Parse.User.current()) {
      props.setUser(Parse.User.current());
    }
  }

  componentWillMount() {
    if (isClient()) {
      this._initTwitter();
      this._initFacebook();
    }
  }

  get className() {
    const classes = ['slide', 'blackSlide'];
    if (this.props.state) {
      classes.push(this.props.state);
      classes.push('animate');
      if (this.props.state === 'active') {
        classes.push('selected');
      }
    }
    return classes.join(' ');
  }

  _initTwitter() {
    window.twitterLogin = (data) => {
      this.props.logInTW(data).then(({ error }) => {
        this.setState(
          {
            error,
          },
          () => {
            if (!error) {
              this.props.onSignIn();
            } else {
              console.error(error);
            }
          },
        );
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
      this.setState(
        {
          error,
        },
        () => {
          if (!error) {
            this.props.onSignIn();
          }
        },
      );
    });
  }

  render() {
    return (
      <section data-title="Connection" className={this.className}>
        <div className="content">
          <div className="container">
            <div className="wrap noSpaces">
              <div className="form-42 margin-top-3 center">
                <div className="pad shadow selected left ae-3">
                  <div className="center ae-3">
                    Login to sync your portfolio on multiple devices.
                  </div>
                  <p className="error-message" style={{ margin: 0 }}>
                    {this.state.error}
                  </p>
                  <a
                    className="button ae-4 orange wide crop margin-bottom-2"
                    href="#"
                    onClick={() => this.props.onSectionChange('signup')}
                  >
                    Sign Up with Email
                  </a>
                  <a
                    className="button ae-5 deepOrange wide crop margin-bottom-2"
                    href="javascript:;"
                    onClick={this._logInFB.bind(this)}
                  >
                    <svg fill="#1c1b1b">
                      <use
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        xlinkHref="#facebook2"
                      />
                    </svg>
                    <span>Continue with Facebook</span>
                  </a>
                  <a
                    className="button ae-6 deepOrange wide crop"
                    href="javascript:;"
                    onClick={this._twitterLogin.bind(this)}
                  >
                    <svg fill="#1c1b1b">
                      <use
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        xlinkHref="#twitter"
                      />
                    </svg>
                    <span>Continue with Twitter</span>
                  </a>
                </div>
                <p className="micro margin-bottom-0 margin-top-3 ae-7">
                  <span className="opacity-6">Already have an Account?</span>
                  <a
                    className="bold opacity-8 ml-1 inline-link-margin"
                    onClick={() => this.props.onSectionChange('signin')}
                    href="javascript:;"
                  >
                    Sign In
                  </a>
                </p>
                <p className="micro margin-bottom-0 margin-top-3 ae-8">
                  <span className="opacity-6">
                    By using this service, you agree to our
                  </span>
                  <a
                    className="opacity-9 inline-link-margin"
                    href="http://coinstats.app/terms.html"
                    target="_blank"
                  >
                    Terms of Use
                  </a>
                  <span className="opacity-6">and</span>
                  <br />
                  <a
                    className="opacity-9 inline-link-margin"
                    href="http://coinstats.app/privacy.html"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
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

function mapStateToProps(state, ownProps) {
  return {
    hasUnlimited: state.auth.hasUnlimited,
    isOpen: state.auth.isModalOpen,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    user: state.auth.user || ownProps.user,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);
