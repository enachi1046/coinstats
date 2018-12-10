import React, { Component } from 'react';

import { isServer } from 'utils/env';
import SubscribeModal from 'components/SubscribeModal';
import { connect } from 'react-redux';
import AuthModal from 'components/AuthModal';
import { ui as uiActions } from 'store/actions';
import Link from 'react-router-dom/Link';

import NavBar from './NavBar';

class SectionHeader extends Component {
  _toggleTheme() {
    this.props.setTheme(!this.props.darkMode);
  }

  get lightSwitcher() {
    if (this.props.singleTheme) {
      return null;
    }
    return (
      <label className="light-switcher">
        <p>Light Mode</p>
        <input
          type="checkbox"
          onChange={this._toggleTheme.bind(this)}
          checked={!this.props.darkMode}
        />
        <span className="switcher-check">
          <i />
        </span>
      </label>
    );
  }

  render() {
    let subscribeModal;
    if (!isServer()) {
      subscribeModal = <SubscribeModal />;
    }
    return (
      <header>
        <div className="guide">
          <Link to="/" className="icon-logo" />
          <input type="checkbox" id="mobileToggle" />
          <label htmlFor="mobileToggle" className="mobile-menu-btn" />
          <div className="header-c">
            <div className="header-c-inner">
              {this.lightSwitcher}
              <NavBar user={this.props.user} />
              <AuthModal btnText="Sign In" user={this.props.user} />
            </div>
          </div>
        </div>
        {subscribeModal}
      </header>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    darkMode: (ownProps.theme) ? (ownProps.theme === 'dark') : state.ui.darkMode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTheme: (v) => {
      return dispatch(uiActions.setDarkMode(v));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionHeader);
