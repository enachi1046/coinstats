import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth as authActions } from 'store/actions';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      passwordConfirmation: '',
      error: null,
    };
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
          .signUp(
            this.state.login,
            this.state.password,
            this.state.passwordConfirmation,
          )
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

  _handlePasswordConfirmationChange(e) {
    this.setState({
      passwordConfirmation: e.target.value,
    });
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
      <section data-title="Create Account" className={this.className}>
        <div className="content">
          <div className="container">
            <div className="wrap noSpaces">
              <h1 className="ae-1">Create Account</h1>
              <div className="form-42 margin-top-3 center">
                <div className="pad shadow selected left ae-3">
                  <form
                    className="slides-form wide"
                    action="#"
                    autoComplete="off"
                    onSubmit={this._handleSubmit.bind(this)}
                  >
                    <div className="label ae-3 cropTop">
                      <label
                        className="left cropTop opacity-5"
                        htmlFor="email42"
                      >
                        Start with email address
                      </label>
                    </div>
                    <input
                      id="email42"
                      className="wide ae-4"
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={this.state.email}
                      onChange={this._handleLoginChange.bind(this)}
                      required
                    />
                    <ul className="grid noSpaces margin-top-1">
                      <li className="col-6-12 form-42-input-1">
                        <div className="label ae-5">
                          <label
                            className="left opacity-5"
                            htmlFor="password42"
                          >
                            Create Password
                          </label>
                        </div>
                        <input
                          id="password42"
                          className="ae-6 mx-0"
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this._handlePasswordChange.bind(this)}
                          required
                        />
                      </li>
                      <li className="col-6-12 form-42-input-2">
                        <div className="label ae-5">
                          <label
                            className="left opacity-5"
                            htmlFor="password42confirm"
                          >
                            Confirm Password
                          </label>
                        </div>
                        <input
                          id="password42confirm"
                          className="ae-6 mx-0"
                          type="password"
                          name="password"
                          placeholder="Repeat"
                          value={this.state.passwordConfirmation}
                          onChange={this._handlePasswordConfirmationChange.bind(
                            this,
                          )}
                          required
                        />
                      </li>
                    </ul>
                    <button
                      type="submit"
                      className="button orange margin-top-6 wide ae-8"
                      name="button"
                      disabled={this.state.loading}
                    >
                      Create Account
                    </button>
                    <p className="error-message">{this.state.error}</p>
                  </form>
                </div>
                <p className="micro margin-top-3 ae-10">
                  <span className="opacity-6">Already have an Account?</span>
                  <a
                    href="javascript:;"
                    className="bold opacity-8 ml-1 inline-link-margin"
                    onClick={() => this.props.onSectionChange('signin')}
                  >
                    Sign In
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
    signUp(username, password, repeatPassword) {
      return dispatch(authActions.signUp(username, password, repeatPassword));
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);
