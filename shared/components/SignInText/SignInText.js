import React, { Component } from 'react';
import Helmet from 'react-helmet';
import HomePageLayout from 'layouts/HomePage';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import { auth as authActions } from 'store/actions';

class SignInText extends Component {
  toggleColor() {
    document.getElementsByTagName('body')[0].classList.toggle('light-mode');
  }

  render() {
    let style = { maxWidth: '480px', marginTop: '25px', marginBottom: '25px' };
    if (this.props.fromNews) {
      style = {
        paddingTop: '25px',
        width: '350px',
        paddingBottom: '25px',
        marginBottom: '1px',
        backgroundColor: '#1C1B1B',
      };
    }
    return (
      <div
        className={`mx-auto ${
          this.props.fromNews ? '' : 'w-100'
        } text-center signin-text`}
        style={style}
      >
        <p
          style={
            this.props.fromNews
              ? { marginLeft: '20px', marginRight: '20px' }
              : {}
          }
        >
          Setup your portfolio by connecting your exchange accounts, wallets or
          entering your holdings manually for easy tracking.
        </p>
        <Link className="btn cs-btn my-4 mx-auto py-0" to="/signup">
          Start Tracking
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showModal: () => {
      return dispatch(authActions.toggleModal(true));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInText);
