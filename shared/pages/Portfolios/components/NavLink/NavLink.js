import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavLink extends Component {
  render() {
    return <NavLink className="waves-effect waves-dark" {...this.props} activeClassName="active" />;
  }
}

export default NavLink;
