import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { ui as uiActions } from 'store/actions';

import SectionHeader from 'components/SectionHeader';
import SectionFooter from 'components/SectionFooter';
import BaseLayout from './_BaseLayout';

class BlankLayout extends BaseLayout {
  constructor(props) {
    super(props);
  }

  render() {
    const children = [
      <main className={this.defaultClasses.join(' ')} id={this.props.id}>
        <SectionHeader
          user={this.props.user}
          singleTheme={this.props.singleTheme}
          theme={this.props.theme}
        />
        {this.props.children}
        {this.props.showFooter && <SectionFooter />}
      </main>,
    ];
    return children;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: ownProps.theme || (state.ui.darkMode ? 'dark' : 'light'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlankLayout);
