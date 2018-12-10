import React, { Component } from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse,
  Button,
  Container,
  Col,
  Row,
} from 'reactstrap';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import AuthModal from 'components/AuthModal';
import { ui as uiActions } from 'store/actions';
import SubscribeModal from 'components/SubscribeModal';
import { isServer } from 'utils/env';
import navMenuItems from 'const/nav-menu-items';

import DarkLightSwitch from '../../darkLightSwitch/DarkLightSwitch';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      collapsed: false,
    };
  }

  _toggleNavbar() {
    document.getElementById('burger').classList.toggle('is-active');
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  _renderNavItem(item) {
    const key = item.link || item.href;
    if (item.href) {
      return <a href={item.href} key={key} target={item.target || '_self'}>{item.title}</a>;
    }
    let active = '';
    if (item.link.slice(1) === this.props.actviveNavBar.link) {
      active = 'active';
    }
    return (
      <Link className={`${active}`} to={item.link} key={key}>
        {item.title}
      </Link>
    );
  }

  openUser(isUser) {
    if (isUser) {
      if (!this.props.hasUnlimited) {
        document
          .getElementById('navNar-collapse')
          .classList.toggle('is-open-unlimited-user');
      } else {
        document
          .getElementById('navNar-collapse')
          .classList.toggle('is-open-user');
      }
    } else {
      document
        .getElementById('navNar-collapse')
        .classList.remove('is-open-unlimited-user');
      document
        .getElementById('navNar-collapse')
        .classList.remove('is-open-user');
    }
  }

  render() {
    let link = '/';
    if (this.props.actviveNavBar.active) {
      link = `/${this.props.actviveNavBar.link}`;
    }
    return (
      <nav>
        {navMenuItems.map((item) => {
          return this._renderNavItem(item);
        })}
      </nav>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    hasUnlimited: state.auth.hasUnlimited,
    actviveNavBar: state.home.actviveNavBar,
    user: ownProps.user || state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleTheme: () => {
      return dispatch(uiActions.toggleDarkMode());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);
