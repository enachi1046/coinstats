import React, { Component } from 'react';
import Parse from 'parse';
import Dropdown from 'react-dropdown';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { auth as authActions } from 'store/actions';
import { isClient } from 'utils/env';

class SignInModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
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
    return this.props.onLogin(this.state.login, this.state.password);
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

    return [
      <ModalHeader toggle={this.toggle} tag="h2">
        <button className="btn btn-link btn-back" type="button" onClick={this.props.onBack}>
          <i className="fa fa-chevron-left mr-2" /> Back
        </button>
        Sign In
      </ModalHeader>,
      <ModalBody className="text-center">
        <form id="loginForm" onSubmit={this._handleSubmit.bind(this)} method="POST">
          <div className="error-message text-danger">{this.props.error || ''}</div>
          <div className="sign-div">
            <input
              type="text"
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
            <div className="already-have-div">
              <a href="#" className="already-have" onClick={this.props.onForgotPassword}>
                Forgot Password?
              </a>
            </div>
          </div>
        </form>
      </ModalBody>,
      <ModalFooter className="justify-center">
        <div className="mx-auto text-center mb-5">
          <Button
            className="btn-highlighted text-white p-0"
            type="submit"
            form="loginForm"
            disabled={this.props.isLoading}
          >
            {this.props.isLoading ? <i className="fas fa-spinner fa-spin" /> : 'Sign In'}
          </Button>
          <button className="btn btn-outline sign-up-fb mb-0 p-0" type="button" onClick={this.props.onFBLogin}>
            Continue with Facebook
          </button>
          <button className="btn btn-outline sign-up-tw p-0" type="button" onClick={this.props.onTWLogin}>
            Continue with Twitter
          </button>
        </div>
      </ModalFooter>,
    ];
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
)(SignInModal);
