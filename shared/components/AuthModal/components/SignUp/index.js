import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';

class SignUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      passwordConfirmation: '',
      signUp: false,
    };
  }

  _handleSubmit(e) {
    e.preventDefault();
    return this.props.onSignUp(this.state.login, this.state.password, this.state.passwordConfirmation);
  }

  _handleLoginChange(e) {
    this.setState({ login: e.target.value });
  }

  _handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  _handlePasswordConfirmationChange(e) {
    this.setState({ passwordConfirmation: e.target.value });
  }

  get header() {
    let BackButton;
    if (this.state.signUp) {
      BackButton = (
        <button className="btn btn-link btn-back" type="button" onClick={() => this.setState({ signUp: false })}>
          <i className="fa fa-chevron-left mr-2" /> Back
        </button>
      );
    }
    return (
      <ModalHeader toggle={this.toggle} tag="h2">
        {BackButton}
        {this.state.signUp ? 'Sign Up With Email' : 'Sign Up'}
      </ModalHeader>
    );
  }

  get body() {
    return this.state.signUp ? this.renderSignupForm() : this.renderSignupBtns();
  }

  get footer() {
    if (this.state.signUp) {
      return (
        <Button
          className="btn-highlighted text-white p-0 mb-5"
          type="submit"
          form="signUpForm"
          disabled={this.props.isLoading}
        >
          {this.props.isLoading ? <i className="fas fa-spinner fa-spin" /> : 'Sign Up'}
        </Button>
      );
    }
    return (
      <ModalFooter>
        <p className="text-center mx-auto">
          By using this service, you agree to our <br />
          <a href="http://coinstats.app/terms.html" target="_blank">
            Terms of Use
          </a>
          <span className="mx-1">and</span>
          <a href="http://coinstats.app/privacy.html" target="_blank">
            Privacy Policy
          </a>
        </p>
      </ModalFooter>
    );
  }

  renderSignupForm() {
    return (
      <ModalBody className="text-center">
        <form id="signUpForm" method="POST" onSubmit={this._handleSubmit.bind(this)}>
          <div className="error-message text-danger">{this.props.error || ''}</div>
          <div className="sign-div">
            <input
              type="email"
              placeholder="Email"
              className="input-in-modal"
              onChange={this._handleLoginChange.bind(this)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input-in-modal"
              onChange={this._handlePasswordChange.bind(this)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-in-modal"
              onChange={this._handlePasswordConfirmationChange.bind(this)}
              required
            />
          </div>
        </form>
      </ModalBody>
    );
  }

  renderSignupBtns() {
    let topText = <div className="modal-text">Login to sync your portfolio on multiple devices.</div>;
    if (this.props.error) {
      topText = <div className="error-message text-danger">{this.props.error || ''}</div>;
    }
    return (
      <ModalBody className="text-center">
        {topText}
        <div className="sign-div">
          <button
            className="btn btn-highlighted mb-2 p-0"
            type="button"
            onClick={() => this.setState({ signUp: true })}
          >
            Sign Up with Email
          </button>
          <button className="btn btn-outline sign-up-fb mb-2 p-0" type="button" onClick={this.props.onFBLogin}>
            Continue with Facebook
          </button>
          <button className="btn btn-outline sign-up-tw mb-2 p-0" type="button" onClick={this.props.onTWLogin}>
            Continue with Twitter
          </button>
          <div className="already-have-div">
            <a href="javascript:;" className="already-have" onClick={this.props.onAlreadyRegistered}>
              Already have an account? Login
            </a>
          </div>
        </div>
      </ModalBody>
    );
  }

  render() {
    return [this.header, this.body, this.footer];
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.auth.isLoading,
    error: state.auth.error,
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpModal);
