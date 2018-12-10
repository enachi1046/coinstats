import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseLayout from './_BaseLayout';

class HomePageLayout extends BaseLayout {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.defaultClasses.join(' ')} id={this.props.id}>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: ownProps.theme || (state.ui.darkMode ? 'dark' : 'light'),
  };
}

export default connect(
  mapStateToProps,
)(HomePageLayout);
