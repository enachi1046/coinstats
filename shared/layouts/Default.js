import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import SectionHeader from 'components/SectionHeader';
import BaseLayout from './_BaseLayout';

class DefaultLayout extends BaseLayout {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.defaultClasses.join(' ')} id={this.props.id}>
        <SectionHeader user={this.props.user} />
        <Container fluid>{this.props.children}</Container>
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
)(DefaultLayout);
