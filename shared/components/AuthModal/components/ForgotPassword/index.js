import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { auth as authActions } from 'store/actions';

class SignInModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailSent: false,
    };
  }

  _handleEmailChange(e) {
    this.setState({
      email: e.target.value,
    });
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.props.requestPasswordReset(this.state.email).then(({ error }) => {
      if (!error) {
        this.setState({
          emailSent: true,
        });
      }
    });
  }

  render() {
    let topText = <div className="error-message text-danger">{this.props.error || ''}</div>;

    if (this.state.emailSent) {
      topText = <div className="error-message text-success">Please, check you inbox.</div>;
    }

    if (this.props.resetPasswordMessage) {
      topText = <div className="error-message text-success">{this.props.resetPasswordMessage}</div>;
    }

    return [
      <ModalHeader toggle={this.toggle} tag="h2">
        <button className="btn btn-link btn-back" type="button" onClick={this.props.onBack}>
          <i className="fa fa-chevron-left mr-2" /> Back
        </button>
        Password Recovery
      </ModalHeader>,
      <ModalBody className="text-center">
        <form id="loginForm" onSubmit={this._handleSubmit.bind(this)} method="POST">
          {topText}
          <input
            style={this.props.resetPasswordMessage ? { marginTop: '50px' } : {}}
            type="email"
            placeholder="Email"
            className="email input-in-modal"
            onChange={this._handleEmailChange.bind(this)}
            disabled={this.props.isLoading || this.state.emailSent}
            required
          />
        </form>
      </ModalBody>,
      <ModalFooter className="justify-center">
        <div className="mx-auto text-center mb-5">
          <Button
            className="btn-highlighted text-white p-0"
            type="submit"
            form="loginForm"
            disabled={this.props.isLoading || this.state.emailSent}
          >
            {this.props.isLoading ? <i className="fas fa-spinner fa-spin" /> : 'Reset Password'}
          </Button>
        </div>
      </ModalFooter>,
    ];
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
)(SignInModal);
