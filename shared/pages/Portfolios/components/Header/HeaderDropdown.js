import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { logOut } from 'store/actions';
import {
  DropdownItem, DropdownMenu, DropdownToggle, Dropdown,
} from 'reactstrap';

class HeaderDropdown extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  logOut() {
    this.props.logOut().then(() => {
      this.props.history.push('/auth/login');
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  dropAccnt() {
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <strong>
            {this.props.user.displayName}
            <small>
              <i className="ti-angle-down text-info" />
            </small>
          </strong>
          {/* <img src={'img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/> */}
        </DropdownToggle>
        <DropdownMenu right>
          {/*      <DropdownItem header tag="div" className="text-center"><strong>Admin</strong></DropdownItem>
          <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
          <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
          <DropdownItem href="/#/portfolios"><i className="fa fa-user"></i> Portfolios </DropdownItem>
          <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem> */}
          {/* <DropdownItem href="/#/settings">
            <i className="fa fa-cog"></i> Settings
          </DropdownItem> */}
          <DropdownItem onClick={this.logOut.bind(this)}>
            <i className="fa fa-lock" /> Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    return this.dropAccnt();
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut() {
      return dispatch(logOut());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(HeaderDropdown));
