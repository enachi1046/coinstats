import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth as authActions } from 'store/actions';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      success: false,
      error: null,
      loading: false,
    };
  }

  _handleLoginChange(e) {
    this.setState({
      login: e.target.value,
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
        this.props.requestPasswordReset(this.state.login).then(({ error }) => {
          this.setState({
            error,
            success: !error,
            loading: false,
          });
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

  get successBlock() {
    return (
      <div className="slides-form wide">
        <h3 className="ae-5 text-center">Please, check your inbox.</h3>
        <div className="ae-7">
          <p className="remind-43 micro">
            <a
              onClick={() => this.setState({ success: false })}
              href="javascript:;"
            >
              Didn't receive an email?
            </a>
          </p>
        </div>
      </div>
    );
  }

  get form() {
    return (
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
          type="email"
          name="email"
          placeholder="Email address"
          value={this.state.login}
          onChange={this._handleLoginChange.bind(this)}
          required
        />
        <div className="ae-7">
          <p className="remind-43 micro">
            <a
              onClick={() => this.props.onSectionChange('signin')}
              href="javascript:;"
            >
              Return to signin page.
            </a>
          </p>
        </div>
        <button
          type="submit"
          className="button orange wide ae-9 cropBottom"
          name="button"
          disabled={this.state.loading || this.state.success}
        >
          Request Password Reset
        </button>
        <p className="error-message">{this.state.error}</p>
      </form>
    );
  }

  render() {
    const content = this.state.success ? this.successBlock : this.form;
    return (
      <section data-title="Forgot Password" className={this.className}>
        <div className="content">
          <div className="container">
            <div className="wrap noSpaces">
              <h1 className="ae-1">Password Recovery</h1>
              <div className="fix-4-12 margin-top-3">
                <div className="pad shadow selected ae-3 left">{content}</div>
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

function mapStateToProps(state) {
  return {
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    resetPasswordMessage: state.auth.resetPasswordMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestPasswordReset(email) {
      return dispatch(authActions.requestPasswordReset(email));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPassword);
