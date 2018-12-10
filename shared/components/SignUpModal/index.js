import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { auth as authActions } from 'store/actions';
import { connect } from 'react-redux';

class SignUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <div>
        <a className="sign-up d-block" onClick={this.toggle} href="javascript:;">
          Sign Up
        </a>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} />
          <ModalBody className="text-center">
            <div className="modal-text">Login to sync your portfolio on multiple devices.</div>
            <div className="sign-div">
              <div
                className="sign-up-email mb-2"
                onClick={() => this.props.logIn(this.state.login, this.state.password)}
              >
                Sign Up with Email
              </div>
              <div className="sign-up-fb mb-2 cursor-pointer" onClick={() => this.props.logInFB()}>
                Continue with Facebook
              </div>
              <div className="sign-up-tw mb-2 cursor-pointer" onClick={() => this.props.logInTW()}>
                Continue with Twitter
              </div>
              <div className="already-have-div">
                <a href="#" className="already-have">
                  Already have an account? Login
                </a>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            By using this service, you agree to our
            <a href="http://coinstats.app/terms.html" target="_blank">
              {' '}
              Terms of Use{' '}
            </a>
            and{' '}
            <a href="http://coinstats.app/privacy.html" target="_blank">
              {' '}
              Privacy Policy
            </a>
          </ModalFooter>
        </Modal>
      </div>
    );
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
  return {
    logIn(username, password) {
      return dispatch(authActions.logIn(username, password));
    },
    logInFB() {
      return dispatch(authActions.logInFB());
    },
    logInTW(data) {
      return dispatch(authActions.logInTW(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpModal);
