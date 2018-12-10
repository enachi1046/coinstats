import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth as authActions } from 'store/actions';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      error: null,
      loading: false,
    };
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
    this.setState(
      {
        loading: true,
        error: null,
      },
      () => {
        this.props
          .logIn(this.state.login, this.state.password)
          .then(({ error }) => {
            this.setState(
              {
                error,
                loading: false,
              },
              () => {
                if (!error) {
                  this.props.onSignIn();
                }
              },
            );
          });
      },
    );
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

  render() {
    return (
      <section data-title="Sign In" className={this.className}>
        <div className="content">
          <div className="container">
            <div className="wrap noSpaces">
              <h1 className="ae-1">Sign In</h1>
              <div className="fix-4-12 margin-top-3">
                <div className="pad shadow selected ae-3 left">
                  <form
                    className="slides-form wide"
                    action="#"
                    autoComplete="on"
                    onSubmit={this._handleSubmit.bind(this)}
                  >
                    <div className="label ae-3 cropTop">
                      <label className="cropTop opacity-5" htmlFor="email43">
                        Email address
                      </label>
                    </div>
                    <input
                      className="wide ae-4"
                      id="email43"
                      type="text"
                      name="email"
                      placeholder="Email address"
                      value={this.state.login}
                      onChange={this._handleLoginChange.bind(this)}
                      required
                    />
                    <div className="label ae-5 margin-top-2">
                      <label className="opacity-5" htmlFor="password43">
                        Password
                      </label>
                    </div>
                    <input
                      id="password43"
                      className="wide ae-6"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this._handlePasswordChange.bind(this)}
                      required
                    />
                    <div className="ae-7">
                      <p className="remind-43 micro">
                        <a
                          onClick={() => this.props.onSectionChange('recovery')}
                          href="javascript:;"
                        >
                          Forgot your password?
                        </a>
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="button orange wide ae-9 cropBottom"
                      name="button"
                      disabled={this.state.loading}
                    >
                      Sign in
                    </button>
                    <p className="error-message">{this.state.error}</p>
                  </form>
                </div>
                <p className="margin-top-3 micro center ae-10">
                  <span className="opacity-6">Don’t have an account?</span>
                  <a
                    href="javascript:;"
                    className="opacity-8 bold ml-1 inline-link-margin"
                    onClick={() => this.props.onSectionChange('social')}
                  >
                    Create Account
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
    logIn(username, password) {
      return dispatch(authActions.logIn(username, password));
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
